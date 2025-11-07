import { PoolClient } from "pg";
import { getClient } from "../../helper/db";
import logger from "../../helper/logger";

export class packageRepository {
  // Add Package
  // public async addPackageRepoV1(data: { type: string; ref: string }) {
  //   const client: PoolClient = await getClient();
  //   try {
  //     const query = `INSERT INTO public.wedding_packages(type, ref) VALUES($1, $2) RETURNING *`;
  //     const result = await client.query(query, [data.type, data.ref]);
  //     return {
  //       success: true,
  //       message: "Package added successfully",
  //       data: result.rows[0],
  //     };
  //   } catch (error) {
  //     logger.error("Repository Error: Package add", error);
  //     return { success: false, message: "Error adding package" };
  //   } finally {
  //     client.release();
  //   }
  // }

  // // Get all packages
  // public async getPackagesRepoV1() {
  //   const client: PoolClient = await getClient();
  //   try {
  //     const result = await client.query(
  //       `SELECT * FROM public.wedding_packages ORDER BY id ASC`
  //     );
  //     return { success: true, data: result.rows };
  //   } catch (error) {
  //     logger.error("Repository Error: Get Packages", error);
  //     return { success: false, message: "Error fetching packages" };
  //   } finally {
  //     client.release();
  //   }
  // }

  // // Update package
  // public async updatePackageRepoV1(
  //   id: number,
  //   data: { type: string; ref: string }
  // ) {
  //   const client: PoolClient = await getClient();
  //   try {
  //     const query = `UPDATE public.wedding_packages SET type=$1, ref=$2 WHERE id=$3 RETURNING *`;
  //     const result = await client.query(query, [data.type, data.ref, id]);
  //     return {
  //       success: true,
  //       message: "Package updated",
  //       data: result.rows[0],
  //     };
  //   } catch (error) {
  //     logger.error("Repository Error: Update Package", error);
  //     return { success: false, message: "Error updating package" };
  //   } finally {
  //     client.release();
  //   }
  // }

  // // Delete package
  // public async deletePackageRepoV1(id: number) {
  //   const client: PoolClient = await getClient();
  //   try {
  //     await client.query(`DELETE FROM public.wedding_packages WHERE id=$1`, [
  //       id,
  //     ]);
  //     return { success: true, message: "Package deleted" };
  //   } catch (error) {
  //     logger.error("Repository Error: Delete Package", error);
  //     return { success: false, message: "Error deleting package" };
  //   } finally {
  //     client.release();
  //   }
  // }

  public async addAddOnRepoV1(data: any) {
    const client: PoolClient = await getClient();
    try {
      const { description, unit, price, createdBy } = data;
      const createdAt = new Date().toISOString();

      const query = `
        INSERT INTO public.add_ons (description, unit, price, "createdAt", "createdBy", "isDelete")
        VALUES ($1, $2, $3, $4, $5, false)
        RETURNING *;
      `;
      const result = await client.query(query, [
        description,
        unit,
        price,
        createdAt,
        createdBy,
      ]);
      return {
        success: true,
        message: "Add-On added successfully",
        data: result.rows[0],
      };
    } catch (error) {
      logger.error("Repository Error: Add Add-On", error);
      return { success: false, message: "Error adding Add-On" };
    } finally {
      client.release();
    }
  }

  // 📋 Get All Add-Ons
  public async getAddOnsRepoV1() {
    const client: PoolClient = await getClient();
    try {
      const query = `SELECT * FROM public.add_ons WHERE "isDelete" = false ORDER BY id DESC`;
      const result = await client.query(query);
      return { success: true, data: result.rows };
    } catch (error) {
      logger.error("Repository Error: Get Add-Ons", error);
      return { success: false, message: "Error fetching Add-Ons" };
    } finally {
      client.release();
    }
  }

