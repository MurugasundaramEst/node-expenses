import * as db from '../models/common.js';

export const listEvents = async (req, res) => {
    const allEvents = await db.get('events');
    res.json({ error: false, events: allEvents });
}

export const listFriends = async (req, res) => {
    const allFrnds = await db.get('friends');
    res.json({ error: false, friends: allFrnds });
}

export const addFriends = async(req, res) => {
    if(!req.body.name) {
        res.json({error: true});
        return;
    }

    const data = db.insert('friends', req.body.name);
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