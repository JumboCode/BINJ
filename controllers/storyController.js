var storyModel = require('../models/storyModel.js');


function getStoryImageURL (url) {
    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);
            var src = "";

            var i = 0;
            $('img').filter(function(){
                if (i == 2) {
                    var data = $(this);
                    console.log(data.attr("src"))
                    src = data.attr("src");
                }
                i++;

            })
            return src;

        } else {
            console.log("error in request:");
            console.log(error);
        }
    });
}

/**
 * storyController.js
 *
 * @description :: Server-side logic for managing storys.
 */
module.exports = {

    /**
     * storyController.list()
     */
    list: function (req, res) {
        //console.log("listing");
        storyModel.find(function (err, storys) {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Error when getting story.',
                    error: err
                });
            }
            return res.json(storys);
        });
    },

    /**
     * storyController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        storyModel.findOne({_id: id}, function (err, story) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting story.',
                    error: err
                });
            }
            if (!story) {
                return res.status(404).json({
                    message: 'No such story'
                });
            }
            return res.json(story);
        });
    },

    /**
     * storyController.filter()
     */
    filter: function (req, res) {
        const filter = req.params.filter;
        const filterValue = req.params.value;
        storyModel.find({[filter]: filterValue}, function (err, stories) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting stories.',
                    error: err
                });
            }
            if (!stories) {
                return res.status(404).json({
                    message: 'No such stories'
                });
            }
            return res.json(stories);
        });
    },



    /**
     * storyController.create()
     */
    create: function (req, res) {
        var story = new storyModel({
            title : req.body.title,
            author : req.body.author,
            url : req.body.url,
            header_photo_url : req.body.header_photo_url,
            blurb : req.body.blurb,
            published_date : req.body.published_date,
            tags : req.body.tags,
            location_name : req.body.location_name,
            type : req.body.type,
            icon : req.body.icon,
            coordinates : req.body.coordinates
        });

        story.save(function (err, story) {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Error when creating story',
                    error: err
                });
            }
            return res.status(201).json(story);
        });

    },

    /**
     * storyController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        storyModel.findOne({_id: id}, function (err, story) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting story',
                    error: err
                });
            }
            if (!story) {
                return res.status(404).json({
                    message: 'No such story'
                });
            }

            story.title = req.body.title ? req.body.title : story.title;
			story.author = req.body.author ? req.body.author : story.author;
			story.url = req.body.url ? req.body.url : story.url;
			story.header_photo_url = req.body.header_photo_url ? req.body.header_photo_url : story.header_photo_url;
			story.blurb = req.body.blurb ? req.body.blurb : story.blurb;
			story.published_date = req.body.published_date ? req.body.published_date : story.published_date;
			story.tags = req.body.tags ? req.body.tags : story.tags;
			story.location_name = req.body.location_name ? req.body.location_name : story.location_name;
			story.type = req.body.type ? req.body.type : story.type;
      story.icon = req.body.icon ? req.body.icon : story.icon;
            story.coordinates = req.body.coordinates ? req.body.coordinates : story.coordinates;

            story.save(function (err, story) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating story.',
                        error: err
                    });
                }

                return res.json(story);
            });
        });
    },

    /**
     * storyController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        storyModel.findByIdAndRemove(id, function (err, story) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the story.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    },
};
