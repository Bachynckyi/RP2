const { Schema, model } = require("mongoose");
const Joi = require("joi");
const {handleMongooseError} = require("../utils");

const ProductSchema = Schema({
   title: {
    type: String,
    // required: true,
   },
   description: {
    type: String,
    // required: true,
   },
   category: {
    type: String,
    enum: ["Emali", "Gruntovki", "Emali&gruntovki3v1"],
    // required: true,
   },
   price: {
    type: String,
    // required: true,
   },
   type: {
    type: String,
    // required: true,
   },
   color: {
    type: String,
    // required: true,
   },
   photo: {
    type: String,
    // required: true,
   }
}, {versionKey: false});

ProductSchema.post("save", handleMongooseError);

const addProductValidation = Joi.object({
    category: Joi.string().required().messages({
      "any.required": "missing required field - Category",
    }),
    title: Joi.string().required().messages({
      "any.required": "missing required field - Title",
    }),
    type: Joi.string().required().messages({
      "any.required": "missing required field - Type",
    }),
    price: Joi.string().required().messages({
      "any.required": "missing required field - Price",
    }),
    color: Joi.string().required().messages({
      "any.required": "missing required field - Color",
    }),
    description: Joi.string().required().messages({
      "any.required": "missing required field - Description",
    }),
});

const Product = model("products", ProductSchema);

module.exports = {
    Product,
    addProductValidation,
  };