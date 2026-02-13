import { collection, getDocs } from"firebase/firestore";
import { useEffect, useState } from"react"; 

import { db } from"@/firebase/config"; let cachedPickupData = null; const initialEmptyState = { regions: [], isLoading: true,
}; export const usePickupData = () => { const [data, setData] = useState(() => { if (cachedPickupData) { return cachedPickupData; } return initialEmptyState; }); useEffect(() => { if (cachedPickupData) { return; } let isMounted = true; const fetchData = async () => { try { const querySnapshot = await getDocs(collection(db,"pickup")); const regions = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id, })); regions.sort((a, b) => (a.name ||"").localeCompare(b.name ||"")); const finalData = { regions, isLoading: false, }; cachedPickupData = finalData; if (isMounted) { setData(finalData); } } catch (err) { if (isMounted) setData({ ...initialEmptyState, isLoading: false }); } }; fetchData(); return () => { isMounted = false; }; }, []); return data;
}; 
