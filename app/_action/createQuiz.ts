'use server';

import {getClient,fetchUserAttributesForServer} from '@/app/_lib/configForServer'
import { QuizForCreate,QuizForCreateForServer,valdateQuizInput,Quiz } from '@/app/_types/quiz'
import {CreateResult} from '@/app/_types/crud'
import {logger} from '@/app/_lib/logger'
import {getUserId} from './common'
import { redirect } from 'next/navigation';


export async function createQuizAction(_prev:any,obj:QuizForCreate){

    let result:CreateResult<Quiz>

    const client = getClient()

       //クライアント側のインプットを検証
    const validation_ng_client = valdateQuizInput(obj,"CLIENT_CREATE")

    if (validation_ng_client) {
        //ここはクライアントエラーのため、エラーログははかない。
        result = {validationErrors:validation_ng_client}
        return result
    }

    //userIdを取得
    const userId = await getUserId({redirectTo:'/create'})//ただし入力した内容は消えてしまう。保護したければjotaiでsessionまたはlocalストレージに保存して取り出す。
    const createdBy:string = (await fetchUserAttributesForServer()).preferred_username!
    const quizId = crypto.randomUUID()
    const objForServer:QuizForCreateForServer = {...obj , quizId, userId ,createdBy}
        
    //サーバ側のインプット検証
    const validation_ng_server = valdateQuizInput(objForServer,"SERVER_CREATE")

    if (validation_ng_server) {
        //ここはエラーログを吐く
        logger.error(
            validation_ng_server,
            "システムエラーが発生しました（サーバインプット不正）"
        )
        return result = {systemError:"システムエラーが発生しました（サーバインプット不正）"}
    }
   
    const {data,errors} = await client.models.Quiz.create({...objForServer},{authMode:"userPool"})
    
    //エラー時処理
    if(errors){
        //エラーログを吐く
        logger.error(
            errors,
            "クイズ登録に失敗しました。"
        )
        result = {data,graphqlErrors:errors}
        return result
    }

    redirect(`/complete/create/${data?.quizId}`)
}
