import { useState } from "react";
import axios from "axios";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) return alert("Please select an image!");

    const formData = new FormData();
    formData.append("file", image);

    setLoading(true);
    setResultImage(null);
    setDetections([]);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/upload",
        formData,
        { responseType: "blob" }
      );
      setResultImage(URL.createObjectURL(response.data));

      const detRes = await axios.get("http://127.0.0.1:8000/detections");
      setDetections(detRes.data);

    } catch (err) {
      alert("Error processing image.");
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>

      <h1 style={styles.title}>🌊 Underwater Waste Detection</h1>
      <p style={styles.subtitle}>AI-powered detection of marine debris</p>

      <div style={styles.grid}>
        
        {/* Upload Card */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Upload Image</h2>

          <div style={styles.uploadBox}>
            <label style={styles.uploadLabel}>
              <input 
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <span style={styles.uploadText}>📁 Click to Select Image</span>
            </label>
          </div>

          {preview && (
            <img src={preview} style={styles.image} />
          )}

          <button onClick={handleUpload} style={styles.button}>
            {loading ? "Analyzing..." : "Analyze Image"}
          </button>
        </div>

        {/* Result Card */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>AI Output</h2>

          {loading && <p style={styles.loadingText}>⏳ Processing image...</p>}

          {resultImage && (
            <img src={resultImage} style={styles.image} />
          )}
        </div>
      </div>

      {/* Detections List */}
      <div style={styles.cardWide}>
        <h2 style={styles.sectionTitle}>Detected Objects</h2>

        {detections.length === 0 && !loading && (
          <p style={styles.noDetections}>No detections yet.</p>
        )}

        <ul style={styles.list}>
          {detections.map((d, i) => (
            <li key={i} style={styles.listItem}>
              <strong>{d.class}</strong>
              <span style={styles.confidence}>
                {(d.confidence * 100).toFixed(1)}%
              </span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}

/* ------------------------  INLINE STYLING  ------------------------ */

const styles = {
  page: {
    minHeight: "100vh",
    padding: "40px 20px",
    background: "linear-gradient(135deg, #a5f3fc, #dbeafe)",
    fontFamily: "Segoe UI, Roboto, sans-serif",
  },

  title: {
    textAlign: "center",
    fontSize: "40px",
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: "10px",
  },

  subtitle: {
    textAlign: "center",
    fontSize: "18px",
    marginBottom: "40px",
    color: "#334155",
  },

  grid: {
    maxWidth: "1300px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "35px",
  },

  /* ★ GLASSMORPHISM CARD ★ */
  card: {
    background: "rgba(255, 255, 255, 0.35)",
    backdropFilter: "blur(12px)",
    padding: "25px",
    borderRadius: "18px",
    boxShadow: "0 8px 32px rgba(31, 38, 135, 0.20)",
    border: "1px solid rgba(255,255,255,0.2)",
  },

  cardWide: {
    marginTop: "40px",
    maxWidth: "1300px",
    margin: "40px auto 0 auto",
    background: "rgba(255, 255, 255, 0.35)",
    backdropFilter: "blur(12px)",
    padding: "25px",
    borderRadius: "18px",
    boxShadow: "0 8px 32px rgba(31,38,135,0.20)",
    border: "1px solid rgba(255,255,255,0.2)",
  },

  sectionTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "15px",
  },

  uploadBox: {
    padding: "25px",
    borderRadius: "16px",
    border: "2px dashed #2563eb",
    background: "rgba(255,255,255,0.55)",
    marginBottom: "20px",
  },

  uploadLabel: {
    display: "block",
    textAlign: "center",
    cursor: "pointer",
  },

  uploadText: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#2563eb",
  },

  image: {
    width: "100%",
    borderRadius: "16px",
    marginTop: "15px",
    marginBottom: "20px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
  },

  /* ★ Beautiful Button ★ */
  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    fontSize: "17px",
    fontWeight: "700",
    background: "linear-gradient(135deg, #2563eb, #4f46e5)",
    color: "white",
    cursor: "pointer",
    transition: "0.25s",
  },

  loadingText: {
    color: "#4f46e5",
    fontWeight: "600",
    marginTop: "10px",
  },

  noDetections: {
    color: "#475569",
    marginTop: "10px",
  },

  list: {
    padding: 0,
    listStyle: "none",
    marginTop: "20px",
  },

  listItem: {
    background: "rgba(255,255,255,0.7)",
    padding: "14px",
    borderRadius: "12px",
    marginBottom: "12px",
    display: "flex",
    justifyContent: "space-between",
    fontSize: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },

  confidence: {
    color: "#2563eb",
    fontWeight: "700",
  },
};

export default App;
