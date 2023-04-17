import React, { useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import { IconButton } from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { auth, db } from "@/lib/firebase";
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
  const user = auth.currentUser;

  //firestoreのデータをcreatedBy順にする
  const createdBySort = query(
    collection(collection(db, "Users"), user.uid, "TodoListId"),
    orderBy("createdAt")
  );

  // firestoreの各ユーザーのTodoListIdまでアクセス
  const TodoListId = collection(
    collection(db, "Users"),
    user.uid,
    "TodoListId"
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSubmit = async () => {
    if (title !== "") {
      const addData = await addDoc(TodoListId, {
        id: "",
        title: title,
        status: "notStarted",
        detail: "",
        createdAt: serverTimestamp(),
      });
      updateDoc(doc(TodoListId, addData.id), { id: addData.id });
      setTitle("");
    } else {
      alert("何か入力してください");
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Enterのみ通す⇒KeyboardEvent実行中（キー押下中）は動作キャンセル⇒（キー離したら）handleSubmit実行
    if (e.key !== "Enter") return;
    e.preventDefault();
    handleSubmit();
  };

  return (
    <FormControl fullWidth sx={{ mt: 1 }} variant="standard">
      <InputLabel htmlFor="standard-adornment-amount" sx={{ ml: "10px" }}>
        新しいTodoを入力してください
      </InputLabel>
      <Input
        id="standard-adornment-amount"
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        value={title}
        endAdornment={
          <InputAdornment position="start" onClick={handleSubmit}>
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
