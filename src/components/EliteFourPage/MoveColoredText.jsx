import { colorTextElements } from "@/data/pokemonMoveColors";

const MoveColoredText = ({ text }) => {
  const coloredText = colorTextElements(text || "");

  return <span dangerouslySetInnerHTML={{ __html: coloredText }} />;
};

export default MoveColoredText;
