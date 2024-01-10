import { Application, Request, Response } from "express";
import { EmployeeController } from "@/controllers/employeeController";

export class EmployeeRoutes {
  private employeeController: EmployeeController = new EmployeeController();

  public route(app: Application) {
    app.post("/api/employee", (req: Request, res: Response) => {
      this.employeeController.createEmployee(req, res);
    });

    app.get("/api/employees", (req: Request, res: Response) => {
      this.employeeController.getEmployees(req, res);
    });

    app.get("/api/employee/:id", (req: Request, res: Response) => {
      this.employeeController.getEmployee(req, res);
    });

    app.put("/api/employee/:id", (req: Request, res: Response) => {
      this.employeeController.updateEmployee(req, res);
    });

    app.delete("/api/employee/:id", (req: Request, res: Response) => {
      this.employeeController.deleteEmployee(req, res);
    });
  }
}
