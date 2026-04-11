import React, { useState } from "react";
import axios from "axios";

export default function NotesUpload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("author", "Admin");
    formData.append("email", "admin@gmail.com");

    try {
      await axios.post("http://localhost:5000/notesshare/notesshare", formData);
      alert("Uploaded successfully");
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload Notes</h2>

      <input type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)} /><br /><br />

      <textarea placeholder="Description" onChange={(e) => setDescription(e.target.value)} /><br /><br />

      <input type="file" onChange={(e) => setFile(e.target.files[0])} /><br /><br />

      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}