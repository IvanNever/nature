const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'Please provide your password'],
        minlength: [8, 'Password must have more or equal then 10 characters'],
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'You should confirm your password'],
        validate: {
            //This only work on Save and Create
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!',
        },
    },
    passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
    //Only run if password was actually modified
    if (!this.isModified('password')) return next();

    //Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    //Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return JWTTimestamp < changedTimestamp;
    }

    //False means NOT CHAGED
    return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
