const mongoose = require('mongoose')

const TheatreSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('Theatre',TheatreSchema)