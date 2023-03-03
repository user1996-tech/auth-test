import React, { useEffect } from "react";
import { useRouter } from "next/router";

const login = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/api/auth/login?returnTo=/home");
  }, []);

  return <div></div>;
};

export default login;
