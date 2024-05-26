import jimp from "jimp";
import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import { registerSchema, loginSchema } from "../schemas/authSchemas.js";
import HttpError from "../helpers/HttpError.js";
import * as userService from "../services/usersServices.js";

const { SECRET_KEY } = process.env;
const avatarsDir = path.join(process.cwd(), "public", "avatars");

export const register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) throw HttpError(400, error.message);

    const { email, password } = req.body;
    const existingUser = await userService.findUserByEmail(email);

    if (existingUser) {
      throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email, { s: "250", d: "identicon" }, true);

    const user = await userService.createUser({
      ...req.body,
      password: hashPassword,
      avatarURL,
    });

    res.status(201).json({
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) throw HttpError(400, error.message);

    const { email, password } = req.body;
    const user = await userService.findUserByEmail(email);

    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
    await userService.updateUserToken(user._id, token);

    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await userService.updateUserToken(_id, null);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    res.json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    console.log(req.file);
    const { path: tempUpload, originalname } = req.file;
    const { _id } = req.user;
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);

    await jimp
      .read(tempUpload)
      .then((avatar) => avatar.resize(250, 250).write(resultUpload))
      .catch((err) => {
        throw HttpError(500, "Failed to process the image");
      });

    await fs.unlink(tempUpload);
    const avatarURL = `/avatars/${filename}`;
    await userService.updateUserAvatar(_id, avatarURL);

    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};
