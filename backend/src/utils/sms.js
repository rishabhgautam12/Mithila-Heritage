// SMS OTP via Fast2SMS (fast2sms.com — Indian numbers).
// .env me FAST2SMS_API_KEY daalo to real SMS jaayega;
// warna OTP server console me print hota hai (sirf testing ke liye).
export async function sendOtpSms(phone, otp) {
  if (!process.env.FAST2SMS_API_KEY) {
    console.log(`📱 [DEV MODE — no FAST2SMS_API_KEY] OTP for ${phone}: ${otp}`);
    return;
  }
  const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
    method: "POST",
    headers: {
      authorization: process.env.FAST2SMS_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      route: "otp",
      variables_values: otp,
      numbers: phone.replace(/\D/g, "").slice(-10),
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.return === false)
    throw new Error(data.message || "SMS sending failed");
}
