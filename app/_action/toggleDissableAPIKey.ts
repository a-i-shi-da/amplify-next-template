'use server';

import {getClient} from '@/app/_lib/configForServer'
import {getUserForServer} from '@/app/_lib/configForServer'
import { logger } from '../_lib/logger';
import { redirect } from 'next/navigation';



export async function toggleDissableAPIKeyAction(dissabled:boolean){
    const client = getClient()

    const user = await getUserForServer()
    const userId = user.userId
    

    if (!userId){
        redirect("/login?redirectTo=/mypage")
    } 
    

    const {errors} = await client.models.ApiKey.update(
        {
            userId,
            dissabled:!dissabled
        },
        {authMode:"userPool"}
    )

    if(errors){
        logger.error(errors,'システムエラー（APIKey有効化/無効化エラー）')
        return "システムエラー（APIKey有効化/無効化エラー）が発生しました。"
    }
        

    redirect("/mypage")
}