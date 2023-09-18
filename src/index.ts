import dotenv from "dotenv";
dotenv.config();
import express from "hyper-express";
import helmet from "helmet";
import cluster from "cluster";
import { cpus } from "os";
import { IncomingMessage, ServerResponse } from "node:http";
import { sendOTP } from "./routes/sendOTP.js";
import { verifyOTP } from "./routes/verifyOTP.js";

const totalCPU = cpus().length;

const PORT = process.env.PORT || 4001;

const app = new express.Server({
  fast_abort: true,
});

if (cluster.isWorker == false) {
  console.log(`Number of CPUs is ${totalCPU}`);

  //Fork Workers
  for (let i = 0; i < totalCPU; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Cluster ${worker.process.pid} died, Code: ${code}, Signal: ${signal}`
    );
    console.log("Creating anoter worker");
    cluster.fork();
  });
} else {
  app.use((req: unknown, res: unknown, next) => {
    let satisfactoryRes = res as ServerResponse;
    let satisfactoryReq = req as IncomingMessage;
    let runHelmet = helmet();
    runHelmet(satisfactoryReq, satisfactoryRes, (err) => {
      if (err) {
        console.log(err);
        return;
      } else {
        next();
      }
    });
  });

  app.post("/sendOTP", sendOTP);

  app.post("/verifyOTP", verifyOTP);

  app.set_error_handler((req, res) => {
    res
      .status(500)
      .json({ message: "Server failed to handle request", status: false });
  });

  //Start hyper-express Server

  app
    .listen(PORT as number)
    .then(() => {
      console.log("Order System Server Running on " + PORT);
    })
    .catch((err) => {
      console.error(err);
    });
}
