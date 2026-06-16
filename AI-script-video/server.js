require("dotenv").config();
const generateScenes = require("./aiService");
const generateVoice = require("./voiceService");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Script To Video Backend Running");
});


app.post("/generate", async (req, res) => {
  try {
    const { script } = req.body;

    const scenes = await generateScenes(script);

    const voiceFile = await generateVoice(script);

    res.json({
      success: true,
      scenes,
      voiceFile
    });

  } catch (error) {
  console.error("FULL ERROR:", error);

  res.status(500).json({
    success: false,
    message: error.message,
  });
}
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});