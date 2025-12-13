const admin = require("firebase-admin");

// Scarica il service account key da:
// Firebase Console > Project Settings > Service Accounts > Generate new private key
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function setAdminClaim(email) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`✅ Admin claim impostato con successo per ${email}`);
    console.log(`⚠️  L'utente deve fare logout e re-login per applicare le modifiche`);
  } catch (error) {
    console.error("❌ Errore nell'impostazione dell'admin claim:", error);
  }
  process.exit();
}

// Imposta l'email dell'admin
setAdminClaim("simonelostimolo@gmail.com");