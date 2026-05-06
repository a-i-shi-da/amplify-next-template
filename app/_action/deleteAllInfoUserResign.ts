'use server';

import {getClient} from '@/app/_lib/configForServer'
import {logger} from '@/app/_lib/logger'
import {getUserId} from './common'


export async function deleteAllInfoUserResignAction(){
    const client = getClient()

    //userIdを取得
    const userId = await getUserId({redirectTo:`/mypage`})
    
    //アップデートするパーティションキーを取得
    const {data:listData,errors:listErrors} = await client.models.Quiz.listQuizByUserIdAndCreatedAt({userId},
        {
        selectionSet:['quizId'],
        authMode:'userPool'
        }
    )
    if(listErrors){
        logger.error(
            listErrors,
            "変更対象の取得に失敗しました。"
        )
        return listErrors
    }

    await Promise.all([
        ...listData.map(item => {
            return client.models.Quiz.delete({quizId:item.quizId},{authMode:'userPool'})
        }) ,client.models.ApiKey.delete({userId},{authMode:'userPool'})
    ]
    ).then(results => {
        results.filter(r => r.errors).forEach(rHasErrors=> {
            rHasErrors.errors?.forEach( e =>{
                logger.error(e)
            })
        })
    })
}
