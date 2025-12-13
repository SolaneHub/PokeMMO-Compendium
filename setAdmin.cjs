const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const email = 'simonelostimolo@gmail.com';

admin.auth().getUserByEmail(email)
  .then(user => {
    return admin.auth().setCustomUserClaims(user.uid, { admin: true });
  })
  .then(() => {
    console.log('✅ Admin claim impostato!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Errore:', error);
    process.exit(1);
  });