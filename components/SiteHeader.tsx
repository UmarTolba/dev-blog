import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import SignOutButton from "@/components/SignOutButton"

export default async function SiteHeader() {
  const user = await getCurrentUser()

  return (
    <header className="mx-auto flex max-w-shell flex-col gap-4 border-b border-ink px-6 py-5 md:flex-row md:items-center md:justify-between md:px-10">
      <Link href="/" className="font-display text-2xl">
        Minimal Blog
      </Link>
      <nav aria-label="Main navigation" className="flex flex-wrap gap-x-5 gap-y-2 text-meta">
        <Link href="/articles" className="link">Articles</Link>
        <Link href="/about" className="link">About</Link>
        <Link href="/contact" className="link">Contact</Link>
        <Link href="/upload-blog" className="link">Upload an article</Link>
        <Link href="/add-article" className="link">Add an article</Link>
        {user?.role === "admin" && <Link href="/admin" className="link">Admin</Link>}
        {user ? (
          <>
            <span className="text-muted">{user.name} ({user.role})</span>
            <SignOutButton />
          </>
        ) : (
          <>
            <Link href="/login" className="link">Sign in</Link>
            <Link href="/register" className="link">Register</Link>
          </>
        )}
      </nav>
    </header>
  )
}
