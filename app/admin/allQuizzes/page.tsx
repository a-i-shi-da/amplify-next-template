import {getUserForServer,fetchUserAttributesForServer,getClient,fetchAuthSessionForServer} from '@/app/_lib/configForServer'
import { logger } from '../../_lib/logger'
import {GraphQLFormattedError} from 'graphql'
import {QuizForAllQuizzes} from '@/app/_types/quiz'
import { AllQuizzes } from './_components/allQuizzes'
import { redirect } from 'next/navigation'



export default async function AllQuizzesPage(){
    let user
    let authSession

    try{
        authSession = await fetchAuthSessionForServer()
        logger.info("ログイン事後処理完了")
    }catch(e){
        redirect('/')
    }

    //ユーザグループがadminの場合のみ遷移可能
    if(authSession.tokens?.idToken?.payload['cognito:groups']?.toString() !== "admin"){
        redirect('/')
    }

    // try{
    //     user = await getUserForServer()
    //     logger.info("ログイン事後処理完了")
    // }catch(e){
    //     redirect('/')
    // }
    
    const client = getClient()

    //ユーザが作成したクイズの取得
    let allQuizzes:QuizForAllQuizzes[] =[]
    let token:string | null | undefined = null

    do {
        const { data,errors,nextToken }:{
            data ?: QuizForAllQuizzes[],
            errors ?: GraphQLFormattedError[],
            nextToken ?: string | null | undefined
        } = await client.models.Quiz.list({
            limit: 1000,
            nextToken: token,
            selectionSet:['quizId','userId','createdBy','createdAt','question','isPublic'],
            authMode:"userPool"
        });
    
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
    
        allQuizzes.push(...data);
        token = nextToken;
    } while (token); // tokenがnullになるまで繰り返す


    return (
        <AllQuizzes allQuizzes={allQuizzes}></AllQuizzes>
    )
}