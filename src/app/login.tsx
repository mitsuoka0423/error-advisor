"use client";
import { Box, Button } from "@chakra-ui/react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Login() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <Button onClick={() => signOut()}>Sign Out of Google</Button>
        <Box>
          Signed in as {session.user?.name} <br />
        </Box>
      </>
    )
  }

  return (
    <>
      <Button onClick={() => signIn()}>Sign In with Google</Button>
    </>
  )
}
