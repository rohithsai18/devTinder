const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowerCase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Enter proper email")
            }
        },
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter strong password")
            }
        },
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        // only works for new document
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender data is not valid")
            }
        },
    },
    photoUrl: {
        type: String,
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Enter proper URL")
            }
        },
    },
    about: {
        type: String,
        default: "This is a default description of the user "
    },
    skills: {
        type: [String]
    }
}, { timestamps: true });

const userModel = mongoose.model('Users', userSchema);

module.exports = userModel;