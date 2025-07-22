import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import app from "../firebaseConfig";
import getCurrentUserId from '../utils/getCurrentUserId';

const db = getFirestore(app);

function getUserDespesasCollection() {
  const uid = getCurrentUserId();
  if (!uid) throw new Error('Usuário não autenticado');
  return collection(db, 'despesasFixas', uid, 'itens');
}

export async function listarDespesasFixas() {
  const despesasCollection = getUserDespesasCollection();
  const snapshot = await getDocs(despesasCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function adicionarDespesaFixa(despesa) {
  const despesasCollection = getUserDespesasCollection();
  return await addDoc(despesasCollection, despesa);
}

export async function atualizarDespesaFixa(id, despesa) {
  const uid = getCurrentUserId();
  if (!uid) throw new Error('Usuário não autenticado');
  const despesaRef = doc(db, 'despesasFixas', uid, 'itens', id);
  return await updateDoc(despesaRef, despesa);
}

export async function deletarDespesaFixa(id) {
  const uid = getCurrentUserId();
  if (!uid) throw new Error('Usuário não autenticado');
  const despesaRef = doc(db, 'despesasFixas', uid, 'itens', id);
  return await deleteDoc(despesaRef);
}
