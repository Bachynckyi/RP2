const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;
const { ctrlWrapper } = require("../utils");
const { User } = require("../models/user");
const { HttpError } = require("../helpers");

const register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new HttpError(400, "Email and password are required");
  }
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const result = await User.create({...req.body, password: hashPassword });
  const payload = {
    id: result.id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  const updatedUser = await User.findByIdAndUpdate(payload.id, {token}, {new: true});
  res.status(201).json({user: updatedUser});
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const result = await User.findOne({ email });
  if (!result) {
    throw HttpError(401, "Email or password invalid");
  }
  const passwordCompare = await bcrypt.compare(password, result.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const payload = {
    id: result._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  const updatedUser = await User.findByIdAndUpdate(result._id, { token });
  const user = await User.findById(result._id);
  res.status(200).json({token, user});
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.json({
    message: "Logout success",
  });
};

const getCurrent = async (req, res) => {
  const user = req.user;
  res.status(200).json({user});
};

const addToBasket = async (req, res) => {
  const userId = req.user._id;
  const result = await User.findByIdAndUpdate(userId, {$push: { basket: req.body.data}}, {new: true});
  if(!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200);
};

const removeFromBasket = async (req, res) => {
  const userId = req.user._id;
  const idProduct = req.params.id;
  const result = await User.findById({_id: userId});
  if(!result) {
    throw HttpError(404, "Not found");
  }
  const currentBasket = result.basket;
  const newBasket = currentBasket.filter(currentBasket => currentBasket.id !== idProduct);
  const updatedUser = await User.findByIdAndUpdate(userId, { basket: newBasket}, {new: true});
  res.status(200).json(updatedUser);
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  addToBasket: ctrlWrapper(addToBasket),
  removeFromBasket: ctrlWrapper(removeFromBasket),
  getCurrent: ctrlWrapper(getCurrent),
};