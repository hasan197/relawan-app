import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { sendUltramsg } from "./otpProviders/ultramsg";

export const sendOtpMessage = internalAction({
  args: { phone: v.string(), otp: v.string() },
  handler: async (ctx, args) => {
    // Ganti provider di sini jika ingin menggunakan layanan lain (contoh: "ultramsg", "twilio", "whatsapp_cloud")
    const provider = process.env.OTP_PROVIDER || "ultramsg";

    // Normalisasi nomor telepon ke format internasional
    let toPhone = args.phone;
    if (toPhone.startsWith("0")) {
      toPhone = "+62" + toPhone.substring(1);
    } else if (toPhone.startsWith("62")) {
      toPhone = "+" + toPhone;
    } else if (!toPhone.startsWith("+")) {
      toPhone = "+62" + toPhone;
    }

    const body = `Kode OTP: ${args.otp} , untuk aplikasi Relawan Zakat.\n\nJangan share ke orang lain.`;

    if (provider === "ultramsg") {
      await sendUltramsg(toPhone, body);
    } else if (provider === "other_provider") {
      // Tambahkan implementasi provider lain (seperti Twilio, Fonnte, dll) di blok ini
      console.log(`[${provider}] Simulasi mengirim pesan: ${body}`);
    } else {
      console.warn("Unknown OTP provider configured:", provider);
    }
  }
});
