

var startLat = 42.3601;
var startLng = -71.0589;

console.log("inside admin.js");

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
    
}

function getAddress()
{
    var latlng = map.getCenter()	
    console.log(latlng);
    alert(latlng);
    
    //Geocoding
    geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                document.getElementById("location").value = results[1].formatted_address;
            }
        }
    })
    //Grab element fill with value

}


document

document.onload = google.maps.event.addListener(map, "click", function (e) {
    console.log("event triggered\n");
    alert("recognized click")
    //lat and lng is available in e object
    //var latLng = e.latLng;
    //console.log(latlng);
});
