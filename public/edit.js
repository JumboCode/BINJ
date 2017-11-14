$.holdReady(true);
stories = [];
var artInfo = new Object();
hostname = location.hostname;
port = location.port;
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
    console.log(id);
    $.ajax({
    url: self.url + id,
    type: 'DELETE',
    success: function(result) {
        alert(id + "deleted");
    }
});
}

function editStory(story) {
    console.log($(story).data('id'));
    $.get(self.url + $(story).data('id'), function( data ) {
        console.log(data);
        artInfo = data;
        $("#title").replaceWith( '<input type="locationType" class="form-control" id="location" value="'+ artInfo["title"] + '">');
        $("#author").replaceWith( '<input type="locationType" class="form-control" id="location" value="'+ artInfo["author"] + '">');
        $("#summary").replaceWith( '<textarea class="form-control" id="summary" rows="4" value="'+ artInfo["blurb"] + '">');
        $("#location").replaceWith( '<input type="locationType" class="form-control" id="location" value="'+ artInfo["location_name"] + '">');
        $("#tags").replaceWith( '<input type="locationType" class="form-control" id="location" value="'+ artInfo["type"] + '">');
        $("#url").replaceWith( '<input type="locationType" class="form-control" id="location" value="'+ artInfo["url"] + '">');


        
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
