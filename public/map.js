var startLat = 0;
var startLng = 0;

var bostonLat =  42.35;
var bostonLng = -71.10;
var bostonLatLng = new google.maps.LatLng(bostonLat, bostonLng);


// Notes from Will:
// maybe we should consider user this nice looking library to deal with
// large quantities of markers:
// https://developers.google.com/maps/documentation/javascript/marker-clustering

// Here is the BINJ API key: AIzaSyCCPJ3Q8yqIUnauTodS9RgJWLNeQmxHEiw

// maybe it'd be nice to go to user's location, unless user isn't in
// the boston area, in which case default to ... somewhere in boston

var user;

var mapOptions = {
    zoom: 12, // The larger the zoom number, the bigger the zoom
    center: user,
    gestureHandling: 'greedy',
    mapTypeId: google.maps.MapTypeId.ROADMAP,
     styles: [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"lightness":33}]},{"featureType":"administrative","elementType":"labels","stylers":[{"saturation":"-100"}]},{"featureType":"administrative","elementType":"labels.text","stylers":[{"gamma":"0.75"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"lightness":"-37"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f9f9f9"}]},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"saturation":"-100"},{"lightness":"40"},{"visibility":"off"}]},{"featureType":"landscape.natural","elementType":"labels.text.fill","stylers":[{"saturation":"-100"},{"lightness":"-37"}]},{"featureType":"landscape.natural","elementType":"labels.text.stroke","stylers":[{"saturation":"-100"},{"lightness":"100"},{"weight":"2"}]},{"featureType":"landscape.natural","elementType":"labels.icon","stylers":[{"saturation":"-100"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"saturation":"-100"},{"lightness":"80"}]},{"featureType":"poi","elementType":"labels","stylers":[{"saturation":"-100"},{"lightness":"0"}]},{"featureType":"poi.attraction","elementType":"geometry","stylers":[{"lightness":"-4"},{"saturation":"-100"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#c5dac6"},{"visibility":"on"},{"saturation":"-95"},{"lightness":"62"}]},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"lightness":20}]},{"featureType":"road","elementType":"labels","stylers":[{"saturation":"-100"},{"gamma":"1.00"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"gamma":"0.50"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"saturation":"-100"},{"gamma":"0.50"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#c5c6c6"},{"saturation":"-100"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"lightness":"-13"}]},{"featureType":"road.highway","elementType":"labels.icon","stylers":[{"lightness":"0"},{"gamma":"1.09"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#e4d7c6"},{"saturation":"-100"},{"lightness":"47"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"lightness":"-12"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"saturation":"-100"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#fbfaf7"},{"lightness":"77"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"lightness":"-5"},{"saturation":"-100"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"saturation":"-100"},{"lightness":"-15"}]},{"featureType":"transit.station.airport","elementType":"geometry","stylers":[{"lightness":"47"},{"saturation":"-100"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"color":"#acbcc9"}]},{"featureType":"water","elementType":"geometry","stylers":[{"saturation":"53"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"lightness":"-42"},{"saturation":"17"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"lightness":"61"}]}]
    
};
var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
var markers = [];
var markerCluster = new MarkerClusterer(map, markers,
            {imagePath: '../images/m'});
var userMarker;
var userInfoWindow = new google.maps.InfoWindow();

// approximately from https://developers.google.com/maps/documentation/javascript/importing_data
// more on markers https://developers.google.com/maps/documentation/javascript/reference#Marker
function addStoryPoints(data, filter, author) {

  var filters = String(filter).split("+");
  var authors = String(author).split("+");

    for (var i = 0; i < data.length; i++) {
    var point = data[i];
    // this only handles geojson points!
    // for (var j = 0; i < filters.length; j++) {
      // var f = filters[j];
    if (filterAuthor(point, authors) || typeof author == "undefined" || author == "") {
      if (filterTags(point, filters) || typeof filter == "undefined" || filter == "") {
        var coords = point.coordinates;
        //check for incorrectly formatted coordinates
        if (coords[1] != "" && typeof coords[1] != "undefined"
            && coords[0] != "" && coords[0] != "undefined") {
          var latlng = new google.maps.LatLng(coords[1], coords[0]);


          var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: point.title,
                      author: point.author,
                      blurb: point.blurb,
                      photo: point.header_photo_url
          });
          markers.push(marker);
          markerCluster.addMarker(marker);
          var infoWindow = new google.maps.InfoWindow();
          map.panTo(latlng);
          google.maps.event.addListener(marker, 'click', function() {
            infoWindow.setContent("<h1>" + this.title + "</h1><img src='" + this.photo + "' width='150px'><h3>by " + this.author + "</h3><p>" + this.blurb + "</p>");
            infoWindow.open(map, this);
          });
        }
      }
    }

  }
}

function filterAuthor(story, authors) {
  if (authors.includes(story.author)) return true;
  return false;
}

function filterTags(story, filter) {
  var tags = story.tags;
  for (var i = 0; i < filter.length; i++) {
    if (filter[i] != "" && tags.includes(filter[i])) return true;
  }
  return false;

}

function initMap() {
  if (location.hostname == "localhost") {
      var url = 'http://' + location.hostname + ':' + location.port;
  } else {
      var url = 'https://' + location.hostname + ':' + location.port;
  }

  // this has been added for testing -wm
  // url = 'http://binj-map.herokuapp.com';

  boston = new google.maps.LatLng(bostonLat, bostonLng);
    map.panTo(boston);
  var urlToParse = location.search;
  var result = parseQueryString(urlToParse );
  $.get(url + '/stories/', function(data){
    addStoryPoints(data, result.filter, result.author);
    localStorage.setItem('storyData', JSON.stringify(data));
    searchBox();
  });

}

function searchBox()
  {
      // Create the search box and link it to the UI element.
      var input = document.getElementById('loc_search');
      var searchBox = new google.maps.places.SearchBox(input);
      map.controls[google.maps.ControlPosition.TOP].push(input);

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
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
          self.coordinates = [place.geometry.location.lng(), place.geometry.location.lat()];
          if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
          }

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
