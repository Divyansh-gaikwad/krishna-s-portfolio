const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Resend } = require("resend");

const app = express();

// ✅ Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Middlewares
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL // your frontend URL
}));

// ✅ Route
app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  // 🔒 Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }

  try {
    const response = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>", // test sender
      to: process.env.RECEIVER_EMAIL, // where you receive emails
      subject: `New message from ${name}`,
      html: `
        <h2>New Contact Form Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/> ${message}</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Email sent successfully!",
      data: response
    });

  } catch (error) {
    console.error("Error sending email:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send email"
    });
  }
});

// ✅ Health check route (optional but useful)
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});