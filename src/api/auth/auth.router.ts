import { Router } from "express";
import AuthController from "./auth.controller";
import { asyncErrorHandler } from "../../errors/api/error.handler";

export default class AuthRouter {
  private readonly router: Router;
  private readonly controller: AuthController;

  constructor() {
    this.router = Router();
    this.controller = new AuthController();
  }

  async init(path: string, app: Router) {
    this.attachRouter(path, app);

    this.router.post(
      "/signup",
      asyncErrorHandler(this.controller.signup.bind(this.controller)),
    );
    this.router.post(
      "/login",
      asyncErrorHandler(this.controller.login.bind(this.controller)),
    );

    this.router.get(
      "/status",
      asyncErrorHandler(
        this.controller.authenticationStatus.bind(this.controller),
      ),
    );
  }

  private async attachRouter(path: string, app: Router) {
    app.use(path, this.router);
  }
}
