import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

admin.initializeApp();
const db = admin.firestore();
const ALLOWED_ROLES = [
  'super_admin', 'ketua_ipnu', 'ketua_ippnu', 'wakil_ketua',
  'sekretaris', 'bendahara', 'koordinator_departemen', 'anggota',
] as const;
type Role = (typeof ALLOWED_ROLES)[number];

async function requireSuperAdmin(uid: string | undefined) {
  if (!uid) throw new HttpsError('unauthenticated', 'Silakan login terlebih dahulu.');
  const snapshot = await db.collection('users').doc(uid).get();
  if (!snapshot.exists || snapshot.data()?.status !== 'approved' || snapshot.data()?.role !== 'super_admin') {
    throw new HttpsError('permission-denied', 'Hanya Super Admin yang dapat melakukan tindakan ini.');
  }
}

export const ensurePendingProfile = onCall(async (request) => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError('unauthenticated', 'Silakan login terlebih dahulu.');
  if (request.auth?.token.email_verified !== true) {
    throw new HttpsError('failed-precondition', 'Verifikasi email sebelum melanjutkan.');
  }
  const authUser = await admin.auth().getUser(uid);
  const userRef = db.collection('users').doc(uid);
  const existing = await userRef.get();
  if (existing.exists) return { status: existing.data()?.status ?? 'pending' };

  await userRef.create({
    uid,
    email: authUser.email ?? '',
    displayName: authUser.displayName ?? '',
    role: 'anggota',
    status: 'pending',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return { status: 'pending' };
});

// Bootstrap is intentionally a trusted CLI operation, never a public callable function.
export const approveUserRegistration = onCall(async (request) => {
  const approverUid = request.auth?.uid;
  await requireSuperAdmin(approverUid);
  const uid = request.data?.uid;
  const role = request.data?.role as Role;
  if (typeof uid !== 'string' || !ALLOWED_ROLES.includes(role)) {
    throw new HttpsError('invalid-argument', 'UID atau role tidak valid.');
  }
  if (role === 'super_admin') throw new HttpsError('invalid-argument', 'Super Admin tidak dapat ditetapkan melalui persetujuan registrasi.');

  const targetRef = db.collection('users').doc(uid);
  const target = await targetRef.get();
  if (!target.exists || target.data()?.status !== 'pending') {
    throw new HttpsError('failed-precondition', 'Akun tidak ditemukan atau bukan berstatus pending.');
  }
  const now = admin.firestore.FieldValue.serverTimestamp();
  await db.runTransaction(async (tx) => {
    tx.update(targetRef, { role, status: 'approved', approvedBy: approverUid, approvedAt: now, updatedAt: now });
    tx.create(db.collection('activity_logs').doc(), {
      actorUid: approverUid,
      action: 'user.approved',
      targetUid: uid,
      role,
      createdAt: now,
    });
  });
  return { ok: true };
});

export const rejectUserRegistration = onCall(async (request) => {
  const approverUid = request.auth?.uid;
  await requireSuperAdmin(approverUid);
  const uid = request.data?.uid;
  if (typeof uid !== 'string') throw new HttpsError('invalid-argument', 'UID tidak valid.');
  const targetRef = db.collection('users').doc(uid);
  const target = await targetRef.get();
  if (!target.exists || target.data()?.status !== 'pending') {
    throw new HttpsError('failed-precondition', 'Akun tidak ditemukan atau bukan berstatus pending.');
  }
  const now = admin.firestore.FieldValue.serverTimestamp();
  await db.runTransaction(async (tx) => {
    tx.update(targetRef, { status: 'rejected', rejectedBy: approverUid, rejectedAt: now, updatedAt: now });
    tx.create(db.collection('activity_logs').doc(), {
      actorUid: approverUid,
      action: 'user.rejected',
      targetUid: uid,
      createdAt: now,
    });
  });
  return { ok: true };
});
