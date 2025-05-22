import { Application } from "express";
import AuthRouter from "./api/auth/auth.router";
import JotRouter from "./api/jot/jot.router";

export default class HTTPRouter {
  private readonly authRouter: AuthRouter;
  private readonly jotRouter: JotRouter;

  constructor() {
    this.authRouter = new AuthRouter();
    this.jotRouter = new JotRouter();

  }

  async init(path: string, app: Application) {
    this.authRouter.init(`${path}/auth`, app);
    this.jotRouter.init(`${path}/jot`, app);
  }
}
