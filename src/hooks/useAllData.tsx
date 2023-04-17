import { auth, db } from "@/lib/firebase";
import { TODO, TODOArray } from "@/types/user";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import React, { useState } from "react";

const useAllData = () => {
  const [AllTodos, setTodos] = useState<TODO[]>([]);

  //firestoreのデータをcreatedBy順にする
  const AllData = () => {
    const user = auth.currentUser!;
    const createdBySort = query(
      collection(collection(db, "Users"), user.uid, "TodoListId"),
      orderBy("createdAt")
    );
    // createdBy順のデータを取得し配列にする
    getDocs(createdBySort).then((res) => {
      const todosData: TODOArray = res.docs.map((doc: any) => ({
        ...doc.data(),
      }));
      setTodos(todosData);
    });
  };
  return { AllData, AllTodos };
};

export default useAllData;
