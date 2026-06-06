import { useEffect, useState } from "react";

import { formatItemNameForUrl } from "@/utils/pokemonImageHelper";

interface ItemImageProps {
  item: string;
  className?: string;
}

const ItemImage = ({
  item,
  className = "w-5 h-5 mr-2 object-contain",
}: ItemImageProps) => {
  const formattedName = formatItemNameForUrl(item);
  const dreamUrl = `https://archives.bulbagarden.net/wiki/Special:FilePath/Dream_${formattedName}_Sprite.png`;

  const [imgSrc, setImgSrc] = useState<string | null>(dreamUrl);

  useEffect(() => {
    setImgSrc(dreamUrl);
  }, [dreamUrl]);

  return (
    <img
      src={imgSrc || undefined}
      alt={item}
      loading="lazy"
      className={className}
      onError={() => {
        setImgSrc(null);
      }}
      style={imgSrc === null ? { display: "none" } : {}}
    />
  );
};

export default ItemImage;
