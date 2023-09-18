import { Request, Response } from "hyper-express";
import { sendMsg } from "../helpers/sms.js";
import { totp } from "otplib";
import validator from "validator";

async function sendOTP(req: Request, res: Response) {
  const body = await req.json();
  const phoneNo = body.phone;

  const isPhoneNo=validator.isMobilePhone(String(phoneNo))

  if(!isPhoneNo){
    return res.status(401).json({message:"Invalid Phone Number Received",status:false})
  }

  const otp = totp.generate(phoneNo);
  await sendMsg(
    phoneNo,
    `Verify your Phone Number using this One Time Password ${otp}. **Valid for 5mins**`
  )
  return res.status(200).json({message:`OTP sent Successfully`,status:false})
}

export { sendOTP };
