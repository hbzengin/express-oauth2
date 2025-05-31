import { User } from "../../db/schema/users";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
