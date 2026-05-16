const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://namastenode:OTcDBnpyifQ4X3Zs@cluster0.yhwql4b.mongodb.net/devTinder')
}

module.exports = { connectDB }



