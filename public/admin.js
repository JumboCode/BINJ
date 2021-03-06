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
        $(story).parent().parent().parent().parent().remove();
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
        $("#modal_author").replaceWith( '<input type="text" class="form-control" id="author" value="'+ artInfo["author"] + '">');
        $("#date").replaceWith( '<input type="date" class="form-control" id="date" value="'+ artInfo["published_date"].slice(0,10) + '">');
        $("#publication_name").replaceWith('<input type="linkType" class="form-control" id="publication_name" value="' + artInfo["publication_name"] + '">');
        $("#publication_logo_url").replaceWith('<input type="linkType" class="form-control" id="publication_logo_url" value="' + artInfo["publication_logo_url"] + '">')
        $("#blurbId").replaceWith( '<textarea id="blurbId" class="form-control" rows="15" >' + artInfo["blurb"] + '</textarea>');
        $("#location_name_modal").replaceWith( '<input type="text" class="form-control" id="location_name_modal" value="'+ artInfo["location_name"] + '">');
        $("#url").replaceWith( '<input type="text" class="form-control" id="url" rows="1" value="'+ artInfo["url"] + '">');
        $("#header_photo_url").replaceWith( '<input type="text" class="form-control" id="header_photo_url" rows="1" value="'+ artInfo["header_photo_url"] + '">');
        $("#checkboxes").replaceWith(checkBox(artInfo["type"]));
        $("#icons").replaceWith(icons(artInfo["icon"]));
        $("#modalTags").tagsinput();
        artInfo["tags"].forEach(function(elem) {
          $("#modalTags").tagsinput('add', elem);
        })
    });
}
function checkBox(storytype) {
  // or, as the locals call it, the SpaghettiCodeGenerator3000

  html = '<label for="storytype">Story type and icon</label><div id="checkboxes">';
  if (storytype.indexOf('ArtsAndEntertainment') != -1) {
    html += '<div class="checkbox"><label><input type="checkbox" name="storytype" value="ArtsAndEntertainment" checked>Arts and Entertainment</label></div>';
  } else {
    html += '<div class="checkbox"><label><input type="checkbox" name="storytype" value="ArtsAndEntertainment">Arts and Entertainment</label></div>';
  }
  if (storytype.indexOf('BusinessNonprofitCommerce') != -1) {
    html += '<div class="checkbox"><label><input type="checkbox" name="storytype" value="BusinessNonprofitCommerce" checked>Business, Nonprofits, Commerce</label></div>';
  } else {
    html += '<div class="checkbox"><label><input type="checkbox" name="storytype" value="BusinessNonprofitCommerce">Business, Nonprofits, Commerce</label></div>';
  }
  if (storytype.indexOf('CommunityAndNeighborhoods') != -1) {
    html += '<div class="checkbox"><label><input type="checkbox" name="storytype" value="CommunityAndNeighborhoods" checked>Community and Neighborhoods</label></div>';
  } else {
    html += '<div class="checkbox"><label><input type="checkbox" name="storytype" value="CommunityAndNeighborhoods">Community and Neighborhoods</label></div>';
  }
  if (storytype.indexOf('EducationAndFamilies') != -1) {
    html += '<div class="checkbox"><label><input type="checkbox" name="storytype" value="EducationAndFamilies" checked>Education and Families</label></div>';
  } else {
    html += '<div class="checkbox"><label><input type="checkbox" name="storytype" value="EducationAndFamilies">Education and Families</label></div>';
  }
  if (storytype.indexOf('HousingAndHealth') != -1) {
    html += '<div class="checkbox"><label><input type="checkbox" name="storytype" value="HousingAndHealth" checked>Housing and Health</label></div>';
  } else {
    html +='<div class="checkbox"><label><input type="checkbox" name="storytype" value="HousingAndHealth">Housing and Health</label></div>'
  }
  if (storytype.indexOf('LaborAndActivism') != -1) {
    html += '<div class="checkbox"><label><input type="checkbox" name="storytype" value="LaborAndActivism" checked>Labor and Activism</label></div>';
  } else {
    html += '<div class="checkbox"><label><input type="checkbox" name="storytype" value="LaborAndActivism">Labor and Activism</label></div>';
  }
  if (storytype.indexOf('Politics') != -1) {
    html += '<div class="checkbox"><label><input type="checkbox" name="storytype" value="Politics" checked>Politics</label></div>';
  } else {
    html += '<div class="checkbox"><label><input type="checkbox" name="storytype" value="Politics">Politics</label></div>';
  }
  if (storytype.indexOf('Sports') != -1) {
    html += '<div class="checkbox"><label><input type="checkbox" name="storytype" value="Sports" checked>Sports</label></div>';
  } else {
    html += '<div class="checkbox"><label><input type="checkbox" name="storytype" value="Sports">Sports</label></div>';
  }
  if (storytype.indexOf('Transit') != -1) {
    html += '<div class="checkbox"><label><input type="checkbox" name="storytype" value="Transit" checked>Transit</label></div>';
  } else {
    html += '<div class="checkbox"><label><input type="checkbox" name="storytype" value="Transit">Transit</label></div>';
  }
  if (storytype.indexOf('Other') != -1) {
    html += '<div class="checkbox"><label><input type="checkbox" name="storytype" value="Other" checked>Other</label></div>';
  } else {
    html += '<div class="checkbox"><label><input type="checkbox" name="storytype" value="Other">Other</label></div>';
  }

  html += "</div>"
  return html;
}

