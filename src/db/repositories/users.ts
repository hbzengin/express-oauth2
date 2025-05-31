import db from "../index";
import { eq } from "drizzle-orm";

import { NewUser, User, usersTable } from "../schema/users";

export const userRepo = {
  async getById(id: number) : Promise<User | undefined> {
    return db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id))
        .then(([user]) => user);
  },

  async getBySub(sub: string) : Promise<User | undefined> {
    return db
        .select()
        .from(usersTable)
        .where(eq(usersTable.sub, sub))
        .then(([user]) => user);
  },

  async getAll() : Promise<User[]> {
    return db
        .select()
        .from(usersTable);
  },

  async create(user: NewUser) : Promise<User> {
    return db
        .insert(usersTable)
        .values(user)
        .returning()
        .then(([user]) => user);
  },

    async update (id: number, user: Partial<NewUser>) : Promise<User | undefined> {
        return db
            .update(usersTable)
            .set(user)
            .where(eq(usersTable.id, id))
            .returning()
            .then(([user]) => user);
    },

  async delete(id: number) : Promise<User | undefined> {
    return db
        .delete(usersTable)
        .where(eq(usersTable.id, id))
        .returning()
        .then(([user]) => user);
  },
};
