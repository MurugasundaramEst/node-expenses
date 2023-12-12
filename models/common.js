import * as query from './query.js';

export const get = async (tableName, orderBy) => {
    const result = await query.execute(`Select * from ${tableName} order by id ${orderBy}`);
    return result;
}

export const insert = async (tableName, name) => {
    await query.bulkUpdate(`INSERT INTO ${tableName} (name) VALUES ?`, [[name]]);
    const result =  await query.execute(`SELECT * FROM ${tableName} order by id desc limit 1`);
    return result[0];
}

export const deleteId = async (tableName, id) => {
    const result = await query.execute(`DELETE from ${tableName} where id = ${id}`)
    return result;
}

export const insertEventManage = async (values) => {
    await query.bulkUpdate(`INSERT INTO manage_events (frnd_id, event_id, amount, date, is_exclude) VALUES ?`, [values]);
    const result =  await query.execute(`SELECT * FROM manage_events order by id desc limit 1`);
    return result[0];
}

export const getEventManage = async (eventId) => {
    const result = await query.execute(`Select * from manage_events where event_id = ${eventId}`);
    return result;
}

export const deleteEventManage = async (frndId, eventId) => {
    const result = await query.execute(`DELETE from manage_events where frnd_id = ${frndId} and event_id = ${eventId} and is_exclude = 1`)
    return result;
}