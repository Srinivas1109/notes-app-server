const router = require('express').Router()
const NoteModel = require("../Models/NoteModel")
const UserModel = require("../Models/UserModel")
const bcrypt = require('bcrypt')
const saltRounds = 10

router.get('/', (req, res) => {
    const routes = [
        {
            action: "Create Account",
            url: "/api/create"
        },
        {
            action: "Login",
            url: "/api/login"
        },
        {
            action: "Add new Note",
            url: "/api/notes/add"
        },
        {
            action: "update existing Note",
            url: "/api/notes/update:id"
        },
        {
            action: "delete existing Note",
            url: "/api/notes/delete:id"
        },
        {
            action: "Get all Notes",
            url: "/api/notes/user:id"
        },
    ]
    res.json({ "Available_Routes": routes })
})

router.post('/create', async (req, res) => {
    try {
        const { username, email, password } = req.body
        let hashedPassword = await bcrypt.hash(password, saltRounds)
        const newuser = await UserModel.create({
            username,
            email,
            password: hashedPassword
        })
        // console.log(newuser)
        await newuser.save()

        const resUser = await UserModel.findById(newuser._id).select(["-password"])
        // console.log(resUser)
        res.json({ status: 200, success: true, status_text: `Account created for ${newuser.username}`, user: resUser })
    } catch (error) {
        res.json({ status: 400, success: false, status_text: error })
    }

})

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await UserModel.findOne({
            username
        })
        const hashedPassword = await bcrypt.compare(password, user.password)
        if (hashedPassword) {
            res.json({ status: 200, success: true, status_text: `Logged in Successfully as ${user.username}`, user })
        } else {
            res.json({ status: 400, success: false, status_text: "Invalid password" })
        }
    } catch (error) {
        res.json({ status: 400, success: false, status_text: error })
    }

})

router.post('/notes', async (req, res) => {
    const { id } = req.body
    try {
        const user_notes = await UserModel.findById(id).populate('notes').select(["-password"])
        // console.log(user_notes)
        res.json({ status: 200, notes: user_notes })
    } catch (error) {
        res.json({ status: 400, success: false, status_text: error })
    }

})

router.post('/notes/add', async (req, res) => {
    try {
        const { user, title, description, _id } = req.body
        let user_note_exist = true
        try {
            user_note_exist = await NoteModel.findOne({ _id: _id, user: user })
        } catch (error) {
            user_note_exist = false
        }
        if (user_note_exist) {
            const response = await NoteModel.updateOne({ user: user, _id: _id }, { title: title, description: description, modified: new Date() })
            const note = await NoteModel.findOne({ _id: _id, user: user })
            res.json({ status: 200, success: true, status_text: `${user_note_exist._id} Note updated`, note: note })
        } else {
            const newnote = await NoteModel.create({
                user, // user id
                title,
                description
            })

            await newnote.save()
            const userById = await UserModel.findById(user)

            userById.notes.push(newnote)
            await userById.save()
            res.json({ status: 200, success: true, status_text: `${newnote.title} Note added`, note: newnote })
        }

    } catch (error) {
        console.log(error)
        res.json({ status: 400, success: false, status_text: error })
    }
})

router.delete('/notes/delete/:userId/:noteId', async (req, res) => {
    try {
        // console.log(req.params)
        const { userId, noteId } = req.params
        const response = await NoteModel.deleteOne({ user: userId, _id: noteId })
        // const response = await NoteModel.findOne({ user: userId,_id: noteId })
        // res.json({noteId, response})
        res.json({ status: 200, success: true, status_text: `${noteId} Deleted Successfully...`, deletedCount: response.deletedCount })
        // res.json({response})
    } catch (error) {
        res.json({ status: 400, success: false, status_text: error })
    }
})

// router.put('/notes/update/:userId/:noteId')

module.exports = router