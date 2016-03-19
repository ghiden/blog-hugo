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

    marker = new google.maps.Marker(
        {position:latlng, map:map, draggable:true});

    google.maps.event.addListener(marker, "dragstart", function() {
      circle.setOptions({fillOpacity:0, strokeOpacity: 0});
    });

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
