const express = require('express');
const { AdminAuth } = require('./middlewares/auth')
const { connectDB } = require('./database')
const User = require('./models/user')


const app = express();
// middleware to convert req into json format
app.use(express.json())

app.post('/signup', async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save();
        res.send('User added successfully')
    } catch (err) {
        res.status(500).send('Error saving user: ' + err.message)
    }
})

app.get('/feed', async(req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    }   catch (err) {
        res.status(500).send('fetching users failed'+ err.message)
    }

})

app.get('/user/:email', async(req, res) => {
    const email = req.params.email
    try {
        const user = await User.find({
            emailId: email
        })

        if(user.length) {
            res.send(user)
        } else {
            res.status(404).send("user not found")
        }
    }   catch (err) {
        res.status(500).send('fetching user failed'+ err.message)
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




