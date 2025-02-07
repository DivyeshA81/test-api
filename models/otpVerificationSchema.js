const mongoose = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let mongoosePaginate = require("mongoose-paginate-v2");

const OtpVerificationSchema = mongoose.Schema(
  {
    mobileNo: {
      type: String,
      require: true
    },
    otp: {
      type: String,
      default: ""
    },
  },
  { timestamps: true }
);

OtpVerificationSchema.plugin(aggregatePaginate);
OtpVerificationSchema.plugin(mongoosePaginate);

const OtpVerification = mongoose.model("OtpVerification", OtpVerificationSchema);
module.exports = OtpVerification;