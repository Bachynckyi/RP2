const { ctrlWrapper } = require("../utils");
const { Order } = require("../models/order");
const { HttpError } = require("../helpers");
const { orderValidation } = require("../models/order");
const sendEmail = require("../helpers/sendEmail");


const addOrderByOneClick = async (req, res) => {
    const {error} = orderValidation.validate(req.body);
    if(error) {
      return res.status(400).json({"message": error.message});
    };
    const result = await Order.create({...req.body});
    const email = {
      to: "colorfarb@gmail.com",
      subject: `Нове замовлення ${result.date}`,
      html: 
        `<h1>Нове замовлення ${result._id}</h1>
        <p>Дата: ${result.date}</p>
        <p>Ім'я клієнта: ${result.customerName}</p>
        <p>Телефон клієнта: ${result.customerPhone}</p>
        <p>Назва товару: ${result.title}</p>
        <p>Колір: ${result.color}</p>
        <p>Фасовка: ${result.type}</p>
        <p>Кількість: ${result.quantity} шт</p>
        <p>Код товару: ${result.code}</p>
        <p>Ціна за шт: ${result.price} грн</p>
        <p>Вартість: ${(Number(result.price)*Number(result.quantity)).toFixed(2)} грн</p>`
  };
  await sendEmail(email);
  res.status(201).json(result);
};

module.exports = {
    addOrderByOneClick: ctrlWrapper(addOrderByOneClick),
};