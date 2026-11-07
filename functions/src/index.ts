export const createEvaluation = onCall(async (request) => {
  const actorUid = request.auth?.uid;
  if (!actorUid) throw new HttpsError('unauthenticated', 'Silakan login terlebih dahulu.');
  const actor = await db.collection('users').doc(actorUid).get();
  const allowed = ['super_admin', 'ketua_ipnu', 'ketua_ippnu', 'wakil_ketua', 'sekretaris', 'koordinator_departemen'];
  if (!actor.exists || actor.data()?.status !== 'approved' || !allowed.includes(actor.data()?.role)) {
    throw new HttpsError('permission-denied', 'Role Anda tidak dapat mengirim evaluasi.');
  }
  const periodId = await validPeriod(request.data?.periodId);
  const programId = boundedString(request.data?.programId, 'programId', 128);
  const program = await db.collection('programs').doc(programId).get();
  if (!program.exists || program.data()?.periodId !== periodId) {
    throw new HttpsError('failed-precondition', 'Program tidak ditemukan pada periode yang dipilih.');
  }
  const target = boundedString(request.data?.target, 'target', 180);
  const achievement = request.data?.achievement;
  if (typeof achievement !== 'number' || !Number.isInteger(achievement) || achievement < 0 || achievement > 100) {
    throw new HttpsError('invalid-argument', 'Capaian harus berupa bilangan bulat 0–100.');
  }
  const blockers = typeof request.data?.blockers === 'string' ? request.data.blockers.trim().slice(0, 1000) : '';
  const followUp = boundedString(request.data?.followUp, 'followUp', 1000);
  const evaluationRef = db.collection('evaluations').doc();
  const auditRef = db.collection('activity_logs').doc();
  const now = admin.firestore.FieldValue.serverTimestamp();
  await db.runTransaction(async (tx) => {
    tx.create(evaluationRef, {
      periodId, programId, target, achievement, blockers, followUp,
      status: 'submitted', createdBy: actorUid, createdAt: now, updatedAt: now,
    });
    tx.create(auditRef, {
      actorUid, action: 'evaluation.created', targetId: evaluationRef.id,
      periodId, programId, achievement, createdAt: now,
    });
  });
  return { id: evaluationRef.id };
});
