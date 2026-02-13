import React, { useEffect, useState } from"react"; 

import { formatItemNameForUrl } from"@/utils/pokemonImageHelper"; const ItemImage = ({ item, className ="w-5 h-5 mr-2 object-contain" }) => { const formattedName = formatItemNameForUrl(item); const dreamUrl = `https://archives.bulbagarden.net/wiki/Special:FilePath/Dream_${formattedName}_Sprite.png`; const finalUrl = import.meta.env.DEV ? `http://localhost:3001/api/proxy-image?url=${encodeURIComponent(dreamUrl)}` : dreamUrl; const [imgSrc, setImgSrc] = useState(finalUrl); useEffect(() => { setImgSrc(finalUrl); }, [finalUrl]); return ( <img src={imgSrc} alt={item} loading="lazy" className={className} onError={(e) => { setImgSrc(null); }} style={imgSrc === null ? { display:"none" } : {}} /> );
}; export default ItemImage; 
