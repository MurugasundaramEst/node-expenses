import mysql from 'mysql';
import 'dotenv/config';

// Create a connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.MYSQL_HOST, // ENV_VARIABLES
    user: process.env.MYSQL_USER, // ENV_VARIABLES
    password: process.env.MYSQL_PASSWORD, // ENV_VARIABLES
    database: process.env.MYSQL_DB, // ENV_VARIABLES
});

export const execute = (query) => {
    const promise = new Promise((resolve) => {
        // Get a connection from the pool
        pool.getConnection((err, connection) => {
            if (err) {
                let e = {
                    error: JSON.stringify(err),
                    errorType: "MYSQL_ERROR",
                    errorMessage: `Error in getting connection: ${query}`
                };
                resolve(e);
            } else {
                // Execute the query
                connection.query(query, (err, result) => {
                    if (err) {
                        let e = {
                            error: JSON.stringify(err),
                            errorType: "MYSQL_ERROR",
                            errorMessage: `Error in Query execution: ${query}`
                        };
                        resolve(e);
                    } else {
                        resolve(result);
                    }

                    // Release the connection back to the pool
                    connection.release();
                });
            }
        });
    });

    return promise;
};

export const bulkUpdate = (query, values) => {
    const promise = new Promise((resolve) => {
        // Get a connection from the pool
        pool.getConnection((err, connection) => {
            if (err) {
                let e = {
                    error: JSON.stringify(err),
                    errorType: "MYSQL_ERROR",
                    errorMessage: `Error in getting connection: ${query}`
                };
                resolve(e);
            } else {
                // Execute the query
                connection.query(query, [values], (err, result) => {
                    if (err) {
                        let e = {
                            error: JSON.stringify(err),
                            errorType: "MYSQL_ERROR",
                            errorMessage: `Error in Query execution: ${query}`
                        };
                        resolve(e);
                    } else {
                        resolve(result);
                    }

                    // Release the connection back to the pool
                    connection.release();
                });
            }
        });
    });

    return promise;
};
