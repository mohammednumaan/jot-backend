import { Application } from "express";
import AuthRouter from "./api/auth/auth.router";

export default class HTTPRouter {
  private readonly authRouter: AuthRouter;

  constructor() {
    this.authRouter = new AuthRouter();
  }

  async init(path: string, app: Application) {
    this.authRouter.init(`${path}/auth`, app);
  }
}
