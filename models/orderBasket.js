const { Schema, model } = require("mongoose");
const Joi = require("joi");
const {handleMongooseError} = require("../utils");

const OrderBasketSchema = Schema({
   customerName: {
    type: String,
    required: true,
   },
   customerSurname: {
    type: String,
    required: true,
   },
   phone: {
    type: String,
    required: true,
   },
   comments: {
    type: String,
    required: true,
   },
   date: {
    type: String,
    required: true,
   },
   typeOfDelivery: {
    type: String,
    required: true,
   },
   locality: {
    type: String,
   },
   branchNumber: {
    type: String,
   },
   confirmedOrder: {
    type: Array,
    required: true,
   },
   totalAmount: {
    type: String,
    required: true,
   },
}, {versionKey: false});

OrderBasketSchema.post("save", handleMongooseError);

const orderValidation = Joi.object({
    customerName: Joi.string().required().messages({
        "any.required": "missing required field - customerName",
    }),
    customerSurname: Joi.string().required().messages({
        "any.required": "missing required field - customerSurname",
    }),
    phone: Joi.string().required().messages({
        "any.required": "missing required field - phone",
    }),
    date: Joi.string().required().messages({
      "any.required": "missing required field - date",
    }),
    comments: Joi.string().required().messages({
      "any.required": "missing required field - comments",
    }),
    locality: Joi.string().required().allow("").messages({
        "any.required": "missing required field -  locality",
    }),
    branchNumber: Joi.string().required().allow("").messages({
        "any.required": "missing required field - branchNumber",
    }),
    typeOfDelivery: Joi.string().required().allow("").messages({
        "any.required": "missing required field - typeOfDelivery",
    }),
    confirmedOrder: Joi.array().required().messages({
        "any.required": "missing required field - confirmedOrder",
    }),
    totalAmount: Joi.string().required().allow("").messages({
        "any.required": "missing required field - totalAmount",
    }),
});

const OrderBasket = model("basket-order", OrderBasketSchema);

module.exports = {
    OrderBasket,
    orderValidation,
  };