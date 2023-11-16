// Environment variables
require('dotenv').config();

// Database
const connectDB = require('./db/connect');

const initialize = async() => {
    try {
        console.log('Connecting to the database...');
        await connectDB(process.env.DB_CONNECTION_STRING);
        console.log('Connection successful');
    }
    catch(err) {
        console.log(`Something happend while connectiong to the DB: ${err}`)
    }
    
};

initialize();
