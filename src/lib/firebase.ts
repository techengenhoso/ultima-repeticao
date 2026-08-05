import { type Analytics, getAnalytics, isSupported } from "firebase/analytics"
import { getApp, getApps, initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDOwPQBrSwJFhs9AMkDtNbLoWPeO2U_3AE",
  authDomain: "ultima-repeticao-5da2b.firebaseapp.com",
  projectId: "ultima-repeticao-5da2b",
  storageBucket: "ultima-repeticao-5da2b.firebasestorage.app",
  messagingSenderId: "174568685702",
  appId: "1:174568685702:web:be1dfb3f250c5c16351107",
  measurementId: "G-37E41PV8D0",
}

export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)

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
