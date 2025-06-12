import { Application } from "express";
import AuthRouter from "./api/auth/auth.router";
import JotRouter from "./api/jot/jot.router";
import UserRouter from "./api/user/user.router";

export default class HTTPRouter {
  private readonly authRouter: AuthRouter;
  private readonly jotRouter: JotRouter;
  private readonly userRouter: UserRouter;

  constructor() {
    this.authRouter = new AuthRouter();
    this.jotRouter = new JotRouter();
    this.userRouter = new UserRouter();
  }

  async init(path: string, app: Application) {
    this.authRouter.init(`${path}/auth`, app);
    this.jotRouter.init(`${path}/jots`, app);
    this.userRouter.init(`${path}/user`, app);
  }
}
