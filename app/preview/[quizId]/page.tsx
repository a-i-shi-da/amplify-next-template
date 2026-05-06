import { getClient } from "@/app/_lib/configForServer"
import { logger } from "@/app/_lib/logger"
import { notFound } from "next/navigation"
import {AnswerQuizForm} from '@/app/_components/answerQuiz'
import { Quiz } from "@/app/_types/quiz"
import {shuffleArray} from '@/app/_lib/util'
import {redirect} from 'next/navigation'
import {getUserForServer} from '@/app/_lib/configForServer'

type Props = {
    params:Promise<{quizId:string}>
}

export default async function PreviewQuizPage({params}:Props){
    const {quizId} = await params
    let user

    //ログイン確認    
    try{
        user = await getUserForServer()
    }catch(e){
        redirect(`/login?redirectTo=/preview/${quizId}`)
    }


    const client = getClient()

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

    if (!data || data.userId !== user.userId){
        notFound()
    }


    const quiz:Quiz = {...data}
    quiz.choices = shuffleArray(quiz.choices)

    return (
        <AnswerQuizForm quiz={quiz}></AnswerQuizForm>
    )

}