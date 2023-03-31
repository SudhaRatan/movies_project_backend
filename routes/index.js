const express = require('express')
const verifyJWT = require('../auth/auth')
const router = express.Router()
const Movie = require('../models/Movies')
const Ticket = require('../models/Tickets')


router
  .route("/")
  .get(async (req, res) => {
    try {
      const result = await Movie.find().populate('theatres')
      res.json(result)
    } catch (error) {
      console.log(error)
    }
  })

router
  .route('/bookTicket')
  .post(verifyJWT, async (req, res) => {
    req.body.User = req.userId
    try {
      const result = await Ticket.create(req.body)
      res.json({ auth: true })
    } catch (error) {
      console.log(error)
      res.json({ auth: false })
    }
  })

router
  .route('/mybookings')
  .get(verifyJWT, async (req, res) => {
    try {
      const result = await Ticket.find({ User: req.userId }).populate('Theatre User Movie')
      result.auth = true
      res.json(result)
    } catch (error) {
      console.log(error)
      res.json({ auth: false })
    }

  })

router
  .route('/dashboard')
  .get(verifyJWT, async (req, res) => {
    try {
      const movies = await Movie.find()
      var selectedSeats = []
      const prom = movies.map(async (movie) => {
        const tickets = await Ticket.find({ Movie: movie._id })
        var seatsLen = 0
        tickets.map(async (ticket) => {
          seatsLen += ticket.selectedSeats.length
        })
        // console.log(seatsLen)
        selectedSeats.push(seatsLen)
      })
      await Promise.all(prom)
      res.json({
        auth: true,
        movies,
        selectedSeats
      })

    } catch (error) {
      console.log(error)
      res.json({ auth: false })
    }
  })

router
  .route("/:search")
  .get(async (req, res) => {
    try {
      const result = await Movie.find({
        $or: [
          { name: { $regex: req.params.search, $options: 'si' } },
        ]
      }).populate('theatres')
      res.json(result)
    } catch (error) {
      console.log(error)
    }
  })


module.exports = router