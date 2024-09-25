"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
export const Appbar = ()=>{
    const router = useRouter()

    return (
        <header className="border-b border-gray-800">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            FileShare
          </Link>
          <div className="space-x-6">
            {/* <Button variant="ghost">Login</Button> */}
            <button onClick={()=>router.push("/signup")} className="mx-2">Sign Up</button>
            <button onClick={()=>router.push("/signin")} className="mx-2">Login</button>
            {/* <Button>Sign Up</Button> */}
          </div>
        </nav>
      </header>
    )
}