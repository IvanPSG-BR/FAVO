import { HttpErrorNames } from "@fastify/sensible";

export default interface AppErrorType {
  name: HttpErrorNames,
  message: string,
  type: ERROR_TAGS,
  identifierCode: string
}

export enum ERROR_TAGS {
  APP = "AppLogicError",
  STARDEW_VALLEY = "StardewValleyLogicError",
  DATABASE = "DatabaseError",
  UNKNOWN = "UnknownError"
}
