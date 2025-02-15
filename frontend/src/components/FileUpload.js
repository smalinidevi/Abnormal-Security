import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadFileAction } from "../redux/fileSlice";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const dispatch = useDispatch();

  const email = useSelector((state) => state.auth.email);
  const { message, error } = useSelector((state) => state.file);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile && selectedFile.type !== "application/pdf") {
      setErrorMsg("Only PDF files are allowed.");
      setFile(null);
      return;
    }
    
    setErrorMsg(null);
    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a PDF file.");
      return;
    }

    if (!email) {
      alert("User not authenticated. Please log in.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);

    dispatch(uploadFileAction(formData));
  };

  return (
    <div>
      <h1>Secure PDF Upload with AES-256 Encryption</h1>
      <p>Uploading as: <strong>{email}</strong></p>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload File</button>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default FileUpload;