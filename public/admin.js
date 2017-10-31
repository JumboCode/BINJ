var startLat = 42.3601;
var startLng = -71.0589;

var map, geocoder, user;

var coordinates = [];

var hostname = location.hostname;
var port = location.port;

initMap();

function initMap()
{
    map = new google.maps.Map(document.getElementById('map_canvas'), {
        zoom: 12,
        center: {lat: startLat, lng: startLng}
    });
    geocoder = new google.maps.Geocoder();
    google.maps.event.addListener(map, 'click', function(event) {getAddress(event.latLng);});

    //Converts selected map location into formatted address which then goes into Location box
    function getAddress(latLng)
    {
        this.coordinates = [latLng.latitude, latLng.longitude];
        geocoder.geocode({'latLng': latLng}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    document.getElementById("location_name").value = results[1].formatted_address;
                }
            }
        })
    }
}

$(document).ready(function() {
    $("#submitbutton").on('click', function(){
        $.post("http://" + location.hostname + ":" + location.port + "/stories", {
            "title": $('#title').val(),
            "author": $('#author').val(),
            "url": $('#url').val(),
            "header_photo_url": $('#header_photo_url').val(),
            "published_date": new Date(),
            "blurb": $('#blurb').val(),
            "location_name": $('#location_name').val()
        })
    });
});
