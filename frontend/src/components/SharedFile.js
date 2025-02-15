import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchSharedFileDataAction, downloadFileAction } from "../redux/fileSlice";

const SharedFile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedPermission, setSelectedPermission] = useState("");
  const user = useSelector((state) => state.auth.email);

  const { filesData = {}, status, error } = useSelector((state) => state.file);

  useEffect(() => {
    dispatch(fetchSharedFileDataAction(user));
  }, [dispatch, user]);

  const sharedFiles = filesData?.files || [];
  const files = [...new Set(sharedFiles.map((item) => item.file))];

  const filteredPermissions = selectedFile
    ? sharedFiles.filter((item) => item.file === selectedFile).map((item) => item.permission)
    : [];

  const handleAction = () => {
    if (!selectedFile || !selectedPermission) {
      alert("Please select both file and permission.");
      return;
    }

    if (selectedPermission === "Download") {
      dispatch(downloadFileAction(selectedFile));
    } else if (selectedPermission === "View") {
      navigate(`/fileview/${selectedFile}`);
    } else {
      alert(`Unknown permission: ${selectedPermission}`);
    }
  };

  return (
    <div className="shared-file-container">
      <h1>Shared Files</h1>
      {status === "loading" && <p>Loading files...</p>}
      {error && <p className="error-text">Error: {error}</p>}

      {status === "succeeded" && sharedFiles.length > 0 ? (
        <div className="form-container">
          <div className="form-group">
            <label>File:</label>
            <select
              value={selectedFile}
              onChange={(e) => {
                setSelectedFile(e.target.value);
                setSelectedPermission("");
              }}
            >
              <option value="">Select a file</option>
              {files.map((file, index) => (
                <option key={index} value={file}>
                  {file}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Permission:</label>
            <select
              value={selectedPermission}
              onChange={(e) => setSelectedPermission(e.target.value)}
              disabled={!selectedFile}
            >
              <option value="">Select permission</option>
              {filteredPermissions.length > 0 ? (
                filteredPermissions.map((perm, index) => (
                  <option key={index} value={perm}>
                    {perm}
                  </option>
                ))
              ) : (
                <option disabled>No permissions available</option>
              )}
            </select>
          </div>

          <button className="action-button" onClick={handleAction}>
            {selectedPermission === "Download" ? "Download File" : "View File"}
          </button>
        </div>
      ) : (
        status === "succeeded" && <p>No shared files available.</p>
      )}
    </div>
  );
};

export default SharedFile;
