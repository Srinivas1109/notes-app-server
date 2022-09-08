const mongoose = require('mongoose')
const validator = require('validator')

const UserSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        // unique: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        validate: (value) => {
            return validator.isEmail(value)
        }
    },
    password: {
        type: String,
        required: true
    },
    notes: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Note' }
    ],
    created_on: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', UserSchema)