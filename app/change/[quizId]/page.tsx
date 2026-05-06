import { getClient } from "@/app/_lib/configForServer"
import { logger } from "@/app/_lib/logger"
import { notFound } from "next/navigation"
import UpdateQuizForm from '@/app/_components/updateQuizForm'
import { Quiz } from "@/app/_types/quiz"
import {redirect} from 'next/navigation'
import {getUserForServer} from '@/app/_lib/configForServer'

type Props = {
    params:Promise<{quizId:string}>
}

export default async function ChangeQuizPage({params}:Props){
    const {quizId} = await params
    let user

    //ログイン確認    
    try{
        user = await getUserForServer()
    }catch(e){
        redirect(`/login?redirectTo=/change/${quizId}`)
    }


    const client = getClient()
    logger.info("データ取得")
    const {data,errors} = await client.models.Quiz.get({quizId},{authMode:"userPool"})
    if(errors){
        //errorsの内容を精査
        //サーバーエラーパターン、NotFoundパターンを確認
        errors.forEach(e => {
            logger.error(e)
        })

        return (
            <p>Error!</p>
        )
    }
    logger.info(data,"データ内容")

    if (!data || data.userId !== user!.userId){
        logger.info("想定外")
        notFound()
    }

    const quiz:Quiz = {...data}
    
    return (
        <UpdateQuizForm quiz={quiz}></UpdateQuizForm>
    )

}