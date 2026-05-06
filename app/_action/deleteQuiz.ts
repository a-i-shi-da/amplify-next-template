'use server';

import {getClient} from '@/app/_lib/configForServer'
import {Quiz } from '@/app/_types/quiz'
import {DeleteResult} from '@/app/_types/crud'
import {logger} from '@/app/_lib/logger'
import {getUserId} from './common'
import { redirect } from 'next/navigation';


export async function DeleteQuizAction(quizId:string){
    let result:DeleteResult<Quiz>

    const client = getClient()

    await getUserId({redirectTo:`/myquizzes`})
         
    const {data,errors} = await client.models.Quiz.delete({quizId},{authMode:"userPool"})
 
    //エラー時処理
    if(errors){
        //エラーログを吐く
        logger.error(
            errors,
            "クイズ削除に失敗しました。"
        )
        result = {data,graphqlErrors:errors}
        return result
    }
    redirect(`/myquizzes`)
}
