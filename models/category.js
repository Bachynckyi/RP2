const { Schema, model } = require("mongoose");
const Joi = require("joi");
const {handleMongooseError} = require("../utils");

const CategorySchema = Schema({
   title: {
    type: String,
    required: true,
   },
   photo: {
    type: String,
    required: true,
   }
}, {versionKey: false});

CategorySchema.post("save", handleMongooseError);

const addCategoryValidation = Joi.object({
    title: Joi.string().required().messages({
      "any.required": "missing required field - Title",
    }),
});

const Category = model("categories", CategorySchema);

module.exports = {
    Category,
    addCategoryValidation,
  };