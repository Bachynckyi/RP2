const { ctrlWrapper } = require("../utils");
const { UserPet } = require("../models/userPet");
const { User } = require("../models/user");
const { HttpError } = require("../helpers");
const { addUserPetValidation } = require("../models/userPet");

const addUserPet = async (req, res) => {
  const { error } = addUserPetValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  const maxSizeOfAvatar = 3145728;
  if (req.file) {
    if (req.file.size > maxSizeOfAvatar) {
      return res.status(400).json({ message: "Uploaded file is too big" });
    }
    const { namePet } = req.body;
    const nameCheck = await UserPet.findOne({ namePet });
    if (nameCheck) {
      throw HttpError(409, "This pet allready added");
    } else {
      const { _id: ownerPet } = req.user;
      const result = await UserPet.create({
        ...req.body,
        ownerPet,
        petAvatar: req.file.path,
      });
      const data = await UserPet.findById(result._id)
      res.status(201).json(data);
    }
  }
  const { namePet } = req.body;
  const nameCheck = await UserPet.findOne({ namePet });
  if (nameCheck) {
    throw HttpError(409, "This pet allready added");
  } else {
    const { _id: ownerPet } = req.user;
    const result = await UserPet.create({ ...req.body, ownerPet });
    res.status(201).json(result);
  }
};

const deleteUserPet = async (req, res) => {
  console.log(req.user);
  const { _id: ownerPet } = req.user;
  const { _id: userPetId } = req.params;
  const response = await UserPet.findOneAndRemove({ userPetId, ownerPet });
  if (response === null) {
    throw HttpError(404, "Not found");
  } else {
    res.status(200).json({ message: "pet deleted" });
  }
};

const getAllUserPets = async (req, res) => {
  const user = req.user;
  const userInfo = await User.find({ _id: user });

  if (!userInfo) {
    throw HttpError(404, "Not found");
  }
  const userPets = await UserPet.find({ ownerPet: user });
  if (!userPets) {
    throw HttpError(404, "Not found");
  }

  const userWithPets = { userInfo, userPets };

  res.status(200).json(userWithPets);
};

module.exports = {
  addUserPet: ctrlWrapper(addUserPet),
  deleteUserPet: ctrlWrapper(deleteUserPet),
  getAllUserPets: ctrlWrapper(getAllUserPets),
};
