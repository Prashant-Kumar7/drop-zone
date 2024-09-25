import prisma from "@/db";
import { NEXT_AUTH_CONFIG } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async(req : NextRequest)=>{
    const body = await req.json()
    // const session = await getServerSession(NEXT_AUTH_CONFIG)
    const data = await body.array
    console.log(data)
    const response = await prisma.dashboard.createMany({
        data : body.array,
        skipDuplicates : true
    })

    console.log(response)

    if(response){
        return NextResponse.json({
            task : true
        })
    }

    return NextResponse.json({
        task : false
    })
}