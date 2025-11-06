import * as Hapi from "@hapi/hapi";
import { loginRepository } from "./repository";
import logger from "../../helper/logger";

export class loginController {
  public repo = new loginRepository();

  public loginDataV1 = async (request: any, h: Hapi.ResponseToolkit) => {
    logger.info("Controller: Login Cont");
    try {
      const result = await this.repo.loginRepoV1(request.payload);
      return h.response(result).code(result.success ? 201 : 400);
    } catch (error) {
      logger.error("Controller Error: Add Employee", error);
      return h
        .response({ success: false, message: "Internal Server Error" })
        .code(500);
    }
  };

  public addRoleV1 = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    logger.info("Controller: Add Role");
    try {
      const result = await this.repo.addRoleRepoV1(request.payload);
      return h.response(result).code(result.success ? 201 : 400);
    } catch (error) {
      logger.error("Controller Error: Add Role", error);
      return h
        .response({ success: false, message: "Internal Server Error" })
        .code(500);
    }
  };

  // 🔹 List Roles
  public listRolesV1 = async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ) => {
    logger.info("Controller: List Roles");
    try {
      const result = await this.repo.listRolesRepoV1();
      return h.response(result).code(result.success ? 200 : 400);
    } catch (error) {
      logger.error("Controller Error: List Roles", error);
      return h
        .response({ success: false, message: "Internal Server Error" })
        .code(500);
    }
  };

  public updateRoleV1 = async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ) => {
    logger.info("Controller: Update Role");
    try {
      const result = await this.repo.updateRoleRepoV1(request.payload);
      return h.response(result).code(result.success ? 200 : 400);
    } catch (error) {
      logger.error("Controller Error: Update Role", error);
      return h
        .response({ success: false, message: "Internal Server Error" })
        .code(500);
    }
  };
}
