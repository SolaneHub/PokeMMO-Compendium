// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Funzione per impostare admin claim (chiamata solo da super-admin)
exports.setAdminClaim = functions.https.onCall(async (data, context) => {
  // Verifica che il chiamante sia già admin
  if (!context.auth?.token?.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Solo gli admin possono creare altri admin'
    );
  }
  
  await admin.auth().setCustomUserClaims(data.uid, { admin: true });
  return { success: true };
});