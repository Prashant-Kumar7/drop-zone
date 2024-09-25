"use server"

import prisma from "@/db"
import { NEXT_AUTH_CONFIG } from "@/lib/auth"
import { getServerSession } from "next-auth"

export const getDashboardData = async()=>{
    const session = await getServerSession(NEXT_AUTH_CONFIG)
    const res = await prisma.dashboard.findMany({
        where : {
            userId : session.user.id
        }
    })
    
    return res
}