import { JotDatabase } from "./jot.db";
import { JotGroupDatabase } from "./jot_group.db";
import { IDatabases } from "./types";
import { UserDatabase } from "./user.db";

export class Databases implements IDatabases {
  readonly user;
  readonly jots;
  readonly jotGroups;

  constructor() {
    this.user = new UserDatabase();
    this.jots = new JotDatabase();
    this.jotGroups = new JotGroupDatabase();
  }
}
