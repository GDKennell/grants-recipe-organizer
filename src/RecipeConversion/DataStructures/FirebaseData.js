import {Serializer} from '../../ClassSerializer';

export class FirebaseData {
  constructor(firebaseInitialized,
      firebaseDb,
      firebaseApp,
      firebaseAnalytics,
      firebaseUser,
      firebaseCredential,
      firebaseToken ) {
    this.firebaseInitialized = firebaseInitialized;
    this.firebaseDb = firebaseDb;
    this.firebaseApp = firebaseApp;
    this.firebaseAnalytics = firebaseAnalytics;
    this.firebaseUser = firebaseUser;
    this.firebaseCredential = firebaseCredential;
    this.firebaseToken = firebaseToken;
  }
  get isUserSignedIn() {
    return this.firebaseUser != null;
  }
};

export const firebaseDataClassSerializer = new Serializer([FirebaseData]);
