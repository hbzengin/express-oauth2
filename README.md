# Express.js Backend with Google OAuth 2.0

I have been meaning to learn how to build OAuth2 authentication using Google as the provider. The code on this project is a basic implementation that uses Express.js as the backend framework, Drizzle as the ORM, a Postgres database for storage. There is a authentication middleware that ensures that users are authenticated before requesting protected pages.

Needs the following environment variables to run: `PORT, COOKIE_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL, DATABASE_URL`. Install packages using `npm i`. Then run `npm run dev`.
