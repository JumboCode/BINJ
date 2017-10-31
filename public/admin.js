var startLat = 42.3601;
var startLng = -71.0589;

var map;
var geocoder;
var user;
var coordinates = [];

var button;



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
        this.coordinates = [latLng.latitude, latLng.longitude];
        geocoder.geocode({'latLng': latLng}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    document.getElementById("location").value = results[1].formatted_address;
                }
            }
        })
    }
}

//document.onload = 

document.onload = google.maps.event.addListener(map, "click", function (e) {
    console.log("event triggered\n");
    alert("recognized click")
    //lat and lng is available in e object
    //var latLng = e.latLng;
    //console.log(latlng);
});

$(document).ready(function() {
$("#submitbutton").on('click', function(){
    alert("submit started");
    var dataObject = new Object();
    dataObject.title = $('#title').val();
    dataObject.author = $('#author').val();
    dataObject.url = $('#url').val();
    dataObject.header_photo_url = $('#header_photo_url').val();
    dataObject.published_date = new Date();
    dataObject.blurb = $('#blurb').val();
    dataObject.location_name = $('#location_name').val();
    dataObject.coordinates = this.coordinates;
    
    button = story;
    console.log($('#title').val());
    
    var dataString = JSON.stringify(dataObject);

    $.ajax({
        url: "http://" + this.hostname + ":" + this.port + "/stories/",
        type: 'POST',
        data: {
            story: dataString
        },
        success: function(response) {
            alert ("success");
        }
    })
})
})

