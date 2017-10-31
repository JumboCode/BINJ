var startLat = 42.3601;
var startLng = -71.0589;

var map;
var geocoder;
var user;


function initMap()
{

    console.log("initMap called");
    map = new google.maps.Map(document.getElementById('map_canvas'), {
        zoom: 12,
        center: {lat: startLat, lng: startLng}
    });
    geocoder = new google.maps.Geocoder();
    google.maps.event.addListener(map, 'click', function(event) {getAddress(event.latLng);});

    //Converts selected map location into formatted address which then goes into Location box
    function getAddress(latLng)
    {
        geocoder.geocode({'latLng': latLng}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    document.getElementById("location").value = results[1].formatted_address;
                }
            }
        })
    }
}
