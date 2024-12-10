import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Redirect } from "expo-router";

export default function App() {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [path, setPath] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      setPath("/home");
    } else {
      setPath("/auth");
    }
  }, [isLoggedIn]);

  return <Redirect href={path}></Redirect>;
}
