import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "@/lib/firebase";
import {
  Avatar,
  Button,
  Container,
  CssBaseline,
  Typography,
} from "@mui/material";
import Fingerprint from "@mui/icons-material/Fingerprint";
import InputPassword from "@/components/atom/InputPassword";
import InputEmail from "@/components/atom/InputEmail";
import Link from "next/link";
import { useRouter } from "next/router";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const auth = getAuth(app);

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user.uid);
        router.push("/todos/Todos");
      })
      .catch((error) => console.log(error.code));
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        mt: "10vh",
        p: "30px",
        border: 2,
        borderColor: "green",
        borderRadius: "50px",
      }}
    >
      <CssBaseline />
      <Avatar sx={{ m: "auto", bgcolor: "green" }}></Avatar>
      <Typography
        component="h1"
        variant="h5"
        textAlign={"center"}
        color={"green"}
      >
        Sign up
      </Typography>
      <form onSubmit={handleSubmit}>
        <InputEmail value={email} onChange={handleChangeEmail} />
        <InputPassword value={password} onChange={handleChangePassword} />
        <Button
          type="submit"
          fullWidth
          variant="outlined"
          color="success"
          sx={{ mb: "15px" }}
          endIcon={<Fingerprint />}
        >
          新規登録
        </Button>
      </form>
      <div>
        すでに登録している人は
        <Link
          href="/Login"
          style={{ color: "green", textDecoration: "underline" }}
        >
          ログイン
        </Link>
      </div>
    </Container>
  );
};

export default SignUp;
