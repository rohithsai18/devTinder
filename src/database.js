const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://namastenode:<>.mongodb.net/devTinder')
}

module.exports = { connectDB }



