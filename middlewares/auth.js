const jwt = require('jsonwebtoken');
const { SECRET } = require('../config/config');

module.exports = () => (req, res, next) => {
    const token = req.headers['x-authorization'];

    try {
        if (token) {
            const userData = jwt.verify(token, SECRET);
            req.user = userData;
        }
    } catch (error) {
        console.log(error.message);
        // res.status(401).json({ message: 'Невалидна потребителска сесия. Влез в профила си.' });
    }
    next();
};