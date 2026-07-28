import * as admin from 'firebase-admin';

const firebaseAdminConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (!admin.apps.length) {
  try {
    // If clientEmail and privateKey are available, initialize with service account
    if (firebaseAdminConfig.clientEmail && firebaseAdminConfig.privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: firebaseAdminConfig.projectId,
          clientEmail: firebaseAdminConfig.clientEmail,
          privateKey: firebaseAdminConfig.privateKey,
        }),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
      console.log('Firebase Admin initialized with credentials.');
    } else {
      // Fallback for local development if credentials aren't set in env yet
      admin.initializeApp({
        projectId: firebaseAdminConfig.projectId,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
      console.log('Firebase Admin initialized with project ID fallback.');
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

const adminDb = admin.firestore();
const adminAuth = admin.auth();
const adminStorage = admin.storage();

export { adminDb, adminAuth, adminStorage };
export default admin;
