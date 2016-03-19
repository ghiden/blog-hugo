---
date: 2012-07-09T00:00:00Z
tags:
- python
- google-api
title: Open Google Reader's Starred Items Part II
url: /2012/07/09/open-google-readers-starred-items-part-ii/
---

The [previous entry](/2012/04/27/open-googlereaders-starred-page/) on retrieving Google Reader's Starred items had some problems.
- Occassionally, it was failing to open a site
- There are times that I want to just check how many items that I starred
- It wasn't easy to read

So, I revisited the code and revised it.

## Executing a command

I found out that using os.system to execute a command is considered not a good practice.

    os.system("open %s -a 'Google Chrome'" % url)

I see that I didn't even check the result.  
To have better control, I use subprocess.call which takes arguments in list.  
Here is the code. By the way, I made it as a function for better readability.

    def open_in_browser(url):
        # open in Chrome
        result = subprocess.call(["open", "-a", "Google Chrome", url])
        if result != 0:
            print "Error opening the item"
        return result

If it returns a non-zero value, the function shows an error message and returns.  
The items that it fails to open should not be unstarred. Otherwise, it'll be forgotten forever.

## Adding options

It was easy. I just need to use OptionParser.
- '-s' for not to clear stars.  
- '-b' for not to open in browser.  

    parser = OptionParser()
    parser.add_option("-s", action="store_true", default=False, 
            help="not to clear stars")
    parser.add_option("-b", action="store_true", default=False,
            help="not to open in browser")
    (options, args) = parser.parse_args()

With these options, I can just invoke this command with -s and -b for not clearing the stars and not opening in browser, just to show list of starred items in terminal.

## Getting a 'continuation' param

Google Reader API returns a parameter called 'continuation.'  
By supplying the continuation to subsequent query, they return the following items.  
Without it, I had to unstar everything to get other starred items.  
Or maybe I could bump up the number of retrieved items to 1000 or something, so that I can get all the items at once. But it sounds very crude, so I decided to use the continuation.  
The 'continuation' param is included in the result from API call.  
It is enclosed in "ns2:continuation" element.  
I use regular expression to get the value.  

    def get_continuation(feed):
        pattern = re.compile(r"""ns2:continuation>(.*)<\/ns2:continuation""", re.M)
        result = pattern.search(feed.ToString())                                     
        if result:
            return result.group(1)
        else:
            False

If I have a 'continuation,' that means I have more starred items.  
If I don't, there is no more starred items.  

## Revised Code
Overall, I changed top-to-bottom-one-long script to bunch of small functions.

    #!/usr/bin/env python

    import sys
    import gdata.service
    import subprocess
    import getpass
    import urllib
    import re
    from optparse import OptionParser
    from gdata.service import BadAuthentication

    URL = '/reader/atom/user/-/state/com.google/starred'
    SERVICE = gdata.service.GDataService(account_type='GOOGLE',
                                         service='reader',
                                         server='www.google.com',
                                         source='MyReader')
    CONFIG = {'email':'YOUR-EMAIL@gmail.com', 'password':'DUMMY'}

    def unstar(entry, token):
        i = entry.id.text
        s = entry.source.extension_attributes['{http://www.google.com/schemas/reader/atom/}stream-id']
        ret = SERVICE.Post(urllib.urlencode({
            'i':i,
            'r':'user/-/state/com.google/starred',
            's':s,
            'T':token
            }),
            '/reader/api/0/edit-tag',
            converter = lambda x:x,
            extra_headers = {'Content-Type':'application/x-www-form-urlencoded'})
        print "Unstar result: %s [id: %s]" % (ret, i)
        if ret == "OK":
            return 1
        else:
            return 0

    def get_continuation(feed):
        pattern = re.compile(r"""ns2:continuation>(.*)<\/ns2:continuation""", re.M)
        result = pattern.search(feed.ToString())
        if result:
            return result.group(1)
        else:
            return False

    def password_prompt():
        CONFIG['password'] = getpass.getpass('Enter your password for Google Reader: ')

    def open_in_browser(url):
        # open in Chrome
        result = subprocess.call(["open", "-a", "Google Chrome", url])
        if result != 0:
            print "Error opening the item"
        return result

    def login():
        try:
          SERVICE.ClientLogin(CONFIG['email'], CONFIG['password'])
        except BadAuthentication:
          print "Wrong password!"
          sys.exit()
        # authenticated token
        return SERVICE.Get('/reader/api/0/token',converter=lambda x:x)

    # collect starred items
    def starred():
        # n = number of items to read per query, default is 20
        params = {}
        entries = []

        while True:
            query = gdata.service.Query(feed=URL, params=params)
            feed = SERVICE.Get(query.ToUri())
            cont = get_continuation(feed)
            entries.extend(feed.entry)
            if cont:
                params['c'] = cont
            else:
                break
        print '*' * len(entries)
        return entries

    # process starred items
    def process_starred(token, entries, options):
        total = len(entries)
        cleared = 0

        for entry in entries:
            url = entry.GetHtmlLink().href
            print entry.title.text
            print url
            if options.b != True:
                result = open_in_browser(url)
            else:
                # -b is set, always return 0
                result = 0

            if options.s != True and result == 0:
                # now unstar it
                cleared += unstar(entry, token)
            print "==============================================================="

        return (total, cleared)

    def main(options):
        password_prompt()

        token = login()

        entries = starred()

        (total, cleared) = process_starred(token, entries, options)

        print "%d starred item(s) found and %d cleared" % (total, cleared)

    if __name__ == '__main__':
        parser = OptionParser()
        parser.add_option("-s", action="store_true", default=False, 
                help="not to clear stars")
        parser.add_option("-b", action="store_true", default=False,
                help="not to open in browser")
        (options, args) = parser.parse_args()
        main(options)

gist: <https://gist.github.com/2509075/>
