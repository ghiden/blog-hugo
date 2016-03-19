---
date: 2012-07-26T00:00:00Z
tags:
- javascript
title: A Quick JavaScript Test on Scope and Closure
url: /2012/07/26/a-quick-javascript-test-on-scope-and-closure/
---

I found this article on how scope works in JavaScript at DailyJS.  
[JS101: A Brief Lesson on Scope](http://dailyjs.com/2012/07/23/js101-scope/)

There is a code snippet that demonstrates a possibly confusing behavior of closure and scoping for beginners. Here is the code:

{{< highlight javascript >}}
function example() {
    var o = {}, i = 0;
    for (i = 0; i < 3; i++) {
        o[i] = function() { console.log(i); };
    }
    o[0]();
    o[1]();
    o[2]();
}

example();

{{< / highlight >}}

This returns the following in console:

    3
    3
    3

So I was thinking, next time I interview someone for hire, I might show this snippet and ask him/her to make it return 0, 1, 2 instead.

If you read the comments in the original [post](http://dailyjs.com/2012/07/23/js101-scope/), you can find two solutions.


