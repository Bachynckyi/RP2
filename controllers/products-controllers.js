const { ctrlWrapper } = require("../utils");
const { Product } = require("../models/product");
const { Category } = require("../models/category");
const { Subcategory } = require("../models/subcategory");
const { Slider } = require("../models/slider");
const { HttpError } = require("../helpers");
const { addProductValidation } = require("../models/product");
const { addCategoryValidation} = require("../models/category");
const { addSubcategoryValidation} = require("../models/subcategory");
const cloudinary = require("cloudinary").v2;

const { API_KEY, CLOUD_NAME, API_SECRET } = process.env;

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
  });

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
  // Delete an old image
  const resultCategory = await Category.find({_id: id});
  const categoryPublicId = resultCategory[0].photoCategory.split("/").pop().split(".")[0];
  await cloudinary.uploader.destroy(categoryPublicId);
  // Update category 
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

const updateSubcategoryWithPhoto = async (req, res) => {
  const { id } = req.params;
  // Delete an old image
  const resultSubcategory = await Subcategory.find({_id: id});
  const subcategoryPublicId = resultSubcategory[0].photoSubcategory.split("/").pop().split(".")[0];
  await cloudinary.uploader.destroy(subcategoryPublicId);
  // Update subcategory
  const result = await Subcategory.findByIdAndUpdate(id, {...req.body, photoSubcategory: req.file.path}, { new: true });
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.json(result);
};

const updateSubcategoryWithoutPhoto = async (req, res) => {
  const { id } = req.params;
  const result = await Subcategory.findByIdAndUpdate(id, {...req.body}, { new: true });
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.json(result);
};

const getProductById = async (req, res) => {
  const result = await Product.find({_id: req.params.id});
  if (!result) {
    throw HttpError(404, "Not Found");
  }
  res.json(result);
};

const deleteCategory = async (req, res) => {

// Category delete from cloud and database
    const id = req.params.id;
    const resultCategory = await Category.find({_id: id});

    if (resultCategory.length === 0) {
      throw HttpError(404, "Not Found")
    }
    else {
      const categoryPublicId = resultCategory[0].photoCategory.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(categoryPublicId);
      await Category.findOneAndRemove({_id: id});

// Subcategory delete from cloud and database
    const category = resultCategory[0].category;
    const resultSubcategories = await Subcategory.find({category: category});

    if(resultSubcategories.length === 0) {
      const resultProducts = await Product.find({category: category})

// if category don't have a subcategories, will found products without subcategory
      const productPublicId = resultProducts.map((item) => {
        return (item.photo.split("/").pop().split(".")[0])});
        for (const publicId of productPublicId) {
          await cloudinary.uploader.destroy(publicId)};

        const productId = resultProducts.map((item) => {
          return (item._id)});
        for (const id of productId) {
          await Product.findOneAndRemove({_id: id});};
      res.status(200).json("All items have been deleted")
    }
    else {
      const subcategoryPublicId = resultSubcategories.map((item) => {
        return (item.photoSubcategory.split("/").pop().split(".")[0])});

      for (const publicId of subcategoryPublicId) {
        await cloudinary.uploader.destroy(publicId);};
      
      const subcategoryId = resultSubcategories.map((item) => {
        return (item._id)});
      
        for (const id of subcategoryId) {
          await Subcategory.findOneAndRemove({_id: id});};

// Product delete from cloud and database
      const subcategoryName = resultSubcategories.map((item) => {
        return (item.subcategory)});

      for (const subcategory of subcategoryName) {
        const resultProducts = await Product.find({subcategory: subcategory})
        if(resultProducts.length === 0){
          res.status(200).json("Zero products")
        }
        else {
          const productPublicId = resultProducts.map((item) => {
            return (item.photo.split("/").pop().split(".")[0])});
            
            for (const publicId of productPublicId) {
              await cloudinary.uploader.destroy(publicId)};

            const productId = resultProducts.map((item) => {
              return (item._id)});

            for (const id of productId) {
              await Product.findOneAndRemove({_id: id});};
            res.status(200).json("Zero products")
        }
      };
    }
  }
};

const deleteSubcategory = async (req, res) => {
      const id = req.params.id;
  // Subcategory delete from cloud and database
      const resultSubcategory = await Subcategory.find({_id: id});
      if(resultSubcategory.length === 0) {
        throw HttpError(404, "Not Found")
      }
      else {
        const subcategoryPublicId = resultSubcategory[0].photoSubcategory.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(subcategoryPublicId);
        await Subcategory.findOneAndRemove({_id: id});
  
  // Product delete from cloud and database
        const subcategory = resultSubcategory[0].subcategory;
        const resultProducts = await Product.find({subcategory: subcategory})
        if(resultProducts.length === 0) {
          res.status(200).json("Zero products")
        }
        else {
          const productPublicId = resultProducts.map((item) => {
            return (item.photo.split("/").pop().split(".")[0])});
            
          for (const publicId of productPublicId) {
            await cloudinary.uploader.destroy(publicId)};

          const productId = resultProducts.map((item) => {
            return (item._id)});

          for (const id of productId) {
            await Product.findOneAndRemove({_id: id});};

          res.status(200).json("Zero products")
      };
    }
};

const deleteProduct = async (req, res) => {
  const id = req.params.id;

    const resultProducts = await Product.find({_id: id})
    if(resultProducts.length === 0) {
      throw HttpError(404, "Not Found")
    }
    else {
      const productPublicId = resultProducts[0].photo.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(productPublicId)
        await Product.findOneAndRemove({_id: id});
        res.status(200).json("Deleted")
      };
};

