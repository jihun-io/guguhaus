import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// Firebase Admin이 이미 초기화되었는지 확인
const apps = getApps();
let adminApp: App;

const serviceAccountKey = process.env.FIREBASE_ADMIN_SDK_PRIVATE_KEY;
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET; // 환경 변수에 버킷 이름 추가

if (!serviceAccountKey) {
  throw new Error("FIREBASE_ADMIN_SDK_PRIVATE_KEY is not set");
}

if (!storageBucket) {
  throw new Error("FIREBASE_STORAGE_BUCKET is not set");
}

if (!apps.length) {
  adminApp = initializeApp({
    credential: cert(JSON.parse(serviceAccountKey)),
    storageBucket: storageBucket, // 버킷 이름 지정
  });
} else {
  adminApp = apps[0];
}

const adminDb: Firestore = getFirestore(adminApp);
const adminStorage = getStorage(adminApp);

export { adminApp, adminDb, adminStorage };
