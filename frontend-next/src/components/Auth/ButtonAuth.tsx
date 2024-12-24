"use client";
import { buttonVariants } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";

export default function ButtonAuth() {
  const { data: session, status } = useSession();
  console.log({session,status})

  if (session) {
    return (
      <>
        <button
          onClick={() => signOut()}
          className={`ml-4 ${buttonVariants({ variant: "destructive" })}`}
          >
          Cerrar sesión
        </button>
      </>
    );
  }
  return (
    <>
      <button
        onClick={() => signIn()}
        className={`ml-4 ${buttonVariants({ variant: "outline" })}`}
      >
        Iniciar sesión
      </button>
    </>
  );
}