const updateProductWithPhoto = async (req, res) => {
  const { id } = req.params;
  // Delete an old image
  const resultProduct = await Product.find({_id: id});
  const productPublicId = resultProduct[0].photo.split("/").pop().split(".")[0];
  await cloudinary.uploader.destroy(productPublicId);
  // Update product
  const result = await Product.findByIdAndUpdate(id, {...req.body, photo: req.file.path}, { new: true });
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.json(result);
};

const updateProductWithoutPhoto = async (req, res) => {
  const { id } = req.params;
  const result = await Product.findByIdAndUpdate(id, {...req.body}, { new: true });
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.json(result);
};

const addPhotoSlider = async (req, res) => {
  const result = await Slider.create({photoSlider: req.file.path});
  res.status(201).json(result)
};

const deletePhotoSlider = async (req, res) => {
  const id = req.params.id;
  const resultSliderPhoto = await Slider.find({_id: id})
  if(resultSliderPhoto.length === 0) {
    throw HttpError(404, "Not Found")
  }
  else {
    const SliderPublicId = resultSliderPhoto[0].photoSlider.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(SliderPublicId)
      await Slider.findOneAndRemove({_id: id});
      res.status(200).json("Deleted")
    };
};

const getAllPhotoSlider = async (req, res) => {
  const result = await Slider.find()
  if (!result) {
    throw HttpError(404, "Not Found");
  }
  res.json(result);
};

const updateStatusCategory = async (req, res) => {
  // Category change status of active
      const id = req.params.id;
      const resultCategory = await Category.find({_id: id});
  
      if (resultCategory.length === 0) {
        throw HttpError(404, "Not Found")
      }
      else {
        await Category.findByIdAndUpdate(id, {...req.body});
        const category = resultCategory[0].category;
        const resultSubcategories = await Subcategory.find({category: category});
    // if category don't have a subcategories, will found products without subcategory
        if(resultSubcategories.length === 0) {
          const resultProducts = await Product.find({category: category})
          const productId = resultProducts.map((item) => {
            return (item._id)});
          for (const id of productId) {
            await Product.findByIdAndUpdate(id, {...req.body})};
          res.status(200).json("All items have been updated")
        }
        else {
          const subcategoryId = resultSubcategories.map((item) => {
            return (item._id)});
          
            for (const id of subcategoryId) {
              await Subcategory.findByIdAndUpdate(id, {...req.body})};
    
    // Product change status active
          const subcategoryName = resultSubcategories.map((item) => {
            return (item.subcategory)});
    
          for (const subcategory of subcategoryName) {
            const resultProducts = await Product.find({subcategory: subcategory})
            if(resultProducts.length === 0){
              res.status(200).json("Zero products")
            }
            else {
                const productId = resultProducts.map((item) => {
                  return (item._id)});
    
                for (const id of productId) {
                  await Product.findByIdAndUpdate(id, {...req.body})};
                res.status(200).json("Zero products")
            }
          };
        }
    } 
};

const updateStatusSubcategory = async (req, res) => {
  const id = req.params.id;
  // Subcategory change status active
      const resultSubcategory = await Subcategory.find({_id: id});
      if(resultSubcategory.length === 0) {
        throw HttpError(404, "Not Found")
      }
      else {
        await Subcategory.findByIdAndUpdate(id, {...req.body});
  
  // Product change status active
        const subcategory = resultSubcategory[0].subcategory;
        const resultProducts = await Product.find({subcategory: subcategory})
        if(resultProducts.length === 0) {
          res.status(200).json("Zero products")
        }
        else {
          const productId = resultProducts.map((item) => {
            return (item._id)});

          for (const id of productId) {
            await Product.findByIdAndUpdate(id, {...req.body});};

          res.status(200).json("Zero products")
      };
    }
};

const updateStatusProduct = async (req, res) => {
  const id = req.params.id;

  const resultProducts = await Product.find({_id: id})
  if(resultProducts.length === 0) {
    throw HttpError(404, "Not Found")
  }
  else {
      await Product.findByIdAndUpdate(id, {...req.body});
      res.status(200).json("Updated")
    };
};

const updateTopProduct = async (req, res) => {
  const id = req.params.id;

  const resultProducts = await Product.find({_id: id})
  if(resultProducts.length === 0) {
    throw HttpError(404, "Not Found")
  }
  else {
      await Product.findByIdAndUpdate(id, {...req.body});
      res.status(200).json("Deleted")
    };
};


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
    updateSubcategoryWithPhoto: ctrlWrapper(updateSubcategoryWithPhoto),
    updateSubcategoryWithoutPhoto: ctrlWrapper(updateSubcategoryWithoutPhoto),
    getProductById: ctrlWrapper(getProductById),
    deleteCategory: ctrlWrapper(deleteCategory),
    deleteSubcategory: ctrlWrapper(deleteSubcategory),
    deleteProduct: ctrlWrapper(deleteProduct),
    updateProductWithPhoto: ctrlWrapper(updateProductWithPhoto),
    updateProductWithoutPhoto: ctrlWrapper(updateProductWithoutPhoto),
    addPhotoSlider: ctrlWrapper(addPhotoSlider),
    deletePhotoSlider: ctrlWrapper(deletePhotoSlider),
    getAllPhotoSlider: ctrlWrapper(getAllPhotoSlider),
    updateStatusCategory: ctrlWrapper(updateStatusCategory),
    updateStatusSubcategory: ctrlWrapper(updateStatusSubcategory),
    updateStatusProduct: ctrlWrapper(updateStatusProduct),
    updateTopProduct: ctrlWrapper(updateTopProduct),
};