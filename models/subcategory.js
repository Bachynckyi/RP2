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
   routeSubcategory: {
    type: String,
    required: true,
   },
   descriptionSubcategory: {
    type: String,
    required: true,
   },
    category: {
    type: String,
    required: true,
   },
   
}, {versionKey: false});

SubcategorySchema.post("save", handleMongooseError);

const addSubcategoryValidation = Joi.object({
    nameSubcategory: Joi.string().required().messages({
      "any.required": "missing required field - nameSubcategory",
    }),
    routeSubcategory: Joi.string().required().messages({
      "any.required": "missing required field - routeSubcategory",
    }),
    descriptionSubcategory: Joi.string().required().messages({
      "any.required": "missing required field - descriptionSubcategory",
    }),
    category: Joi.string().required().messages({
      "any.required": "missing required field - category",
    }),

});

const Subcategory = model("subcategories", SubcategorySchema);

module.exports = {
    Subcategory,
    addSubcategoryValidation,
  };