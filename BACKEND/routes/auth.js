const express = require('express');
const User = require('../models/user.model')

const router = express.Router();

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


/*
================ REGISTER ROUTE ================

Flow:
1. Get user data from frontend
2. Check if user already exists
3. Hash password using bcrypt
4. Save user in database
5. Generate JWT token
6. Send token + user data back
*/

router.post('/register', async (req, res) => {

  try {

    // Extract user data from request body
    const { name, email, password } = req.body;

    // Check whether user already exists
    const userAlreadyExists = await User.findOne({ email });

    if (userAlreadyExists) {

      return res.status(400).json({
        message: "User already exists."
      })
    }

    /*
      bcrypt flow:
      1. Generate salt
      2. Mix password + salt
      3. Store hashed password in DB

      Actual password should NEVER be stored directly
    */
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user document
    const user = new User({
      name,
      email,
      password: hashedPassword
    })

    // Save user in MongoDB
    await user.save()

    /*
      jwt.sign():

      Creates authentication token using:
      1. Payload → user id
      2. Secret key
      3. Expiry time
    */
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Send response to frontend
    res.status(201).json({

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })

  }

  catch (err) {

    res.status(500).json({ message: 'Server error' })
  }
})



/*
================ LOGIN ROUTE ================

Flow:
1. Find user using email
2. Compare passwords
3. Generate JWT token
4. Send token + user data
*/

router.post('/login', async (req, res) => {

  try {

    const { email, password } = req.body

    // Check whether user exists
    const user = await User.findOne({ email })

    if (!user) {

      return res.status(400).json({
        message: "User does not exist."
      })
    }

    /*
      bcrypt.compare():

      Compares:
      entered password
      vs
      hashed password stored in DB
    */
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {

      return res.status(400).json({
        message: "Incorrect password."
      })
    }

    /*
      Generate new JWT token

      Token usually generated when:
      - user logs in
      - token expired
      - new account created
    */
    const token = jwt.sign(

      { id: user._id },

      process.env.JWT_SECRET,

      { expiresIn: '7d' }
    )

    // Send response back to frontend
    res.status(200).json({

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })

  }

  catch (err) {

    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router


/*
Authentication Summary:

Frontend sends:
→ name, email, password

Backend:
→ validates user
→ hashes password
→ generates token
→ sends response

Frontend:
→ stores token in localStorage
→ token used for future protected requests
*/