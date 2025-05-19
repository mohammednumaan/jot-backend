import jwt from "jsonwebtoken";
import { Request } from "express";
import { envData } from "../env";
import { UnauthorizedError } from "../errors/api/error";
export default function verifyToken(req: Request, token: string) {
  jwt.verify(token, envData.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      throw new UnauthorizedError(err.message);
    }
    req.user = user;
  });
}
