import { Request, Response } from "express";

import {
  insufficientFields,
  mongoError,
  successResponse,
  failureResponse,
} from "@/modules/common/service";
import EmployeeService from "@/modules/employee/service";
import { IEmployee } from "@/modules/employee/model";
import mongoose from "mongoose";

export class EmployeeController {
  private employeeService: EmployeeService = new EmployeeService();

  public async createEmployee(req: Request, res: Response) {
    const requiredFields = [
      "name",
      "contact",
      "dob",
      "joiningDate",
      "relievingDate",
      "status",
      "salary",
    ];
    const missingFields = requiredFields.filter(
      (field) => !(field in req.body)
    );

    if (missingFields.length === 0) {
      const employeeFilter = { contact: req.body.contact.toLowerCase() };
      const isEmployee = await this.employeeService.findEmployee(
        employeeFilter
      );

      if (isEmployee)
        return failureResponse(
          "Employee with same email already exist.",
          null,
          res
        );

      const { name, contact, dob, joiningDate, relievingDate, status, salary } =
        req.body;

      const employeeParams: IEmployee = {
        name,
        contact,
        dob,
        joiningDate,
        relievingDate,
        status,
        salary,
      };

      try {
        const employee = await this.employeeService.createEmployee(
          employeeParams
        );

        successResponse("Employee is created successfully.", employee, res);
      } catch (error) {
        mongoError(error, res);
      }
    } else {
      insufficientFields(res, missingFields);
    }
  }

  public async getEmployees(req: Request, res: Response) {
    try {
      const employees = await this.employeeService.fetchEmployees();

      if (employees.length === 0)
        return failureResponse("No employee found", null, res);

      successResponse("get employee successful", employees, res);
    } catch (error) {
      mongoError(error, res);
    }
  }

  public async getEmployee(req: Request, res: Response) {
    if (req.params.id) {
      const employeeFilter = { _id: req.params.id };

      try {
        const employee = await this.employeeService.findEmployee(
          employeeFilter
        );

        if (!employee) return failureResponse("invalid employee", null, res);

        successResponse("get employee successful", employee, res);
      } catch (error) {
        mongoError(error, res);
      }
    } else {
      insufficientFields(res);
    }
  }

  public async updateEmployee(req: Request, res: Response) {
    const { ...updatedFields } = req.body;

    if (req.params.id && Object.keys(updatedFields).length >= 1) {
      try {
        const employeeFilter = { _id: req.params.id };
        const employee = await this.employeeService.findEmployee(
          employeeFilter
        );
        const existingEmployee = await this.employeeService.findEmployee({
          contact: req.body.contact.toLowerCase(),
        });

        if (
          existingEmployee &&
          !new mongoose.Types.ObjectId(req.params.id).equals(
            existingEmployee._id
          )
        )
          return failureResponse(
            "Employee with same email already exist.",
            null,
            res
          );

        if (!employee) return failureResponse("invalid employee", null, res);

        const {
          name,
          contact,
          dob,
          joiningDate,
          relievingDate,
          status,
          salary,
        } = req.body;

        const employeeParams: IEmployee = {
          _id: new mongoose.Types.ObjectId(req.params.id),
          name: name ?? employee.name,
          contact: contact.toLowerCase() ?? employee.contact,
          dob: dob ?? employee.dob,
          joiningDate: joiningDate ?? employee.joiningDate,
          relievingDate: relievingDate ?? employee.relievingDate,
          status: status ?? employee.status,
          salary: salary ?? employee.salary,
        };

        try {
          const employee = await this.employeeService.updateEmployee(
            employeeParams
          );

          successResponse("update employee successful", employee, res);
        } catch (error) {
          mongoError(error, res);
        }
      } catch (error) {
        mongoError(error, res);
      }
    } else {
      insufficientFields(res);
    }
  }

  public async deleteEmployee(req: Request, res: Response) {
    if (req.params.id) {
      try {
        const deleteDetails = await this.employeeService.deleteEmployee(
          req.params.id
        );

        if (deleteDetails.deletedCount === 0)
          return failureResponse("Invalid employee", null, res);

        successResponse("delete employee successful", null, res);
      } catch (error) {
        mongoError(error, res);
      }
    } else {
      insufficientFields(res);
    }
  }
}
