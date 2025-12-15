// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
admin.initializeApp();

// Funzione per impostare admin claim (chiamata solo da super-admin)
exports.setAdminClaim = functions.https.onCall(async (data, context) => {
  // Verifica se l'utente è un admin o è il super-admin configurato
  const superAdminEmail = functions.config().admin?.email;
  const isSuperAdmin = superAdminEmail && context.auth?.token?.email === superAdminEmail;

  if (!context.auth?.token?.admin && !isSuperAdmin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Solo gli admin possono creare altri admin'
    );
  }

  // Validazione input
  if (!data.uid || typeof data.uid !== 'string' || !data.uid.trim()) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Il campo UID è obbligatorio e deve essere una stringa non vuota.'
    );
  }

  try {
    // Verifica esistenza utente
    await admin.auth().getUser(data.uid);
    
    // Imposta claim
    await admin.auth().setCustomUserClaims(data.uid, { admin: true });
    return { success: true };
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      throw new functions.https.HttpsError(
        'not-found',
        `Nessun utente trovato con UID: ${data.uid}`
      );
    }
    throw new functions.https.HttpsError(
      'internal',
      'Errore durante l\'impostazione dei permessi admin',
      error.message
    );
  }
});

// Funzione per verificare il token reCAPTCHA
exports.verifyRecaptcha = functions.https.onCall(async (data, context) => {
  const token = data.token;
  const secretKey = functions.config().recaptcha?.secret;

  if (!token) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Il token reCAPTCHA è mancante.'
    );
  }

  if (!secretKey) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'La chiave segreta reCAPTCHA non è configurata.'
    );
  }

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
    );

    const { success } = response.data;

    if (!success) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Verifica reCAPTCHA fallita.'
      );
    }

    return { success: true };
  } catch (error) {
    console.error('Errore durante la verifica reCAPTCHA:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Errore interno durante la verifica reCAPTCHA.'
    );
  }
});