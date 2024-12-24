import express from "express";
import { makeSignUpController } from "../factories/makeSignUpController";
import { makeSignInController } from "../factories/makeSignInController";
import { routeAdapter } from "./adapters/routeAdapter";
import { middlewareAdapter } from "./adapters/middlewareAdapter";
import { makeAuthenticationMiddleware } from "../factories/makeAuthenticationMiddleware";
import { makeListUsersController } from "../factories/makeListUsersController";
import { makeAuthorizationMiddleware } from "../factories/makeAuthorizationMiddleware";

const app = express();

app.use(express.json());

app.post("/sign-up", routeAdapter(makeSignUpController()));
app.post("/sign-in", routeAdapter(makeSignInController()));

app.get(
	"/users",
	middlewareAdapter(makeAuthenticationMiddleware()),
	routeAdapter(makeListUsersController()),
);

app.get(
	"/leads",
	middlewareAdapter(makeAuthenticationMiddleware()),
	middlewareAdapter(makeAuthorizationMiddleware(['USER'])),
	(req, res) => {
    res.json({ message: "Leads" });
  },
);

app.listen(3001, () => {
	console.log("Server is running on http://localhost:3001");
});
