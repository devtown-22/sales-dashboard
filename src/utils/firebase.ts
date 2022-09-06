import { signInWithEmailAndPassword, onAuthStateChanged as _onAuthChange, User } from 'firebase/auth'
import { signOut as firebaseSignout } from '@firebase/auth'
import { auth } from '../lib/firebase'

export const signInUserWithCredential = async (email: string, password: string) => {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

export const signOut = () => firebaseSignout(auth)

export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  _onAuthChange(auth, callback)
}

// Error utils
// @ts-ignore
const ErrorCodeToFriendlyMessages: Map = {
  'auth/invalid-phone-number': 'Please provide a valid phone number',
  'auth/invalid-verification-code': 'Please check the code entered and try again',
  'auth/code-expired': 'You have timed-out or too many unsuccessful tries. Please try again later',
  'auth/too-many-requests': 'Too many attempts. Please try again later',
}

export const getErrorMessageFromCode = (code: string) => {
  return ErrorCodeToFriendlyMessages[code] || 'Unexpected Error occurred: ' + code
}
