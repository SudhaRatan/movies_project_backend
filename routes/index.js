const express = require('express')
const verifyJWT = require('../auth/auth')
const router = express.Router()
const Movie = require('../models/Movies')
const Ticket = require('../models/Tickets')
const Theatre = require('../models/Theatres')


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
    console.log(req.userId)
    if (req.userId === 1234) {
      try {
        const movies = await Movie.find()
        var selectedSeats = []
        const prom = movies.map(async (movie) => {
          const tickets = await Ticket.find({ Movie: movie._id })
          var seatsLen = 0
          tickets.map(async (ticket) => {
            seatsLen += ticket.selectedSeats.length
          })
          selectedSeats.push({
            id: movie._id,
            seatNumbers: seatsLen
          })
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
    } else {
      res.json({ auth: false })
    }
  })

router
  .route('/getMovieDetails')
  .get(async (req, res) => {
    try {
      const movies = await Movie.find().sort({ name: 1 })
      var selectedSeats = []
      const prom = movies.map(async (movie) => {
        const tickets = await Ticket.find({ Movie: movie._id })
        var seatsLen = 0
        tickets.map(async (ticket) => {
          seatsLen += ticket.selectedSeats.length
        })
        selectedSeats.push({
          id: movie._id,
          seatNumbers: seatsLen
        })
      })
      await Promise.all(prom)
      res.json({
        auth: true,
        selectedSeats
      })

    } catch (error) {
      console.log(error)
      res.json({ auth: false })
    }
  })

router
  .route("/addtheatre")
  .post(verifyJWT, async (req, res) => {
    const check = await Theatre.findOne({ name: req.body.name })
    if (!check) {
      await Theatre.create({ name: req.body.name })
      res.json({ auth: true, message: "Added theatre" })
    } else {
      res.json({ auth: false, message: "Theatre already exists" })
    }
  })

router
  .route('/gettheatres')
  .get(verifyJWT, async (req, res) => {
    const theatres = await Theatre.find().sort({ name: 1 })
    res.json(theatres)
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