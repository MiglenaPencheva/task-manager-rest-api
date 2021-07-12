const router = require('express').Router();
const { getAll, create, getOne, complete, remove } = require('../services/dataService');
const { getUserById } = require('../services/authService');
const { isAuth } = require('../middlewares/guards');
const { parseError } = require('../utils');
const preload = require('../middlewares/preload');  

// router.get('/', async (req, res) => {
//     const data = await getAll();
//     res.json(data);
// });

router.get('/all', isAuth(), async (req, res) => {
    const tasks = await getAll(req.query.search);
    let formatedTasks = tasks.map(x => formatDate(x));
    let isOne = formatedTasks.length == 1 ? true : false;
    res.json({ formatedTasks, isOne });
});

router.get('/archive', isAuth(), async (req, res) => {
    const completed = await getAllCompleted(req.query.search);
    let formatedCompleted = completed.map(x => formatDate(x));
    let isOne = formatedCompleted.length == 1 ? true : false;
    res.json({ formatedCompleted, isOne });
});

router.get('/to-do', isAuth(), async (req, res) => {
    const toDoList = await getAllToDo(req.query.search);
    let formatedToDoList = toDoList.map(x => formatDate(x));
    let isOne = formatedToDoList.length == 1 ? true : false;
    res.json({ formatedToDoList, isOne });
});

router.get('/my-tasks', isAuth(), async (req, res) => {
    const myTasks = await getMine(req.query.search, req.user._id);
    let formatedMyTasks = myTasks.map(x => formatDate(x));
    let isOne = formatedMyTasks.length == 1 ? true : false;
    res.json({ formatedMyTasks, isOne });
});

router.post('/', isAuth(), async (req, res) => {
    // const id = 'a' + (Math.random() * 1000 | 0);
    // data[id] = req.body;

    try {
        if (req.body.content === '') throw { message: 'Попълни съдържание' };
        
        const task = req.body;
        task.creator = req.user._id;
        task.isCompleted = false;
        task.completor = '';
        
        const result = await create(task);
        res.status(201).json(result);

    } catch (error) {
        const message = parseError(error);
        res.status(error.status || 400).json({ message });
    }
});

router.get('/:id', isAuth(), preload(), async (req, res) => {
    const task = await getOne(req.params.id);
    formatDate(task);

    let creator = await getUserById(task.creator);
    formatCreator(task, creator);

    if (task.completor) {
        let completor = await getUserById(task.completor);
        formatCompletor(task, completor);
    }

    res.json(task);
});

router.put('/:id', isAuth(), preload(), async (req, res) => {
    try {
        const completed = await complete(req.params.id, req.user._id);
        res.json(completed);
        
    } catch (error) {
        const message = parseError(error);
        res.status(error.status || 400).json({ message })
    }
});

router.delete('/:id', isAuth(), preload(), async (req, res) => {
    try {
        await remove(req.params.id)
        res.status(204).end();
    } catch (error) {
        res.status(error.status || 400).json({ message: error.message })
    }
});

// router.patch('/:id', isAuth(), async (req, res) => {
//     const item = data[req.params.id];
//     Object.assign(item, req.body);
//     data[req.params.id] = item;
//     res.send(202).json(item);
// });

// router.all('*', (req, res) => {
//     res.render('404', { title: 'Page Not Found' });
// });

module.exports = router;

const monts = {
    'Jan': 'ян',
    'Feb': 'февр',
    'Mar': 'март',
    'Apr': 'апр',
    'May': 'май',
    'Jun': 'юни',
    'Jul': 'юли',
    'Aug': 'авг',
    'Sep': 'септ',
    'Oct': 'окт',
    'Nov': 'ное',
    'Dec': 'дек',
};

function formatDate(task) {
    let createdAt = task.created_at;
    let timeCreated = createdAt.toString().split(' ');

    let day = timeCreated[2];
    let month = monts[timeCreated[1]];
    let year = timeCreated[3];

    task.dateCreated = `${day} ${month} ${year}`;

    let hour = timeCreated[4];
    task.hourCreated = hour.slice(0, 5);

    if(task.updated_at) {
        let completedAt = task.updated_at;
        let timeCompleted = completedAt.toString().split(' ');
        
        let dayC = timeCompleted[2];
        let monthC = monts[timeCompleted[1]];
        let yearC = timeCompleted[3];
        task.dateCompleted = `${dayC} ${monthC} ${yearC}`;

        let hourC = timeCreated[4];
        task.hourCompleted = hourC.slice(0, 5);
    }

    return task;
}

function formatCreator(task, creator) {
    task.userCreated = creator.username;
    return task;
}

function formatCompletor(task, completor) {
    task.userCompleted = completor.username;
    return task;
}