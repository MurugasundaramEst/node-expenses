import * as query from './query.js';

export const get = async (tableName, orderBy) => {
    const result = await query.execute(`Select * from ${tableName} order by id ${orderBy}`);
    return result;
}

export const insert = async (tableName, name) => {
    await query.bulkUpdate(`INSERT INTO ${tableName} (name) VALUES ?`, [[name]]);
    const result =  await query.execute(`SELECT * FROM ${tableName} order by id desc limit 1`);
    console.log(result)
    return result[0];
}

export const deleteId = async (tableName, id) => {
    const result = await query.execute(`DELETE from ${tableName} where id = ${id}`)
    return result;
}