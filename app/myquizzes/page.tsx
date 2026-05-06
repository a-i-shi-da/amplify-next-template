import {getUserForServer,fetchUserAttributesForServer,getClient} from '@/app/_lib/configForServer'
import { logger } from '../_lib/logger'
import {GraphQLFormattedError} from 'graphql'
import {QuizForMyQuizzes} from '@/app/_types/quiz'
import { MyQuizzes } from './_components/myQuizzes'
import { redirect } from 'next/navigation'



export default async function MyQuizzesPage(){
    let user 
    try{
        user = await getUserForServer()
        logger.info("ログイン事後処理完了")
    }catch(e){
        redirect('/login?redirectTo=/myquizzes')
    }
    
    //ユーザIDの取得
    const userId = user!.userId
    const username = (await fetchUserAttributesForServer()).preferred_username

    const client = getClient()

    //ユーザが作成したクイズの取得
    let myQuizzes:QuizForMyQuizzes[] =[]
    let token:string | null | undefined = null

    do {
        const { data,errors,nextToken }:{
            data ?: QuizForMyQuizzes[],
            errors ?: GraphQLFormattedError[],
            nextToken ?: string | null | undefined
        // } = await client.models.Quiz.list({
        //     filter:{
        //         userId:{
        //             eq:userId
        //         }
        //     },
        //     limit: 1000,
        //     nextToken: token,
        //     selectionSet:['quizId','createdAt','question','isPublic']
        // });
        //インデックスが効く検索に変更
        } = await client.models.Quiz.listQuizByUserIdAndCreatedAt({
            userId,
        },{
            limit: 1000,
            nextToken: token,
            selectionSet:['quizId','createdAt','question','isPublic'],
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
    
        myQuizzes.push(...data);
        token = nextToken;
    } while (token); // tokenがnullになるまで繰り返す


    return (
        <MyQuizzes myQuizzes={myQuizzes} username={username!}></MyQuizzes>
    )
}