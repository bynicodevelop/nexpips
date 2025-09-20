import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  limit,
  DocumentData,
  QueryConstraint,
} from "firebase/firestore";
import { useFirebase } from "./useFirebase";
import { useLog } from "./useLog";

export const useFirestore = () => {
  const { getFirebaseFirestore } = useFirebase();
  const { error: logError } = useLog({ ns: "Firestore" });

  const getCollection = (collectionName: string) => {
    const firestore = getFirebaseFirestore();
    if (!firestore) {
      throw new Error("Firestore not initialized");
    }
    return collection(firestore, collectionName);
  };

  const addDocument = async (collectionName: string, data: DocumentData) => {
    try {
      const col = getCollection(collectionName);
      return await addDoc(col, data);
    } catch (error) {
      logError(`Erreur lors de l'ajout dans ${collectionName}:`, error);
      throw error;
    }
  };

  const queryDocuments = async (
    collectionName: string,
    ...constraints: QueryConstraint[]
  ) => {
    try {
      const col = getCollection(collectionName);
      const q = query(col, ...constraints);
      return await getDocs(q);
    } catch (error) {
      logError(`Erreur lors de la requête ${collectionName}:`, error);
      throw error;
    }
  };

  const findDocumentByField = async (
    collectionName: string,
    field: string,
    value: any,
    limitCount: number = 1
  ) => {
    try {
      const snap = await queryDocuments(
        collectionName,
        where(field, "==", value),
        limit(limitCount)
      );

      if (!snap.empty) {
        const doc = snap.docs[0];
        return { id: doc.id, data: doc.data() };
      }
      return null;
    } catch (error) {
      logError(`Erreur lors de la recherche dans ${collectionName}:`, error);
      return null;
    }
  };

  return {
    getCollection,
    addDocument,
    queryDocuments,
    findDocumentByField,
  };
};
