import Header from "@/organisms/layout/Header";
import React, { useEffect } from "react";
import AddTodos from "../../components/atom/AddTodos";

const Todos = () => {
  useEffect(() => {
    // ページが読み込まれるとuidが一致するデータのみ取ってくる。
  }, []);

  return (
    <>
      <Header />
      <div style={{ maxWidth: "50em", margin: "2em", fontSize: "20px" }}>
        <h1>Todo一覧</h1>
        <AddTodos />
      </div>
    </>
  );
};

export default Todos;
