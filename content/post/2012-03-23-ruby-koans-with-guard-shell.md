---
date: 2012-03-23T00:00:00Z
tags:
- ruby
title: Ruby Koans with guard shell
url: /2012/03/23/ruby-koans-with-guard-shell/
---

I thought I knew Ruby, but I was wrong.  
Most of the stuff you will see in [Ruby Koans](http://rubykoans.com/ "Learn Ruby with the EdgeCase Ruby Koans") is quite easy if you have played with Ruby before.  
But as you progress, you will see occasional surprises, and from those, you learn a lot.

It comes with autotest setup but I don't use autotest.  
I prefer guard. For Koans, guard-shell works good.  
First, download the Koans form their [site](http://rubykoans.com/ "Learn Ruby with the EdgeCase Ruby Koans"). Extract the zip to somewhere. Cd to there.  
Then install [guard-shell](https://github.com/guard/guard-shell):

    gem install guard-shell

Then, initialize it, or you just create a file called 'Guardfile':

    guard init shell

Open the Guardfile, copy and paste this:

    guard 'shell' do
      watch(/^.*\.rb$/) { `rake` }
    end

You are ready to go:

    guard --notify false

(You don't need any notification for Koans, output from koans in shell looks good.)  
Touch one file, and then you see something.

    touch about_asserts.rb

Now, start meditating...
