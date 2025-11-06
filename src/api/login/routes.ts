import IRoute from "../../helper/iroute";
import { loginController } from "./controller";

export class loginRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    const controller = new loginController();
    server.route([
      {
        method: "POST",
        path: "/api/v1/routes/login",
        handler: controller.loginDataV1,
        config: { auth: false },
      },
      {
        method: "POST",
        path: "/api/v1/roles/add",
        handler: controller.addRoleV1,
        config: { auth: false },
      },
      {
        method: "GET",
        path: "/api/v1/roles/list",
        handler: controller.listRolesV1,
        config: { auth: false },
      },
      {
        method: "PUT",
        path: "/api/v1/roles/update",
        handler: controller.updateRoleV1,
        config: { auth: false },
      },
    ]);
  }
}
