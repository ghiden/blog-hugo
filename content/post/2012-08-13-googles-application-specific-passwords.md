---
date: 2012-08-13T00:00:00Z
tags:
- python
- google-api
title: Google's application specific passwords
url: /2012/08/13/googles-application-specific-passwords/
---

I quite like the Google's application-specific password scheme.  
1. Go to your Google Account page
1. Click "Security"
1. Click "Edit" button for "Authorizing applications and sites"
1. Probably you get prompted for your password, then you see the page.

It is a bit risky to use your Google account password for every app that accesses your Google hosted services; for example, my Gmail account setting on my iPhone. By using app-specific passwords, in case you lose your phone, you can easily revoke them anytime.

For my experiment, I generated one for [my python script](/2012/07/09/open-google-readers-starred-items-part-ii/) that reads Google Reader's starred items.  
To support that, I've added a config file that stores an email address and a password.

{{< highlight python >}}
CONFIG_FILE = os.path.expanduser('~/.gstar-reader')

def init_config():
    if not os.path.exists(CONFIG_FILE):
        print """Config file not found
Please create a file ~/.gstar-reader with the following contents
[base]
email:name@example.com
password:password"""
        sys.exit()

    parser = ConfigParser.SafeConfigParser()
    parser.read(CONFIG_FILE)
    CONFIG['email'] = parser.get('base', 'email')
    CONFIG['password'] = parser.get('base', 'password')

{{< / highlight >}}

I've never used ConfigParser before. It's quite handy for stuff like this.

Gist: <https://gist.github.com/2509075>

