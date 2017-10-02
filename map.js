var myLat = 0;
var myLng = 0;

function getMyLocation() {
	if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
			updateMap();
		});
	}
	else {
		alert("Geolocation is not supported by your web browser.  What a shame!");
	}
}

var me = new google.maps.LatLng(myLat, myLng); // default to South Station
var myOptions = {
	zoom: 13, // The larger the zoom number, the bigger the zoom
	center: me,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};
var map;
var infowindow = new google.maps.InfoWindow();
var stations = [
	{"station_name":"South Station", "latitude":42.352271, "longitude":-71.05524200000001},
	{"station_name":"Andrew", "latitude":42.330154, "longitude":-71.057655},
