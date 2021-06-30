const User = require('../models/userModels')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const express = require('express')
const mongoose = require('mongoose')
const router = express()

require("dotenv").config();

const adminKey = "admin123"


mongoose.connect('mongodb://localhost:27017/test', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
})


// Register //

router.post('/register', async (req, res) => {
        
    const { role, email, name, password: plainTextPassword, confirmPwd: plainTextConPass } = req.body
    console.log(req.body)

	if (!email || typeof email !== 'string') {
		return res.json({ status: 'error', error: 'Enter email' })
	}

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({ status: "error", error: 'Email already in use' });
    }

	if (!name || typeof name !== 'string') {
		return res.json({ status: 'error', error: 'Enter name' })
	}

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Enter Password' })
	}

	if (!plainTextConPass || typeof plainTextConPass !== 'string') {
		return res.json({ status: 'error', error: 'Enter Confirm Password' })
	}

	if (plainTextPassword !== plainTextConPass) {
		return res.json({ status: 'error', error: 'Please enter same password...' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}


    // Hash Password
    const salt = await bcrypt.genSalt();
        
    const passwordHash = await bcrypt.hash(plainTextPassword, salt);

    // Creating token
    const token = jwt.sign(
        { 
            role, 
            email, 
            name,
            passwordHash, 
        },
        process.env.JWT_KEY,{
            expiresIn: "2h"
        }
    );
	

	try {
		const response = await User.create({
            role,
            email,
			name,
			passwordHash
		})
		console.log('User created successfully: ', response)
	} 
    catch (res) {
		res.redirect('/register')
	}
	res.json({ status: 'ok' })
})

// Login //

router.post('/login', async (req, res) => {
    const { email, password: plainTextPassword } = req.body
    console.log(req.body)

    if (!email || typeof email !== 'string'){
        return res.send({ status: 'error', error: 'Enter the Email' })
    }
    const checkEmail = await User.findOne({email})
    if (!checkEmail) {
        return res.json({ status: 'error', error: 'No user with that email' })
    }

    const correctPwd = await bcrypt.compare(plainTextPassword, checkEmail.passwordHash);

    if (!correctPwd){
      return res.json({ status: 'error', error: 'Incorrect Password' });
    }

    if (correctPwd) {
        const token = jwt.sign(
            {
                email: checkEmail._id,
            },
            process.env.JWT_KEY,{
                expiresIn: "48h"
            }
        );

        return res.json({ status: 'ok', data: token })
    }

    res.cookie("token", token, {
        httpOnly: true,
    })
})


module.exports = router