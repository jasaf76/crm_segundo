const mongoose = require("mongoose");

const ClientSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  nachname: {
    type: String,
    required: true,
    trim: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    match: [/.+@.+\..+/, "Must match an email address!"],
    index: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
    match: [/.+/, "Must match a telefon number!"],
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
});

module.exports = mongoose.model("Client", ClientSchema);
