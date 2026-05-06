import {DynamoDBClient} from '@aws-sdk/client-dynamodb'
import {DynamoDBDocumentClient,PutCommand,
    PutCommandInput,
    PutCommandOutput,
    GetCommand,
    GetCommandInput,
    GetCommandOutput,
    QueryCommand,
    QueryCommandInput,
    QueryCommandOutput
} from "@aws-sdk/lib-dynamodb"
import {Schema} from '../../data/resource.js'


type Quiz = Schema['I_Quiz']['type']
type ApiKey = Schema['ApiKey']['type']

type ResultQuery = {
    data?:QueryCommandOutput
    errors?:any
}
type ResultPut = {
    data?:PutCommandOutput
    errors?:any
}


const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

const QUIZ_TABLE_NAME = process.env.QUIZ_TABLE_NAME
const APIKEY_TABLE_NAME = process.env.APIKEY_TABLE_NAME

const sendPutQuiz = async(quizInput:Quiz) => {
    let result:ResultPut = {}
    const command = new PutCommand({
        TableName:QUIZ_TABLE_NAME,
        Item:{
            ... quizInput
        }
    })
    try{
        result.data = await docClient.send(command)
    }catch(e){
        result.errors = e
    }
    return result
}

const sendQueryAPIKey = async(apiKey:string) => {
    let result:ResultQuery = {}
    const command = new QueryCommand({
        TableName:APIKEY_TABLE_NAME,
        IndexName: "apiKeysByApiKey", // ここでインデックス名を指定
        KeyConditionExpression: "apiKey = :apiKey", // インデックスのキーで検索
        ExpressionAttributeValues: {
            ":apiKey": apiKey,
         },
    })
    try{
        result.data = await docClient.send(command)
    }catch(e){
        result.errors = e
    }
    return result
}

const createErrResponse = (status:number,message:string) => {
    let statusText
    switch (status) {
        case 400:
            statusText = "Bad Request"
            break;
    
        case 401:
            statusText = "Unauthorized"
            break;

        default:
            statusText = "Internal Server Error"
            break;

    }
    return JSON.stringify({status,statusText,message})
} 

export const handler:Schema["CreateQuizForAPI"]["functionHandler"] = async(event) => {
    const apiKey:string = event.arguments.apiKey
    const quiz:Quiz = event.arguments.quiz

    let resultQuery:ResultQuery
    let dbAPIKey :ApiKey
    //ステップ1 APIキーの一致を確認
    try {
        resultQuery  = await sendQueryAPIKey(apiKey)
        if(resultQuery.errors){
            console.error(resultQuery.errors)
            console.error("APIキー取得の失敗")
            throw new Error(resultQuery.errors.toString());
        }
    }catch(e){
        return createErrResponse(500,(e as Error).message)
    }

    if(!resultQuery?.data?.Items?.length){
        return createErrResponse(401,"Unautherized(No APIKey)")
    }

    if(resultQuery?.data?.Items[0].dissabled){
        return createErrResponse(401,"Unautherized(APIKey is dissabled)")
    }

    
    const now = new Date()
    const keyExpire = new Date(resultQuery?.data?.Items[0].expiredAt)
    if (now > keyExpire){
        return createErrResponse(401,"Unautherized(APIKey is expired)")
    }
    
    
    const userId = resultQuery?.data?.Items[0].userId
    const createdBy = resultQuery?.data?.Items[0].userName

    const InputQuiz:Quiz ={...quiz,userId,createdBy}

    let resultPut:ResultPut = {}
    // //ステップ2 クイズの登録
    try {
        resultPut = await sendPutQuiz(InputQuiz)
        if(resultPut.errors){
            console.error(resultPut.errors)
            console.error("クイズ登録の失敗")
            throw new Error(resultPut.errors.toString());
        }
    }catch(e){
        return createErrResponse(500,(e as Error).message)
    }
    if(!resultPut?.data){
        createErrResponse(500,"Unknown System Error")
    }

    return JSON.stringify({status:200,statusText:"OK",quizId:InputQuiz.quizId})

}