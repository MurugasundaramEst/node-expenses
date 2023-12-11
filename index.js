import express from 'express';
import cors from 'cors';
import { listEvents, listFriends, addFriends, 
    deleteFriends, addEvents, deleteEvents,
    saveManageEvents, getManageEvents
} from './controllers/appController.js';

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

app.get('/', (req, res) => {
    res.json({error: false, msg:'able to access api'})
})

app.get('/event/list', listEvents);
app.post('/event/add', addEvents);
app.post('/event/delete', deleteEvents);

app.get('/friend/list', listFriends);
app.post('/friend/add', addFriends);
app.post('/friend/delete', deleteFriends);

app.post('/get/events', getManageEvents)
app.post('/save/events', saveManageEvents)

app.listen(PORT, () => {
    console.log(`App is Running on http://localhost:${PORT}`)
})