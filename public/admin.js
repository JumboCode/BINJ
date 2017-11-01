var startLat = 42.3601;
var startLng = -71.0589;

var map, geocoder, user;

var coordinates = [];
var self = this;

var hostname = location.hostname;
var port = location.port;

function initMap()
{
    map = new google.maps.Map(document.getElementById('map_canvas'), {
        zoom: 12,
        center: {lat: startLat, lng: startLng}
    });
    geocoder = new google.maps.Geocoder();
    searchBox();
    google.maps.event.addListener(map, 'click', function(event) {getAddress(event.latLng);});

    //Converts selected map location into formatted address which then goes into Location box
    function getAddress(latLng)
    {
        self.coordinates = [latLng.lng(), latLng.lat()];
        geocoder.geocode({'latLng': latLng}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    document.getElementById("location_name").value = results[1].formatted_address;
                }
            }
        })
    }

    function searchBox()
    {
        // Create the search box and link it to the UI element.
        var input = document.getElementById('location_name');
        var searchBox = new google.maps.places.SearchBox(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            // This creates an icon and puts it on the map. I'm not sure it's necessary because
            // this is the admin page, but it could be useful later down the line
            /*var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
          }));*/

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
        });

    }
}


$(document).ready(function() {
    initMap();
    $("#submitbutton").on('click', function(){
        $.post("http://" + location.hostname + ":" + location.port + "/stories", {
            "title": $('#title').val(),
            "author": $('#author').val(),
            "url": $('#url').val(),
            "header_photo_url": $('#header_photo_url').val(),
            "published_date": new Date(),
            "blurb": $('#blurb').val(),
            "tags": $("#tags").tagsinput('items'),
            "location_name": $('#location_name').val(),
            "type": $("input[name='storytype']:checked").val(),
            "coordinates": self.coordinates
        })
    });
});
