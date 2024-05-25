import Contact from "../models/Contact.js";

export const listContacts = async (owner) => {
  return await Contact.find({ owner });
};

export const getContactById = async (id) => {
  return await Contact.findById(id);
};

export const removeContact = async (id, owner) => {
  return await Contact.findOneAndRemove({ _id: id, owner });
};

export const addContact = async (body, owner) => {
  return await Contact.create({ ...body, owner });
};

export const updateContact = async (id, body, owner) => {
  return await Contact.findOneAndUpdate({ _id: id, owner }, body, {
    new: true,
  });
};

export const updateContactStatus = async (id, body, owner) => {
  return await Contact.findOneAndUpdate({ _id: id, owner }, body, {
    new: true,
  });
};
