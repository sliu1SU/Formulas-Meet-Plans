/*
    Homework 1
    Sizhe Liu
    NOTE: I implemented everything on app.js file, which is allowed for homework 1 after consulting
    with Prof Spinney.
    For detailed documentation, please refer to the word/pdf file "Homework 1 APIs Documentation"
 */

//var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const punycode = require("punycode");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     next(createError(404));
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });

/* the http verb rainbow
GET - gets data (R)
POST - create something/add to a collection (C)
PUT - replace something (wholesale update) - completely overwrite the old object (C/U)
PATCH - (came out in 2008) - partially update something (U)
DELETE - delete a thing (D)

OPTIONS - lists which verbs you can use for a specific path
HEAD - run the request without returning a body
 */

/*
Add a new formula. - POST
See the inputs and outputs of a specific formula. - GET
List which plans contain a specific formula. - GET
Add a new plan. - POST
Append a formula to the end of a plan. - POST
Replace a formula anywhere in the sequence of formulas associated with a plan. - PATCH???
List all the formulas contained in a plan. - GET
Delete a plan. - DELETE
 */

// create data structure in memory to hold plans and formulas
// create global number variables for formula and plan ids
formulaId = 4
planId = 4
const plans = new Map()
const formulas = new Map()

// init some data for easier testing (so that I dont have to type these formulas out
// over and over again...
const f1 = {
    "inputs": [{"name": "butter", "number": 2}, {"name": "egg", "number": 1},
        {"name": "sugar", "number": 1}, {"name": "flour", "number": 2},
        {"name": "baking soda", "number": 2}],
    "outputs": [{"name": "cookies", "number": 36}]
}

const f2 = {
    "inputs": [{"name": "iron ore", "number": 3}],
    "outputs": [{"name": "iron bar", "number": 1}]
}

const f3 = {
    "inputs": [{"name": "iron ore", "number": 3}, {"name": "coal", "number": 1}],
    "outputs": [{"name": "steel bar", "number": 1}]
}

const f4 = {
    "inputs": [{"name": "water", "number": 1000}],
    "outputs": [{"name": "hydrogen", "number": 999}, {"name": "deuterium", "number": 1}]
}

formulas.set(0, f1)
formulas.set(1, f2)
formulas.set(2, f3)
formulas.set(3, f4)
plans.set(0, [0])
plans.set(1, [1])
plans.set(2, [2])
plans.set(3, [3])

// this is the root directory, not needed for homework 1
app.get('/', (req, res) => {
    res.send('welcome to my website. you can manage plans and formulas here!')
})

// Add a new formula. - POST
app.post('/formulas', (req, res) => {
    const fid = formulaId
    formulaId++
    formulas.set(fid, req.body)
    res.status(201);
    res.send([fid])
})

// See the inputs and outputs of a specific formula. - GET
app.get('/formulas/:id', (req, res) => {
    const fid = Number(req.params.id)
    if (!formulas.has(fid)) {
        res.status(400)
        res.end()
        return
    }
    res.status(200)
    res.send(formulas.get(fid))
})

// List which plans contain a specific formula. - GET
app.get('/plans/formulas/:id', (req, res) => {
    // another url to do this
    // /formula/:id/plans or /plans?containFormulaId=/:id
    const fid = Number(req.params.id)
    let array = []
    // check every plan and see if it includes the id of the formula you are looking for
    for (let [key, value] of plans) {
        if (value.includes(fid)) {
            array.push(key)
        }
    }
    res.status(200)
    res.send(array);
})

// Add a new plan. - POST
app.post('/plans', (req, res) => {
    const pid = planId
    planId++
    plans.set(pid, [])
    res.status(201);
    res.send([pid])
})

// Append a formula to the end of a plan. - POST
app.post('/plans/:id/formula', (req, res) => {
    const pid = Number(req.params.id)
    if (Object.keys(req.body).length === 0) {
        // the request body is empty
        res.status(400)
        res.end()
        return
    }
    const fid = req.body.id
    if (!plans.has(pid) || !formulas.has(fid) || plans.get(pid).includes(fid)) {
        res.status(400)
        res.end()
        return
    }
    plans.get(pid).push(fid)
    res.status(200);
    res.end()
})

// Replace a formula anywhere in the sequence of formulas associated with a plan. - PATCH
app.patch('/plans/:id/formula', (req, res) => {
    // alternatively: PUT /plans/:id/formula/:index
    const pid = Number(req.params.id)
    if (Object.keys(req.body).length === 0 || Object.keys(req.body).length !== 2) {
        // the request body is either empty or the length is less than the required length
        res.status(400)
        res.end()
        return
    }
    const oldFid = req.body.oldId
    const newFid = req.body.newId
    if (!plans.has(pid) || !plans.get(pid).includes(oldFid)
        || !formulas.has(newFid) || plans.get(pid).includes(newFid)) {
        res.status(400)
        res.end()
        return
    }
    // get the index of the formula id that needs to be replaced, then replace the old
    // formula id with the new formula id
    const arrayIdx = plans.get(pid).indexOf(oldFid)
    plans.get(pid)[arrayIdx] = newFid
    console.log(plans.get(pid))
    res.status(200)
    res.end()
})

// List all the formulas contained in a plan. - GET
app.get('/plans/:id', (req, res) => {
    // or /plans/:id/formulas
    const pid = Number(req.params.id)
    if (!plans.has(pid)) {
        res.status(400)
        res.end()
        return
    }
    let array = []
    // go through every formula ids in a plan and use the formula keys to look up each formula
    // content (json object)
    for (let i = 0; i < plans.get(pid).length; i++) {
        let formulaKey = plans.get(pid)[i]
        console.log(`fkey: ${formulaKey}`)
        obj = {}
        obj[formulaKey] = formulas.get(formulaKey)
        array.push(obj)
    }
    res.status(200)
    res.send(array)
})

// Delete a plan. - DELETE
app.delete('/plans/:id', (req, res) => {
    const pid = Number(req.params.id)
    if (!plans.has(pid)) {
        res.status(400)
        res.end()
        return
    }
    plans.delete(pid)
    res.status(204)
    res.end()
})

module.exports = app;
