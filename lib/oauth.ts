import { GitHub, Google, Twitter } from "arctic";

export const github = new GitHub(
  process.env.GITHUB_CLIENT_ID ?? "",
  process.env.GITHUB_CLIENT_SECRET ?? "",
  "http://localhost:3000/login/github/callback",
);

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID ?? "",
  process.env.GOOGLE_CLIENT_SECRET ?? "",
  "http://localhost:3000/login/google/callback",
);

export const x = new Twitter(
  process.env.X_CLIENT_ID ?? "",
  process.env.X_CLIENT_SECRET ?? "",
  "http://localhost:3000/login/x/callback",
);
