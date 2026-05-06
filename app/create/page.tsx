import {CreateQuiz} from './_componets/create'
import {logger} from '@/app/_lib/logger'
import { redirect } from 'next/navigation';
import { getUserForServer } from '@/app/_lib/configForServer'

export default async function QuizCreatePage(){
    try{
        await getUserForServer()
        //logger.info("ログイン済み")
    }catch(e){
        redirect('/login?redirectTo=/create')
    }

    return (
        <CreateQuiz />
    )
}

