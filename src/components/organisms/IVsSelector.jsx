import { Leaf } from "lucide-react";

import ButtonSelect from "@/components/molecules/ButtonSelect";
import ToggleCard from "@/components/molecules/ToggleCard";
function IVsSelector({
  ivOptions,
  selectedIvCount,
  setSelectedIvCount,
  nature,
  setNature,
}) {
  return (
    <div className="space-y-6">
      {" "}
      {/* IV Count Selector */}{" "}
      <ButtonSelect
        label="Desired Perfect IVs"
        options={ivOptions}
        value={selectedIvCount}
        onChange={setSelectedIvCount}
      />{" "}
      {/* Nature Toggle */}{" "}
      <div className="pt-2">
        {" "}
        <ToggleCard
          icon={Leaf}
          title="Nature Breeding"
          subtitle={nature ? "Include nature in path" : "IVs only"}
          isActive={nature}
          onClick={() => setNature(!nature)}
        />{" "}
      </div>{" "}
    </div>
  );
}
export default IVsSelector;
