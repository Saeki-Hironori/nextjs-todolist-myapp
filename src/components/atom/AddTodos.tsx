import React, { useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import { IconButton } from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { app, db } from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const addTodos = () => {
  const [title, setTitle] = useState("");
  const auth = getAuth(app);
  const user = auth.currentUser!;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const handleIconButtonClick = async () => {
    if (title !== "") {
      console.log(user.uid);
      await addDoc(collection(collection(db, "Users"), user.uid, "TodoList"), {
        title: title,
        status: "notStarted",
        createdAt: serverTimestamp(),
      });
      setTitle("");
    } else {
      alert("何か入力してください");
    }
  };

  return (
    <FormControl fullWidth sx={{ mt: 1 }} variant="standard">
      <InputLabel htmlFor="standard-adornment-amount" sx={{ ml: "10px" }}>
        新しいTodo
      </InputLabel>
      <Input
        id="standard-adornment-amount"
        onChange={handleInputChange}
        endAdornment={
          <InputAdornment position="start">
            <IconButton edge="end" onClick={handleIconButtonClick}>
              <ControlPointIcon sx={{ color: "green" }} />
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
};

export default addTodos;