function icons(icon) {
  html = '<div class="col-md-3">';
  if (icon == "ArtsAndEntertainment") {
    html += '<div id="icon"> <label><input type="radio" name="icon" value="ArtsAndEntertainment" checked><img src="../images/AE.png" alt="Arts and Entertainment" /></label></div>';
  } else {
    html += '<div id="icon"> <label><input type="radio" name="icon" value="ArtsAndEntertainment"><img src="../images/AE.png" alt="Arts and Entertainment" /></label></div>';
  }
  if (icon == "BusinessNonprofitCommerce") {
    html += '<div id="icon"><label><input type="radio" name="icon" value="BusinessNonprofitCommerce" checked><img src="../images/BN.png" alt="Business/Nonprofit/Commerce" /></label></div>';
  } else {
    html += '<div id="icon"><label><input type="radio" name="icon" value="BusinessNonprofitCommerce"><img src="../images/BN.png" alt="Business/Nonprofit/Commerce" /></label></div>';
  }
  if (icon == "CommunityAndNeighborhoods") {
    html += '<div id="icon"><label><input type="radio" name="icon" value="CommunityAndNeighborhoods" checked><img src="../images/CN.png" alt="Community and Neighborhoods" /></label></div>';
  } else {
    html += '<div id="icon"><label><input type="radio" name="icon" value="CommunityAndNeighborhoods"><img src="../images/CN.png" alt="Community and Neighborhoods" /></label></div>';
  }
  if (icon == "EducationAndFamilies") {
    html += '<div id="icon"><label><input type="radio" name="icon" value="EducationAndFamilies" checked><img src="../images/EF.png" alt="Education and Families" /></label></div>';
  } else {
    html += '<div id="icon"><label><input type="radio" name="icon" value="EducationAndFamilies"><img src="../images/EF.png" alt="Education and Families" /></label></div>';
  }
  if (icon == "HousingAndHealth") {
    html += '<div id="icon"><label><input type="radio" name="icon" value="HousingAndHealth" checked><img src="../images/HH.png" alt="Housing and Health" /></label></div>';
  } else {
    html += '<div id="icon"><label><input type="radio" name="icon" value="HousingAndHealth"><img src="../images/HH.png" alt="Housing and Health" /></label></div>';
  }
  html += '</div><div class="col-md-3">';
  if (icon == "LaborAndActivism") {
    html += '<div id="icon"><label><input type="radio" name="icon" value="LaborAndActivism" checked><img src="../images/LA.png" alt="Labor and Activism" /></label></div>';
  } else {
    html += '<div id="icon"><label><input type="radio" name="icon" value="LaborAndActivism"><img src="../images/LA.png" alt="Labor and Activism" /></label></div>';
  }
  if (icon == "Politics") {
    html += '<div id="icon"><label><input type="radio" name="icon" value="Politics" checked><img src="../images/POLITICS.png" alt="Politics" /></label></div>';
  } else {
    html += '<div id="icon"><label><input type="radio" name="icon" value="Politics"><img src="../images/POLITICS.png" alt="Politics" /></label></div>';
  }
  if (icon == "Sports") {
    html += '<div id="icon"><label><input type="radio" name="icon" value="Sports" checked><img src="../images/SPORTS.png" alt="Sports" /></label></div>';
  } else {
    html += '<div id="icon"><label><input type="radio" name="icon" value="Sports"><img src="../images/SPORTS.png" alt="Sports" /></label></div>';
  }
  if (icon == "Transit") {
    html += '<div id="icon"><label><input type="radio" name="icon" value="Transit" checked><img src="../images/TT.png" alt="Transit" /></label></div>';
  } else {
    html += '<div id="icon"><label><input type="radio" name="icon" value="Transit"><img src="../images/TT.png" alt="Transit" /></label></div>';
  }
  if (icon == "Other" || icon == undefined) {
    html += '<div id="icon"><label><input type="radio" name="icon" value="Other" checked><img src="../images/OTHER.png" alt="Other" /></label></div>';
  } else {
    html += '<div id="icon"><label><input type="radio" name="icon" value="Other"><img src="../images/OTHER.png" alt="Other" /></label></div>';
  }
  html += '</div';
  return html
}

function cleanDate(published_date)
{
    var year = published_date.slice(0, 4);
    var month = published_date.slice(5, 7);
    var day = published_date.slice(8, 10);
    return clean_date = (month + "/" + day + "/" + year);
};

