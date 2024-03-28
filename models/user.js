const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true, // Makes quring by email faster and makes our database bigger
    },
    password: {
        type: String,
        required: true,
    },
    notes: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Note'}
    ]
})

const User = mongoose.model("User", noteSchema);

module.exports = User;
