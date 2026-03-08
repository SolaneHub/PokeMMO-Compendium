import { Trash2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/components/atoms/Button";
import PageLayout from "@/components/templates/PageLayout";
import { POKEMON_TYPES } from "@/constants/calculatorConstants";
import { useMoves } from "@/context/MovesContext";
import { deleteMove, saveMove } from "@/firebase/services/movesService";
import { MoveMaster } from "@/types/pokemon";

const MoveEditorPage = () => {
  const { moves } = useMoves();
  const navigate = useNavigate();

  const [selectedMoveId, setSelectedMoveId] = useState<string>("");
  const [formData, setFormData] = useState<MoveMaster>({
    name: "",
    type: "",
    category: "",
    power: "",
    accuracy: "",
    pp: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const selectedMove = moves.find((m) => m.id === selectedMoveId);

  useEffect(() => {
    if (selectedMove) {
      setFormData({ ...selectedMove });
    } else {
      setFormData({
        name: "",
        type: "",
        category: "",
        power: "",
        accuracy: "",
        pp: "",
      });
    }
  }, [selectedMove]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name) return;

    setIsSaving(true);
    try {
      await saveMove(formData);
      alert("Move saved successfully!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error saving move:", error);
      alert("Failed to save move.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMove?.id) return;
    if (
      !globalThis.confirm(
        `Are you sure you want to delete ${selectedMove.name}?`
      )
    )
      return;

    setIsSaving(true);
    try {
      await deleteMove(selectedMove.id);
      alert("Move deleted successfully!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error deleting move:", error);
      alert("Failed to delete move.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageLayout title="Move Editor">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="rounded-xl border border-white/5 bg-[#1a1b20] p-6 text-white">
          <h2 className="mb-4 text-xl font-bold">Select Move to Edit</h2>
          <select
            className="w-full rounded bg-slate-800 p-2 text-white focus:outline-none"
            value={selectedMoveId}
            onChange={(e) => setSelectedMoveId(e.target.value)}
          >
            <option value="">-- Create New Move --</option>
            {moves.map((move) => (
              <option key={move.id} value={move.id}>
                {move.name} ({move.type})
              </option>
            ))}
          </select>
        </div>

        <form
          onSubmit={handleSave}
          className="rounded-xl border border-white/5 bg-[#1a1b20] p-6 text-white"
        >
          <div className="mb-6 flex items-center justify-between border-b border-slate-700 pb-2">
            <h2 className="text-xl font-bold">Move Information</h2>
            {selectedMoveId && (
              <button
                type="button"
                onClick={handleDelete}
                className="text-red-400 hover:text-red-300"
                title="Delete Move"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="move-name"
                className="mb-1 block text-xs font-bold text-slate-400 uppercase"
              >
                Name
              </label>
              <input
                id="move-name"
                name="name"
                className="w-full rounded bg-slate-700 p-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="move-type"
                className="mb-1 block text-xs font-bold text-slate-400 uppercase"
              >
                Type
              </label>
              <select
                id="move-type"
                name="type"
                className="w-full rounded bg-slate-700 p-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Type</option>
                {POKEMON_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="move-category"
                className="mb-1 block text-xs font-bold text-slate-400 uppercase"
              >
                Category
              </label>
              <select
                id="move-category"
                name="category"
                className="w-full rounded bg-slate-700 p-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Physical">Physical</option>
                <option value="Special">Special</option>
                <option value="Status">Status</option>
              </select>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label
                  htmlFor="move-power"
                  className="mb-1 block text-xs font-bold text-slate-400 uppercase"
                >
                  Power
                </label>
                <input
                  id="move-power"
                  name="power"
                  className="w-full rounded bg-slate-700 p-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  value={formData.power}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  htmlFor="move-accuracy"
                  className="mb-1 block text-xs font-bold text-slate-400 uppercase"
                >
                  Accuracy
                </label>
                <input
                  id="move-accuracy"
                  name="accuracy"
                  className="w-full rounded bg-slate-700 p-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  value={formData.accuracy}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  htmlFor="move-pp"
                  className="mb-1 block text-xs font-bold text-slate-400 uppercase"
                >
                  PP
                </label>
                <input
                  id="move-pp"
                  name="pp"
                  className="w-full rounded bg-slate-700 p-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  value={formData.pp}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              disabled={isSaving || !formData.name}
            >
              {isSaving ? "Saving..." : "Save Move"}
            </Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
};

export default MoveEditorPage;
