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
	// later on this data will come from a request to some endpoint
	// but for now just some test data will do
	for (var i = 0; i < data.length; i++) {
        	var point = data[i];
        	// this only handles geojson points!
		var coords = point.coordinates;
    console.log(coords);
		var latlng = new google.maps.LatLng(coords[1], coords[0]);
		var marker = new google.maps.Marker({
			position: latlng,
			map: map,
			title: point.title,
            		author: point.author,
            		blurb: point.blurb,
            		photo: point.header_photo_url
		});
		var infoWindow = new google.maps.InfoWindow();
		google.maps.event.addListener(marker, 'click', function() {
			infoWindow.setContent("<h1>" + this.title + "</h1><img src='" + this.photo + "' width='150px'><h3>by " + this.author + "</h3><p>" + this.blurb + "</p>");
			infoWindow.open(map, this);
		});
	}
}

function initMap() {
  var url = 'http://localhost:3000';
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
    var urlToParse = location.search;
    var result = parseQueryString(urlToParse);
    $.get(url + '/stories/', function(data) {
      addStoryPoints(data);
    });
	  // addStoryPoints(samplePoints);
}



function setup() {
	if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
		navigator.geolocation.getCurrentPosition(function(position) {
			startLat = position.coords.latitude;
			startLng = position.coords.longitude;
			user = new google.maps.LatLng(startLat, startLng);
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
    title: "Somerville House Cat Completes Moon Mission",
    author: "Dennis the Cat",
    url: "hmm.com/story",
    header_photo_url: "https://i.ytimg.com/vi/E7BnKFl7lYI/hqdefault.jpg",
    published_date: new Date(),
    blurb: "Cat-stronaut pilots dry-food fueled engine to dark side of moon",
    tags: ["somerville", "cats", "news"],
    coordinates: [
          -71.12341225147247,
          42.402303114395295],
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
    coordinates: [
          -71.12189412117003,
          42.406751426673765],
    location_name: "That one storm drain by Monaco's house"
};

var point3 = {
    _id: null,
    title: "Boy Trips on Shoelace, Stays on Ground",
    author: "Squilliam Fancypants",
    url: "another-fake-url.io",
    header_photo_url: "https://fittingchildrenshoes.com/wp-content/uploads/2016/02/38970378_s.jpg",
    published_date: Date(),
    blurb: "Local boy who never learned to tie his shoes falls yet again, but this time decides to cut his loses and just stay on the ground forever.",
    tags: ["somerville", "tufts", "news"],
    coordinates: [
          -71.120490,
          42.404189],
    location_name: "Right by South, I mean Harleston"
};

var point4 = {
    _id: null,
    title: "Tufts Passes Legislation Offcially Combining Sports and Fraternity Houses",
    author: "Squilliam Fancysuds",
    url: "yet_another-fake-url.io",
    header_photo_url: "https://fittingchildrenshoes.com/wp-content/uploads/2016/02/38970378_s.jpg",
    published_date: Date(),
    blurb: "Some things happened. Some more things were done.",
    tags: ["somerville", "tufts", "news", "satire"],
    coordinates: [
          -71.120499,
          42.404183],
    location_name: "Around Tufts Somewhere"
};

var samplePoints = [point1, point2, point3, point4];

// parsing url parameters
// special thanks to https://cmatskas.com/get-url-parameters-using-javascript/
var parseQueryString = function(url) {
  var urlParams = {};
  url.replace(
    new RegExp("([^?=&]+)(=([^&]*))?", "g"),
    function($0, $1, $2, $3) {
      urlParams[$1] = $3;
    }
  );

  return urlParams;
}
