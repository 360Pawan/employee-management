import { IEmployee } from "./model";
import Employees from "./schema";

export default class EmployeeService {
  public async createEmployee(employeeParams: IEmployee) {
    const newEmployee = new Employees(employeeParams);
    const employee = await newEmployee.save();
    return employee;
  }

  public async fetchEmployees() {
    const employees = await Employees.find();
    return employees;
  }

  public async findEmployee(query) {
    const employee = await Employees.findOne(query);
    return employee;
  }

  public async updateEmployee(employeeParams: IEmployee) {
    const query = { _id: employeeParams._id };

    const employee = await Employees.findOneAndUpdate(query, employeeParams, {
      new: true,
      runValidators: true,
    });

    return employee;
  }

  public async deleteEmployee(_id: string) {
    const query = { _id: _id };

    const employee = await Employees.deleteOne(query);

    return employee;
  }
}
