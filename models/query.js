import mysql from 'mysql';
import 'dotenv/config';

let con = mysql.createConnection({
    host: process.env.MYSQL_HOST, //ENV_VARIABLES
    user: process.env.MYSQL_USER, //ENV_VARIABLES
    password: process.env.MYSQL_PASSWORD, //ENV_VARIABLES
    database: process.env.MYSQL_DB //ENV_VARIABLES
})

export const execute = (query) => {
    const promise = new Promise((resolve) => {
        con.query(query, (err, result) => {
            if (err) {
                let e = {
                    error: JSON.stringify(err),
                    errorType: "MYSQL_ERROR",
                    errorMessage: `Error in Query execution: ${query}`
                }
                resolve(e)
            } else {
                resolve(result)
            }

            // End the connection after the query
            con.end((endErr) => {
                if (endErr) {
                    console.error('Error ending connection:', endErr.stack);
                } else {
                    console.log('Connection ended');
                }
            });
        })
    })

    return promise

};


export const bulkUpdate = (query, values) => {
    const promise = new Promise((resolve) => {
        
        con.query(query, [values], (err, result) => {
            if (err) {
                let e = {
                    error: JSON.stringify(err),
                    errorType: "MYSQL_ERROR",
                    errorMessage: `Error in Query execution: ${query}`
                }
                resolve(e)
            } else {
                resolve(result)
            }

            // End the connection after the query
            con.end((endErr) => {
                if (endErr) {
                    console.error('Error ending connection:', endErr.stack);
                } else {
                    console.log('Connection ended');
                }
            });
        })
    })

    return promise
};