const { Schema, model } = require("mongoose");
const Joi = require("joi");
const {handleMongooseError} = require("../utils");

const SubcategorySchema = Schema({
   title: {
    type: String,
    required: true,
   },
   photo: {
    type: String,
    required: true,
   },
   name: {
    type: String,
    required: true,
   }
}, {versionKey: false});

SubcategorySchema.post("save", handleMongooseError);

const addSubcategoryValidation = Joi.object({
    title: Joi.string().required().messages({
      "any.required": "missing required field - Title",
    }),
    name: Joi.string().required().messages({
      "any.required": "missing required field - Name",
    }),
});

const Subcategory = model("subcategories", SubcategorySchema);

module.exports = {
    Subcategory,
    addSubcategoryValidation,
  };