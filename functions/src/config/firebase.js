import firebase from 'firebase/app'
import 'firebase/firebase-firestore'
import 'firebase/firebase-auth'
import 'firebase/firebase-functions'
import { firebaseConfig } from './settings'

const init = () => {
  firebase.initializeApp(firebaseConfig)

  const Firestore = firebase.firestore()
  const Auth = firebase.auth()
  const Functions = firebase.app().functions('europe-west1')

  return {
    Firestore,
    Auth,
    Functions
  }
}

export { init }
