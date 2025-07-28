// services/otpService.js
import { OTP } from '../models/otp.model.js';
class OtpService {
  async insertOTP(userId, otp, expirationMinutes) {
    // Delete all existing OTPs for this user before creating a new one
    await this.deleteAllOtps(userId);
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
    // Find the latest OTP for this user (in case there are multiple)
    const otpDocument = await OTP.findOne({ 
      user_id: userId, 
      otp_value: otpValue 
    }).sort({ created_at: -1 }); // Get the most recent one

    if (!otpDocument) {
      return { isValid: false, message: 'Invalid OTP' };
    }

    const now = new Date();
    if (now > otpDocument.expires_at) {
      // Clean up expired OTPs
      await this.deleteAllOtps(userId);
      return { isValid: false, message: 'OTP has expired. Please request a new one.' };
    }

    // Verify this is the latest OTP by checking if there's a newer one
    const latestOtp = await OTP.findOne({ user_id: userId })
      .sort({ created_at: -1 });
    
    if (latestOtp && latestOtp._id.toString() !== otpDocument._id.toString()) {
      return { isValid: false, message: 'This OTP is no longer valid. Please use the latest OTP sent to you.' };
    }
    // OTP is valid, delete all OTPs for this user
    await this.deleteAllOtps(userId);
    return { isValid: true, message: 'OTP verified successfully' };
  }
}
export default new OtpService();
