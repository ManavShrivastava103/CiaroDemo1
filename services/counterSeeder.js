const Counter = require("../models/counterModel");

const seed_counters = async () => {
    const counters = [
        {
            counter_name : "PROJECT",
            prefix : "PRJ"
        },
        {
            counter_name : "ORGANIZATION",
            prefix : "ORG"
        }
    ];
    for(const counter of counters){
        const existing_counter = await Counter.findOne({ counter_name : counter.counter_name });
        if(!existing_counter){
            await Counter.create(counter);
            console.log("Counter Seeded : ", counter);
        }
        console.log("Counter Exists : ", counter);
    }
    console.log("Counters Seeding Check Completed.");
};

module.exports = seed_counters;