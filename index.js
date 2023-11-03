const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 8001;
const CROSS_ORIGIN = 'http://localhost:3000'

const corsOptions = {
    origin: CROSS_ORIGIN,
    allowedHeaders: [
      'Content-Type',
      'Access-Control-Allow-Origin'
    ],
    optionsSuccessStatus: 200 
  }
  
app.use(cors(corsOptions))
app.use(express.json())

const writeFileData = async (content) => {
    if (typeof content === 'object') {
        content = JSON.stringify(content)
    }

    //const __dirname = path.resolve()
    
    await fs.writeFile(path.join(__dirname, 'data', 'expense.json'), content)

    return false;
}

const readFileData = async () => {
    
    //const __dirname = path.resolve()
    
    const data = await fs.readFile(path.join(__dirname, 'data', 'expense.json'), 'utf8');

    return data;
}

app.get('/', (req, res) => {
    res.json({error: false, msg:'able to access api'})
})

app.post('/api/expense', async (req, res) => {
    let fileData = writeFileData(req.body.content)
    res.json({error: false})
})

app.get('/api/expense', async (req, res) => {
    let fileData = await readFileData();
    res.json({error: false, data: JSON.parse(fileData)})
})

app.listen(PORT, () => {
    console.log(`App is Running on http://localhost:${PORT}`)
})