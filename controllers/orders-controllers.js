const { ctrlWrapper } = require("../utils");
const { OrderOneClick } = require("../models/orderOneclick");
const { OrderBasket } = require("../models/orderBasket");
const { orderOneClickValidation } = require("../models/orderOneclick");
const { orderValidation } = require("../models/orderBasket");
const sendEmail = require("../helpers/sendEmail");

const addOrderByOneClick = async (req, res) => {
    const {error} = orderOneClickValidation.validate(req.body);
    if(error) {
      return res.status(400).json({"message": error.message});
    };
    const result = await OrderOneClick.create({...req.body});
    const email = {
      to: "colorfarb@gmail.com",
      subject: `Нове замовлення в один клік ${result.date}`,
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

const addOrderByBasket = async (req, res) => {
  const {error} = orderValidation.validate(req.body);
  if(error) {
    return res.status(400).json({"message": error.message});
  };
  const result = await OrderBasket.create({...req.body});

  const order = [];

    for (const item of result.confirmedOrder) {
      const itemsOforder = 
      `
      <h3>Назва товару: ${item.title}</h3>
      <p>Код товару: ${item.code}</p>
      <p>Ціна за шт: ${item.price} грн</p>
      <p>Фасовка: ${item.type} грн</p>
      <p>Колір: ${item.color} грн</p>
      <p>Кількість: ${item.quantity} грн</p>
      <p>Вартість: ${(Number(item.price)*Number(item.quantity)).toFixed(2)} грн</p>
      `
      order.splice(0,0, itemsOforder);
    };

  if(result.typeOfDelivery === "Sklad"){
    const email = {
      to: "colorfarb@gmail.com",
      subject: `Нове замовлення ${result.date}`,
      html: 
        `<h1>Нове замовлення № ${result._id}</h1>
        <p>Дата: ${result.date}</p>
        <p>Ім'я клієнта: ${result.customerName}</p>
        <p>Телефон клієнта: ${result.phone}</p>
        <p>Тип доставки: Самовивіз</p>
        <h2>Замовлення</h2>
        <div>${order}</div>
        <h3>Загальна сума до сплати: ${result.totalAmount}</h3>`
    }
  await sendEmail(email);
  res.status(201).json(result);
  }
  else if(result.typeOfDelivery === "Delivery"){
    const email = {
      to: "colorfarb@gmail.com",
      subject: `Нове замовлення ${result.date}`,
      html: 
        `<h1>Нове замовлення № ${result._id}</h1>
        <p>Дата: ${result.date}</p>
        <p>Ім'я клієнта: ${result.customerName}</p>
        <p>Телефон клієнта: ${result.phone}</p>
        <p>Тип доставки: Delivery</p>
        <p>Населений пункт: ${result.locality}</p>
        <p>Відділення: ${result.branchNumber}</p>
        <h2>Замовлення</h2>
        <div>${order}</div>
        <h3>Загальна сума до сплати: ${result.totalAmount}</h3>`
    }
    await sendEmail(email);
    res.status(201).json(result);
  }
  else if(result.typeOfDelivery === "Nova Poshta"){
    const email = {
      to: "colorfarb@gmail.com",
      subject: `Нове замовлення ${result.date}`,
      html: 
        `<h1>Нове замовлення № ${result._id}</h1>
        <p>Дата: ${result.date}</p>
        <p>Ім'я клієнта: ${result.customerName}</p>
        <p>Телефон клієнта: ${result.phone}</p>
        <p>Тип доставки: Нова пошта</p>
        <p>Населений пункт: ${result.locality}<p/>
        <p>Відділення: ${result.branchNumber}</p>
        <h2>Замовлення</h2>
        <div>${order}</div>
        <h3>Загальна сума до сплати: ${result.totalAmount}</h3>`
    }
    await sendEmail(email);
    res.status(201).json(result);
  }
};

module.exports = {
    addOrderByOneClick: ctrlWrapper(addOrderByOneClick),
    addOrderByBasket: ctrlWrapper(addOrderByBasket),
};