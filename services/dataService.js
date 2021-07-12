const Task = require('../models/Task');

async function getAll(query) {
    return Task
        .find({ content: { $regex: query || '', $options: 'i' } })
        .sort({ 'created_at': 1 })
        .lean();
}

async function getAllToDo(query) {
    return await Task
        .find({
            isCompleted: false,
            content: { $regex: query || '', $options: 'i' }
        })
        .sort({ 'created_at': 1 })
        .lean();
}

async function getAllCompleted(query) {
    return await Task
        .find({
            isCompleted: true,
            content: { $regex: query || '', $options: 'i' }
        })
        .sort({ 'created_at': 1 })
        .lean();
}

async function getMine(query, userId) {
    return await Task
        .find({
            creator: userId,
            content: { $regex: query || '', $options: 'i' }
        })
        .sort({ 'created_at': 1 })
        .lean();
}

async function getOne(taskId) {
    const task = await Task.findById(taskId).lean();
    if (task) {
        return task;
    } else {
        return undefined;
    }
}

async function create(data) {
    const task = new Task(data);
    await task.save();
    return task;
}

async function complete(taskId, userId) {
    const existing = await Task.findById(taskId);
    if (!existing) {
        throw new ReferenceError('No such ID in database');
    }
    existing.isCompleted = true;
    existing.completor = userId;

    await existing.save();
    return existing;
}

async function remove(taskId) {
    // return Task.deleteOne({ _id: taskId });
    return Task.findByIdAndDelete(taskId);
}

module.exports = {
    getAll,
    getAllToDo,
    getAllCompleted,
    getMine,
    getOne,
    create,
    complete,
    remove,
};