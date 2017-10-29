$.holdReady(true);
stories = [];
getStories();

function getStories() {
    $.ajax({
        dataType: "json",
        type: "GET",
        url: "http://lvh.me:3000/stories",
        success: function(response) {
            stories = response;
            $.holdReady(false);
        },
        error: function(xhr, status, error) {
            console.log(xhr, status, error);
        }
    });
};

$(document).ready(function() {
    console.log(stories);
})
