const mongoose = require('mongoose');

const { DB_URI } = require('./config');

const dbOptions = {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
};

mongoose.connect(DB_URI, dbOptions);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'DB connection error:'));
db.once('open', console.log.bind(console, 'DB is connected'))

module.exports = db;

