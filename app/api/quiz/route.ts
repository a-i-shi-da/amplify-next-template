import { NextResponse } from "next/server";
import { ZodError } from "zod";
import {QuizForCreate,QuizForCreateForServer,Quiz,client_create_schema,server_create_schema} from '@/app/_types/quiz'
import {logger} from '@/app/_lib/logger'
import { getClient } from "@/app/_lib/configForServer";

//ToDoスキーマを設定
//DynamoDBアクセス可能にする
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

    try {
        //検証
        client_create_schema.parse(body)
        //登録    
    }catch(e){
        if  (e instanceof ZodError){
            return NextResponse.json({status:400,statusText:"Bad Request",message:JSON.stringify(e.issues)})
        }
        else{
            logger.error(e,"クライアントNG登録エラー")
            return NextResponse.json({status:500,statusText:"Internal Server Error"})
        }
    }

    const userId = "dummyID" 
    const createdBy = "dummyName"
    const quizId = crypto.randomUUID()
    const objForServer = {...body , quizId, userId ,createdBy}

    try {
        //サーバインプット検証
        server_create_schema.parse(objForServer)
        //登録    
    }catch(e){
        logger.error(e,"クライアントNGサーバインプット　登録エラー")
        return NextResponse.json({status:500,statusText:"Internal Server Error"})
    }
    //サーバ検証後データ修正（appsyncを通さない登録のため、createdAt,updatedAtがデータなしとなる）
    const createdAt =new Date().toISOString()
    const updatedAt = createdAt
    const InputQuiz:Quiz = {... objForServer,createdAt,updatedAt}

    const client = getClient()

    const {data,errors} = await client.queries.CreateQuizForAPI({apiKey:reqApiKey!,quiz:InputQuiz},{authMode:"apiKey"})

    if (errors){
        logger.error(errors,"サーバ登録エラー")
        return NextResponse.json({status:500,statusText:"Internal Server Error"})
    }else{
        return NextResponse.json(JSON.parse(data!))
    }

}
