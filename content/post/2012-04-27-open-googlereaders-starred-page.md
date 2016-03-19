---
date: 2012-04-27T00:00:00Z
tags:
- python
- google-api
title: Open Google Reader's Starred Items
url: /2012/04/27/open-googlereaders-starred-page/
---

Here is my routine for every weekday.  
I come to work and start checking emails and Google Reader's Starred pages that I mark during my commute time.  
I always felt that this Google Reader part is quite cumbersome and time consuming even though it's not a lot.

These are the steps that I do:
1. Open up Google Reader on my browser
2. Type 'gs' that is a shortcut for opening the starred page view
3. Type 'v' to open it up in a new tab.
4. Type 'j' to go down the list and do 'v' again and repeat.

So, I thought would it be nice if I can just type one command and open all the starred pages at once.

Here is the recipe.
First, you need to install [gdata-python-client](http://code.google.com/p/gdata-python-client/)
And, follow the steps here.

1. Login

        config = {'email':'YOUR-ACCOUNT@gmail.com', 'password':'PASSWORD'}

        service = gdata.service.GDataService(account_type='GOOGLE',
                                             service='reader',
                                             server='www.google.com',
                                             source='MyReader')

        service.ClientLogin(config['email'],config['password'])

2. Get your token and retrieve starred items

        token = service.Get('/reader/api/0/token',converter=lambda x:x)

        query = gdata.service.Query(feed='/reader/atom/user/-/state/com.google/starred')
        feed = service.Get(query.ToUri())

3. Open each item: in my case I open it with Google Chrome

        for entry in feed.entry:
            url = entry.GetHtmlLink().href
            # open in Chrome. This part varies depending on your system and your preference
            os.system("open %s -a 'Google Chrome'" % url)
            print entry.title.text
            print entry.GetHtmlLink().href

4. Unstar each item:

        for entry in feed.entry:
            i = entry.id.text
            s = entry.source.extension_attributes['{http://www.google.com/schemas/reader/atom/}stream-id']
            ret = service.Post(urllib.urlencode({
                'i':i,
                'r':'user/-/state/com.google/starred',
                's':s,
                'T':token
                }),
                '/reader/api/0/edit-tag',
                converter = lambda x:x,
                extra_headers = {'Content-Type':'application/x-www-form-urlencoded'})
            print "Unstar result: %s [id: %s]" % (ret, i)

This is the whole thing in one shot. This code has more stuff.  
In case you don't want to keep your password inside this little script, it uses getpass command to ask you every time. But if you don't care, you can just leave it out.  
And, I added some exception handling.

    #!/usr/bin/env python

    import sys
    import gdata.service
    import json
    import subprocess
    from getpass import getpass
    import urllib
    from gdata.service import BadAuthentication

    # password prompt
    password = getpass('Enter your password for Google Reader: ')

    config = {'email':'YOUR-ACCOUNT@gmail.com', 'password':password}

    service = gdata.service.GDataService(account_type='GOOGLE',
                                         service='reader',
                                         server='www.google.com',
                                         source='MyReader')

    try:
      service.ClientLogin(config['email'],config['password'])
    except BadAuthentication:
      print "Wrong password!"
      sys.exit()

    # authenticated token
    token = service.Get('/reader/api/0/token',converter=lambda x:x)

    query = gdata.service.Query(feed='/reader/atom/user/-/state/com.google/starred')
    total = 0
    cleared = 0

    while True:
        feed = service.Get(query.ToUri())
        count = len(feed.entry)
        total += count
        if count == 0:
            break
        for entry in feed.entry:
            url = entry.GetHtmlLink().href
            # open in Chrome
            result = subprocess.call(["open", "-a", "Google Chrome", url])
            print entry.title.text
            print entry.GetHtmlLink().href

            if result != 0:
                print "Error opening the item"
            else:
                # now unstar it
                i = entry.id.text
                s = entry.source.extension_attributes['{http://www.google.com/schemas/reader/atom/}stream-id']
                ret = service.Post(urllib.urlencode({
                    'i':i,
                    'r':'user/-/state/com.google/starred',
                    's':s,
                    'T':token
                    }),
                    '/reader/api/0/edit-tag',
                    converter = lambda x:x,
                    extra_headers = {'Content-Type':'application/x-www-form-urlencoded'})
                cleared += 1
                print "Unstar result: %s [id: %s]" % (ret, i)
            print "==============================================================="
    print "%d starred item found and %d cleared" % (total, cleared)

You can just name this little script to something recognizable and execute it from your shell.  
I guess it would be nice if it is a little app that sits on my desktop and by double-clicking, it opens all my starred items.  
I guess if I have time, I'll make one. But I don't think this script gains any popularity.  
It is just saving my little time from everyday routine. If there is someone like me, it might help, but not many for sure.
Or, I might rewrite it in Ruby just for fun. I first tried googlereader gem, but it turned out that it's 5 years old and didn't work. I stopped using Python regularly 5 or 6 years ago, it was the time I converted to Ruby. Python is nice. I never hated it or anything. So, this was quite refreshing exercise to program in Python.

Thanks, I stole most of code from this page:  
<http://moimoitei.blogspot.jp/2011/03/google-python-google-reader-api.html>.  
Here is my [gist](https://gist.github.com/2509075).

