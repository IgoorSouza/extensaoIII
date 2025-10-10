import type { User } from "./user";

export interface AuthData {
  user: User;
  token: string;
}
