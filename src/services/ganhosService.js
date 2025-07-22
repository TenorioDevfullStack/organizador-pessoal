import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import app from "../firebaseConfig";
import getCurrentUserId from '../utils/getCurrentUserId';

const db = getFirestore(app);

function getUserGanhosCollection() {
  const uid = getCurrentUserId();
  if (!uid) throw new Error('Usuário não autenticado');
  return collection(db, 'ganhos', uid, 'itens');
}

export async function listarGanhos() {
  const ganhosCollection = getUserGanhosCollection();
  const snapshot = await getDocs(ganhosCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function adicionarGanho(ganho) {
  const ganhosCollection = getUserGanhosCollection();
  return await addDoc(ganhosCollection, ganho);
}

export async function atualizarGanho(id, ganho) {
  const uid = getCurrentUserId();
  if (!uid) throw new Error('Usuário não autenticado');
  const ganhoRef = doc(db, 'ganhos', uid, 'itens', id);
  return await updateDoc(ganhoRef, ganho);
}

export async function deletarGanho(id) {
  const uid = getCurrentUserId();
  if (!uid) throw new Error('Usuário não autenticado');
  const ganhoRef = doc(db, 'ganhos', uid, 'itens', id);
  return await deleteDoc(ganhoRef);
}
