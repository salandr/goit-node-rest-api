import mongoose from "mongoose";
import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
  updateStatusSchema,
} from "../schemas/contactsSchemas.js";
import * as contactsService from "../services/contactsServices.js";

const { isValidObjectId } = mongoose;

export const getAllContacts = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const result = await contactsService.listContacts(owner);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      throw HttpError(400, "Invalid ID format");
    }
    const result = await contactsService.getContactById(id);
    if (!result) {
      throw HttpError(404);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw HttpError(400, "Invalid ID format");
    }
    const result = await contactsService.removeContact(id);
    if (!result) {
      throw HttpError(404);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) throw HttpError(400, error.message);

    const { _id: owner } = req.user;
    const result = await contactsService.addContact(req.body, owner);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw HttpError(400, "Invalid ID format");
    }

    const { error } = updateContactSchema.validate(req.body);
    if (error) throw HttpError(400, error.message);

    if (Object.keys(req.body).length === 0) {
      throw HttpError(400, "Body must have at least one field");
    }

    const { favorite, ...updateBody } = req.body;

    const result = await contactsService.updateContact(id, updateBody);
    if (!result) {
      throw HttpError(404);
    }

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      throw HttpError(400, "Invalid ID format");
    }
    const { error } = updateStatusSchema.validate(req.body);
    if (error) throw HttpError(400, error.message);

    const result = await contactsService.updateContactStatus(id, req.body);

    if (!result) {
      throw HttpError(404, "Contact not found");
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};
