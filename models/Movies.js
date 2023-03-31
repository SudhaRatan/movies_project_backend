const mongoose = require('mongoose')

const MovieSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  theatres: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theatre'
  }]
})

module.exports = mongoose.model('Movie', MovieSchema)