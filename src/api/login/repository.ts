import { PoolClient } from "pg";
import bcrypt from "bcrypt";
import { executeQuery, getClient } from "../../helper/db";
import logger from "../../helper/logger";

export class loginRepository {
  public async loginRepoV1(userData: { email: string; password: string }) {
    const client: PoolClient = await getClient();

    try {
      const { email, password } = userData;

      // Fetch user credentials and employee details
      const query = `
        SELECT
          *
        FROM public.employee_credentials ec
        JOIN public.employees e ON e.id = ec."userId"
        WHERE ec.email = $1
      `;

      const result = await executeQuery(query, [email]);

      if (!result.length) {
        return { success: false, message: "Invalid email or password" };
      }

      const user = result[0];

      if (user.isDelete === "Y") {
        return { success: false, message: "User has been deleted" };
      }

      if (user.isActive !== "Y") {
        return { success: false, message: "User is inactive" };
      }

      // Compare password with hashed password
      const isPasswordValid = await bcrypt.compare(
        password,
        user.hashedPassword
      );
      if (!isPasswordValid) {
        return { success: false, message: "Invalid email or password" };
      }

      // Return employee details
      return {
        success: true,
        message: "Login successful",
        data: result,
      };
    } catch (error) {
      logger.error("Login repository error:", error);
      return { success: false, message: "Internal server error" };
    } finally {
      client.release();
    }
  }

  public async addRoleRepoV1(roleData: any) {
    const client: PoolClient = await getClient();
    try {
      const { roleName, createdBy } = roleData;

      if (!roleName) {
        return { success: false, message: "Role name is required" };
      }

      const createdAt = new Date().toISOString();

      const query = `
        INSERT INTO public."UserRoles" 
          ("roleName", "createdAt", "createdBy") 
        VALUES ($1, $2, $3)
        RETURNING *;
      `;

      const result = await executeQuery(query, [
        roleName,
        createdAt,
        createdBy || "System",
      ]);

      return {
        success: true,
        message: "Role added successfully",
        data: result[0],
      };
    } catch (error) {
      logger.error("Repository Error: Add Role", error);
      return { success: false, message: "Internal Server Error" };
    } finally {
      client.release();
    }
  }

  // 🔹 List Roles Repository
  public async listRolesRepoV1() {
    const client: PoolClient = await getClient();
    try {
      const query = `
        SELECT 
          id,
          "roleName",
          "createdAt",
          "createdBy",
          "updatedAt",
          "updatedBy"
        FROM public."UserRoles"
        ORDER BY id ASC;
      `;

      const result = await executeQuery(query, []);

      return {
        success: true,
        message: "Roles fetched successfully",
        data: result,
      };
    } catch (error) {
      logger.error("Repository Error: List Roles", error);
      return { success: false, message: "Internal Server Error" };
    } finally {
      client.release();
    }
  }

  public async updateRoleRepoV1(roleData: any) {
    const client: PoolClient = await getClient();
    try {
      const { id, roleName, updatedBy } = roleData;

      if (!id || !roleName) {
        return {
          success: false,
          message: "Role ID and Role Name are required",
        };
      }

      const updatedAt = new Date().toISOString();

      const query = `
        UPDATE public."UserRoles"
        SET 
          "roleName" = $1,
          "updatedAt" = $2,
          "updatedBy" = $3
        WHERE id = $4
        RETURNING *;
      `;

      const result = await executeQuery(query, [
        roleName,
        updatedAt,
        updatedBy || "System",
        id,
      ]);

      if (!result.length) {
        return { success: false, message: "Role not found or update failed" };
      }

      return {
        success: true,
        message: "Role updated successfully",
        data: result[0],
      };
    } catch (error) {
      logger.error("Repository Error: Update Role", error);
      return { success: false, message: "Internal Server Error" };
    } finally {
      client.release();
    }
  }
}
