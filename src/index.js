if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}



const path = require('path');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const { engine } = require('express-handlebars');
const initializePassport = require('./passport-config');
const { getUserByPhonenumber } = require('./app/models/Account');
const flash = require('express-flash');
const session = require('express-session');

const route = require('./routes');
const sortMiddleware = require('./app/middlewares/sortMiddleware');
const passport = require('passport');

const app = express();
const port = 3000;

initializePassport(
    passport,
    getUserByPhonenumber
)

app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))
app.use(passport.initialize());
app.use(passport.session());

// use static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

app.use(methodOverride('_method'));

// Custom middleware
app.use(sortMiddleware);

app.use(morgan('combined'));

app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        helpers: require('./helpers/handlebars')
    }),
);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// route init
route(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
