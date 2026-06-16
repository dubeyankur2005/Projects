import { useState } from "react";
import "./App.css";

function App() {
  const [videoUrl, setVideoUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const generateNotes = async () => {
    if (!videoUrl.trim()) {
      alert("Please enter a YouTube URL");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/generate-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoUrl }),
      });

      const data = await response.json();

      setNotes(data.notes);
    } catch (error) {
      console.error(error);
      alert("Error generating notes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🎥 YouTube Notes Generator</h1>

      <div className="input-section">
        <input
          type="text"
          placeholder="Paste YouTube Video URL..."
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />

        <button onClick={generateNotes}>
          {loading ? "Generating..." : "Generate Notes"}
        </button>
      </div>

      {notes && (
        <div className="notes-section">
          <h2>Generated Notes</h2>
          <p>{notes}</p>
        </div>
      )}
    </div>
  );
}

export default App;