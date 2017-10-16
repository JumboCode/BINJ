var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var storySchema = new Schema({
	'title' : String,
	'author' : String,
	'url' : String,
	'header_photo_url' : String,
	'blurb' : String,
	'published_date' : Date,
	'tags' : [{type: String, lowercase: true}],
	'location_name' : String,
	'type' : String,
	'coordinates' : [{type: Number}]
});

module.exports = mongoose.model('story', storySchema);
