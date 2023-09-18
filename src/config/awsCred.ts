import Global from "aws-sdk/global.js";
// @ts-ignore
let cred = new Global.Credentials({
  // @ts-ignore
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  // @ts-ignore
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export { cred };