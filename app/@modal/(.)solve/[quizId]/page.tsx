import { getClient } from "@/app/_lib/configForServer"
import { logger } from "@/app/_lib/logger"
import { notFound } from "next/navigation"
import {AnswerQuizForm} from '@/app/_components/answerQuiz'
import { Quiz } from "@/app/_types/quiz"
import {shuffleArray} from '@/app/_lib/util'
import {ModalWrapperForAnswer} from '../../_components/modalWappeForAnswer'

type Props = {
    params:Promise<{quizId:string}>
}

export default async function SolveQuizPage({params}:Props){
    const {quizId} = await params

    const client = getClient()

    const {data,errors} = await client.models.Quiz.get({quizId})
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

    if (!data){
        notFound()
    }
    //非公開は404
    if(!data.isPublic){
        notFound()
    }

    const quiz:Quiz = {...data}
    quiz.choices = shuffleArray(quiz.choices)
    logger.info("インターセプトルート")

    return (
        <ModalWrapperForAnswer>
            <AnswerQuizForm quiz={quiz}></AnswerQuizForm>
        </ModalWrapperForAnswer>
    )

}