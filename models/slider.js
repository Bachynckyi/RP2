const { Schema, model } = require("mongoose");
const {handleMongooseError} = require("../utils");

const SliderSchema = Schema({
   photoSlider: {
    type: String,
    required: true,
   }
}, {versionKey: false});

SliderSchema.post("save", handleMongooseError);

const Slider = model("slider", SliderSchema);

module.exports = {
    Slider
  };