import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import app from "../firebaseConfig";
import getCurrentUserId from '../utils/getCurrentUserId';

const db = getFirestore(app);

function getUserMetasCollection() {
  const uid = getCurrentUserId();
  if (!uid) throw new Error('Usuário não autenticado');
  return collection(db, 'metas', uid, 'itens');
}

export async function listarMetas() {
  const metasCollection = getUserMetasCollection();
  const snapshot = await getDocs(metasCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function adicionarMeta(meta) {
  const metasCollection = getUserMetasCollection();
  return await addDoc(metasCollection, meta);
}

export async function atualizarMeta(id, meta) {
  const uid = getCurrentUserId();
  if (!uid) throw new Error('Usuário não autenticado');
  const metaRef = doc(db, 'metas', uid, 'itens', id);
  return await updateDoc(metaRef, meta);
}

export async function deletarMeta(id) {
  const uid = getCurrentUserId();
  if (!uid) throw new Error('Usuário não autenticado');
  const metaRef = doc(db, 'metas', uid, 'itens', id);
  return await deleteDoc(metaRef);
}
