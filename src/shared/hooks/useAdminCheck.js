import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";

export function useAdminCheck() {
  const [isAdmin, setIsAdmin] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (user) {
        // ForceRefresh true è importante per scaricare il nuovo claim appena messo
        const tokenResult = await user.getIdTokenResult(true);
        setIsAdmin(!!tokenResult.claims.admin);
      } else {
        setIsAdmin(false);
      }
    };

    // Controlla al caricamento e ogni volta che cambia l'utente
    return auth.onAuthStateChanged(() => {
      checkAdmin();
    });
  }, [auth]);

  return isAdmin;
}
