import bcryptJS from "bcryptjs";
export const generateHash = async (password: string) => {
  return await bcryptJS.hash(password, 10);
};

export const compareHash = async (password: string, hash: string) => {
  return await bcryptJS.compare(password, hash);
};
