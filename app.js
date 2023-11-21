// Environment variables
require('dotenv').config();

// Express.js
const express = require('express');
const app = express();

// Packages
// ...

// Database
const connectDB = require('./db/connect');

// Routers
const userRouter = require('./routers/userRouter');


app.use(express.json());

app.use('/api/v1/users', userRouter);


const initialize = async() => {
    try {
        console.log('Connecting to the database...');
        await connectDB(process.env.DB_CONNECTION_STRING);
        console.log('Connection successful. The server is starting...');

        let port = 3000;    // TODO: Change it while shipping
        app.listen(port, () => {
            console.log(`The server is listening on port ${port}...`);
        });
    }
    catch (error) {
        console.log(`Something happend: ${error}`)
    }
};

initialize();
