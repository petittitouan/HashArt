const path = require('path')

const { sha512 } = require('js-sha512')

const fileUpload = require('express-fileupload')
const express = require('express')
const app = express()

app.use(express.static(path.resolve(__dirname, 'web', 'public')))
app.use(fileUpload())

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'web', 'pages', 'index.html'))
})

app.post('/file', (req, res) => {
    if (!req.files) return res.redirect('/')
    const hash = sha512(req.files.file.data)
    res.redirect(`/processHash?hash=${encodeURIComponent(hash)}`)
})

app.get('/processHash', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'web', 'pages', 'processHash.html'))
})

app.get('/hash', (req, res) => {
    const toHash = req.query['toHash']
    if (!toHash) return res.sendStatus(400)
    res.send(sha512(toHash))
})

app.listen(8080)
