import express from "express";
import { bootstrap } from "./app.controller";
import { initSocketIo } from "./socket-io";
const app = express();
const port = 3000;

bootstrap(app, express);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
initSocketIo(server);
