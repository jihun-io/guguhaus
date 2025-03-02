"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const handleLogout = () => {
    signOut();
  };

  return (
    <Button variant="destructive" onClick={handleLogout}>
      로그아웃
    </Button>
  );
}
