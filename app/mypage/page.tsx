import { getClient } from "@/app/_lib/configForServer"
import { logger } from "@/app/_lib/logger"
import {redirect} from 'next/navigation'
import {getUserForServer,fetchUserAttributesForServer,fetchAuthSessionForServer} from '@/app/_lib/configForServer'
import {ApiKeyUpsertForm} from './_components/apiKeyUpsertForm'
import {UserNameUpdateForm} from './_components/userNameUpdateForm'
import {ResignForm} from './_components/resignForm'
import { Box,Card,Button,Typography } from "@mui/material"
import Link from 'next/link'


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

    let authSession
    try{
        authSession = await fetchAuthSessionForServer()
        logger.info("ユーザグループを取得")
    }catch(e){
        logger.info("ユーザグループ取得エラー")
    }

    let adminFlg:boolean = false
    //ユーザグループがadminの場合のみフラグオン
    if(authSession && authSession.tokens?.idToken?.payload['cognito:groups']?.toString() === "admin"){
        adminFlg = true
    }

    return (
        <>
            <UserNameUpdateForm username={username!}></UserNameUpdateForm>
            <ApiKeyUpsertForm apiKeyInfo={data!} />
            <ResignForm></ResignForm>
            {adminFlg ? ( 
                <Card className="max-w-2xl mx-auto mt-3 shadow-lg">
                    <Typography variant="h6">管理者メニュー</Typography>
                    <Box className="flex text-center">
                        <Link href="/admin/allQuizzes"><Button size="large" variant="contained">すべてのクイズを管理</Button></Link>
                    </Box>
                </Card>
                ) : (<>/</>)}
        </>
    )

}