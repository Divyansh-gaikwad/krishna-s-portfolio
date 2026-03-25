const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Resend } = require("resend");

const app = express();

const requiredEnvVars = [
  "RESEND_API_KEY",
  "RECEIVER_EMAIL",
  "SENDER_EMAIL",
  "FRONTEND_URL",
  "PORT",
];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.error(`Missing required env vars: ${missingEnvVars.join(", ")}`);
  process.exit(1);
}

const resend = new Resend(process.env.RESEND_API_KEY);

const normalizeOrigin = (origin = "") => origin.trim().replace(/\/+$/, "");

const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(normalizeOrigin(origin))) {
      callback(null, true);
      return;
    }
    callback(new Error("CORS blocked for this origin"));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

app.use(express.json());
app.use(cors(corsOptions));

const sanitize = (value = "") => String(value).trim();

app.post("/send-email", async (req, res) => {
  const name = sanitize(req.body?.name);
  const email = sanitize(req.body?.email);
  const message = sanitize(req.body?.message);

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address",
    });
  }

  try {
    const response = await resend.emails.send({
      from: process.env.SENDER_EMAIL,
      to: process.env.RECEIVER_EMAIL,
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
      data: response,
    });
  } catch (error) {
    console.error("Error sending email:", error?.message || error);

    return res.status(500).json({
      success: false,
      message: "Failed to send email",
    });
  }
});

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, status: "ok" });
});

const PORT = Number(process.env.PORT);

if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;