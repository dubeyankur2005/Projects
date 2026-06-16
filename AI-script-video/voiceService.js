const gTTS = require("gtts");

function generateVoice(text) {
  return new Promise((resolve, reject) => {
    const gtts = new gTTS(text, "en");

    const filePath = "output.mp3";

    gtts.save(filePath, (err) => {
      if (err) reject(err);
      else resolve(filePath);
    });
  });
}

module.exports = generateVoice;