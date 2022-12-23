

export const globalFirebaseManager = {
  isUserAdmin: function( firebaseUser) {
    const adminUid = 'abc123';
    return firebaseUser != null &&
           firebaseUser.uid == adminUid;
  },
};
