const { Schema, model } = require("mongoose");
const Joi = require("joi");
const {handleMongooseError} = require("../utils");

const CategorySchema = Schema({
   nameCategory: {
    type: String,
    required: true,
   },
   photoCategory: {
    type: String,
    required: true,
   },
   category: {
    type: String,
    required: true,
   },
   descriptionCategory: {
    type: String,
    required: true,
   },

}, {versionKey: false});

CategorySchema.post("save", handleMongooseError);

const addCategoryValidation = Joi.object({
    nameCategory: Joi.string().required().messages({
      "any.required": "missing required field - nameCategory",
    }),
    category: Joi.string().required().messages({
      "any.required": "missing required field - category",
    }),
    descriptionCategory: Joi.string().required().messages({
      "any.required": "missing required field - descriptionCategory",
    }),
});

const Category = model("categories", CategorySchema);

module.exports = {
    Category,
    addCategoryValidation,
  };