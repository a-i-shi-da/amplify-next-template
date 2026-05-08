'use client'
import {QuizForAllQuizzes} from '@/app/_types/quiz'
import {Card, Typography} from '@mui/material'
import {AllQuizzesTable} from './allQuizzesTable'

type Props = {
    allQuizzes :QuizForAllQuizzes[]
}

export function AllQuizzes({allQuizzes}:Props){

    return (
        <Card className="max-w-4xl mx-auto mt-3 shadow-lg">
            <Typography variant='body2'>{`すべてのクイズ`}</Typography>
            <AllQuizzesTable allQuizzes={allQuizzes}></AllQuizzesTable>
        </Card>
    )
}