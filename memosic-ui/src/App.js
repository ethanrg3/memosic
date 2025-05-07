import React, { useState, useCallback } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import "./App.css";

function App() {
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!acceptedFiles.length) return;
    const file = acceptedFiles[0];
    const form = new FormData();
    form.append("file", file);

    setLoading(true);
    setTranscript("");
    setError(null);

    try {
      const res = await axios.post("/transcribe", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setTranscript(res.data.transcript);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "audio/*",
    multiple: false,
  });

  return (
    <div className="App">
      <header>
        <h1>Memosic Transcriber</h1>
      </header>

      <section {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
        <input {...getInputProps()} />
        {isDragActive
          ? <p>Drop it like it’s hot 🎵👇</p>
          : <p>Drag & drop an audio file here, or click to select</p>}
      </section>

      {loading && (
        <div className="spinner">
          <div className="bounce1" />
          <div className="bounce2" />
          <div className="bounce3" />
        </div>
      )}

      {error && <p className="error">Error: {error}</p>}

      {transcript && (
        <div className="result">
          <h2>Transcript</h2>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
}

export default App;