import jwt from "jsonwebtoken";
import { Request } from "express";
import { envData } from "../env";
export default function verifyToken(req: Request, token: string) {
  jwt.verify(token, envData.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      throw err;
    }
    req.user = user;
  });
}
