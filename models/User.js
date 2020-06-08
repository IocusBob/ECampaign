const mongoose = require('mongoose')

// The below line is EXACTLY the same as doing: const Schema = mongoose.Schema;
const { Schema } = mongoose;

const userSchema = new Schema({
    googleId: String,
    credits: {type: Number, default: 0}
});


// arg1 table name, arg2 schema
mongoose.model('users', userSchema)