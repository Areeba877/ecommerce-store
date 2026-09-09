"use client";

import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  const handleLogout = () => {
    // Logout logic yahan add hogi
    router.push("/");
  };

  return (
    <div>
      <h1>Logout</h1>
      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}