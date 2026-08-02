import { type Analytics, getAnalytics, isSupported } from "firebase/analytics"
import { getApp, getApps, initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBladHZGGYXh3K8rDrVVKZtVu9cyoBG0VY",
  authDomain: "ultima-repeticao.firebaseapp.com",
  projectId: "ultima-repeticao",
  storageBucket: "ultima-repeticao.firebasestorage.app",
  messagingSenderId: "38923107245",
  appId: "1:38923107245:web:6f1608cd889c2503ef3f24",
  measurementId: "G-CSD9W85F3V",
}

export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)
export const storage = getStorage(firebaseApp)

let analyticsPromise: Promise<Analytics | null> | undefined

export function getFirebaseAnalytics() {
  if (typeof window === "undefined") {
    return Promise.resolve(null)
  }

  analyticsPromise ??= isSupported().then(supported =>
    supported ? getAnalytics(firebaseApp) : null
  )

  return analyticsPromise
}
