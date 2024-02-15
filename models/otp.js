const mongoose = require("mongoose");

const otpSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: Number
    },
    expiresAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
 
module.exports = mongoose.model("Otp", otpSchema);