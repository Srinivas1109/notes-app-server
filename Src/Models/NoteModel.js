const mongoose = require('mongoose')
const validator = require('validator')

const NoteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        // unique: true
    },
    description: {
        type: String,
    },
    modified: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Note', NoteSchema)