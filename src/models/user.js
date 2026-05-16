const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


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


userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({
        _id: user.id
    }, "DEV@tinder123", { expiresIn: "1h" })

    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByuser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByuser, passwordHash);

    return isPasswordValid;

}

const userModel = mongoose.model('Users', userSchema);

module.exports = userModel;