import { NextFunction, Request, Response, Router } from "express";
import { asyncErrorHandler } from "../../errors/api/error.handler";
import verifyToken from "../../utils/verify_token.utils";
import { UserController } from "./user.controller";

export default class UserRouter {
  private readonly router: Router;
  private readonly controller: UserController;

  constructor() {
    this.router = Router();
    this.controller = new UserController();
  }

  async init(path: string, app: Router) {
    this.attachRouter(path, app);

    this.router.use(
      asyncErrorHandler((req: Request, res: Response, next: NextFunction) => {
        verifyToken(req, req.cookies["jot_access_token"]);
        next();
      })
    );

    this.router.get(
      "/:name/:jotGroupId",
      asyncErrorHandler(this.controller.getJotGroup.bind(this.controller))
    );
  }
  private async attachRouter(path: string, app: Router) {
    app.use(path, this.router);
  }
}
