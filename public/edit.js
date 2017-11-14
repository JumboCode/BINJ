$.holdReady(true);
stories =  [];
coordinates = [];

var artInfo = new Object();
hostname = location.hostname;
port = location.port;
storyId = -1;

if (hostname == "localhost") {
    url = "http://" + hostname + ":" + port + "/stories/";
} else {
    url = "https://" + hostname + ":" + port + "/stories/";
}
var self = this;

getStories();

function getStories() {
    $.get(self.url, function( data ) {
        stories = data;
        $.holdReady(false);
    });
};


function deleteStory(story) {
    var id = $(story).data('id');
    $.ajax({
    url: self.url + id,
    type: 'DELETE',
    success: function(result) {
        alert(id + "deleted");
    }
});
}

function editStory(story) {
    storyId = $(story).data('id');
    $.get(self.url + $(story).data('id'), function( data ) {
        artInfo = data;
        initMap(artInfo["coordinates"]);
        self.coordinates = artInfo["coordinates"];
        $("#titleId").replaceWith( '<input type="text" class="form-control" id="titleId" value="'+ artInfo["title"] + '">');
        $("#author").replaceWith( '<input type="text" class="form-control" id="author" value="'+ artInfo["author"] + '">');
        $("#blurbId").replaceWith( '<textarea id="blurbId" class="form-control" rows="15" >' + artInfo["blurb"] + '</textarea>');
        $("#location_name_modal").replaceWith( '<input type="text" class="form-control" id="location_name_modal" value="'+ artInfo["location_name"] + '">');
        $("#tags").replaceWith( '<input type="text" class="form-control" id="tags" value="'+ artInfo["type"] + '">');
        $("#url").replaceWith( '<input type="text" class="form-control" id="url" rows="1" value="'+ artInfo["url"] + '">');
    });
}

$(document).ready(function() {
    $.each(stories, function(index) {
        tempStory = stories[index];
        tempHTML =  '<div class="list-group-item">' + '<div id="overview" class="d-flex w-100 justify-content-between">' +
                          '<h5 id="title">' + tempStory['title'] +
                          '</h5> <small id="published_date">' + tempStory['published_date'] +
                         ' </small></div><p id="blurb">' + tempStory['blurb'] +
                         '</p><small id="location_name">' + tempStory['location_name'] +
                         '</small><div><button type="button" onClick="deleteStory(this)" data-id="'+ tempStory['_id'] + '" id="delete" class="btn-danger">Delete</button>' +
                         '<button type="button" class="btn btn-outline-danger" data-toggle="modal" data-target="#edit-modal" onClick="editStory(this)" data-id="'+ tempStory['_id'] + '">Edit</button></div></div>'
        $("#storiesList").append(tempHTML);
    })
})

function initMap(coords)
{
    map = new google.maps.Map(document.getElementById('map_canvas'), {
        zoom: 12,
        center: {lat: coords[1], lng: coords[0]}
    });
    geocoder = new google.maps.Geocoder();
    google.maps.event.addListener(map, 'click', function(event) {getAddress(event.latLng);});

    // refresh the map to stop the greying-out bug
    var refresh = function() {
        var center = map.getCenter();
            google.maps.event.trigger(map, "resize");
            map.setCenter(center);
            searchBox()
        }
    setTimeout(refresh, 500);

    var latlng = new google.maps.LatLng(coords[1], coords[0]);
    var marker = new google.maps.Marker({
      position: latlng,
      map: map
    });
    //Converts selected map location into formatted address which then goes into Location box
    function getAddress(latLng)
    {
        self.coordinates = [latLng.lng(), latLng.lat()];
        geocoder.geocode({'latLng': latLng}, function(results, status) {
            document.getElementById("location_name_modal").value = results[1].formatted_address;
            initMap(self.coordinates);
        })
    }

    function searchBox()
    {
        // Create the search box and link it to the UI element.
        var input = document.getElementById('location_name_modal');
        var searchBox = new google.maps.places.SearchBox(input);

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

            var latlng = new google.maps.LatLng(self.coordinates[1], self.coordinates[0]);
            var marker = new google.maps.Marker({
              position: latlng,
              map: map,
            });

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
}

 $("#submitButton").on('click', function(){
    if (location.hostname == "localhost") {
        PUTurl = "http://" + location.hostname + ":" + location.port + "/stories/" + storyId;
    } else {
        PUTurl = "https://" + location.hostname + ":" + location.port + "/stories/" + storyId;
    }
    toSubmit = {
        "title": $('#titleId').val(),
        "author": $('#author').val(),
        "url": $('#url').val(),
        "blurb": $('#blurbId').val(),
        "location_name": $('#location').val(),
        "type": $("input[name='storytype']:checked").val(),
        "coordinates": self.coordinates
    };
    //"header_photo_url": $('#header_photo_url').val(),

    //"published_date": new Date(),

    //"tags": $("#tags").tagsinput('items'),

    console.log(toSubmit);

    $.ajax({
        url: PUTurl,
        data: toSubmit,
        type: 'PUT',
        success: function() {alert("success"); console.log($('#author').val());}
    })
});
