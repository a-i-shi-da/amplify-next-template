import { getClient } from "@/app/_lib/configForServer"
import { logger } from "@/app/_lib/logger"
import {redirect} from 'next/navigation'
import {getUserForServer,fetchUserAttributesForServer} from '@/app/_lib/configForServer'
import {ApiKeyUpsertForm} from './_components/apiKeyUpsertForm'
import {UserNameUpdateForm} from './_components/userNameUpdateForm'
import {ResignForm} from './_components/resignForm'


export default async function MyPage(){
    let user

    //ログイン確認    
    try{
        user = await getUserForServer()
    }catch(e){
        redirect(`/login?redirectTo=/mypage`)
    }

    const userId = user!.userId
    const username = (await fetchUserAttributesForServer()).preferred_username

    const client = getClient()

    const {data,errors} = await client.models.ApiKey.get(
        {userId},{authMode:"userPool"}
    )

    if(errors){
        logger.error(errors,'システムエラー（APIKey取得エラー）')
    }


    return (
        <>
            <UserNameUpdateForm username={username!}></UserNameUpdateForm>
            <ApiKeyUpsertForm apiKeyInfo={data!} />
            <ResignForm></ResignForm>
        </>
    )

}