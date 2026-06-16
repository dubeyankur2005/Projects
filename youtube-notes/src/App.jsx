
import jsPDF from "jspdf";
import { useState, useEffect } from "react";
import "./App.css";
import ReactMarkdown from "react-markdown";

function App() {
  const [videoUrl, setVideoUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(() => {
  const savedHistory = localStorage.getItem("history");
  return savedHistory ? JSON.parse(savedHistory) : [];
});
  const [thumbnail, setThumbnail] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  useEffect(() => {
  localStorage.setItem(
    "history",
    JSON.stringify(history)
  );
}, [history]);

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setVideoUrl(url);

    const match = url.match(
      /(?:v=|youtu\.be\/)([^&\n?#]+)/
    );

    if (match) {
      setThumbnail(
        `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`
      );
    } else {
      setThumbnail("");
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    const lines = doc.splitTextToSize(notes, 180);

    doc.text(lines, 10, 10);

    doc.save("youtube-notes.pdf");
  };

  const generateNotes = async () => {
    if (!videoUrl.trim()) {
      alert("Please enter a YouTube URL");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/generate-notes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            videoUrl,
          }),
        }
      );

      const data = await response.json();

      setNotes(data.notes);

  const title =
  data.notes
    .replace(/^#+\s*/, "")
    .split("\n")[0]
    .trim() || "Untitled Note";

setHistory((prev) => [
  {
    title,
    notes: data.notes,
  },
  ...prev,
]);
    } catch (error) {
      console.error(error);
      alert("Failed to generate notes");
    } finally {
      setLoading(false);
    }
  };

  const copyNotes = () => {
    navigator.clipboard.writeText(notes);
    alert("Notes copied successfully!");
  };

  return (
    <div
      className={`container ${
        darkMode ? "dark" : "light"
      }`}
    >
      <div className="theme-toggle">
        <button
          onClick={() =>
            setDarkMode(!darkMode)
          }
        >
          {darkMode
            ? "☀️ Light Mode"
            : "🌙 Dark Mode"}
        </button>
      </div>

      <h1>🤖 YouTube Notes AI</h1>

      <p className="subtitle">
        Transform YouTube videos into structured study notes using AI
      </p>

      <input
        type="text"
        placeholder="Paste YouTube Video URL here..."
        value={videoUrl}
        onChange={handleUrlChange}
      />

      {thumbnail && (
        <img
          src={thumbnail}
          alt="YouTube Thumbnail"
          className="thumbnail"
        />
      )}

      <button
        onClick={generateNotes}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            Generating...
          </>
        ) : (
          "Generate Notes"
        )}
      </button>

      {notes && (
        <>
          <div className="notes-box">
            <ReactMarkdown>
              {notes}
            </ReactMarkdown>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "20px",
              flexWrap: "wrap",
            }}
          >
            <button onClick={copyNotes}>
              📋 Copy Notes
            </button>

            <button onClick={downloadPDF}>
              📄 Download PDF
            </button>
          </div>
        </>
      )}

      {history.length > 0 && (
        <div className="history">
          <h2>📚 Recent Notes</h2>

          {history.map((item, index) => (
            <div
              key={index}
              className="history-item"
              onClick={() =>
                setNotes(item.notes)
              }
            >
<strong>
  📖 {item.title}
</strong>
            </div>
          ))}
          <button
  onClick={() => {
    localStorage.removeItem("history");
    setHistory([]);
  }}
  style={{ marginTop: "15px" }}
>
  🗑 Clear History
</button>

        </div>
      )}
    </div>
  );
}

export default App;

