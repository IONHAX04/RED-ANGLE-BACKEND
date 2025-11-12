import * as Hapi from "@hapi/hapi";
import { employeeRepository } from "./repository";
import logger from "../../helper/logger";

export class employeeController {
  public repo = new employeeRepository();

  public addEmployeeControllerV1 = async (
    request: any,
    h: Hapi.ResponseToolkit
  ) => {
    logger.info("Controller: Add Employee");
    try {
      const payload = request.payload;

      const result = await this.repo.addEmployeeRepoV1(payload, null);
      return h.response(result).code(result.success ? 201 : 400);
    } catch (error) {
      logger.error("Controller Error: Add Employee", error);
      return h
        .response({ success: false, message: "Internal Server Error" })
        .code(500);
    }
  };

  public addProfileImgControllerV1 = async (
    request: any,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info(`GET URL REQ => ${request.url.href}`);
    try {
      // const decodedToken = { id: request.plugins.token.id };
      const decodedToken = { id: 1 };
      console.log("decodedToken", decodedToken);
      let entity;

      entity = await this.repo.FoodImgV1(request.payload, decodedToken);

      if (entity.success) {
        return response.response(entity).code(201);
      }
      return response.response(entity).code(200);
    } catch (error) {
      logger.error(`GET URL REQ => ${request.url.href}`, error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        })
        .code(500);
    }
  };

  public uploadProfileImageControllerV1 = async (
    request: any,
    response: Hapi.ResponseToolkit
  ) => {
    try {
      const decodedToken = { id: 1 }; // Replace with token logic later
      const file = request.payload.profileImage;

      if (!file) {
        return response
          .response({ success: false, message: "No file uploaded" })
          .code(400);
      }

      const entity = await this.repo.storeProfileImage(file, decodedToken);

      if (entity.success) return response.response(entity).code(201);
      return response.response(entity).code(200);
    } catch (error) {
      console.error("Error uploading profile image:", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error ? error.message : "Unknown error occurred",
        })
        .code(500);
    }
  };

  public uploadAadharCardControllerV1 = async (
    request: any,
    response: Hapi.ResponseToolkit
  ) => {
    try {
      const decodedToken = { id: 1 };
      const file = request.payload.aadharCard;

      if (!file) {
        return response
          .response({ success: false, message: "No file uploaded" })
          .code(400);
      }

      const entity = await this.repo.storeAadharCard(file, decodedToken);

      if (entity.success) return response.response(entity).code(201);
      return response.response(entity).code(200);
    } catch (error) {
      console.error("Error uploading Aadhaar card:", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error ? error.message : "Unknown error occurred",
        })
        .code(500);
    }
  };

  public getAllEmployeesController = async (
    _req: any,
    h: Hapi.ResponseToolkit
  ) => {
    logger.info("Controller: Get All Employees");
    const result = await this.repo.getAllEmployees();
    return h.response(result).code(result.success ? 200 : 500);
  };

  public getEmployeeByIdController = async (
    req: any,
    h: Hapi.ResponseToolkit
  ) => {
    const id = Number(req.params.id);
    logger.info(`Controller: Get Employee by ID ${id}`);
    const result = await this.repo.getEmployeeById(id);
    return h.response(result).code(result.success ? 200 : 404);
  };

  public updateEmployeeController = async (
    request: any,
    h: Hapi.ResponseToolkit
  ) => {
    logger.info("Controller: Update Employee");
    try {
      const id = Number(request.params.id);
      const payload = request.payload;
      const result = await this.repo.updateEmployeeRepoV1(id, payload);
      return h.response(result).code(result.success ? 200 : 400);
    } catch (error) {
      logger.error("Controller Error: Update Employee", error);
      return h
        .response({ success: false, message: "Internal Server Error" })
        .code(500);
    }
  };

  public deleteEmployeeController = async (
    req: any,
    h: Hapi.ResponseToolkit
  ) => {
    const id = Number(req.params.id);
    logger.info(`Controller: Delete Employee ID ${id}`);
    const result = await this.repo.deleteEmployee(id);
    return h.response(result).code(result.success ? 200 : 400);
  };
}
