import Header from "@/organisms/layout/Header";
import React, { useEffect, useState } from "react";
import AddTodos from "../../components/atom/AddTodos";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Box, Button, LinearProgress } from "@mui/material";
import { TODO, TODOArray } from "@/types/user";

const Todos = () => {
  const [todos, setTodos] = useState<TODO[]>([]);
  const [user, setUser] = useState(auth.currentUser);
  const [filter, setFilter] = useState("all");
  const [filteredTodos, setFilteredTodos] = useState<TODOArray>([]);

  // ページ読み込み時にすべてのデータを表示する
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    AllData();
  }, []);

  useEffect(() => {
    filteringTodos();
  }, [filter, todos]);

  const AllData = async () => {
    //firestoreのデータをcreatedBy順にする
    const createdBySort = query(
      collection(collection(db, "Users"), user.uid, "TodoListId"),
      orderBy("createdAt")
    );
    // createdBy順のデータを取得し配列にする
    await getDocs(createdBySort).then((res) => {
      const todosData = res.docs.map((doc: any) => ({
        ...doc.data(),
      }));
      setTodos(todosData);
      console.log(todos);
    });
  };

  const statusChange = async (
    targetTodo: TODO,
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    // TodoList = firestoreの各ユーザーのTodoListまでアクセス（User⇒uid⇒TodoList⇒todos）
    const TodoList = collection(
      collection(db, "Users"),
      user.uid,
      "TodoListId"
    );
    await updateDoc(doc(TodoList!, targetTodo.id), {
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

  const deleteTodo = async (targetTodo: TODO) => {
    const TodoList = collection(
      collection(db, "Users"),
      user.uid,
      "TodoListId"
    );
    await deleteDoc(doc(TodoList, targetTodo.id));
    AllData();
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
                    <Button onClick={() => deleteTodo(todo)}>削除</Button>
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
