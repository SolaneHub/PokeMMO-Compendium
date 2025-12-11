import { useEffect, useState, useTransition } from "react";

import { useToast } from "@/shared/components/ToastNotification";
import { usePersistentState } from "@/shared/utils/usePersistentState";

const API_URL = "http://localhost:3001/api";

export function useEditorData() {
  const showToast = useToast();
  const [fileList, setFileList] = useState([]);
  const [selectedFileName, setSelectedFileName] = usePersistentState(
    "editor_lastFile",
    ""
  );
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSaving, startTransition] = useTransition();
  const [serverError, setServerError] = useState(null);

  // Fetch File List
  useEffect(() => {
    async function fetchFiles() {
      try {
        const res = await fetch(`${API_URL}/files`);
        if (!res.ok) throw new Error("Unable to connect to server");

        const data = await res.json();
        setFileList(data);
        setServerError(null);

        if (!selectedFileName || !data.includes(selectedFileName)) {
          const defaultFile = data.find((f) => f === "pokedex.json") || data[0];
          if (defaultFile) setSelectedFileName(defaultFile);
        }
      } catch (err) {
        console.error(err);
        setServerError("Error: Ensure the server (port 3001) is active.");
      }
    }
    fetchFiles();
  }, [selectedFileName, setSelectedFileName]);

  // Fetch File Data
  useEffect(() => {
    if (!selectedFileName) return;

    let ignore = false;
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/data?file=${selectedFileName}`);
        if (!res.ok) throw new Error("Error fetching data");
        const data = await res.json();
        if (!ignore) setFileData(data);
      } catch (err) {
        console.error(err);
        if (!ignore) showToast("Error loading file.", "error");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchData();
    return () => {
      ignore = true;
    };
  }, [selectedFileName, showToast]);

  // Save File Data
  const handleSave = () => {
    if (!fileData || !selectedFileName) return;

    startTransition(async () => {
      try {
        const res = await fetch(`${API_URL}/data?file=${selectedFileName}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fileData),
        });
        const result = await res.json();
        if (result.success) {
          showToast(`✅ ${selectedFileName} saved!`, "success");
        } else {
          showToast("❌ Server error during save.", "error");
        }
      } catch (err) {
        console.error(err);
        showToast("❌ Connection error.", "error");
      }
    });
  };

  return {
    fileList,
    selectedFileName,
    setSelectedFileName,
    fileData,
    setFileData,
    loading,
    isSaving,
    serverError,
    handleSave,
  };
}
