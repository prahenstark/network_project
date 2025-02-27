"use client"

import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";

const FirebaseImageUpload = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadImage = () => {
    if (!file) {
      alert("Please choose a file to upload");
      return;
    }

    setUploading(true);
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload failed", error);
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setImageUrl(downloadURL);
        setUploading(false);
      }
    );
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Upload Image to Firebase Storage</h1>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      <button
        onClick={uploadImage}
        disabled={uploading}
        style={{ marginLeft: "10px" }}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {uploadProgress > 0 && (
        <p>Upload Progress: {uploadProgress.toFixed(2)}%</p>
      )}
      {imageUrl && (
        <div>
          <h3>Uploaded Image</h3>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: "300px" }} />
          <p>
            Download URL:{" "}
            <a href={imageUrl} target="_blank" rel="noopener noreferrer">
              {imageUrl}
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default FirebaseImageUpload;
