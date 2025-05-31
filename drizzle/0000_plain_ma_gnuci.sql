CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"sub" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"picture" varchar(255),
	"access_token" text NOT NULL,
	"refresh_token" text NOT NULL,
	"expiry_date" bigint NOT NULL,
	CONSTRAINT "users_sub_unique" UNIQUE("sub"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
