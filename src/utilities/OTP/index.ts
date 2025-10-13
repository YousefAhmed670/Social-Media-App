export const generateOTP = (): string => {
  return Math.floor(Math.random() * 900000 + 100000).toString();
};

export const generateExpiryTime = (minutes: number) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};
