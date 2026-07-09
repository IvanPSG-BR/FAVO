import { HttpErrorCodes } from "@fastify/sensible";
import AppErrorType from "./dto/default-error.interface.js";

export default class AppError extends Error {
  public readonly name
  public readonly type
  public readonly identifierCode
  public readonly status

  constructor(status: HttpErrorCodes, data: AppErrorType) {
    super(data.message)
    this.name = data.name
    this.type = data.type
    this.identifierCode = data.identifierCode
    this.status = status
  }
}
