// Environment variables
require('dotenv').config();

// Express.js
const express = require('express');
const app = express();

// Packages
const cookieParser = require('cookie-parser');

// Database
const connectDB = require('./db/connect');

// Routers
const userRouter = require('./routers/userRouter');
const productRouter = require('./routers/productRouter');
const orderRouter = require('./routers/orderRouter');
const customerSupportRouter = require('./routers/customerSupportRouter');


app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET_KEY));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/customer-support', customerSupportRouter);


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
