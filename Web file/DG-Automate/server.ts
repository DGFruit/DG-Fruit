import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { google } from "googleapis";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

// Gemini AI Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const SYSTEM_PROMPT = `You are an advanced AI YouTube Automation System designed to generate high-quality, engaging, and monetizable video content for faceless YouTube channels.

Your goal is to transform a simple keyword or idea into a complete YouTube video production package that maximizes audience retention, click-through rate (CTR), watch time, engagement, and monetization potential.

Follow these steps strictly:
STEP 1: IDEA EXPANSION AND SELECTION
STEP 2: TARGET AUDIENCE DEFINITION
STEP 3: VIDEO FORMAT DECISION
STEP 4: TITLE CREATION
STEP 5: HOOK CREATION (CRITICAL)
STEP 6: FULL SCRIPT
STEP 7: VOICE AND DELIVERY STYLE
STEP 8: VISUAL STRUCTURE
STEP 9: SUBTITLE FORMAT
STEP 10: BACKGROUND MUSIC SUGGESTION
STEP 11: THUMBNAIL STRATEGY
STEP 12: DESCRIPTION (SEO OPTIMIZED)
STEP 13: TAGS
STEP 14: HASHTAGS
STEP 15: VIRALITY BOOST CHECKLIST
STEP 16: FINAL OUTPUT FORMAT

RULES:
- Avoid repetition
- Keep language simple and engaging
- Focus on retention and watch time
- Content must feel human, not robotic
- Optimize for monetization-friendly content
- Avoid controversial or policy-violating topics

IMPORTANT:
Always prioritize Hook strength, Story flow, and Viewer retention over fancy words or over-explanation.`;

// YouTube OAuth Configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  `${process.env.APP_URL}/api/auth/youtube/callback`
);

// In-memory store for automation jobs (simulated)
let automationJobs: any[] = [];

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Generate YouTube Package
app.post("/api/generate", async (req, res) => {
  const { keyword } = req.body;
  if (!keyword) return res.status(400).json({ error: "Keyword is required" });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `INPUT KEYWORD/IDEA: "${keyword}"\n\nGenerate the complete YouTube production package following the system instructions.`;
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: SYSTEM_PROMPT + "\n\n" + prompt }] }],
    });
    res.json({ result: result.response.text() });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

// Get YouTube Auth URL
app.get("/api/auth/youtube/url", (req, res) => {
  const scopes = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.readonly"
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent"
  });

  res.json({ url });
});

// YouTube Auth Callback
app.get("/api/auth/youtube/callback", async (req, res) => {
  const { code } = req.query;

  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    // In a real app, store tokens securely (e.g., database)
    // For this demo, we'll set a cookie (SameSite=None for iframe)
    res.cookie("youtube_token", JSON.stringify(tokens), {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'YOUTUBE_AUTH_SUCCESS' }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication successful! You can close this window.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    res.status(500).send("Authentication failed");
  }
});

// Automation Jobs API
app.get("/api/automation/jobs", (req, res) => {
  res.json(automationJobs);
});

app.post("/api/automation/jobs", (req, res) => {
  const { niche, frequency, duration } = req.body;
  const newJob = {
    id: Math.random().toString(36).substr(2, 9),
    niche,
    frequency,
    duration,
    status: "active",
    createdAt: new Date().toISOString(),
    nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Mock next run
    videosGenerated: 0
  };
  automationJobs.push(newJob);
  res.status(201).json(newJob);
});

app.delete("/api/automation/jobs/:id", (req, res) => {
  automationJobs = automationJobs.filter(j => j.id !== req.params.id);
  res.status(204).send();
});

// Serve static files and index.html
app.use(express.static(__dirname));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
