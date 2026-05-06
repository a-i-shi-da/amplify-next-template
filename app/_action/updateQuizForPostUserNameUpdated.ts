'use server';

import {getClient,fetchUserAttributesForServer} from '@/app/_lib/configForServer'
import {logger} from '@/app/_lib/logger'
import {getUserId} from './common'
import { redirect } from 'next/navigation';



export async function updateQuizForPostUserNameUpdatedAction(){
    const client = getClient()

    //userIdを取得
    const userId = await getUserId({redirectTo:`/mypage`})
    //ユーザ名を取得
    const createdBy = (await fetchUserAttributesForServer()).preferred_username

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
            "ユーザ名変更に対する変更対象のクイズの取得に失敗しました。"
        )
    }

    if (!listData){
        redirect(`/mypage`)
    }

    await Promise.all([
        ...listData.map(item => {
            return client.models.Quiz.update({quizId:item.quizId,createdBy},{authMode:'userPool'})
        })]
    ).then(results => {
        results.filter(r => r.errors).forEach(rHasErrors=> {
            rHasErrors.errors?.forEach( e =>{
                logger.error(e)
            })
        })
    })

    const {data:apikeyInfo,errors:getErrors} = await client.models.ApiKey.get(
        {userId},{authMode:"userPool"}
    )

    if(getErrors){
        logger.error(getErrors,'システムエラー（APIKey取得エラー）')
        return "システムエラー（APIKey取得エラー）が発生しました。"
    }

    if(apikeyInfo){
        //データが存在した場合は更新
        const {errors} = await client.models.ApiKey.update(
            {
                userId,
                userName:createdBy,
            },
            {authMode:"userPool"}
        )
        if(errors){
            logger.error(errors,'システムエラー（APIKey更新エラー）')
            return "システムエラー（APIKey更新エラー）が発生しました。"
        }
        
    }
    
    redirect(`/mypage`)
}
