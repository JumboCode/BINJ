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
        gestureHandling: 'greedy',
        styles: [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"lightness":33}]},{"featureType":"administrative","elementType":"labels","stylers":[{"saturation":"-100"}]},{"featureType":"administrative","elementType":"labels.text","stylers":[{"gamma":"0.75"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"lightness":"-37"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f9f9f9"}]},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"saturation":"-100"},{"lightness":"40"},{"visibility":"off"}]},{"featureType":"landscape.natural","elementType":"labels.text.fill","stylers":[{"saturation":"-100"},{"lightness":"-37"}]},{"featureType":"landscape.natural","elementType":"labels.text.stroke","stylers":[{"saturation":"-100"},{"lightness":"100"},{"weight":"2"}]},{"featureType":"landscape.natural","elementType":"labels.icon","stylers":[{"saturation":"-100"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"saturation":"-100"},{"lightness":"80"}]},{"featureType":"poi","elementType":"labels","stylers":[{"saturation":"-100"},{"lightness":"0"}]},{"featureType":"poi.attraction","elementType":"geometry","stylers":[{"lightness":"-4"},{"saturation":"-100"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#c5dac6"},{"visibility":"on"},{"saturation":"-95"},{"lightness":"62"}]},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"lightness":20}]},{"featureType":"road","elementType":"labels","stylers":[{"saturation":"-100"},{"gamma":"1.00"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"gamma":"0.50"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"saturation":"-100"},{"gamma":"0.50"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#c5c6c6"},{"saturation":"-100"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"lightness":"-13"}]},{"featureType":"road.highway","elementType":"labels.icon","stylers":[{"lightness":"0"},{"gamma":"1.09"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#e4d7c6"},{"saturation":"-100"},{"lightness":"47"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"lightness":"-12"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"saturation":"-100"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#fbfaf7"},{"lightness":"77"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"lightness":"-5"},{"saturation":"-100"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"saturation":"-100"},{"lightness":"-15"}]},{"featureType":"transit.station.airport","elementType":"geometry","stylers":[{"lightness":"47"},{"saturation":"-100"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"color":"#acbcc9"}]},{"featureType":"water","elementType":"geometry","stylers":[{"saturation":"53"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"lightness":"-42"},{"saturation":"17"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"lightness":"61"}]}]

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

        types = []
        if (($("input[name='storytype']:checked").length) != 0) {
          $.each($("input[name='storytype']:checked"), function() {
              types.push($(this)[0].value);
          });
        }

        $.post(url, {
            "title": $('#title').val(),
            "author": $('#author').val(),
            "url": $('#url').val(),
            "header_photo_url": $('#header_photo_url').val(),
            "published_date": $('#date').val(),
            "blurb": $('#blurb').val(),
            "tags": $("#tags").tagsinput('items'),
            "location_name": $('#location_name').val(),
            "type": types,
            "coordinates": self.coordinates
        }, function() {window.location.replace("admin");})
    });


    function updatedImgUrl() {
        const headerPhotoUrl = $("#header_photo_url");
        const img = $('<img id="preview-image">'); //Equivalent: $(document.createElement('img'))
        img.attr('src', headerPhotoUrl.val());
        $("#header_photo_url_parent img").remove();

        // img styling here
        img.attr('width', 450)

        $("#header_photo_url_parent").append(img);
    }

    const headerPhotoUrl = $("#header_photo_url");
    headerPhotoUrl.focusout(() => {
        console.log("focusing out: ")
        updatedImgUrl()

    });

    const articleUrl = $("#url");
    articleUrl.focusout(() => {
<<<<<<< HEAD
        $.get("/imgurl?url=" + articleUrl.val(), function(response) {
            console.log("got a valid url:")
            console.log(response)
=======
        $.get("/imgurl?url=" + articleUrl.val(), function(response) { 
>>>>>>> 67d7af24caee5a82080a188d30a1358d9a331add
            $("#header_photo_url").val(response)
            updatedImgUrl()
        }).fail(function(status) {
            // Add a better error handler here (possibly an error message)
            console.log(status)
            console.log("invalid url")
        });
    });

});
