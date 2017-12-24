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
// var markerCluster = new MarkerClusterer(map, markers,
//             {imagePath: '../images/m'});
var oms = new OverlappingMarkerSpiderfier(map, {
  markersWontMove: true,
  markersWontHide: true,
  basicFormatEvents: true
});

//look at other icons https://github.com/jawj/OverlappingMarkerSpiderfier
// oms.addListener('format', function(marker, status) {
//         var iconURL = status == OverlappingMarkerSpiderfier.markerStatus.SPIDERFIED ? 'images/m1' :
//           status == OverlappingMarkerSpiderfier.markerStatus.SPIDERFIABLE ? 'images/m2' :
//           status == OverlappingMarkerSpiderfier.markerStatus.UNSPIDERFIABLE ? 'images/m3' :
//           null;
//         var iconSize = new google.maps.Size(23, 32);
//         marker.setIcon({
//           url: iconURL,
//           size: iconSize,
//           scaledSize: iconSize  // makes SVG icons work in IE
//         });
//       });

var userMarker;
var userInfoWindow = new google.maps.InfoWindow();

// approximately from https://developers.google.com/maps/documentation/javascript/importing_data
// more on markers https://developers.google.com/maps/documentation/javascript/reference#Marker
function addStoryPoints(data, tags, boxes) {

    for (var i = 0; i < data.length; i++) {
    var point = data[i];
    // this only handles geojson points!

    // for (var j = 0; i < tags.length; j++) {
      // var f = tags[j];
    if ((inBoxes(point, boxes) || inTags(point, tags)) || ((boxes.length == 0) && tags.length == 0)) {
        var coords = point.coordinates;
        //check for incorrectly formatted coordinates
        if (coords[1] != "" && typeof coords[1] != "undefined"
            && coords[0] != "" && coords[0] != "undefined") {
          var latlng = new google.maps.LatLng(coords[1], coords[0]);

          switch(point.type) {
            case "Arts":
              icon = "../images/arts.png";
              break;
            case "Politics":
              icon = "../images/politics.png";
              break;
            case "Science":
              icon = "../images/science.png";
              break;
            case "Sports":
              icon = "../images/sports.png";
              break;
            default:
              icon = "../images/alert.png";
          }
          var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: point.title,
            author: point.author,
            blurb: point.blurb,
            photo: point.header_photo_url,
            icon: icon,
            tags: point.tags,
            published_date: point.published_date,
            url: point.url
          });
          markers.push(marker);
          // markerCluster.addMarker(marker);
          var infoWindow = new google.maps.InfoWindow();
          map.panTo(latlng);
          google.maps.event.addListener(marker, 'click', function() {
            infoWindow.setContent("<h1 class='bubbleTitle'>" + this.title +
                                  "</h1><br><img src='" + this.photo +
                                  "' class='bubbleImg'></img><br><h4>" + cleanDate(this.published_date.toString()) +
                                  "</h4><i><h4 class='bubbleAuthor'>By " + this.author +
                                  "</i> | Tags: " + this.tags.join(", ") +
                                  "</h4><p>" + this.blurb +
                                  "</p><br><button class='storyLink'><a id='linkText' href=" + this.url +
                                  " target='_blank'>Full story</a></button>");
            infoWindow.open(map, this);
          });
          oms.addMarker(marker);

        }
      }
    }

  }

  function cleanDate(published_date)
  {
      var year = published_date.slice(0, 4);
      var month = published_date.slice(5, 7);
      var day = published_date.slice(8, 10);
      return clean_date = (month + "/" + day + "/" + year);
  };

function inBoxes(story, boxes) {
  if (boxes.length == 0) {
    return false;
  } else if (boxes.includes(story.type) || boxes.includes(story.author)) {
    return true;
  }
  return false;
}

function inTags(story, filter) {
  if (filter.length == 0) {
    return false;
  }
  var tags = story.tags;
  for (var i = 0; i < filter.length; i++) {
    if (filter[i] != "" && tags.includes(filter[i])) return true;
  }
  return false;

}

function initMap() {
  var filter = JSON.parse(localStorage.getItem("filter"));
  if (location.hostname == "localhost") {
      var url = 'http://' + location.hostname + ':' + location.port;
  } else {
      var url = 'https://' + location.hostname + ':' + location.port;
  }

  boston = new google.maps.LatLng(bostonLat, bostonLng);
    map.panTo(boston);
  var urlToParse = location.search;
  var result = parseQueryString(urlToParse );
  $.get(url + '/stories/', function(data){
    addStoryPoints(data, filter.tags, filter.boxes);
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
