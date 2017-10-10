var startLat = 0;
var startLng = 0;

// maybe it'd be nice to go to user's location, unless user isn't in 
// the boston area, in which case default to ... somewhere in boston
var user; 
var mapOptions = {
	zoom: 13, // The larger the zoom number, the bigger the zoom
	center: user,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};
var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
var userMarker;
var userInfoWindow = new google.maps.InfoWindow();


function initMap() {
	console.log("about to pan to:", user.lat(), user.lng());
	map.panTo(user);
	userMarker = new google.maps.Marker({
		position: user,
		title: "lookie here"
	});
	userMarker.setMap(map);
	google.maps.event.addListener(userMarker, 'click', function() {
		userInfoWindow.setContent(userMarker.title);
		userInfoWindow.open(map, userMarker);
	});
}



function setup() {
	if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
		navigator.geolocation.getCurrentPosition(function(position) {
			startLat = position.coords.latitude;
			startLng = position.coords.longitude;
			user = new google.maps.LatLng(startLat, startLng);
			console.log("user coords are", startLat, startLng);
			initMap();
		});
	}
	else {
		alert("Geolocation is not supported by your web browser.  What a shame!");
		initMap();
	}
}