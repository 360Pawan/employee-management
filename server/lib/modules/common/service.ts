import { Response } from "express";
import { responseStatusCodes } from "./model";

export function successResponse(message: string, DATA, res: Response) {
  res.status(responseStatusCodes.success).json({
    STATUS: "SUCCESS",
    MESSAGE: message,
    DATA,
  });
}

export function failureResponse(message: string, DATA, res: Response) {
  res.status(responseStatusCodes.success).json({
    STATUS: "FAILURE",
    MESSAGE: message,
    DATA,
  });
}

export function insufficientFields(res: Response, params?: string[]) {
  res.status(responseStatusCodes.badRequest).json({
    STATUS: "FAILURE",
    MESSAGE:
      !!params && params.length >= 1
        ? `Insufficient fields. Missing ${params.join(", ")}`
        : "Insufficient fields",
    DATA: {},
  });
}

export function mongoError(err, res: Response) {
  res.status(responseStatusCodes.internalServerError).json({
    STATUS: "FAILURE",
    MESSAGE: "MongoDB error",
    DATA: err,
  });
}
