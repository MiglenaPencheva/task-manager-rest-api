const express = require('express');
require('./config/mongoose');
const cors = require('./middlewares/cors');
const dataController = require('./controllers/dataController');
const authController = require('./controllers/authController');
const auth = require('./middlewares/auth');
const { PORT } = require('./config/config');

const app = express();

app.use(cors());                //{ exposedHeaders: 'Authorization' }
app.use(express.json());
app.use(auth());

app.use('/data', dataController);
app.use('/auth', authController);

app.get('/', (req, res) => {
    res.send('REST Service operational.');      //  Send requests to /api
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));