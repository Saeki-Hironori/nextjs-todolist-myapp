import Header from "@/organisms/layout/Header";
import React, { useEffect, useState } from "react";
import AddTodos from "../../components/atom/AddTodos";
import {
  Timestamp,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { app, db } from "@/lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Box, Button, LinearProgress } from "@mui/material";
import { query, orderBy } from "firebase/firestore";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

type TODO = {
  id: string;
  createdAt: Timestamp;
  status: string;
  title: string;
};

type TODOArray = Array<{
  id: string;
  createdAt: Timestamp;
  status: string;
  title: string;
}>;

const Todos = () => {
  const [todos, setTodos] = useState<TODO[]>([]);
  const auth = getAuth(app);
  const [user, setUser] = useState(auth.currentUser);
  const [filter, setFilter] = useState("all");
  const [filteredTodos, setFilteredTodos] = useState<TODOArray>([]);

  //firestoreのデータをcreatedBy順にする

  // firestoreの各ユーザーのTodoListまでアクセス

  // ページ読み込み時にすべてのデータを表示する
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    AllData();
  }, [auth]);

  useEffect(() => {
    filteringTodos();
  }, [filter, todos]);

  // 全てのデータを表示する（タイムスタンプ順）
  const AllData = async () => {
    const createdBySort = query(
      collection(collection(db, "Users"), user.uid, "TodoList"),
      orderBy("createdAt")
    );
    await getDocs(createdBySort).then((res) => {
      const todosData = res.docs.map((doc: any) => ({
        ...doc.data(),
      }));
      setTodos(todosData);
    });
  };

  const statusChange = async (
    targetTodo: TODO,
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const TodoList = collection(collection(db, "Users"), user.uid, "TodoList");
    await updateDoc(doc(TodoList, targetTodo.id), {
      status: e.target.value,
    });
    AllData();
  };

  const filteringTodos = () => {
    switch (filter) {
      case "notStarted":
        setFilteredTodos(todos.filter((todo) => todo.status === "notStarted"));
        break;
      case "doing":
        setFilteredTodos(todos.filter((todo) => todo.status === "doing"));
        break;
      case "done":
        setFilteredTodos(todos.filter((todo) => todo.status === "done"));
        break;
      default:
        setFilteredTodos(todos);
    }
  };

  return (
    <>
      {user ? (
        <>
          <Header />
          <div>
            <h1>TodoList</h1>
            <div className="filter">
              <label>Pick Up : </label>
              <select
                value={filter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFilter(e.target.value)
                }
              >
                <option value="all">すべて</option>
                <option value="notStarted">未着手</option>
                <option value="doing">進行中</option>
                <option value="done">完了</option>
              </select>
            </div>
          </div>
          <div style={{ margin: "1em 2em" }}>
            <div
              style={{
                maxWidth: "50em",
                margin: "0 auto",
                fontSize: "20px",
              }}
            >
              {filteredTodos.map((todo) => (
                <Box
                  sx={{
                    display: "flex",
                    bgcolor: "background.paper",
                    borderRadius: 1,
                  }}
                >
                  <li key={todo.id} className="list">
                    <select
                      value={todo.status}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        statusChange(todo, e);
                      }}
                      style={{
                        marginRight: "10px",
                      }}
                    >
                      <option value="notStarted">未着手</option>
                      <option value="doing">進行中</option>
                      <option value="done">完了</option>
                    </select>
                    <span className="todo_title">{todo.title}</span>
                    <Button>編集</Button>
                    <Button>削除</Button>
                  </li>
                </Box>
              ))}
              <AddTodos />
              <div
                style={{
                  marginTop: "20px",
                  color: "red",
                }}
              >
                <Button
                  onClick={AllData}
                  color="success"
                  variant="outlined"
                  fullWidth
                >
                  データ同期
                </Button>
              </div>
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
