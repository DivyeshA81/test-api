const mongoose = require("mongoose");
const Country = require('../models/countrySchema');
const { Schema } = mongoose;

const stateSchema = new Schema(
  {
    stateName: {
      type: String,
      required: true,
    },
    country: {
      type: Schema.Types.ObjectId,  
      ref: 'Country',
      required: true, 
    },
  },
  { timestamps: true }
);

const State = mongoose.model("State", stateSchema);
module.exports = State;