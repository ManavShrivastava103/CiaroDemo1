const Counter = require("../models/counterModel");

const generate_unique_id = async (counter_name) => {
    try {
        const updated_counter = await Counter.findOneAndUpdate(
            { counter_name: counter_name },
            {
                $inc: { seq_value: 1 }
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        if (!updated_counter) {
            throw new Error("Counter generation failed");
        }
        const padded_number = updated_counter.seq_value
            .toString()
            .padStart(4, "0");
        return `${updated_counter.prefix}-${padded_number}`;

    } catch (err) {
        throw new Error(`Failed to generate unique ID : ${err.message}`);
    }
};

module.exports = generate_unique_id;