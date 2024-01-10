import * as mongoose from "mongoose";

export interface IEmployee {
  _id?: mongoose.Types.ObjectId;
  name: string;
  contact: string;
  dob: Date;
  salary: number;
  joiningDate: Date;
  relievingDate: Date;
  status: string;
}
