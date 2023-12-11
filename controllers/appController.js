import * as db from '../models/common.js';
import moment from 'moment/moment.js';

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
    if(!req.body.frnd_id || !req.body.event_id || !req.body.amount) {
        res.json({ error: true });
        return;
    }

    let data = req.body;
    let today = moment().format('YYYY-MM-DD');

    let dataObject = [
        data.frnd_id,
        data.event_id,
        data.amount,
        today
    ]

    const result = await db.insertEventManage(dataObject);

    let lastData = {
        date: moment(result.date).format('DD MMM'),
        frndId: result.frnd_id,
        amount: result.amount
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

    let totalReceived = 0;
    let received = allData.map(data => {
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
    let pending = allFrnds.filter(x => !receivedFrom.includes(x.id))

    res.json({ 
        error: false, 
        received: received, 
        pending: pending,
        totalReceived: totalReceived
    })
}