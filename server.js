import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000;

app.post("/signature", (req, res) => {
  try {
    const { meetingNumber, role } = req.body;

    if (!meetingNumber || role === undefined) {
      return res.status(400).json({ error: "Missing meetingNumber or role" });
    }

    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 60 * 2; // 2 hours

    const payload = {
      sdkKey: process.env.ZOOM_SDK_KEY,
      mn: meetingNumber,
      role,
      iat,
      exp,
      appKey: process.env.ZOOM_SDK_KEY,
      tokenExp: exp,
    };

    const token = jwt.sign(payload, process.env.ZOOM_SDK_SECRET, {
      algorithm: "HS256",
    });

    res.json({
      signature: token,
      sdkKey: process.env.ZOOM_SDK_KEY,
    });
  } catch (err) {
    console.error("❌ Error generating signature:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Zoom signature backend is running!");
});

app.listen(port, () =>
  console.log(`✅ Server running on http://localhost:${port}`)
);
