const { ctrlWrapper } = require("../utils");
const { Product } = require("../models/product");
const { Category } = require("../models/category");
const { Subcategory } = require("../models/subcategory");
const { HttpError } = require("../helpers");
const { addProductValidation } = require("../models/product");
const { addCategoryValidation} = require("../models/category");
const { addSubcategoryValidation} = require("../models/subcategory");

const addProduct = async (req, res) => {
  // const {title}  = req.body;
  const {error} = addProductValidation.validate(req.body);
  if(error) {
    return res.status(400).json({"message": error.message});
  };
  const result = await Product.create({...req.body, photo: req.file.path});
  res.status(201).json(result)
  // const maxSizeOfAvatar = 3145728;
  // if(req.file){
  //   if(req.file.size > maxSizeOfAvatar){
  //     return res.status(400).json({"message": "Uploaded file is too big"});
  //   }
  //   const nameCheck = await Notice.findOne({title: title});
  //   if(nameCheck) {
  //     throw HttpError(409, "This title is already added");
  //   }
  //   else {
  //   const {_id: ownerNotice} = req.user;
  //   const result = await Notice.create({...req.body, ownerNotice, noticeAvatar: req.file.path}); 
  //   res.status(201).json(result);
  //   }
  // }
  // else {
  //   const nameCheck = await Notice.findOne({title: title});
  //   if(nameCheck) {
  //     throw HttpError(409, "This title is already added");
  //   }
  //   else {
  //   const {_id: ownerNotice} = req.user;
  //   const result = await Notice.create({...req.body, ownerNotice});
  //   res.status(201).json(result);
  //   }
  // }
};

const addCategory = async (req, res) => {
  const {error} = addCategoryValidation.validate(req.body);
  if(error) {
    return res.status(400).json({"message": error.message});
  };
  const result = await Category.create({...req.body, photoCategory: req.file.path});
  res.status(201).json(result)
};

const addSubcategory = async (req, res) => {
  const {error} = addSubcategoryValidation.validate(req.body);
  if(error) {
    return res.status(400).json({"message": error.message});
  };
  const result = await Subcategory.create({...req.body, photoSubcategory: req.file.path});
  res.status(201).json(result)
};

const getAllCategories = async (req, res) => {
  const result = await Category.find()
  if (!result) {
    throw HttpError(404, "Not Found");
  }
  res.json(result);
};

const getAllSubcategories = async (req, res) => {
  const result = await Subcategory.find()
  if (!result) {
    throw HttpError(404, "Not Found");
  }
  res.json(result);
};

const getProductByCategory = async (req, res) => {
  const category = req.params.id;
  const result = await Product.find({$or:[{category: category},{subcategory: category}]});
  res.status(200).json(result)
};

const getSubcategoryByCategory = async (req, res) => {
  const category = req.params.id;
  const result = await Subcategory.find({category: category})
  if (!result) {
    throw HttpError(404, "Not Found");
  }
  res.json(result);
};

const getProductBySearch = async (req, res) => {
  const search = req.query.search;
  const result = await Product.find({$or:[{title: { $regex: search, $options: 'i' }},{code: { $regex: search, $options: 'i' }}]});
  if (!result) {
    throw HttpError(404, "Not Found");
  }
  res.json(result);
};

const updateCategoryWithPhoto = async (req, res) => {
  const { id } = req.params;
  const result = await Category.findByIdAndUpdate(id, {...req.body, photoCategory: req.file.path}, { new: true });
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.json(result);
};

const updateCategoryWithoutPhoto = async (req, res) => {
  const { id } = req.params;
  const result = await Category.findByIdAndUpdate(id, {...req.body}, { new: true });
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.json(result);
};

// const updateSubCategory = async (req, res) => {
//   const { id } = req.params;
//   const result = await Subcategory.findByIdAndUpdate(id, {...req.body, photoCategory: req.file.path}, { new: true });
//   if (!result) {
//     throw HttpError(404, `Not found`);
//   }
//   res.json(result);
// };

































module.exports = {
    addProduct: ctrlWrapper(addProduct),
    addCategory: ctrlWrapper(addCategory),
    addSubcategory: ctrlWrapper(addSubcategory),
    getAllCategories: ctrlWrapper(getAllCategories),
    getAllSubcategories: ctrlWrapper(getAllSubcategories),
    getProductByCategory: ctrlWrapper(getProductByCategory),
    getSubcategoryByCategory: ctrlWrapper(getSubcategoryByCategory),
    getProductBySearch: ctrlWrapper(getProductBySearch),
    updateCategoryWithPhoto: ctrlWrapper(updateCategoryWithPhoto),
    updateCategoryWithoutPhoto: ctrlWrapper(updateCategoryWithoutPhoto),
    // updateSubCategory: ctrlWrapper(updateSubCategory),
};