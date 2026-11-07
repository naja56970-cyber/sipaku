import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

admin.initializeApp();

export const bootstrapSuperAdmin = onCall(async (request) => {
  const uid = request.data?.uid;
  const username = request.data?.username;

  if (!uid || !username) {
    throw new HttpsError('invalid-argument', 'uid dan username wajib diisi.');
  }

  const db = admin.firestore();
  const userRef = db.collection('users').doc(uid);

  await userRef.set(
    {
      uid,
      username,
      email: request.data?.email ?? '',
      role: 'super_admin',
      status: 'approved',
      organizationId: 'default',
      approvedBy: 'system-bootstrap',
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    { merge: true },
  );

  return {
    ok: true,
    message: 'Super Admin berhasil dibuat melalui bootstrap aman.',
  };
});

export const approveUserRegistration = onCall(async (request) => {
  const uid = request.data?.uid;
  const role = request.data?.role;
  const approverUid = request.auth?.uid;

  if (!uid || !role) {
    throw new HttpsError('invalid-argument', 'uid dan role wajib diisi.');
  }

  const db = admin.firestore();
  const currentUser = await db.collection('users').doc(approverUid ?? '').get();

  if (!approverUid || !currentUser.exists || currentUser.data()?.role !== 'super_admin') {
    throw new HttpsError('permission-denied', 'Hanya Super Admin yang dapat menyetujui user.');
  }

  const userRef = db.collection('users').doc(uid);
  await userRef.set(
    {
      role,
      status: 'approved',
      approvedBy: approverUid,
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  );

  return { ok: true, message: 'User berhasil disetujui.' };
});
