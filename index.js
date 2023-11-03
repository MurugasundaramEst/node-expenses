const express = require('express');

const app = express();
const PORT = 8001;

app.get('/', (req, res) => {
    res.json({error: false, msg:'hii'})
})

app.listen(PORT, () => {
    console.log(`App is Running on http://localhost:${PORT}`)
})