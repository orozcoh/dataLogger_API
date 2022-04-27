const express = require('express');

const urlsRouter = require('./data.router');
//const usersRouter = require('./users.router');
//const categoriesRouter = require('./categories.router');


function routerApi_v1(app) {
    const router = express.Router();
    app.use('/v1', router);
    router.use('/data', urlsRouter);
    //router.use('/users', usersRouter);
    //router.use('/categories', categoriesRouter);
}

module.exports = routerApi_v1;