import React, { useState } from "react";
import { useEffect } from "react";
import { Redirect } from "expo-router";
import useAuthStore from "../store/authStore";

export default function App() {
  const { isLoggedIn } = useAuthStore();
  const [path, setPath] = useState("");

  useEffect(() => {
    setPath(isLoggedIn ? "/home" : "/auth");
  }, [isLoggedIn]);

  return <Redirect href={path}></Redirect>;
}
