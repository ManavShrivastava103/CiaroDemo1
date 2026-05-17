const mongoose = require("mongoose");

const otp_schema = new mongoose.Schema({

    email: { type: String, required: true},
    otp: { type: String, required: true },
    purpose: { type: String, enum: ["LOGIN", "REGISTER", "RESET_PASSWORD"], default: "LOGIN" },
    attempts: { type: Number, default: 0, max: 5 },
    expires_at: { type: Date, required: true }
}, {
    timestamps: true
});

otp_schema.index(
    {expires_at: 1},
    {expireAfterSeconds: 0}
);

module.exports = mongoose.model("OTP", otp_schema);