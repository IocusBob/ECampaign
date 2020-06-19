const recipientSchema = require('./Recipient');

const mongoose = require('mongoose');
const { Schema } = mongoose;


const surveySchema = new Schema({
    title: String,
    body: String,
    subject: String,
    // [recipientSchema] = array of recipient Schema objects
    recipients: [recipientSchema],
    yes: {type: Number, default: 0},
    no: {type: Number, default: 0},
    // _user is convention for showing relational fields. Schema.Types.ObjectId is just saying its a relational ID.
    // Mongo DB is doing some behind the scenes stuff to relate "User" to the "users" table.
    _user: {type: Schema.Types.ObjectId, ref: 'User'},
    dateSend: Date,
    lastResponded: Date
});

mongoose.model('surveys', surveySchema);