import { Request, Response } from "hyper-express";
import { totp } from "otplib";
import validator from "validator";

async function verifyOTP(req: Request, res: Response) {
  const body = await req.json();
  const otp = body.otp;
  const phoneNo = body.phone;

  const isPhoneNo = validator.isMobilePhone(String(phoneNo));

  if (!isPhoneNo) {
    return res
      .status(401)
      .json({ message: "Invalid Phone Number Received", status: false });
  }

  const check = totp.verify({ secret: phoneNo, token: otp });

  if (!check) {
    return res
      .status(401)
      .json({ message: "Invalid OTP Received", status: false });
  }

  return res
    .status(200)
    .json({ message: "OTP Successfully verified", status: true });
}

export { verifyOTP };
