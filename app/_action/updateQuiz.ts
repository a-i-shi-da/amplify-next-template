'use server';

import {getClient,fetchUserAttributesForServer} from '@/app/_lib/configForServer'
import { valdateQuizInput,Quiz } from '@/app/_types/quiz'
import {CreateResult} from '@/app/_types/crud'
import {logger} from '@/app/_lib/logger'
import {getUserId} from './common'
import { redirect } from 'next/navigation';


export async function updateQuizAction(_prev:any,obj:Quiz){

    
    let result:CreateResult<Quiz>

    const client = getClient()

       //クライアント側のインプットを検証
    const validation_ng_client = valdateQuizInput(obj,"CLIENT_UPDATE")

    if (validation_ng_client) {
        //ここはクライアントエラーのため、エラーログははかない。
        result = {validationErrors:validation_ng_client}
        return result
    }

    //userIdを取得
    const userId = await getUserId({redirectTo:`/change/${obj.quizId}`})//ただし入力した内容は消えてしまう。保護したければjotaiでsessionまたはlocalストレージに保存して取り出す。
    
    if(obj.userId !== userId){
        logger.error(
            "システムエラーが発生しました（ユーザID不正）"
        )
        return result = {systemError:"システムエラーが発生しました（ユーザID不正）"}
    }
    
    //ユーザ名を取得
    const createdBy = (await fetchUserAttributesForServer()).preferred_username

    //アップデート
    const {data,errors} = await client.models.Quiz.update({...obj,createdBy},{authMode:"userPool"})
 
    //エラー時処理
    if(errors){
        //エラーログを吐く
        logger.error(
            errors,
            "クイズ変更に失敗しました。"
        )
        result = {data,graphqlErrors:errors}
        return result
    }
    redirect(`/complete/change/${data?.quizId}`)
}
