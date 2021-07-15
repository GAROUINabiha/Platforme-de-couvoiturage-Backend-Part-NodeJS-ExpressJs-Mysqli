const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
/* CORS */
app.use(cors({
    origin: '*',
    methods: ['GET', 'PUT', 'DELETE', 'PATCH', 'POST'],
    allowedHeaders: 'Content-Type, Authorization, Origin, X-Requested-With, Accept'
}));
app.use(bodyParser.urlencoded({
    extended: false
}));
// parse application/json//
app.use(bodyParser.json());
app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Import Routes
const usersRouter = require('./routes/users');
const trajetRouter = require('./routes/trajet');
const authRouter = require('./routes/auth');
const avisRouter = require('./routes/avis');
// Define Routes
app.use('/api/users', usersRouter);
app.use('/api/trajet', trajetRouter);
app.use('/api/auth', authRouter);
app.use('/api/avis', avisRouter);
















module.exports = app;