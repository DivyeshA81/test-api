const mongoose = require("mongoose");
const { Schema } = mongoose; 
const Country = require('./countrySchema');
const State = require('./stateSchema');

const citySchema = new Schema(
  {
    cityName: {
      type: String,
      required: true,
    },
    state: {
      type: Schema.Types.ObjectId,
      ref: 'State',
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

const City = mongoose.model("City", citySchema);
module.exports = City;