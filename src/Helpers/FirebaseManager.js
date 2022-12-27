

export function isUserAdmin( firebaseUser) {
  const adminUid = 'lmhuVC9WGpVNiw881hMcrwwwW743';
  return firebaseUser != null &&
           firebaseUser.uid == adminUid;
}
