import IRoute from "../../helper/iroute";
import { packageController } from "./controller";

export class packageRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    const controller = new packageController();
    server.route([
      {
        method: "POST",
        path: "/api/v1/package/add",
        handler: controller.addPackageControllerV1,
        config: { auth: false },
      },
      {
        method: "GET",
        path: "/api/v1/package/list",
        handler: controller.getPackagesControllerV1,
        config: { auth: false },
      },
      {
        method: "PUT",
        path: "/api/v1/package/update/{id}",
        handler: controller.updatePackageControllerV1,
        config: { auth: false },
      },
      {
        method: "DELETE",
        path: "/api/v1/package/delete/{id}",
        handler: controller.deletePackageControllerV1,
        config: { auth: false },
      },

      // ADD ONS
      {
        method: "POST",
        path: "/api/v1/addons/add",
        handler: controller.addAddOnControllerV1,
        config: { auth: false },
      },
      {
        method: "GET",
        path: "/api/v1/addons/list",
        handler: controller.getAddOnsControllerV1,
        config: { auth: false },
      },
      {
        method: "GET",
        path: "/api/v1/addons/{id}",
        handler: controller.getAddOnByIdControllerV1,
        config: { auth: false },
      },
      {
        method: "PUT",
        path: "/api/v1/addons/update/{id}",
        handler: controller.updateAddOnControllerV1,
        config: { auth: false },
      },
      {
        method: "DELETE",
        path: "/api/v1/addons/delete/{id}",
        handler: controller.deleteAddOnControllerV1,
        config: { auth: false },
      },

      // PACKAGES
    ]);
  }
}
