const router = require('express').Router();
const { register, login } = require('../services/authService');
const { isGuest } = require('../middlewares/guards');

router.post('/register', isGuest(), async (req, res) => {
    let { username, password, repeatPassword } = req.body;
    
    try {
        if (!username || !password|| !repeatPassword) throw { message: 'Попълни всички полета!' };
        if (password != repeatPassword) throw { message: 'Паролите не съвпадат!' };

        await register(username, password);

        let token = await login(username, password);
        res.json(token);

    } catch (error) {
        res.status(error.status || 400).json({ message: error.message });
    }
});

router.post('/login', isGuest(), async (req, res) => { 
    const { username, password } = req.body;

    try {
        if (!username || !password) throw { message: 'Попълни всички полета!' };
        
        let token = await login(username, password);
        res.json(token);

    } catch (error) {
        res.status(error.status || 400).json({ message: error.message });
    }
});

router.get('/logout', (req, res) => {
    res.status(204).end();
});

module.exports = router;