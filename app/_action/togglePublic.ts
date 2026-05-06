'use server';

import {getClient} from '@/app/_lib/configForServer'
import { Quiz } from '@/app/_types/quiz'
import {CreateResult} from '@/app/_types/crud'
import {logger} from '@/app/_lib/logger'
import {getUserId} from './common'
import { redirect } from 'next/navigation';


export async function togglePublicAction(quizId:string,isPublic:boolean){

    
    let result:CreateResult<Quiz>

    const client = getClient()

    await getUserId({redirectTo:`/myquizzes`})
 
    const {data,errors} = await client.models.Quiz.update({quizId,isPublic:!isPublic},{authMode:"userPool"})
 
    //エラー時処理
    if(errors){
        //エラーログを吐く
        logger.error(
            errors,
            "クイズ公開／非公開切り替えに失敗しました。"
        )
        result = {data,graphqlErrors:errors}
        return result
    }
    redirect(`/myquizzes`)
}
