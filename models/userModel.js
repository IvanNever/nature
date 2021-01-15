const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valide email'],
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide your password'],
        minlength: [8, 'Password must have more or equal then 10 characters'],
    },
    passwordConfirm: {
        type: String,
        required: [true, 'You should confirm your password'],
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
