const express = require('express')
const app = express()

app.use(express.static('public'))

app.listen(3012, () => console.log('Prototype listening on port 3012!'))