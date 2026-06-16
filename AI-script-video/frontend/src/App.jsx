import { useState } from "react";

function App() {
  const [script, setScript] = useState("");
  const [result, setResult] = useState("");

  const sendScript = async () => {
    const response = await fetch("http://localhost:5000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ script }),
    });

    const data = await response.json();

    setResult(JSON.stringify(data, null, 2));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>AI Script To Video</h1>

      <textarea
        rows="10"
        cols="60"
        value={script}
        onChange={(e) => setScript(e.target.value)}
        placeholder="Enter script..."
      />

      <br />
      <br />

      <button onClick={sendScript}>
        Generate Video
      </button>

      <pre>{result}</pre>
    </div>
  );
}

export default App;