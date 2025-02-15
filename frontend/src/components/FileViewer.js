import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

function FileViewer() {
  const { fileName } = useParams(); // Get filename from URL
  const [fileURL, setFileURL] = useState(null);
  const [fileType, setFileType] = useState(null);

  useEffect(() => {
    if (!fileName) return; // Prevent fetching if no filename

    const fetchFile = async () => {
      try {
        const response = await api.get(`/serve-file/${fileName}/`, {
          responseType: "blob",
        });

        const blob = response.data;
        const contentType = blob.type;
        const fileURL = URL.createObjectURL(blob);

        setFileURL(fileURL);
        setFileType(contentType);
      } catch (error) {
        console.error("Error fetching file:", error);
      }
    };

    fetchFile();
  }, [fileName]); // Run effect when fileName changes

  return (
    <div>
      <h1>Viewing File: {fileName}</h1>

      {fileURL && (
        <div id="file-container">
          {fileType === "application/pdf" ? (
            <iframe src={fileURL} title="PDF Viewer" style={{ width: "100%", height: "500px" }}></iframe>
          ) : (
            <p>Unsupported file type</p>
          )}
        </div>
      )}
    </div>
  );
}

export default FileViewer;
