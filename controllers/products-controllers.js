const { ctrlWrapper } = require("../utils");
const { Product } = require("../models/product");
const { Category } = require("../models/category");
const { Subcategory } = require("../models/subcategory");
const { HttpError } = require("../helpers");
const { User } = require("../models/user");
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
  const result = await Product.find({category: category});
  res.status(200).json(result)
};

const getSubcategoryByCategory = async (req, res) => {
  const {category: categoryProduct} = req.query;
  const result = await Subcategory.find({category: categoryProduct})
  if (!result) {
    throw HttpError(404, "Not Found");
  }
  res.json(result);
};

const getСategory = async (req, res) => {
  const {routeCategory: category} = req.query;
  const result = await Category.find({routeCategory: category})
  if (!result) {
    throw HttpError(404, "Not Found");
  }
  res.json(result);
};





























const getNoticeById = async (req, res) => {
  const {id: idNotice} = req.params;
  const result = await Product.findById(idNotice)
  if (!result) {
    throw HttpError(404, "Not Found");
  }
  res.json(result);
};

const getNoticesСreatedByUser = async (req, res) => {
  const {id: ownerNotice} = req.user;
  const result = await Product.find({ownerNotice: ownerNotice});
  if (JSON.stringify(result) === "[]") {
    res.status(200).json([]);
  }
  else{
    res.status(200).json(result);
  }
};

const deleteNoticeCreatedByUser = async (req, res) => {
  const { id: idNotice} = req.params;
  const { id: ownerNotice} = req.user;
  const response = await Product.findOneAndRemove({_id: idNotice, ownerNotice: ownerNotice});
  console.log(response);
  if(response === null){
    throw HttpError(404, "Not Found");
  }
  else {
  res.status(200).json({"message": "contact deleted"});
  };
};

const getNoticesBySearchOrCategory = async (req, res) => {
  const { search: titleNotice, category: categoryNotice } = req.query;
  const {page, limit} = req.query;
  const skip = (page - 1 ) * limit; 
  if(titleNotice && !categoryNotice) {
    const result = await Product.find({ title: { $regex: titleNotice, $options: 'i' }}, "", {skip, limit});
    if(JSON.stringify(result) === "[]") {
      res.status(200).json([]);
    }
    res.status(200).json(result);
  }
  else if(categoryNotice && !titleNotice) {
    const result = await Product.find({category: categoryNotice}, "", {skip, limit});
    if(JSON.stringify(result) === "[]") {
      res.status(200).json([]);
      }
      res.status(200).json(result);
  }
  else if(titleNotice && categoryNotice) {
    const result = await Product.find({category: categoryNotice, title: { $regex: titleNotice, $options: 'i' }}, "", {skip, limit});
    if(JSON.stringify(result) === "[]") {
      res.status(200).json([]);
      }
      res.status(200).json(result);
  }
  else if(!titleNotice && !categoryNotice) {
    throw HttpError(404, "Not Found");
  };
};

const addNoticeToFavorite = async (req, res) => {
  const { id: idNotice} = req.params;
  const { _id } = req.user;
  const idNoticeCheck = await Product.findById(idNotice);
    if (!idNoticeCheck) {
    throw HttpError(404, `Not found`);
  }
  const favoriteCheck = await User.find({_id: _id, favorite: idNotice});
  if(Object.keys(favoriteCheck).length === 0){
    await User.findByIdAndUpdate(_id, {$push: { favorite: idNotice }});
    const result = await User.findById(_id)
    res.status(201).json(result);
  }
  else{
    throw HttpError(409, "This notice is already added to favorite");
  }

};

const getNoticesAddedToFavoriteByUser = async (req, res) => {
  const { _id } = req.user;
  const result = await User.findById({_id});
  if (!result) {
    throw HttpError(404, `Not found`);
  };
  const allFavoriteNotices = result.favorite;
  const data = [];
  for (let i = 0; i < allFavoriteNotices.length; i++) {
    const currentNotice = allFavoriteNotices[i];
    const getNoticeById = await Product.findById({_id: currentNotice});
    data.push(getNoticeById);
  };
  res.status(200).json(data);
};

const deleteNoticeFromFavorite = async (req, res) => {
  const { id: idNotice} = req.params;
  const { _id } = req.user;
  const result = await User.findById({_id});
  const favoriteData = result.favorite;
  if(!favoriteData.includes(idNotice)){
    throw HttpError(404, `Not found`);
  }
  await User.findByIdAndUpdate(_id, {$pull: { favorite: idNotice }});
  const updatedFavoriteData = await User.findById({_id});
  res.status(200).json(updatedFavoriteData)
};

module.exports = {
    addProduct: ctrlWrapper(addProduct),
    addCategory: ctrlWrapper(addCategory),
    addSubcategory: ctrlWrapper(addSubcategory),
    getAllCategories: ctrlWrapper(getAllCategories),
    getAllSubcategories: ctrlWrapper(getAllSubcategories),
    getProductByCategory: ctrlWrapper(getProductByCategory),
    getSubcategoryByCategory: ctrlWrapper(getSubcategoryByCategory),
    getСategory: ctrlWrapper(getСategory),

    getNoticesBySearchOrCategory: ctrlWrapper(getNoticesBySearchOrCategory),
    getNoticeById: ctrlWrapper(getNoticeById),
    getNoticesСreatedByUser: ctrlWrapper(getNoticesСreatedByUser),
    deleteNoticeCreatedByUser: ctrlWrapper(deleteNoticeCreatedByUser),
    addNoticeToFavorite: ctrlWrapper(addNoticeToFavorite),
    getNoticesAddedToFavoriteByUser: ctrlWrapper(getNoticesAddedToFavoriteByUser),
    deleteNoticeFromFavorite: ctrlWrapper(deleteNoticeFromFavorite),
};