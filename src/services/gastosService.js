import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import app from "../firebaseConfig";
import getCurrentUserId from '../utils/getCurrentUserId';

const db = getFirestore(app);

function getUserGastosCollection() {
  const uid = getCurrentUserId();
  if (!uid) throw new Error('Usuário não autenticado');
  return collection(db, 'gastos', uid, 'itens');
}

export async function listarGastos() {
  const gastosCollection = getUserGastosCollection();
  const snapshot = await getDocs(gastosCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function adicionarGasto(gasto) {
  const gastosCollection = getUserGastosCollection();
  return await addDoc(gastosCollection, gasto);
}

export async function atualizarGasto(id, gasto) {
  const uid = getCurrentUserId();
  if (!uid) throw new Error('Usuário não autenticado');
  const gastoRef = doc(db, 'gastos', uid, 'itens', id);
  return await updateDoc(gastoRef, gasto);
}

export async function deletarGasto(id) {
  const uid = getCurrentUserId();
  if (!uid) throw new Error('Usuário não autenticado');
  const gastoRef = doc(db, 'gastos', uid, 'itens', id);
  return await deleteDoc(gastoRef);
}
