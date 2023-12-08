import * as query from './query.js';

export const get = async (tableName) => {
    const result = await query.execute(`Select * from ${tableName}`);
    return result;
}

export const insert = async (tableName, name) => {
    const result = await query.bulkUpdate(`INSERT INTO ${tableName} (name) VALUES ?`, [[name]])
    return result;
}

export const deleteId = async (tableName, id) => {
    const result = await query.execute(`DELETE from ${tableName} where id = ${id}`)
    return result;
}