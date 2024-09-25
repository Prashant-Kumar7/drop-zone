"use server"

import { DashboardData } from "@/components/ui/uploadPage"
import prisma from "@/db"
import { NEXT_AUTH_CONFIG } from "@/lib/auth"
import { getServerSession } from "next-auth"

export const createData = async(publicUrl :string , name : string)=>{
    const session = await getServerSession(NEXT_AUTH_CONFIG)
    const tempData : DashboardData = {
        url : publicUrl,
        fileName : name,
        userId : session.user.id
    }

    return tempData
}

export const pushDatatoDB = async(data : DashboardData[])=>{
    console.log(data)
    const res = await prisma.dashboard.createMany({
        data : data,
        skipDuplicates:true
    })
    console.log(res)
    if(res.count===0){
        return false
    } else {
        return true
    }
}