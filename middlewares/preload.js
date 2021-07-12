const { getOne } = require("../services/dataService");

module.exports = (paramName = 'id') => async (req, res, next) => {
    const id = req.params[paramName];

    try {
        const data = await getOne(id);
        
        if (!data) throw new Error('Not found');

        req.data = data;
        next();

    } catch (error) {
        res.status(404).json({ message: 'No such record' });
    }
};