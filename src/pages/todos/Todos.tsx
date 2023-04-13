import Header from "@/organisms/layout/Header";
import React, { useEffect, useState } from "react";
import AddTodos from "../../components/atom/AddTodos";
import { Timestamp, collection, getDocs } from "firebase/firestore";
import { app, db } from "@/lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Box, Button, CircularProgress, LinearProgress } from "@mui/material";

type TODO = {
  time: Timestamp;
  status: string;
  title: string;
};

const Todos = () => {
  const [todos, setTodos] = useState<TODO[]>([]);
  const auth = getAuth(app);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, [auth]);

  const fetchData = async () => {
    await getDocs(
      collection(collection(db, "Users"), user.uid, "TodoList")
    ).then((querySnapshot) => {
      const todosData = querySnapshot.docs.map((doc: any) => ({
        ...doc.data(),
      }));
      setTodos(todosData);
      console.log(todos);
    });
  };

  useEffect(() => {
    // ページが読み込まれるとuidが一致するデータのみ取ってくる。
  }, []);

  return (
    <>
      {user ? (
        <>
          <Header />
          <div style={{ maxWidth: "50em", margin: "2em", fontSize: "20px" }}>
            <h1>Todo一覧</h1>
            <AddTodos />
            <div style={{ marginTop: "20px" }}>
              <Button onClick={fetchData} color={"success"} fullWidth>
                データ同期
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <Box sx={{ width: "100%" }}>
            <LinearProgress sx={{ mt: "50%" }} />
          </Box>
        </>
      )}
    </>
  );
};

export default Todos;
