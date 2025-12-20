import { useEffect, useState, useTransition } from "react";

import { getPokedexData, updatePokedexData } from "@/firebase/firestoreService"; // Import Firebase services
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
  const [selectedPokedex, setSelectedPokedex] = usePersistentState(
    "editor_pokedexSelected",
    false
  );
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSaving, startTransition] = useTransition();
  const [serverError, setServerError] = useState(null);

  // Fetch File List (remains mostly the same, but should ideally exclude pokedex.json from local files)
  // For now, I'll assume the file list from the server still returns 'pokedex.json' as a placeholder.
  // A more robust solution might involve merging local file list with a hardcoded 'pokedex.json' if it's always available
  // regardless of server response.
  useEffect(() => {
    async function fetchFiles() {
      try {
        const res = await fetch(`${API_URL}/files`);
        if (!res.ok) throw new Error("Unable to connect to server");

        const data = await res.json();
        const updatedFileList = Array.from(new Set([...data])); // No longer ensure pokedex.json is always in the list
        setFileList(updatedFileList);
        setServerError(null);

        if (!selectedFileName || !updatedFileList.includes(selectedFileName)) {
          const defaultFile = updatedFileList[0];
          if (defaultFile) setSelectedFileName(defaultFile);
        }
      } catch (err) {
        setServerError("Error: Ensure the server (port 3001) is active.");
      }
    }
    fetchFiles();
  }, [selectedFileName, setSelectedFileName]);

  // Fetch File Data
  useEffect(() => {
    if (!selectedFileName && !selectedPokedex) return;

    let ignore = false;
    async function fetchData() {
      setLoading(true);
      try {
        let data;
        if (selectedPokedex) {
          data = await getPokedexData();
          // Firestore returns objects with 'id' field.
          // The PokedexEditor (and other parts) might expect the `id` property from the Firebase document.
          // The `getPokedexData` already returns objects with `id` derived from `doc.id`.
        } else {
          const res = await fetch(`${API_URL}/data?file=${selectedFileName}`);
          if (!res.ok) throw new Error("Error fetching data");
          data = await res.json();
        }

        if (!ignore) setFileData(data);
      } catch (err) {
        if (!ignore) showToast("Error loading file.", "error");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchData();
    return () => {
      ignore = true;
    };
  }, [selectedFileName, selectedPokedex, showToast]);

  // Save File Data
  const handleSave = () => {
    if (!fileData || (!selectedFileName && !selectedPokedex)) return;

    startTransition(async () => {
      try {
        if (selectedPokedex) {
          await updatePokedexData(fileData);
          showToast(`✅ Pokedex data saved to Firebase!`, "success");
        } else {
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
        }
      } catch (err) {
        showToast("❌ Connection error or Firebase save error.", "error");
      }
    });
  };

  const setSelectedFileNameAndClearPokedex = (fileName) => {
    setSelectedPokedex(false);
    setSelectedFileName(fileName);
    setFileData(null);
    setLoading(true);
  };

  const setSelectedPokedexAndClearFileName = (isPokedexSelected) => {
    setSelectedFileName("");
    setSelectedPokedex(isPokedexSelected);
    setFileData(null);
    setLoading(true);
  };

  return {
    fileList,
    selectedFileName,
    setSelectedFileName: setSelectedFileNameAndClearPokedex,
    selectedPokedex,
    setSelectedPokedex: setSelectedPokedexAndClearFileName,
    fileData,
    setFileData,
    loading,
    isSaving,
    serverError,
    handleSave,
  };
}
