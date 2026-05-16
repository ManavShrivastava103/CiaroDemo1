const mongoose = require("mongoose");

const counter_schema = new mongoose.Schema({
    counter_name : { type: String, required: true, unique: true },
    prefix : { type: String, required: true },
    seq_value : { type: Number, default: 0 }
}, {
    timestamps: true
});

module.exports = mongoose.model("Counter", counter_schema);