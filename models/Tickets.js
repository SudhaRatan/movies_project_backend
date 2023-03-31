const mongoose = require('mongoose')

const TicketSchema = mongoose.Schema({
  selectedSeats: [{
    type: Number,
    required: true,
  }],
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  date:{
    type:Date,
    required: true
  },
  Movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  },
  Theatre:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theatre'
  }
})

module.exports = mongoose.model('Ticket', TicketSchema)