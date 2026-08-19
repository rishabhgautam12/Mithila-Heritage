import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const fmt = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export async function sendBookingNotification(booking) {
  const html = `
  <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;border:1px solid #c9a227;">
    <div style="background:#4a0e0e;color:#f5efe0;padding:20px 24px;">
      <h2 style="margin:0;font-weight:normal;">The Mithila Heritage</h2>
      <p style="margin:4px 0 0;color:#c9a227;font-size:13px;letter-spacing:2px;">NEW BOOKING REQUEST</p>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;color:#333;">
      ${[
        ["Guest Name", booking.name],
        ["Phone", booking.phone],
        ["Email", booking.email],
        ["Room", booking.roomName],
        ["Check-in", fmt(booking.checkIn)],
        ["Check-out", fmt(booking.checkOut)],
        ["Nights", booking.nights],
        ["Guests", booking.guests],
        ["Est. Amount", "₹" + booking.amount.toLocaleString("en-IN")],
        ["Payment", booking.paymentStatus === "paid" ? `PAID ✓ (${booking.razorpayPaymentId})` : "Unpaid"],
        ["Special Requests", booking.specialRequests || "—"],
      ]
        .map(
          ([k, v]) =>
            `<tr><td style="padding:10px 24px;border-bottom:1px solid #eee;color:#888;width:40%;">${k}</td>
             <td style="padding:10px 24px;border-bottom:1px solid #eee;"><strong>${v}</strong></td></tr>`
        )
        .join("")}
    </table>
    <p style="padding:16px 24px;font-size:12px;color:#999;">Login to the admin panel to confirm or cancel this booking.</p>
  </div>`;

  await transporter.sendMail({
    from: `"Mithila Heritage Bookings" <${process.env.SMTP_USER}>`,
    to: process.env.NOTIFY_EMAIL,
    subject: `🛎️ New Booking: ${booking.roomName} — ${fmt(booking.checkIn)} (${booking.name})`,
    html,
  });
}

export async function sendGuestConfirmation(booking) {
  await transporter.sendMail({
    from: `"The Mithila Heritage" <${process.env.SMTP_USER}>`,
    to: booking.email,
    subject: "Booking Confirmed ✓ — The Mithila Heritage",
    html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;">
      <h2 style="color:#4a0e0e;">Namaste ${booking.name},</h2>
      <p>Your booking at <strong>The Mithila Heritage</strong> is <strong style="color:green;">confirmed</strong>!</p>
      ${booking.paymentStatus === "paid" && booking.razorpayPaymentId
        ? `<p>We have received your payment of <strong>₹${booking.amount.toLocaleString("en-IN")}</strong> (Payment ID: ${booking.razorpayPaymentId}).</p>`
        : `<p>Amount payable: <strong>₹${booking.amount.toLocaleString("en-IN")}</strong> — to be settled at the hotel.</p>`}
      <p><strong>${booking.roomName}</strong> · <strong>${fmt(booking.checkIn)}</strong> to <strong>${fmt(booking.checkOut)}</strong> · ${booking.guests} guest(s)</p>
      <p>We look forward to welcoming you.</p>
      <p style="color:#888;font-size:13px;">NH-27, Paigamberpur Kolhua, Bihar · mithilaheritage.in</p>
    </div>`,
  });
}

export async function sendOtpEmail(to, otp) {
  await transporter.sendMail({
    from: `"The Mithila Heritage" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your admin verification code — The Mithila Heritage",
    html: `<div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;text-align:center;border:1px solid #c9a227;padding:32px;">
      <p style="color:#4a0e0e;font-size:18px;margin:0 0 8px;">The Mithila Heritage — Admin</p>
      <p style="color:#666;font-size:14px;">Use this code to update your admin credentials. It expires in 10 minutes.</p>
      <p style="font-size:34px;letter-spacing:10px;color:#4a0e0e;margin:20px 0;"><strong>${otp}</strong></p>
      <p style="color:#999;font-size:12px;">If you did not request this, please ignore this email and change your password.</p>
    </div>`,
  });
}

export async function sendCustomerOtpEmail(to, otp) {
  await transporter.sendMail({
    from: `"The Mithila Heritage" <${process.env.SMTP_USER}>`,
    to,
    subject: `${otp} — your login code | The Mithila Heritage`,
    html: `<div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;text-align:center;border:1px solid #c9a227;padding:32px;">
      <p style="color:#4a0e0e;font-size:18px;margin:0 0 8px;">The Mithila Heritage</p>
      <p style="color:#666;font-size:14px;">Use this code to sign in. It expires in 10 minutes.</p>
      <p style="font-size:34px;letter-spacing:10px;color:#4a0e0e;margin:20px 0;"><strong>${otp}</strong></p>
      <p style="color:#999;font-size:12px;">If you did not request this, you can safely ignore this email.</p>
    </div>`,
  });
}
