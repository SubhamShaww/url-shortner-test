const mongoose = require('mongoose')
const shortId = require('shortid')

const shortUrlSchema = new mongoose.Schema({
	// define the model
    clicks: {type: Number, default: 0},
    full: {type: String, required: true},
    short: {type: String, default: shortId.generate()}
})

module.exports = mongoose.model('ShortUrl', shortUrlSchema)
