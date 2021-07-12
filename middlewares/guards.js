module.exports = {
    isAuth() {
        return (req, res, next) => {
            if (!req.user) {
                res.status(401).json({ message: 'Влез в профила си.' });
            } else {
                next();
            }
        };
    },
    isGuest() {
        return (req, res, next) => {
            if (req.user) {
                res.status(400).json({ message: 'Вече си влязъл в профила си.' });
            } else {
                next();
            }
        };
    },
    // isOwner() {
    //     return (req, res, next) => {
    //         const task = req.data;
    //         if (req.user._id != task.creator) {
    //             res.status(403).json({ message: 'Нямаш право да извършиш това действие.' });
    //         } else {
    //             next();
    //         }
    //     };
    // }
}