  // 🔍 Get Add-On by ID
  public async getAddOnByIdRepoV1(id: number) {
    const client: PoolClient = await getClient();
    try {
      const query = `SELECT * FROM public.add_ons WHERE id = $1 AND "isDelete" = false`;
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        return { success: false, message: "Add-On not found" };
      }
      return { success: true, data: result.rows[0] };
    } catch (error) {
      logger.error("Repository Error: Get Add-On by ID", error);
      return { success: false, message: "Error fetching Add-On" };
    } finally {
      client.release();
    }
  }

  // ✏️ Update Add-On
  public async updateAddOnRepoV1(id: number, data: any) {
    const client: PoolClient = await getClient();
    try {
      const { description, unit, price, updatedBy } = data;
      const updatedAt = new Date().toISOString();

      const query = `
        UPDATE public.add_ons
        SET description = $1, unit = $2, price = $3, "updatedAt" = $4, "updatedBy" = $5
        WHERE id = $6
        RETURNING *;
      `;
      const result = await client.query(query, [
        description,
        unit,
        price,
        updatedAt,
        updatedBy,
        id,
      ]);

      if (result.rows.length === 0) {
        return { success: false, message: "Add-On not found" };
      }

      return {
        success: true,
        message: "Add-On updated successfully",
        data: result.rows[0],
      };
    } catch (error) {
      logger.error("Repository Error: Update Add-On", error);
      return { success: false, message: "Error updating Add-On" };
    } finally {
      client.release();
    }
  }

  // 🗑️ Soft Delete Add-On
  public async deleteAddOnRepoV1(id: number) {
    const client: PoolClient = await getClient();
    try {
      const query = `UPDATE public.add_ons SET "isDelete" = true WHERE id = $1 RETURNING id`;
      const result = await client.query(query, [id]);

      if (result.rowCount === 0) {
        return { success: false, message: "Add-On not found" };
      }

      return { success: true, message: "Add-On deleted successfully" };
    } catch (error) {
      logger.error("Repository Error: Delete Add-On", error);
      return { success: false, message: "Error deleting Add-On" };
    } finally {
      client.release();
    }
  }

  public async addPackageRepoV1(data: any) {
    const client: PoolClient = await getClient();
    try {
      await client.query("BEGIN");

      const {
        title,
        packageTitle,
        priceTitle,
        price,
        services,
        deliverables,
        addons,
        createdBy,
      } = data;
      const createdAt = new Date().toISOString();

      // 🔹 Insert into packages
      const insertPackageQuery = `
      INSERT INTO public.packages (title, package_title, package_type, price, created_at, "createdBy")
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id;
    `;
      const pkgRes = await client.query(insertPackageQuery, [
        title,
        packageTitle,
        priceTitle,
        price,
        createdAt,
        createdBy,
      ]);
      const packageId = pkgRes.rows[0].id;

      // 🔹 Insert Services
      for (const service of services) {
        await client.query(
          `INSERT INTO public.package_services (package_id, service_name) VALUES ($1, $2)`,
          [packageId, service]
        );
      }

      // 🔹 Insert Deliverables
      for (const deliverable of deliverables) {
        await client.query(
          `INSERT INTO public.package_deliverables (package_id, deliverable_name) VALUES ($1, $2)`,
          [packageId, deliverable]
        );
      }

      // 🔹 Insert Add-ons (if selected)
      if (addons && addons.length > 0) {
        for (const addOnId of addons) {
          await client.query(
            `INSERT INTO public.package_add_ons (package_id, add_on_id) VALUES ($1, $2)`,
            [packageId, addOnId]
          );
        }
      }

      await client.query("COMMIT");

      return {
        success: true,
        message: "Package created successfully",
        data: { id: packageId },
      };
    } catch (error) {
      await client.query("ROLLBACK");
      logger.error("Repository Error: Add Package", error);
      return { success: false, message: "Error creating package" };
    } finally {
      client.release();
    }
  }

  public async getPackagesRepoV1() {
    const client: PoolClient = await getClient();
    try {
      const query = `
      SELECT 
        p.*, 
        array_agg(DISTINCT ps.service_name) AS services,
        array_agg(DISTINCT pd.deliverable_name) AS deliverables,
        array_agg(DISTINCT pa.add_on_id) AS addons
      FROM public.packages p
      LEFT JOIN public.package_services ps ON p.id = ps.package_id
      LEFT JOIN public.package_deliverables pd ON p.id = pd.package_id
      LEFT JOIN public.package_add_ons pa ON p.id = pa.package_id
      GROUP BY p.id
      ORDER BY p.id DESC;
    `;
      const result = await client.query(query);
      return { success: true, data: result.rows };
    } catch (error) {
      logger.error("Repository Error: Get Packages", error);
      return { success: false, message: "Error fetching packages" };
    } finally {
      client.release();
    }
  }

  public async getPackageByIdRepoV1(id: number) {
    const client: PoolClient = await getClient();
    try {
      const query = `
      SELECT 
        p.id,
        p.title,
        p.package_title,
        p.package_type,
        p.price,
        p.created_at,
        p."createdBy",
        p."updatedBy",
        -- 🔹 Aggregate services as array
        COALESCE(
          json_agg(DISTINCT ps.service_name) FILTER (WHERE ps.service_name IS NOT NULL),
          '[]'
        ) AS services,
        -- 🔹 Aggregate deliverables as array
        COALESCE(
          json_agg(DISTINCT pd.deliverable_name) FILTER (WHERE pd.deliverable_name IS NOT NULL),
          '[]'
        ) AS deliverables,
        -- 🔹 Aggregate add-ons with details
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', a.id,
              'description', a.description,
              'unit', a.unit,
              'price', a.price
            )
          ) FILTER (WHERE a.id IS NOT NULL),
          '[]'
        ) AS addons
      FROM public.packages p
      LEFT JOIN public.package_services ps ON p.id = ps.package_id
      LEFT JOIN public.package_deliverables pd ON p.id = pd.package_id
      LEFT JOIN public.package_add_ons pa ON p.id = pa.package_id
      LEFT JOIN public.add_ons a ON pa.add_on_id = a.id
      WHERE p.id = $1
      GROUP BY p.id
    `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        return { success: false, message: "Package not found" };
      }

      return {
        success: true,
        data: result.rows[0],
      };
    } catch (error) {
      logger.error("Repository Error: Get Package By ID", error);
      return { success: false, message: "Error fetching package details" };
    } finally {
      client.release();
    }
  }

  public async deletePackageRepoV1(id: number) {
    const client: PoolClient = await getClient();
    try {
      await client.query("BEGIN");

      await client.query(
        `DELETE FROM public.package_add_ons WHERE package_id = $1`,
        [id]
      );
      await client.query(
        `DELETE FROM public.package_services WHERE package_id = $1`,
        [id]
      );
      await client.query(
        `DELETE FROM public.package_deliverables WHERE package_id = $1`,
        [id]
      );
      await client.query(`DELETE FROM public.packages WHERE id = $1`, [id]);

      await client.query("COMMIT");

      return { success: true, message: "Package deleted successfully" };
    } catch (error) {
      await client.query("ROLLBACK");
      logger.error("Repository Error: Delete Package", error);
      return { success: false, message: "Error deleting package" };
    } finally {
      client.release();
    }
  }
}
