'use server';

import {getClient} from '@/app/_lib/configForServer'
import {getUserForServer,fetchUserAttributesForServer} from '@/app/_lib/configForServer'
import { logger } from '../_lib/logger';
import { redirect } from 'next/navigation';
import crypto from 'crypto';



export async function upSertAPIKeyAction(){
    const client = getClient()

    const user = await getUserForServer()
    const userId = user.userId
    const userName:string = (await fetchUserAttributesForServer()).preferred_username!
    

    if (!userId){
        redirect("/login?redirectTo=/mypage")
    } 
    
    logger.info(user,'ユーザ情報取得')


    const {data:apikeyInfo,errors:getErrors} = await client.models.ApiKey.get(
        {userId},{authMode:"userPool"}
    )

    if(getErrors){
        logger.error(getErrors,'システムエラー（APIKey取得エラー）')
        return "システムエラー（APIKey取得エラー）が発生しました。"
    }
    
    const date = new Date()
    date.setDate(new Date().getDate() + 91)
    const expiredAt:Date = date
    const apiKey = generateAPIKey()
     

    if(apikeyInfo){
        //データが存在した場合は更新
        const {data,errors} = await client.models.ApiKey.update(
            {
                userId,
                apiKey,
                expiredAt:expiredAt.toISOString(),
                userName,
                dissabled:false
            },
            {authMode:"userPool"}
        )

        if(errors){
            logger.error(errors,'システムエラー（APIKey更新エラー）')
            return "システムエラー（APIKey更新エラー）が発生しました。"
        }
        
    }else{
        //データが存在しない場合作成
        const {data,errors} = await client.models.ApiKey.create(
            {
                userId,
                apiKey,
                userName,
                expiredAt:expiredAt.toISOString(),
                dissabled:false
            },
            {authMode:"userPool"}
        )

        if(errors){
            logger.error(errors,'システムエラー（APIKey登録エラー）')
            return "システムエラー（APIKey登録エラー）が発生しました。"
        }
    }

    redirect("/mypage")
}

function generateAPIKey():string{
    const buffer = crypto.randomBytes(32)
    const apiKey = 'nq_' + buffer.toString('base64url')
    return apiKey
}