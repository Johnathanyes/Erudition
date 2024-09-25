"use client"

import { SignInButton, UserButton } from "@clerk/nextjs"
import { Unauthenticated, Authenticated, AuthLoading } from "convex/react"
import { Loader2 } from "lucide-react"

export function HeaderActions() {
    return (
        <>
            <Unauthenticated>
                <SignInButton />
            </Unauthenticated>
            <Authenticated>
                <UserButton />
            </Authenticated>
            <AuthLoading>
                Loading
                <Loader2 className="animate-spin" />
            </AuthLoading>
        </>
    )
}