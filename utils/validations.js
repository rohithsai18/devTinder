const validator = require('validator')

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;


    if (!firstName || !lastName) {
        throw new Error("Name is not valid")
    }

    else if (firstName.length < 4 || firstName.length > 50) {
        throw new Error("firstName should be between 4 and 50 characters")
    }

    else if (lastName.length < 4 || lastName.length > 50) {
        throw new Error("lastName should be between 4 and 50 characters")
    }
    else if (emailId && !validator.isEmail(emailId)) {
        throw new Error("emailId is not valid")
    }

    else if (password && !validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password")
    }

}

module.exports = { validateSignUpData }