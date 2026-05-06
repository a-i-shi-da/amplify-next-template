'use client'
import {QuizForMyQuizzes} from '@/app/_types/quiz'
import {Card, Typography} from '@mui/material'
import {MyQuizzesTable} from './myQuizzesTable'

type Props = {
    myQuizzes :QuizForMyQuizzes[]
    username : string
}

export function MyQuizzes({myQuizzes,username}:Props){

    return (
        <Card className="max-w-4xl mx-auto mt-3 shadow-lg">
            <Typography variant='body2'>{`${username}さんの作成したクイズ`}</Typography>
            <MyQuizzesTable myQuizzes={myQuizzes}></MyQuizzesTable>
        </Card>
    )
}