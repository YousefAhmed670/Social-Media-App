"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUsers = exports.getUser = void 0;
const DB_1 = require("../../../DB");
const middleware_1 = require("../../../middleware");
const utilities_1 = require("../../../utilities");
const user_validation_graphql_1 = require("./user-validation.graphql");
const userRepository = new DB_1.UserRepository();
const getUser = async (_, args, context) => {
    await (0, middleware_1.isAuthenticatedGraphql)(context);
    await (0, middleware_1.isValidGraphql)(user_validation_graphql_1.getUserValidation, args);
    const user = await userRepository.getOne({ _id: args.id });
    if (!user) {
        throw new utilities_1.NotFoundException("User not found");
    }
    return {
        message: "User found successfully",
        success: true,
        data: user,
    };
};
exports.getUser = getUser;
const getUsers = async (_, args, context) => {
    await (0, middleware_1.isAuthenticatedGraphql)(context);
    await (0, middleware_1.isValidGraphql)(user_validation_graphql_1.getUsersValidation, args);
    const users = await userRepository.getAll({}, {}, { limit: args.count, skip: (args.page - 1) * args.count });
    if (!users) {
        throw new utilities_1.NotFoundException("Users not found");
    }
    return {
        message: "Users found successfully",
        success: true,
        data: users,
    };
};
exports.getUsers = getUsers;
const updateUser = async (_, args, context) => {
    await (0, middleware_1.isAuthenticatedGraphql)(context);
    await (0, middleware_1.isValidGraphql)(user_validation_graphql_1.updateUserValidation, args);
    const updateData = {};
    if (args.firstName)
        updateData.firstName = args.firstName;
    if (args.lastName)
        updateData.lastName = args.lastName;
    if (args.phoneNumber !== undefined)
        updateData.phoneNumber = (0, utilities_1.cryptPhone)(args.phoneNumber);
    if (args.gender)
        updateData.gender = args.gender;
    const user = await userRepository.update({ _id: context.user._id }, { $set: updateData });
    if (!user) {
        throw new utilities_1.NotFoundException("User not found");
    }
    return {
        message: "User updated successfully",
        success: true,
    };
};
exports.updateUser = updateUser;
const deleteUser = async (_, args, context) => {
    await (0, middleware_1.isAuthenticatedGraphql)(context);
    const user = await userRepository.delete({ _id: context.user._id });
    if (!user) {
        throw new utilities_1.NotFoundException("User not found");
    }
    return {
        message: "User deleted successfully",
        success: true,
    };
};
exports.deleteUser = deleteUser;
