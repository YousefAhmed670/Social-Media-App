import { UserRepository } from "../../../DB";
import { isAuthenticatedGraphql, isValidGraphql } from "../../../middleware";
import { NotFoundException } from "../../../utilities";
import {
  getUsersValidation,
  getUserValidation,
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
