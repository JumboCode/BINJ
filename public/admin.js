var startLat = 42.3601;
var startLng = -71.0589;

var map, geocoder, user;

var coordinates = [];
var self = this;
var markers = [];

var hostname = location.hostname;
var port = location.port;

function initMap()
{
    map = new google.maps.Map(document.getElementById('map_canvas'), {
        zoom: 12,
        center: {lat: startLat, lng: startLng},
        gestureHandling: 'greedy'
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
                    // Clear out the old markers.
                    markers.forEach(function(marker) {
                      marker.setMap(null);
                    });
                    var latlng = new google.maps.LatLng(self.coordinates[1], self.coordinates[0]);
                    var marker = new google.maps.Marker({
                      position: latlng,
                      map: map
                    });
                    self.markers.push(marker);
                    me = new google.maps.LatLng(self.coordinates[1], self.coordinates[0]);
                      map.panTo(me);
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

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            self.coordinates = [place.geometry.location.lng(), place.geometry.location.lat()];
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }

            var latlng = new google.maps.LatLng(self.coordinates[1], self.coordinates[0]);
            var marker = new google.maps.Marker({
              position: latlng,
              map: map
            });
            self.markers.push(marker);

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
        if (location.hostname == "localhost") {
            url = "http://" + location.hostname + ":" + location.port + "/stories";
        } else {
            url = "https://" + location.hostname + ":" + location.port + "/stories";
        }
        $.post(url, {
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
        }, function() {window.location.replace("admin");})
    });

    const headerPhotoUrl = $("#header_photo_url");
    headerPhotoUrl.focusout(() => {
        $.getJSON("/imgurl", {url: headerPhotoUrl.val()}, (error, response) => {
            if (error) {
                alert("Invalid URL");
            } else {
                const img = $('<img id="preview-image">'); //Equivalent: $(document.createElement('img'))
                img.attr('src', response);
                headerPhotoUrl.append(img);
            }
        });
    });
});
