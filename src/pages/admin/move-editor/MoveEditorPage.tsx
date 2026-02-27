import { Plus, Save, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import Button from "@/components/atoms/Button";
import PageTitle from "@/components/atoms/PageTitle";
import { useMoves } from "@/context/MovesContext";
import { useToast } from "@/context/ToastContext";
import { deleteMove, saveMove } from "@/firebase/services/movesService";
import { MoveMaster } from "@/types/pokemon";

const INITIAL_MOVE_STATE: MoveMaster = {
  name: "",
  type: "",
  category: "",
  power: "",
  accuracy: "",
  pp: "",
};

const MoveEditorPage = () => {
  const { moves, isLoading, refetch } = useMoves();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMove, setSelectedMove] = useState<MoveMaster | null>(null);
  const [formData, setFormData] = useState<MoveMaster>(INITIAL_MOVE_STATE);
  const [isSaving, setIsSaving] = useState(false);
  const showToast = useToast();

  useEffect(() => {
    if (selectedMove) {
      setFormData({ ...selectedMove });
    } else {
      setFormData(INITIAL_MOVE_STATE);
    }
  }, [selectedMove]);

  const filteredList = moves.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.name) {
      showToast("Move name is required!", "error");
      return;
    }

    setIsSaving(true);
    try {
      await saveMove(formData);
      showToast(`${formData.name} saved successfully!`, "success");
      refetch();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      showToast(`Error saving: ${message}`, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMove || !selectedMove.id) return;
    if (
      !window.confirm(`Are you sure you want to delete ${selectedMove.name}?`)
    )
      return;

    setIsSaving(true);
    try {
      await deleteMove(selectedMove.id);
      showToast("Move deleted!", "info");
      setSelectedMove(null);
      refetch();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      showToast(`Error deleting: ${message}`, "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto min-h-screen w-full flex-1 p-6 text-white">
      <PageTitle title="Admin: Move Editor" />

      <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
        <h1 className="text-3xl font-bold text-white">Move Editor</h1>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="secondary"
            onClick={() => {
              setSelectedMove(null);
              setFormData(INITIAL_MOVE_STATE);
            }}
            icon={Plus}
          >
            New Move
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSaving}
            icon={Save}
          >
            {isSaving ? "Saving..." : "Save Move"}
          </Button>
          {selectedMove && (
            <Button variant="danger" onClick={handleDelete} icon={Trash2}>
              Delete
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Left: Search & List */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            <div className="relative">
              <Search
                className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search moves..."
                className="w-full rounded-lg border border-slate-600 bg-slate-700 py-2 pr-4 pl-10 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="custom-scrollbar max-h-[calc(100vh-200px)] overflow-y-auto rounded-lg bg-slate-800 p-2">
              {isLoading ? (
                <div className="p-4 text-center text-white">Loading...</div>
              ) : (
                filteredList.map((m) => (
                  <button
                    key={m.id}
                    className={`mb-1 w-full rounded px-3 py-2 text-left text-white transition-colors ${
                      selectedMove?.id === m.id
                        ? "bg-blue-600"
                        : "bg-slate-700/50 hover:bg-slate-700"
                    }`}
                    onClick={() => setSelectedMove(m)}
                  >
                    <div className="font-bold">{m.name}</div>
                    <div className="text-xs opacity-50">
                      {m.type} • {m.category}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="space-y-6 lg:col-span-3">
          <div className="rounded-xl bg-slate-800 p-6 text-white shadow-xl">
            <h2 className="mb-6 border-b border-slate-700 pb-2 text-xl font-bold">
              Move Information
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-400 uppercase">
                  Name
                </label>
                <input
                  name="name"
                  className="w-full rounded bg-slate-700 p-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-400 uppercase">
                  Type
                </label>
                <input
                  name="type"
                  className="w-full rounded bg-slate-700 p-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  value={formData.type}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-400 uppercase">
                  Category
                </label>
                <select
                  name="category"
                  className="w-full rounded bg-slate-700 p-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">Select Category</option>
                  <option value="Physical">Physical</option>
                  <option value="Special">Special</option>
                  <option value="Status">Status</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-400 uppercase">
                    Power
                  </label>
                  <input
                    name="power"
                    className="w-full rounded bg-slate-700 p-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    value={formData.power}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-400 uppercase">
                    Accuracy
                  </label>
                  <input
                    name="accuracy"
                    className="w-full rounded bg-slate-700 p-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    value={formData.accuracy}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-400 uppercase">
                    PP
                  </label>
                  <input
                    name="pp"
                    className="w-full rounded bg-slate-700 p-2 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    value={formData.pp}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoveEditorPage;
