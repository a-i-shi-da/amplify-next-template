import { NextResponse } from "next/server";
import { ZodError,z } from "zod";
import {batch_regist_schema,Quiz} from '@/app/_types/quiz'
import {logger} from '@/app/_lib/logger'
import { getClient } from "@/app/_lib/configForServer";

type BatchQuizzes = z.infer<typeof batch_regist_schema>

export async function POST(req:Request){
    const reqApiKey = req.headers.get('x-api-key')

    if(!reqApiKey){
        NextResponse.json({status:401,statusText:"Unauthorized"})
    }
    
    let body
    try{
        body = await req.json()
    }catch{
        return NextResponse.json({status:400,statusText:"Bad Request",message:"broken Json is requested."})
    }

    let parsedQuizzes:BatchQuizzes
    try {
        //検証
        parsedQuizzes =batch_regist_schema.parse(body)
    }catch(e){
        if  (e instanceof ZodError){
            return NextResponse.json({status:400,statusText:"Bad Request",message:JSON.stringify(e.issues)})
        }
        else{
            logger.error(e,"クライアント検証後その他エラー")
            return NextResponse.json({status:500,statusText:"Internal Server Error"})
        }
    }

    const quizzes = parsedQuizzes.quizzes
    
    if (quizzes.length === 0){
        return NextResponse.json({status:400,statusText:"Bad Request",message:"no quiz is requested"})
    }
    
    if (quizzes.length >= 31){
        return NextResponse.json({status:400,statusText:"Bad Request",message:"31以上のクイズは受け付けません"})
    }

    const userId = "dummyID" 
    const createdBy = "dummyName"
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    const quizzesForInput:Quiz[] = quizzes.map(q => 
         { return{
            ...q,
            quizId : crypto.randomUUID(),
            userId,
            createdBy,
            createdAt,
            updatedAt
        }}
    )

    const client = getClient()

    const result = await Promise.all(quizzesForInput.map( q => client.queries.CreateQuizForAPI({apiKey:reqApiKey!,quiz:q},{authMode:"apiKey"})    
    ))
    
    return NextResponse.json(JSON.stringify({resultList:[...result],status:200,statusText:"executed resist"}))

}
