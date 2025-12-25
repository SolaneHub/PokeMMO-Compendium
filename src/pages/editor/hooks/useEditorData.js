import { useEffect, useState, useTransition } from "react";

import {
  getAllSuperTrainers,
  getPickupData,
  getPokedexData,
  updatePickupCollection,
  updatePokedexData,
  updateSuperTrainersCollection,
} from "@/firebase/firestoreService"; // Import Firebase services
import { useToast } from "@/shared/components/ToastNotification";
import { usePersistentState } from "@/shared/utils/usePersistentState";

const API_URL = "http://localhost:3001/api";

export function useEditorData() {
  const { showToast } = useToast();
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

  // Fetch File List
  useEffect(() => {
    async function fetchFiles() {
      try {
        const res = await fetch(`${API_URL}/files`);
        if (!res.ok) throw new Error("Unable to connect to server");

        const data = await res.json();
        const updatedFileList = Array.from(new Set([...data]));
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
        } else if (selectedFileName === "superTrainersData.json") {
          // Fetch Super Trainers from Firestore
          data = await getAllSuperTrainers();

          // FALLBACK: If Firestore is empty, load from local server
          if (!data || data.length === 0) {
            console.log("Firestore super_trainers collection is empty. Falling back to local JSON.");
            const res = await fetch(`${API_URL}/data?file=${selectedFileName}`);
            if (res.ok) {
              data = await res.json();
            }
          }

          // Sort by name
          if (data && Array.isArray(data)) {
            data.sort((a, b) => a.name.localeCompare(b.name));
          }
        } else if (selectedFileName === "pickupData.json") {
          // Fetch Pickup regions from Firestore
          const regions = await getPickupData();
          data = { regions };
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
        } else if (selectedFileName === "superTrainersData.json") {
          await updateSuperTrainersCollection(fileData);
          showToast(`✅ Super Trainers data saved to Firebase!`, "success");
        } else if (selectedFileName === "pickupData.json") {
          if (fileData.regions) {
            await updatePickupCollection(fileData.regions);
            showToast(`✅ Pickup data saved to Firebase!`, "success");
          }
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
    if (!fileName) {
      showToast("Invalid file selection", "error");
      return;
    }
    setSelectedPokedex(false);
    setSelectedFileName(fileName);
    setFileData(null);
  };

  const setSelectedPokedexAndClearFileName = (isPokedexSelected) => {
    setSelectedFileName("");
    setSelectedPokedex(isPokedexSelected);
    setFileData(null);
    if (isPokedexSelected) {
      setLoading(true);
    }
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
