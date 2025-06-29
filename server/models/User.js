const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: null
    },
    firebaseUid: {
        type: String,
        default: null
    },
    authProvider: {
        type: String,
        enum: ['email', 'google'],
        default: 'email'
    },
    otp: {
        type: Number,
        default: null
    },
    otpExpiresAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User