const express = require('express')
const router = express.Router()
const Theatre = require('../models/Theatres')
const User = require('../models/Users')
const verifyJWT = require('../auth/auth')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

router
  .route('/')
  .get(verifyJWT, (req, res) => {
    res.json({
      auth: true
    })
  })
  .post(async (req, res) => {
    try {
      // console.log(req.body)
      const result = await User.findOne({ LoginId: req.body.id })
      if (result) {
        if (await bcrypt.compare(req.body.password, result.Password)) {
          const token = jwt.sign({ id: result._id }, process.env.ACCESS_TOKEN, {
            // expiresIn: 60 * 60,
          })
          req.user = result._id
          res.json({ auth: true, token: token, user: result.FirstName })
        } else {
          res.send("Incorrect password")
        }
      } else {
        res.send("User not found")
      }
    } catch (error) {
    }
  })

router
  .route('/signup')
  .post(async (req, res) => {
    try {
      const user = await User.findOne({
        $or: [
          { LoginId: req.body.LoginId },
          { Email: req.body.Email }
        ]
      })
      if (user) {
        res.json({
          auth: false,
          message: "Login ID or Email already in use"
        })
      } else {
        req.body.Password = await bcrypt.hash(req.body.Password, 10)
        const result = await User.create(req.body)
        res.json({
          auth: true,
        })
      }
    } catch (error) {
      console.log(error)
      res.json({
        auth: false,
        message: "Fill all fields"
      })
    }
  })

router
  .route("/admin")
  .post((req,res) => {
    if(req.body.id === "admin" && req.body.password === "admin"){
      const token = jwt.sign({ id: 1234 }, process.env.ACCESS_TOKEN)
      console.log(token)
      res.json({
        auth: true,
        token
      })
    } else {
      res.json({auth:false,message:"Wrong Credentials"})
    }
  })

module.exports = router