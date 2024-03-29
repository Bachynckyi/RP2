const { Schema, model } = require("mongoose");
const Joi = require("joi");
const {handleMongooseError} = require("../utils");

const OrderOneClickSchema = Schema({
   title: {
    type: String,
    required: true,
   },
   price: {
    type: String,
    required: true,
   },
   color: {
    type: String,
    required: true,
   },
   type: {
    type: String,
    required: true,
   },
   code: {
    type: String,
    required: true,
   },
   customerName: {
    type: String,
    required: true,
   },
   customerPhone: {
    type: String,
    required: true,
   },
   date: {
    type: String,
    required: true,
   },
   quantity: {
    type: String,
    required: true,
   },
}, {versionKey: false});

OrderOneClickSchema.post("save", handleMongooseError);

const orderOneClickValidation = Joi.object({
    title: Joi.string().required().messages({
      "any.required": "missing required field - title",
    }),
    price: Joi.string().required().messages({
      "any.required": "missing required field - price",
    }),
    color: Joi.string().required().messages({
      "any.required": "missing required field - color",
    }),
    type: Joi.string().required().messages({
        "any.required": "missing required field - type",
    }),
    code: Joi.string().required().messages({
        "any.required": "missing required field - code",
    }),
    customerName: Joi.string().required().messages({
        "any.required": "missing required field - customerName",
    }),
    customerPhone: Joi.string().required().messages({
        "any.required": "missing required field - customerPhone",
    }),
    date: Joi.string().required().messages({
      "any.required": "missing required field - date",
    }),
    quantity: Joi.string().required().messages({
      "any.required": "missing required field - quantity",
  }),
});

const OrderOneClick = model("one-click-order", OrderOneClickSchema);

module.exports = {
    OrderOneClick,
    orderOneClickValidation,
  };