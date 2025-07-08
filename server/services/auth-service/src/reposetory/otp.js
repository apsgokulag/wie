// services/otpService.js
import { OTP } from '../models/otp.model.js';



class OtpService {
  async insertOTP(userId, otp, expirationMinutes) {
    const expiresAt = new Date(Date.now() + expirationMinutes * 60000);
    const otpDocument = new OTP({
      user_id: userId,
      otp_value: otp,
      expires_at: expiresAt,
    });
    await otpDocument.save();
    return otp;
  }

  async deleteAllOtps(userId) {
    await OTP.deleteMany({ user_id: userId });
  }

  async verifyOtp(userId, otpValue) {
    const otpDocument = await OTP.findOne({ user_id: userId, otp_value: otpValue });

    if (!otpDocument) return false;

    const now = new Date();
    if (now > otpDocument.expires_at) {
      await this.deleteAllOtps(userId);
      return false;
    }

    await this.deleteAllOtps(userId);
    return true;
  }
}

export default new OtpService();
