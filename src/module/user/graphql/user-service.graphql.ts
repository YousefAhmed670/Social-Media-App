import { UserRepository } from "../../../DB";
import { isAuthenticatedGraphql, isValidGraphql } from "../../../middleware";
import { cryptPhone, generateHash, NotFoundException } from "../../../utilities";
import {
  getUsersValidation,
  getUserValidation,
  updateUserValidation,
} from "./user-validation.graphql";

const userRepository = new UserRepository();
export const getUser = async (_, args, context) => {
  await isAuthenticatedGraphql(context);
  await isValidGraphql(getUserValidation, args);
  const user = await userRepository.getOne({ _id: args.id });
  if (!user) {
    throw new NotFoundException("User not found");
  }
  return {
    message: "User found successfully",
    success: true,
    data: user,
  };
};

export const getUsers = async (_, args, context) => {
  await isAuthenticatedGraphql(context);
  await isValidGraphql(getUsersValidation, args);
  const users = await userRepository.getAll(
    {},
    {},
    { limit: args.count, skip: (args.page - 1) * args.count }
  );
  if (!users) {
    throw new NotFoundException("Users not found");
  }
  return {
    message: "Users found successfully",
    success: true,
    data: users,
  };
};

export const updateUser = async (_, args, context) => {
  await isAuthenticatedGraphql(context);
  await isValidGraphql(updateUserValidation, args);
  const updateData: any = {};
  if (args.firstName) updateData.firstName = args.firstName;
  if (args.lastName) updateData.lastName = args.lastName;
  if (args.phoneNumber !== undefined) updateData.phoneNumber = cryptPhone(args.phoneNumber);
  if (args.gender) updateData.gender = args.gender;
  const user = await userRepository.update(
    { _id: context.user._id },
    { $set: updateData }
  );
  if (!user) {
    throw new NotFoundException("User not found");
  }
  return {
    message: "User updated successfully",
    success: true,
  };
};

export const deleteUser = async (_, args, context) => {
  await isAuthenticatedGraphql(context);
  const user = await userRepository.delete({ _id: context.user._id });
  if (!user) {
    throw new NotFoundException("User not found");
  }
  return {
    message: "User deleted successfully",
    success: true,
  };
};