import React, { useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import { IconButton } from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { app, db } from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { query, orderBy } from "firebase/firestore";

const addTodos = () => {
  const [title, setTitle] = useState("");
  const auth = getAuth(app);
  const user = auth.currentUser!;

  //firestoreのデータをcreatedBy順にする
  const createdBySort = query(
    collection(collection(db, "Users"), user.uid, "TodoList"),
    orderBy("createdAt")
  );

  // firestoreの各ユーザーのTodoListまでアクセス
  const TodoList = collection(collection(db, "Users"), user.uid, "TodoList");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleIconButtonClick = async () => {
    if (title !== "") {
      const addData = await addDoc(TodoList, {
        id: "",
        title: title,
        status: "notStarted",
        createdAt: serverTimestamp(),
      });
      updateDoc(doc(TodoList, addData.id), { id: addData.id });
      setTitle("");
    } else {
      alert("何か入力してください");
    }
  };

  return (
    <FormControl fullWidth sx={{ mt: 1 }} variant="standard">
      <InputLabel htmlFor="standard-adornment-amount" sx={{ ml: "10px" }}>
        新しいTodoを入力してください
      </InputLabel>
      <Input
        id="standard-adornment-amount"
        onChange={handleInputChange}
        value={title}
        endAdornment={
          <InputAdornment position="start" onClick={handleIconButtonClick}>
            <IconButton edge="end">
              <ControlPointIcon sx={{ color: "green" }} />
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
};

export default addTodos;
