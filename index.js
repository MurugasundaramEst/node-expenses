const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 8001;
const CROSS_ORIGIN = ['http://localhost:3000', 'https://event-expense-manage.web.app']

const corsOptions = {
    origin: function (origin, callback) {
        if (CROSS_ORIGIN.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    allowedHeaders: [
      'Content-Type',
      'Access-Control-Allow-Origin'
    ],
    optionsSuccessStatus: 200 
}
  
app.use(cors(corsOptions))
app.use(express.json())

const writeFileData = async (project, module, content) => {
    if (typeof content === 'object') {
        content = JSON.stringify(content)
    }

    module += '.json';
    await fs.writeFile(path.join(__dirname, 'data', project, module), content)
    return false;
}

const readFileData = async (project, module) => {
    module += '.json';
    const data = await fs.readFile(path.join(__dirname, 'data', project, module), 'utf8');
    return data;
}

app.get('/', (req, res) => {
    res.json({error: false, msg:'able to access api'})
})

app.post('/api/expense/save', async (req, res) => {
    let project = req.body.project;
    let module = req.body.module;
    let content = req.body.content;

    let fileData = writeFileData(project, module, content)
    res.json({error: false})
})

app.post('/api/expense/get', async (req, res) => {
    let project = req.body.project;
    let module = req.body.module;

    let fileData = await readFileData(project, module);
    res.json({error: false, data: JSON.parse(fileData)})
})

app.listen(PORT, () => {
    console.log(`App is Running on http://localhost:${PORT}`)
})