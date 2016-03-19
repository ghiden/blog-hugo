window.requestAnimationFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         function(f) { return window.setTimeout(f, 1000 / 60); };
}());

window.onload = (function(win, doc) {
  var c,
      TWOPI = 2*Math.PI, 
      last = +(new Date()),
      MY_BLACK = "rgba(0, 0, 0, 0.04)",
      WIDTH = 400,
      HEIGHT = 400;

  var hsva = function(h, s, v, a) {
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
      c.fillStyle = hsva(randomWithin(200, 240), 
                         randomWithin(50, 100)/100,
                         randomWithin(50, 100)/100,
                         1.0);
      c.beginPath();
      c.arc(randomPoint(), randomPoint(), randomWithin(5,25), 0, TWOPI, true);
      c.fill();
      last = now;
    }
    win.requestAnimationFrame(draw);
  }

  var init = function() {
    var canvas = doc.getElementById("ground");

    c = canvas.getContext("2d");
    c.fillStyle = MY_BLACK;
    c.fillRect(0, 0, WIDTH, HEIGHT);

    win.requestAnimationFrame(draw);
  };

  return init;
}(window, document));
