---
date: 2012-03-20T00:00:00Z
tags:
- javascript
- google-api
title: Playing with Google Maps
url: /2012/03/20/playing-with-google-maps/
---

<div id="playground">

  <div align="center" id="map"></div>

  <table id="latlng">
    <tr>
      <td><b>Latitude</b></td>
      <td><b>Longitude</b></td>
    </tr>
    <tr>
      <td id="lat"></td>
      <td id="lng"></td>
    </tr>
  </table>

  <form class="form-search" action="javascript:showAddress();">
    <input id="address" type="text" size="60" name="address" value="Tokyo" />
    <input type="submit" class="btn" value="Search!" />
  </form>

</div>

I had to use Google Maps for my current project.
Three things that I needed to do: 
* show longitude and latitude
* draw a circle (e.g. in radius of 100m)
* move it around that circle.

Geocoding part is just an extra.

        $(function() {
          var map, geocoder, circle, marker;

          function updateLatLng(latlng) {
            document.getElementById("lat").innerHTML = latlng.lat().toFixed(5);
            document.getElementById("lng").innerHTML = latlng.lng().toFixed(5);
          }

          function showAddress() {
            var address = document.getElementById("address").value;
            if (geocoder) {
              geocoder.geocode( {'address': address}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                  var latlng = results[0].geometry.location;
                  map.setCenter(latlng);
                  marker.setPosition(latlng);
                  updateLatLng(latlng);
                  circle.setOptions({center: latlng}); 
                }
                else {
                  alert("Geocode not successful: " + status);
                }
              }
              );
            }
            return false;
          }

          function load() {
            var latlng = new google.maps.LatLng(35.68949,  139.69171), 
                myOptions = {
                  zoom: 15,
                  center: latlng,
                  streetViewControl: false,
                  mapTypeId: google.maps.MapTypeId.ROADMAP };

            updateLatLng(latlng);

            map = new google.maps.Map(document.getElementById("map"), myOptions);

            /* 
              Create a circle with 100m radius.
              Set it to where the marker is located.
            */
            circle = new google.maps.Circle({
              strokeColor: "#FF0000",
                   strokeOpacity: 0.8,
                   strokeWidth: 1.5,
                   fillColor: "#ff0000",
                   fillOpacity: 0.35,
                   map: map,
                   center: latlng,
                   radius: 100
            });

            /* create a new marker and make it draggable  */
            marker = new google.maps.Marker(
                {position:latlng, map:map, draggable:true});

            /* when dragging stars, make the circle disappear */
            google.maps.event.addListener(marker, "dragstart", function() {
              circle.setOptions({fillOpacity:0, strokeOpacity: 0});
            });

            /* when dragging ends, make the circle appear and udpate latlng */
            google.maps.event.addListener(marker, "dragend", function() {
              var latlng = marker.getPosition();
              updateLatLng(latlng);
              circle.setOptions({
                center: latlng, 
                fillOpacity:0.35, 
                strokeOpacity: 0.8});
            });

            geocoder = new google.maps.Geocoder();
          }

          load();

          window.showAddress = showAddress;
        });

<script src="http://maps.google.com/maps/api/js?sensor=false" type="text/javascript"> </script>
<script src="/assets/javascripts/jquery-1.7.1.min.js" type="text/javascript"> </script>
<script src="/assets/javascripts/rloader1.5.3_min.js" type="text/javascript"> </script>
<script type="text/javascript">
  $.rloader([ {src:'/assets/stylesheets/gmaps.css'} ]);
</script>
<script src="/assets/javascripts/gmaps.js" type="text/javascript"> </script>
