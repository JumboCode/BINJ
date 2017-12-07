// this shit has to do with retrieving filters and passing that information
// to the map

$('#tags-input').tagsinput({
    confirmKeys: [13, 188]
});
$('#tags-input input').on('keypress', function(e){
    if (e.keyCode == 13){
        e.keyCode = 188;
        e.preventDefault();
    }
});
var tags = [];
var changed = false;
$(document).ready(function () {
  // gotta initialize things, kids
  localStorage.setItem('filter', JSON.stringify({"tags" : [], "boxes" : []}));

    $('#form')
        .find('[name="search"]')
            .change(function (e) {
                $('input').removeAttr('placeholder');
                $('input').on('itemRemoved', function(event) {
                    var index = tags.indexOf(event.item);
                    if (index > -1) tags.splice(index, 1);
                    // event.item: contains the item
                    var filters = "map.html?filter=" + getFilters();
                    $("#iframe").attr("src", filters);

                });
                tags.push($("input").val());
                var filters = "map.html" + getFilters();
                $("#iframe").attr("src", filters);

            })
        .end();

});
function getFilters() {
    var filterTags = [];
    var str = "";
    for (var i = 0; i < tags.length; i++) {
        if (tags[i] == "") tags.splice(i, 1);
        str += tags[i] + "+";
        filterTags.push(tags[i]);

    }
    var filterBoxes = []
    //Getting filters from checked boxes
    $.each($("input:checked"), function() {
        str += "+" + ($(this).val());
        filterBoxes.push(($(this).val()));
    });
    changed = true;
    localStorage.setItem("filter", JSON.stringify({"tags": filterTags,
                                                   "boxes": filterBoxes}));

   var filters = "map.html";
   $("#iframe").attr("src", filters);

    if (str != "") return ("?filter=" + str.substring(0, str.length - 1));
    else return "";

}


// this shit has to do with loading the list view and the filters
// currently displayed
$('#content').height($(window).height() - $('.logo').height() - $('.wrapper').height());

waitForData();
var filterAuthors = [];


function waitForData() {
    if (localStorage.getItem("storyData") !== null) {
        loadCards(JSON.parse(localStorage.getItem("storyData")));
        loadFilters(JSON.parse(localStorage.getItem("storyData")));

    } else {
        setTimeout(waitForData, 250);
    }
}

function loadCards(data) {
    // this is to load the list view

    document.getElementById("loading-message").innerHTML = "";
    for (var i = 0; i < data.length; i++) {
        var newCard = document.createElement("div");
        newCard.className = "list-view-card";
        // make a title
        var title = document.createElement("h2")
        title.innerHTML = data[i].title;
        newCard.appendChild(title);
        // make an author
        var author = document.createElement("h4");
        author.innerHTML = "By " + data[i].author;
        newCard.appendChild(author);
        // link to full text
        var url = document.createElement("p");
        url.innerHTML = '<a href="' + data[i].url + '">Full article</a>';
        newCard.appendChild(url);
        // make a blurb
        var blurb = document.createElement("p");
        blurb.innerHTML = data[i].blurb;
        newCard.appendChild(blurb);
        // maybe header photo?
        document.getElementById("list-view").appendChild(newCard);
    }
}

function loadFilters(data) {
  var authors = [];
  var storytypes = [];
  // to load and show relevant filters
  document.getElementById("author").innerHTML = "";
  document.getElementById("storytype").innerHTML = "";
  for (var i = 0; i < data.length; i++) {
      if (authors.includes(data[i].author)) {
        // do nothing
      } else {
        // make author entry
        var author = document.createElement("div");
        author.className += "checkbox";
        author.innerHTML = '<label><input type = "checkbox" onclick="getFilters();" value="' + data[i].author + '">' + data[i].author + '</label>';
        document.getElementById("author").appendChild(author);
        authors.push(data[i].author);
      }
      if (storytypes.includes(data[i].type)) {
        // do nothing
      } else {
        // make type entry
        var type = document.createElement("div");
        type.className += "checkbox";
        type.innerHTML = '<label><input type = "checkbox" onclick="getFilters();" name="storytype" value="' + data[i].type + '">' + data[i].type + '</label>';
        document.getElementById("storytype").appendChild(type);
        storytypes.push(data[i].type);
      }
  }
}
/*    filtering checkboxes - disabled for now *
function authorCheck(cb) {
  if ($(cb).is(':checked')) {
    filterAuthors.push($(cb).val());
  } else if (filterAuthors.includes($(cb).val())) {
      filterAuthors.pop(filterAuthors.indexOf($(cb).val()), 1);
  }
  query = "map.html?author=" + filterAuthors.join('+');
  console.log(filterAuthors);
  $("#iframe").attr("src", query);
}

$('input[name="storytype"]').click(function () {
  alert($(this).val());
}); */
