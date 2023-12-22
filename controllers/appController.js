import * as db from '../models/common.js';
import moment from 'moment/moment.js';
import Pusher from 'pusher';
import 'dotenv/config';

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
    useTLS: true,
});

// pusher.trigger('events', 'new-event', { message: 'A new event was added' });

export const listEvents = async (req, res) => {
    const allEvents = await db.get('events', 'desc');
    res.json({ error: false, events: allEvents });
}

export const listFriends = async (req, res) => {
    const allFrnds = await db.get('friends', 'asc');
    res.json({ error: false, friends: allFrnds });
}

export const addFriends = async(req, res) => {
    if(!req.body.name) {
        res.json({error: true});
        return;
    }

    const data = await db.insert('friends', req.body.name);
    res.json({ error: false, data: data });
}

export const addEvents = async(req, res) => {
    if(!req.body.name) {
        res.json({error: true});
        return;
    }

    const data = await db.insert('events', req.body.name);
    res.json({ error: false, data: data });
}

export const deleteFriends = async(req, res) => {
    if(!req.body.id) {
        res.json({error: true});
        return;
    }

    const data = db.deleteId('friends', req.body.id);
    res.json({ error: false, data: data });
}

export const deleteEvents = async(req, res) => {
    if(!req.body.id) {
        res.json({error: true});
        return;
    }

    const data = db.deleteId('events', req.body.id);
    res.json({ error: false, data: data });
}

export const saveManageEvents = async (req, res) => {
    if(!req.body.frnd_id || !req.body.event_id) {
        res.json({ error: true });
        return;
    }

    if(!req.body.is_exclude && !req.body.amount) {
        res.json({ error: true });
        return;
    }

    let data = req.body;
    let today = moment().format('YYYY-MM-DD');

    let dataObject = [
        data.frnd_id,
        data.event_id,
        data.amount,
        today,
        data.is_exclude
    ]

    const result = await db.insertEventManage(dataObject);

    let lastData = {
        date: moment(result.date).format('DD MMM'),
        frndId: result.frnd_id,
        amount: result.amount,
        isExclude: result.is_exclude
    }

    res.json({ error: false, data: lastData });
}

export const getManageEvents = async (req, res) => {
    if(!req.body.event_id) {
        res.json({ error: true });
        return;
    }

    const allFrnds = await db.get('friends', 'asc');
    const allData = await db.getEventManage(req.body.event_id);

    let excludedData = allData.filter(x => x.is_exclude == true);
    let nonExcludedData = allData.filter(x => x.is_exclude == false);

    let totalReceived = 0;
    let received = nonExcludedData.map(data => {
        let frnd = allFrnds.filter(x => x.id == data.frnd_id);
        let frndName = frnd.length > 0 ? frnd[0].name : 'DELETED';
        
        totalReceived += data.amount;

        return {
            date: moment(data.date).format('DD MMM'),
            frndId: data.frnd_id,
            frndName: frndName,
            amount: data.amount
        }
    });

    let receivedFrom = received.map(x => x.frndId);
    let excludedFrnd = excludedData.map(x => x.frnd_id);

    let pending = [];
    let excluded = [];

    allFrnds.forEach(x => {
        if(excludedFrnd.includes(x.id)) {
            excluded.push(x)
        } else if(!receivedFrom.includes(x.id)) {
            pending.push(x)
        }
    });

    res.json({ 
        error: false, 
        received: received, 
        pending: pending,
        totalReceived: totalReceived,
        excluded: excluded
    })
}

export const deleteManageEvents = async (req, res) => {
    if(!req.body.event_id || !req.body.frnd_id || !req.body.frnd_name) {
        res.json({ error: true });
        return;
    }

    await db.deleteEventManage(req.body.frnd_id, req.body.event_id);

    res.json({
        error: false,
        data: {
            id: req.body.frnd_id,
            name: req.body.frnd_name,
        }
    })
}

export const addChats = async (req, res) => {
    if(!req.body.name || !req.body.msg || !req.body.date) {
        res.json({ error: true });
        return;
    }

    let newChats = [
        req.body.name,
        req.body.msg,
        req.body.date
    ];

    const response = await db.insertChats(newChats);

    pusher.trigger('events', 'new-chat', { data: response });

    res.json({error: false});
}

export const getChats = async (req, res) => {
    const response = await db.get('chats', 'asc');
    res.json({error: false, chats: response})
}