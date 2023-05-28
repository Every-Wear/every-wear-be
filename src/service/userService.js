import User from "../models/user/user.js";
import jwt from "jsonwebtoken";

// create default token
export const makeToken = (id, userType) => {
    return jwt.sign({ id, userType }, process.env.JWT_SECRET, {
        expiresIn: 365 * 24 * 60 * 60,
        issuer: "every-wear"
    });
};

// create refresh token
export const makeRefreshToken = (id, userType) => {
    return jwt.sign({ id, userType }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "180 days",
        issuer: "every-wear"
    });
};

// user id check 
export const findUserById = async (id) => {
    try {
        const user = await User.findOne({ userId: id }).exec();
        return user;
    } catch (err) {
        console.error(err);
        return err;
    }
};

// user pass check 
export const findUserByPwd = async (user, pwd) => {
    try {
        return await user.checkPassword(pwd);
    } catch (err) {
        console.error(err);
        return err;
    }
};

// user create 
export const createUser = async (body) => {
    const { name, userId, password, userType, gender, age } = body;
    try {
        const newUser = new User({
            name: name,
            userId: userId,
            password: password,
            userType: userType,
            gender: gender,
            age: age,
        });

        const saveUser = await newUser.save();
        return saveUser;
    } catch (err) {
        console.error(err);
        return err;
    }
};

// user delete
export const deleteUser = async (body) => {
    const { userId } = body;
    try {
        const {acknowledged, deletedCount} = await User.deleteOne({ userId: userId });
        return deletedCount;
    } catch (err) {
        console.error(err);
        return err;
    }
};

// user delete all
export const deleteUserAll = async () => {
    try {
        const {acknowledged, deletedCount} = await User.deleteMany({});
        return deletedCount;
    } catch (err) {
        console.error(err);
        return err;
    }
};