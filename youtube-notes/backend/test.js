const { YoutubeTranscript } = require("youtube-transcript");

async function getTranscript() {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    );

    console.log(transcript);
  } catch (error) {
    console.error(error);
  }
}

getTranscript();