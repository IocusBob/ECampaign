const mongoose = require('mongoose');
const _ = require("lodash");
const { Path } = require('path-parser');
const { URL } = require('url');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');
const keys = require('../config/keys');

const Survey = mongoose.model('surveys');

module.exports = app =>{

    app.get('/api/surveys/:surveyId/:choice', (req, res) => {
        res.send("THANKS FOR VOTING");
    });

    app.get('/api/surveys', requireLogin, async (req, res) => {
        const surveys = await Survey.find({ _user:req.user.id })
            .select({recipients: false});
        res.send(surveys);
    });

    app.post('/api/surveys', requireLogin, requireCredits, async (req, res)=>{
        const  {title, subject, body, recipients } = req.body;

        // New Survey
        const survey = new Survey({
            title,
            subject,
            body,
            // Take a string of emails, split into an array and return a list of each email as an object
            recipients: recipients.split(',').map(email => ({ email: email.trim() })),
            _user: req.user.id,
            dateSend: Date.now()
        });

        // New Email
        try {
            const mailer = new Mailer(survey, surveyTemplate(survey));
            await mailer.send();
            await survey.save();
            req.user.credits -= 1;
            const user = await req.user.save();
            res.send(user);
        } catch (err){
            res.status(422).send(err);
        }
        
    });

    // See app.post below for more detailed description of how this function operates
    app.post('/api/surveys/webhooks', (req, res) => {
        const p = new Path('/api/surveys/:surveyId/:choice');
        // The lodash .chain method allows us to chain other methods to the array (which is req.body in this instance)
        _.chain(req.body)
            .map(({url, email}) => {
                const match = p.test(new URL(url).pathname);
                if(match) {
                    return {email, ...match };
                } 
            })
            .compact()
            .uniqBy('email', 'surveyId')
            .each(({surveyId, email, choice}) => {
                Survey.updateOne({
                    _id: surveyId,
                    recipients: {
                        // Matches specific elements on a related field, recipients is a many to 1 relationship (kinda, as mongoDb is non-relational)
                        $elemMatch: {email: email, responded: false}
                    }
                }, {
                    // $inc increments a key by the value : {key: value to increment by}
                    $inc: {[choice]: 1},
                    // $set will set a key to the value, the $ here represents the result of the above query so the key is:
                    // recipients.<personWhoMatchedFromAboveQuery>.responded
                    $set: {'recipients.$.responded': true},
                    lastResponded: new Date()
                }).exec();
            })
            .value();

        res.send({});
    });
};


// app.post('/api/surveys/webhooks', (req, res) => {
//     // Sendgrid will use this API to send a list of events that it knows about
//     const events = _.map(req.body, ({url, email}) => {
//         // next line gets the url path (everything after mywebsite.com/ -> so it returns: /api/surveys/<surveyId>/yes)
//         const pathName = new URL(url).pathname
//         // The next 2 lines will strip the url and return stuff inside the /:surveyId and /:choice part of the url inside of an object with these keys. (eg. {surveyId: 12, choice: "yes"} )
//         const p = new Path('/api/surveys/:surveyId/:choice');
//         const match = p.test(pathName);
//         // Merge the email with the returned "match" object
//         if(match) {
//             return {email, ...match };
//         } 
//     });

//     // removes all undefined values in the object (defensive code for someone doing something like removing the ID in the url)
//     const compactEvents = _.compact(events);
//     // Ensures that each record has a unique combination of email against surveyId (someone cant vote twice on the same survey);
//     const uniqueEvents = _.uniqBy(compactEvents, 'email', 'surveyId');
//     console.log(uniqueEvents);
//     res.send({});
// });