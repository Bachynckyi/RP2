const { Schema, model } = require("mongoose");
const Joi = require("joi");
const {handleMongooseError} = require("../utils");

const ProductSchema = Schema({
    details: {
        title: {
          type: String,
          required: true,
        },
        category: {
          type: String,
          enum: ["Emali", "Gruntovki", "Emali-gruntovki3v1"],
          required: true,
        },
        description: {
          type: String,
          required: true,
        }
    },
    prices: {
      type: Object,
      required: true,
    },
}, {versionKey: false});

ProductSchema.post("save", handleMongooseError);

const addProductValidation = Joi.object({

});

const Product = model("notices", ProductSchema);

module.exports = {
    Product,
    addProductValidation,
  };