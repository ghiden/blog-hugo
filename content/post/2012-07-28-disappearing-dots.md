---
date: 2012-07-28T00:00:00Z
tags:
- javascript
title: Disappearing Dots
url: /2012/07/28/disappearing-dots/
---

Japan is too hot.  
Here is a little toy animation using canvas.  
It looks a bit like snow falling on the ground and dissappearing.  

<canvas id="ground" width="400" height="400" style="margin: 15px;"> </canvas>

{{< highlight javascript >}}
window.onload = (function(win, doc) {
  var c,
      TWOPI = 2*Math.PI, 
      last = +(new Date()),
      MY_BLACK = "rgba(0, 0, 0, 0.05)",
      WIDTH = 400,
      HEIGHT = 400;

  var randomPoint = function() {
    return Math.floor(Math.random() * WIDTH  + 1);
  }

  var draw = function() {
    var now = +(new Date());
    c.fillStyle = MY_BLACK;
    c.fillRect(0, 0, WIDTH, HEIGHT);
    if (now - last > 1000) {
      c.fillStyle = "#fff";
      c.beginPath();
      c.arc(randomPoint(), randomPoint(), 5, 0, TWOPI, true);
      c.fill();
      last = now;
    }
    win.requestAnimationFrame(draw);
  }

  var init = function() {
    var canvas = doc.getElementById("ground");

    c = canvas.getContext("2d");
    c.fillStyle = "#000";
    c.fillRect(0, 0, WIDTH, HEIGHT);

    win.requestAnimationFrame(draw);
  };

  return init;
}(window, document));
{{< / highlight >}}

<script src="/assets/javascripts/disappearing_dots.js" type="text/javascript"> </script>
