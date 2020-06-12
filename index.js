var express = require("express");
const mongoose = require ('mongoose');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const passport = require('passport')
const keys = require('./config/keys');

// It is important that we define the models before we use them, and a model is used in the service/passport.js file
require('./models/User');
require('./models/Survey');
require('./services/passport');



mongoose.connect(keys.mongoURI)

var app = express();

app.use(bodyParser.json())

app.use(
    // below is a function and we are calling the function with an object with some settings
    cookieSession({
        // 30 days, 24 hours, 60 mins in hour, 60 secs in min, 1000 millisecs in second (total = 30 days)
        maxAge: 30 * 24 * 60 * 60 * 1000,
        // this encrypts cookie, can use muliple keys for improved security
        keys: [keys.cookieKey]
    })
)

app.use(passport.initialize())
app.use(passport.session())

// The below require statement returns a function so we immediately call that function with the app object
require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app)

if(process.env.NODE_ENV === 'production'){
    // Express will serve up production assets like main.js or main.css files
    app.use(express.static('client/build'));

    // If the above line of code isnt activitated (i.e it doesnt return anything,
    // then for all other routes resolve to current folder/client/build/index.html (react index file)
    const path = require('path');
    app.get('*', (req, res) =>{
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    });
};

const PORT = process.env.PORT || 8000
app.listen(PORT);