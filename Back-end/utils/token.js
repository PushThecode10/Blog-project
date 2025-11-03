import jwt from "jsonwebtoken";

export const generateToken = (userId, secret, expiresIn) => {
  return jwt.sign({ id: userId }, secret, { expiresIn });
};
