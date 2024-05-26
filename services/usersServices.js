import User from "../models/User.js";

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const createUser = async (userData) => {
  return await User.create(userData);
};

export const updateUserToken = async (userId, token) => {
  return await User.findByIdAndUpdate(userId, { token }, { new: true });
};

export const findUserById = async (userId) => {
  return await User.findById(userId);
};

export const updateUserAvatar = async (userId, avatarURL) => {
  return User.findByIdAndUpdate(userId, { avatarURL }, { new: true });
};
