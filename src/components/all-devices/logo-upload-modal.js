"use client";

import { useState, useEffect } from "react";
import { XIcon } from "lucide-react";
import { Button } from "../ui/button";
import Loader from "../loader";
import { toast } from "@/hooks/use-toast";
import { fetchProtectedInfo } from "@/lib/api";
import { storage } from "@/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const LogoUploadModal = ({ isOpen, onClose, device, refreshAction }) => {
  const [currentLogo, setCurrentLogo] = useState(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // Added for preview
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (device?.logo) {
      setCurrentLogo(device.logo);
    }
  }, [device]);

  // Cleanup preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!isOpen) return null;

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create a preview URL for the selected image
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleLogoSubmit = async () => {
    if (!file) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Please select a logo to upload.",
      });
      return;
    }

    setLoading(true);
    try {
      const storageRef = ref(storage, `logos/${file.name}`);
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
          toast({
            title: "Error",
            variant: "destructive",
            description: "Failed to upload logo. Please try again.",
          });
          setLoading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const formData = new FormData();
          formData.append("logo", downloadURL);

          const response = await fetchProtectedInfo(
            `/devices/upload-logo/${device.deviceId}`,
            "POST",
            formData
          );

          if (response) {
            toast({
              title: "Success",
              description: "Logo uploaded successfully.",
            });
            setCurrentLogo(downloadURL);
            onClose();
            refreshAction();
          } else {
            toast({
              title: "Error",
              variant: "destructive",
              description: "Failed to upload logo to the server.",
            });
          }
        }
      );
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast({
        title: "Error",
        variant: "destructive",
        description: "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
      setFile(null);
      setPreviewUrl(null); // Clear preview after upload
      setUploadProgress(0);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-background w-[80%] max-w-lg p-6 rounded-lg relative shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Upload Your Logo</h2>
          <button onClick={onClose} className="hover:text-green-400">
            <XIcon />
          </button>
        </div>

        {currentLogo && (
          <div className="flex flex-col items-center mb-4">
            <h3 className="text-lg font-medium">Current Logo</h3>
            <img
              src={currentLogo}
              alt="Current Logo"
              className="h-24 w-auto mt-2"
            />
          </div>
        )}

        <input type="file" accept="image/*" onChange={handleFileChange} />

        {previewUrl && (
          <div className="flex flex-col items-center mb-4 mt-4">
            <h3 className="text-lg font-medium">New Logo Preview</h3>
            <img
              src={previewUrl}
              alt="New Logo Preview"
              className="h-24 w-auto mt-2"
            />
          </div>
        )}

        {uploadProgress > 0 && (
          <p className="text-sm text-center mt-2">
            Uploading: {uploadProgress.toFixed(2)}%
          </p>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleLogoSubmit} disabled={loading || !file}>
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LogoUploadModal;
