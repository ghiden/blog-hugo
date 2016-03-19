---
date: 2012-07-30T00:00:00Z
tags:
- javascript
title: Adding Colors to Disappearing Dots
url: /2012/07/30/adding-colors-to-disappearing-dots/
---

This is a second iteration to [the disappering dots](/2012/07/28/disappearing-dots/).  
As the title says, I'm adding colors to dots.  
How about some nice color variations in blue.

<canvas id="ground" width="400" height="400" style="margin: 15px;"> </canvas>

I found a very minimum implementation of HSV to RGV conversion here:
<http://spphire9.wordpress.com/2011/03/03/javascript%E3%81%A7hsv%E3%81%8B%E3%82%89rgb%E5%A4%89%E6%8F%9B/>

Hue is a random value from 200 to 240.  
Saturation is between 50 to 100.  
Value is also between 50 to 100.  

Size of circles is also randomized this time.

Use of HSV, I learned from this lecture notes:
<http://yoppa.org/cuc_prog12/3766.html>  
It's all in Japanese but code is in processing, so you don't really need to read Japanese.

{{< highlight javascript >}}
window.onload = (function(win, doc) {
  var c,
      TWOPI = 2*Math.PI, 
      last = +(new Date()),
      // a bit slower fading out
      MY_BLACK = "rgba(0, 0, 0, 0.4)",
      WIDTH = 400,
      HEIGHT = 400;

  var hsva(h, s, v, a) {
      var f = h/60,
          i = f^0,
          m = v-v*s,
          k = v*s*(f-i),
          p = v-k,
          q = k+m;
          return 'rgba('
            +[[v,p,m,m,q,v][i]*255^0,
            [q,v,v,p,m,m][i]*255^0,
            [m,m,q,v,v,p][i]*255^0,a].join(',')
            +')';
  }

  function randomWithin(a, b) {
      var diff = b - a;
      var val = Math.floor(Math.random() * diff + a);
      return val;
  }

  var randomPoint = function() {
    return Math.floor(Math.random() * WIDTH  + 1);
  }

  var draw = function() {
    var now = +(new Date());
    c.fillStyle = MY_BLACK;
    c.fillRect(0, 0, WIDTH, HEIGHT);
    if (now - last > 1000) {
      // hue being 200 to 240 generates bluish color variations
      c.fillStyle = hsva(randomWithin(200, 240), 
                         randomWithin(50, 100)/100,
                         randomWithin(50, 100)/100,
                         .5);
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

<script src="/assets/javascripts/adding_colors_to_disappearing_dots.js" type="text/javascript"> </script>
