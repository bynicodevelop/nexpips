import { FieldValue, serverTimestamp } from "firebase/firestore";

export type ServerDate = {
  createdAt: FieldValue;
  updatedAt: FieldValue;
};

export const serverDateFactory = (): ServerDate => ({
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});
