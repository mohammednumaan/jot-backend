import { NextFunction, Request, Response, Router } from "express";
import JotController from "./jot.controller";
import { asyncErrorHandler } from "../../errors/api/error.handler";
import verifyToken from "../../utils/verify_token.utils";

export default class JotRouter {
  private readonly router: Router;
  private readonly controller: JotController;

  constructor() {
    this.router = Router();
    this.controller = new JotController();
  }

  async init(path: string, app: Router) {
    this.attachRouter(path, app);

    this.router.use(
      asyncErrorHandler((req: Request, res: Response, next: NextFunction) => {
        verifyToken(req, req.cookies["jot_access_token"]);
        next();
      }),
    );

    this.router.get(
      "/",
      asyncErrorHandler(this.controller.getAll.bind(this.controller)),
    );

    this.router.post(
      "/create",
      asyncErrorHandler(this.controller.create.bind(this.controller)),
    );
  }
  private async attachRouter(path: string, app: Router) {
    app.use(path, this.router);
  }
}
