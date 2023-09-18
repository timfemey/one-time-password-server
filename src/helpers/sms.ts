import SNS from "aws-sdk/clients/sns.js";
import { cred } from "../config/awsCred.js";

const init = new SNS({
  region: "eu_west-2",
  sslEnabled: true,
  maxRetries: 3,
  credentials: cred,
});

const sendMsg = async (number:string, msg:string) => { 
    return init.publish({
      PhoneNumber: number,
      Message: msg,
      Subject: "Order Status",
    });
  
};

export {sendMsg}