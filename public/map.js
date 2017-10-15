var startLat = 0;
var startLng = 0;


// Notes from Will:
// maybe we should consider user this nice looking library to deal with
// large quantities of markers:
// https://developers.google.com/maps/documentation/javascript/marker-clustering

// Here is the BINJ API key: AIzaSyCCPJ3Q8yqIUnauTodS9RgJWLNeQmxHEiw

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

// approximately from https://developers.google.com/maps/documentation/javascript/importing_data
// more on markers https://developers.google.com/maps/documentation/javascript/reference#Marker
function addStoryPoints(data) {
	console.log("gonna make some extra points");
	// later on this data will come from a request to some endpoint
	// but for now just some test data will do
	for (var i = 0; i < data.length; i++) {
        var point = data[i];
		console.log(i);
		var coords = point.location.geometry.coordinates;
        console.log(coords);
		var latlng = new google.maps.LatLng(coords[1], coords[0]);
		var marker = new google.maps.Marker({
			position: latlng,
			map: map,
			title: point.title
		});
		var infoWindow = new google.maps.InfoWindow();
        console.log(infoWindow);
		google.maps.event.addListener(marker, 'click', function() {
			infoWindow.setContent("<h1>" + point.title + "</h1><img src='" + point.header_photo_url + "' width='150px'><h3>by " + point.author + "</h3><p>" + point.blurb + "</p>");
			infoWindow.open(map, marker);
		});
	}
}

function initMap() {
	console.log("about to pan to:", user.lat(), user.lng());
	map.panTo(user);
	// userMarker = new google.maps.Marker({
	// 	position: user,
 //        map: map,
	// 	title: "lookie here"
	// });
	// google.maps.event.addListener(userMarker, 'click', function() {
	// 	userInfoWindow.setContent(userMarker.title);
	// 	userInfoWindow.open(map, userMarker);
	// });
	addStoryPoints(samplePoints);
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


// here lies some sample data
var point1 = {
    _id: null,
    title: "Somerville House Cat Complete Moon Mission",
    author: "Dennis the Cat",
    url: "hmm.com/story",
    header_photo_url: "https://i.ytimg.com/vi/E7BnKFl7lYI/hqdefault.jpg",
    published_date: new Date(),
    blurb: "Cat-stronaut pilots dry-food fueled engine to dark side of moon",
    tags: ["somerville", "cats", "news"],
    location: {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -71.12341225147247,
          42.402303114395295    
        ]
      }
    },
    location_name: "28 Whitman St"
};

var point2 = {
    _id: null,
    title: "Tufts Students Discover Gold in Sewer",
    author: "Tricky Snarkaretos",
    url: "this.isnt.real.co.uk",
    header_photo_url: "http://1.bp.blogspot.com/-5ZbU7ui6v_Q/Ti26NCiFeuI/AAAAAAAAHxw/B2HBln5KQcg/s1600/fW5nZ.St.11.jpg",
    published_date: Date(),
    blurb: "Three Tufts students stuck it rich, discovering hidden gold in a storm drain while looking for that old iPhone 6 they dropped on the way to spanish class",
    tags: ["somerville", "tufts", "sewer"],
    location: {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -71.12189412117003,
          42.406751426673765
        ]
      }
    },
    location_name: "That one storm drain by Monaco's house"
};

var samplePoints = [point1, point2];