$(document).ready(function() {
    $.each(stories, function(index) {
        tempStory = stories[index];
        published_date = tempStory["published_date"];
        if(published_date != undefined) {
            var clean_date = cleanDate(published_date.toString());
        } else {
            var clean_data = "0-0-0";
        }

        tempHTML =  '<div class="list-group-item clearfix" id="eachStory">' + '<div class="container-fluid"><div class="col-xs-6">' + '<div id="overview" class="d-flex w-100 justify-content-between">' +
                          '<h5 id="title">' + tempStory['title'] +
                          '</h5> <small id="published_date">' + clean_date +
                         ' </small></div><p id="blurb">' + tempStory['blurb'] +
                         '</p><small id="modal-author">' + tempStory['author'] +
                         '</small></div><div class="col-xs-6"> <div class="row"> <img src="'+ tempStory['header_photo_url'] +'" class="thumbnail pull-right" alt="No image" style="height:150px; width:200px"></div><div class="row"> <button type="button" onClick="deleteStory(this)" data-id="'+ tempStory['_id'] + '" id="delete" class="btn btn-danger pull-right">Delete</button>' +
                         '<button type="button" class="btn btn-warning pull-right" data-toggle="modal" data-target="#edit-modal" onClick="editStory(this)" data-id="'+ tempStory['_id'] + '">Edit</button></div></div></div>'
        $("#storiesList").append(tempHTML);
    })
})

function initMap(coords)
{
    map = new google.maps.Map(document.getElementById('map_canvas'), {
        zoom: 12,
        center: {lat: coords[1], lng: coords[0]},
        gestureHandling: 'greedy',
        styles: [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"lightness":33}]},{"featureType":"administrative","elementType":"labels","stylers":[{"saturation":"-100"}]},{"featureType":"administrative","elementType":"labels.text","stylers":[{"gamma":"0.75"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"lightness":"-37"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f9f9f9"}]},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"saturation":"-100"},{"lightness":"40"},{"visibility":"off"}]},{"featureType":"landscape.natural","elementType":"labels.text.fill","stylers":[{"saturation":"-100"},{"lightness":"-37"}]},{"featureType":"landscape.natural","elementType":"labels.text.stroke","stylers":[{"saturation":"-100"},{"lightness":"100"},{"weight":"2"}]},{"featureType":"landscape.natural","elementType":"labels.icon","stylers":[{"saturation":"-100"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"saturation":"-100"},{"lightness":"80"}]},{"featureType":"poi","elementType":"labels","stylers":[{"saturation":"-100"},{"lightness":"0"}]},{"featureType":"poi.attraction","elementType":"geometry","stylers":[{"lightness":"-4"},{"saturation":"-100"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#c5dac6"},{"visibility":"on"},{"saturation":"-95"},{"lightness":"62"}]},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"lightness":20}]},{"featureType":"road","elementType":"labels","stylers":[{"saturation":"-100"},{"gamma":"1.00"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"gamma":"0.50"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"saturation":"-100"},{"gamma":"0.50"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#c5c6c6"},{"saturation":"-100"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"lightness":"-13"}]},{"featureType":"road.highway","elementType":"labels.icon","stylers":[{"lightness":"0"},{"gamma":"1.09"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#e4d7c6"},{"saturation":"-100"},{"lightness":"47"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"lightness":"-12"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"saturation":"-100"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#fbfaf7"},{"lightness":"77"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"lightness":"-5"},{"saturation":"-100"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"saturation":"-100"},{"lightness":"-15"}]},{"featureType":"transit.station.airport","elementType":"geometry","stylers":[{"lightness":"47"},{"saturation":"-100"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"color":"#acbcc9"}]},{"featureType":"water","elementType":"geometry","stylers":[{"saturation":"53"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"lightness":"-42"},{"saturation":"17"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"lightness":"61"}]}]

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
    window.location.reload();
    types = []
    if (($("input[name='storytype']:checked").length) != 0) {
      $.each($("input[name='storytype']:checked"), function() {
          types.push($(this)[0].value);
      });
    }
    icon = $("input[name='icon']:checked").val();

    toSubmit = {
        "title": $('#titleId').val(),
        "author": $('#author').val(),
        "url": $('#url').val(),
        "publication_name": $('#publication_name').val(),
        "publication_logo_url": $('#publication_logo_url').val(),
        "blurb": $('#blurbId').val(),
        "location_name": $('#location').val(),
        "published_date": $('#date').val(),
        "type": types,
        "icon": icon,
        "tags": $("#modalTags").tagsinput('items'),
        "header_photo_url": $('#header_photo_url').val(),
        "coordinates": self.coordinates
    };

    $.ajax({
        url: PUTurl,
        data: toSubmit,
        type: 'PUT',
        success: function() {
        }
    })
});
