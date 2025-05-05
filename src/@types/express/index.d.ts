import { AccessTokenPayloadType } from "../api/auth/auth.types";

declare global {
  namespace Express {
    export interface Request {
      user: AccessTokenPayloadType;
    }
  }
}
