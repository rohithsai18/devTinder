const express = require('express');
const { AdminAuth } = require('./middlewares/auth')
const { connectDB } = require('./database')
const User = require('./models/user')


const app = express();

app.post('/signup', async (req, res) => {
    try {
        const userObj = {
            firstName: 'Rohith sai',
            lastName: 'Garlapati',
            age: 32,
            gender: 'm',
            emailId: 'rohithsai18@gmail.com',
            password: 'Rohith@123'
        }

        const user = new User(userObj)
        await user.save();
        res.send('User added successfully')
    } catch (err) {
        res.status(500).send('Error saving user: ' + err.message)
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




