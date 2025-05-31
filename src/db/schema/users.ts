import { bigint, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial().primaryKey(),
  sub: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  picture: varchar({ length: 255 }),

  /* Token stuff */
  access_token: text().notNull(),
  refresh_token: text().notNull(),
  expiry_date: bigint({ mode: "number" }).notNull(),
});

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
export type PublicUser = Pick<User, "id" | "name" | "email" | "picture">;

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    picture: user.picture,
  };
}
