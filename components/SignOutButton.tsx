"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignOutButton() {
  const router = useRouter()
  const [message, setMessage] = useState("")

  const signOut = async () => {
    const response = await fetch("/api/auth/logout", { method: "POST" }).catch(
      () => null,
    )
    if (!response?.ok) {
      setMessage("Could not sign out.")
      return
    }

    router.refresh()
  }

  return (
    <>
      <button type="button" className="link" onClick={signOut}>
        Sign out
      </button>
      {message && <span role="status">{message}</span>}
    </>
  )
}
