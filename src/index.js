const express = require('express');
const { userAuth } = require('./middlewares/auth')
const { connectDB } = require('./database')
const User = require('./models/user')
const { validateSignUpData } = require('../utils/validations')
const bcrypt = require('bcrypt')
const validator = require('validator')
const cookieParser = require('cookie-parser')


const app = express();
// middleware to convert req into json format
app.use(express.json())
app.use(cookieParser())

app.post('/signup', async (req, res) => {
    const data = req.body

    try {
        //validate the data
        validateSignUpData(req)

        //encrypt the password

        const passwordHash = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            firstName: data.firstName,
            lastName: data.lastName,
            password: passwordHash,
            emailId: data.emailId
        })

        await user.save();
        res.send('User added successfully')
    } catch (err) {
        res.status(500).send('Error saving user: ' + err.message)
    }
})

app.get('/feed', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (err) {
        res.status(500).send('fetching users failed' + err.message)
    }

})

app.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;

        if (!validator.isEmail(emailId)) {
            throw new Error("Enter valid email")
        }

        const user = await User.findOne({
            emailId: emailId
        })

        if (!user) {
            throw new Error("emailId is not present")
        }

        const passwordValid = await user.validatePassword(password);

        if (!passwordValid) {
            throw new Error("Enter valid password")
        } else {
            // create a JWT token
            const token = await user.getJWT();


            //attach cookie
            res.cookie('token', token, {
                expiresIn: new Date(Date.now()) * 8 * 360000
            })
            res.status(200).send('login succesfully');
        }



    } catch (err) {
        res.status(500).send('fetching users failed' + err.message)
    }
})

app.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

app.get('/user/:email', async (req, res) => {
    const email = req.params.email
    try {
        const user = await User.find({
            emailId: email
        })

        if (user.length) {
            res.send(user)
        } else {
            res.status(404).send("user not found")
        }
    } catch (err) {
        res.status(500).send('fetching user failed' + err.message)
    }

})

app.delete('/user/:id', async (req, res) => {
    const id = req.params.id
    try {
        await User.findOneAndDelete(id)

        res.status(200).send("deleted successfully")
    } catch (err) {
        res.status(500).send('fetching user failed' + err.message)

    }

})

app.post('/sendConnectionRequest', userAuth, async (req, res) => {
    const user = req.user;

    res.send(user.firstName + ' Sent connection request')
})

app.patch('/user/:userId', async (req, res) => {
    const body = req.body;
    const id = req.params?.userId;

    const ALLOWED_UPDATES = [
        'gender',
        'age',
        'about',
        'photoUrl',
        'skills'
    ];
    try {
        const isUpdateAllowed = Object.keys(body).every((k) => ALLOWED_UPDATES.includes(k))

        if (!isUpdateAllowed) {
            throw new Error("Update not allowed")
        }
        await User.findByIdAndUpdate({ _id: id }, body, {
            returnDocument: "after",
            runValidators: true
        })

        res.status(200).send("updated successfully")
    } catch (err) {
        res.status(500).send('update user failed ' + err.message)

    }
})

connectDB().then(() => {
    console.log('DB connected succesfully')
    app.listen(3000, () => {
        console.log("server is listening to the port 3000")
    })
}).catch(err => {
    console.log('DB Connection failed')
})




