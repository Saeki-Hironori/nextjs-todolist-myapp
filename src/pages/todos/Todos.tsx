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
import { User, onAuthStateChanged } from "firebase/auth";
import {
  Box,
  Button,
  LinearProgress,
  Modal,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { TODO, TODOArray } from "@/types/user";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
};

const Todos = () => {
  const [todos, setTodos] = useState<TODO[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [filter, setFilter] = useState("all");
  const [filteredTodos, setFilteredTodos] = useState<TODOArray>([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [id, setId] = useState("");

  const uid = user?.uid;

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
    if (!uid) return;
    //firestoreのデータをcreatedBy順にする
    const createdBySort = await query(
      collection(collection(db, "Users"), uid, "TodoListId"),
      orderBy("createdAt")
    );
    // createdBy順のデータを取得し配列にする
    await getDocs(createdBySort).then((res) => {
      const AllTodos = res.docs.map((doc: any) => ({
        //↑ここのanyが分からない
        ...doc.data(),
      }));
      setTodos(AllTodos);
    });
  };

  const statusChange = async (
    targetTodo: TODO,
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (!uid) return;
    // TodoList = firestoreの各ユーザーのTodoListまでアクセス（User⇒uid⇒TodoList⇒todos）
    const TodoList = collection(collection(db, "Users"), uid, "TodoListId");
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

  const handleDeleteTodo = async () => {
    if (!uid) return;
    const TodoList = collection(collection(db, "Users"), uid, "TodoListId");
    await deleteDoc(doc(TodoList, id));
    await setOpen(false);
    AllData();
  };

  const handleOpen = async (todoId: string) => {
    setId(todoId);
    const newArray = filteredTodos.filter((todo) => todo.id === todoId);
    setTitle(newArray[0].title);
    setDetail(newArray[0].detail);
    setOpen(true);
  };

  const handleClose = async () => {
    if (!uid) return;
    const TodoList = collection(collection(db, "Users"), uid, "TodoListId");
    updateDoc(doc(TodoList, id), { title: title, detail: detail });
    setOpen(false);
    AllData();
  };

  const handleChangeTitle = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTitle(e.target.value);
  };

  const handleChangeDetail = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDetail(e.target.value);
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
                  <li key={todo.id} className="list" style={{ width: "100%" }}>
                    <select
                      value={todo.status}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        statusChange(todo, e);
                      }}
                      style={{
                        marginRight: "10px",
                        border: "outset green",
                        borderRadius: "8px",
                      }}
                    >
                      <option value="notStarted">未着手</option>
                      <option value="doing">進行中</option>
                      <option value="done">完了</option>
                    </select>
                    <span
                      className="todo_title"
                      style={{
                        display: "inline-block",
                        fontSize: "20px",
                        width: "200px",
                      }}
                    >
                      {todo.title}
                    </span>
                    <Button onClick={() => handleOpen(todo.id)}>詳細</Button>
                  </li>
                </Box>
              ))}
              <Modal
                open={open}
                onClose={() => handleClose()} //onCloseではupDateDocが機能しない？
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Box sx={{ textAlign: "right" }}>
                    <IconButton onClick={() => handleClose()}>
                      <p style={{ fontSize: "20px" }}>保存して閉じる</p>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                  <TextField
                    id="outlined-static"
                    label="タイトル"
                    value={title}
                    onChange={(e) => handleChangeTitle(e)}
                    style={{
                      width: "90%",
                      flex: "2",
                      marginLeft: "5%",
                      marginBottom: "10px",
                    }}
                  />
                  <TextField
                    id="outlined-multiline-static"
                    label="詳細を記入"
                    value={detail}
                    multiline
                    rows={4}
                    onChange={(e) => handleChangeDetail(e)}
                    style={{
                      width: "90%",
                      flex: "2",
                      marginLeft: "5%",
                    }}
                  />
                  <Button
                    sx={{ textAlign: "right" }}
                    onClick={handleDeleteTodo}
                  >
                    削除
                  </Button>
                </Box>
              </Modal>
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
