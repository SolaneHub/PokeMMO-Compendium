import React, { useEffect, useState } from "react";

import { formatItemNameForUrl } from "@/shared/utils/pokemonImageHelper";

const ItemImage = ({ item, className = "w-5 h-5 mr-2 object-contain" }) => {
  const formattedName = formatItemNameForUrl(item);
  const dreamUrl = `https://archives.bulbagarden.net/wiki/Special:FilePath/Dream_${formattedName}_Sprite.png`;
  const bagUrl = `https://archives.bulbagarden.net/wiki/Special:FilePath/Bag_${formattedName}_Sprite.png`;

  const [imgSrc, setImgSrc] = useState(dreamUrl);

  useEffect(() => {
    setImgSrc(dreamUrl);
  }, [dreamUrl]);

  return (
    <img
      src={imgSrc}
      alt={item}
      loading="lazy"
      className={className}
      onError={() => {
        if (imgSrc === dreamUrl) {
          setImgSrc(bagUrl);
        } else {
          setImgSrc(null);
        }
      }}
      style={imgSrc === null ? { display: "none" } : {}}
    />
  );
};

export default ItemImage;
