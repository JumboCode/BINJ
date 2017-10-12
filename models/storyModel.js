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
	'location_name' : String
});

module.exports = mongoose.model('story', storySchema);
