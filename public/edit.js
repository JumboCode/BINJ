$.holdReady(true);
stories = [];
hostname = location.hostname;
port = location.port;

getStories();

function getStories() {
    $.get("http://" + this.hostname + ":" + this.port + "/stories", function( data ) {
        stories = data;
        $.holdReady(false);
    });
};


function deleteStory(story) {
    var id = $(story).data('id');
    console.log(id);
    $.ajax({
    url: "http://" + this.hostname + ":" + this.port + "/stories/" + id,
    type: 'DELETE',
    success: function(result) {
        alert(id + "deleted");
    }
});
}

function editStory(story) {
    console.log($(story).data('id'));
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
                         '<button type="button" onClick="editStory(this)" data-id="'+ tempStory['_id'] + '" class="btn-warning">Edit</button></div></div>'
        $("#storiesList").append(tempHTML);
    })
})
