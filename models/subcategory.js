const { Schema, model } = require("mongoose");
const Joi = require("joi");
const {handleMongooseError} = require("../utils");

const SubcategorySchema = Schema({
   nameSubcategory: {
    type: String,
    required: true,
   },
   photoSubcategory: {
    type: String,
    required: true,
   },
   subcategory: {
    type: String,
    required: true,
   },
   descriptionSubcategory: {
    type: String,
    required: true,
   },
    nameCategory: {
    type: String,
    required: true,
   },
   category: {
    type: String,
    required: true,
   },
   active: {
    type: Boolean,
    default: true,
   },
}, {versionKey: false});

SubcategorySchema.post("save", handleMongooseError);

const addSubcategoryValidation = Joi.object({
    nameSubcategory: Joi.string().required().messages({
      "any.required": "missing required field - nameSubcategory",
    }),
    subcategory: Joi.string().required().messages({
      "any.required": "missing required field - subcategory",
    }),
    descriptionSubcategory: Joi.string().required().messages({
      "any.required": "missing required field - descriptionSubcategory",
    }),
    nameCategory: Joi.string().required().messages({
      "any.required": "missing required field - nameCategory",
    }),
    category: Joi.string().required().messages({
      "any.required": "missing required field - category",
    }),
    active: Joi.boolean().allow('').messages({
      "any.required": "missing required field - active",
    }),
});

const Subcategory = model("subcategories", SubcategorySchema);

module.exports = {
    Subcategory,
    addSubcategoryValidation,
  };