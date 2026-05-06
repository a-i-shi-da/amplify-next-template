import { getClient } from "../_lib/configForServer";
import {QuizForCategories} from '@/app/_types/quiz'
import {GraphQLFormattedError} from 'graphql'
import {logger} from '@/app/_lib/logger'
import {LargeCategoryRecords} from './_components/largeCategoryRecords'

type LargeCategoryCountMap = Record<string,number>
type LargeCategoryCount = {
    largeCategory:string,
    count :number
}

export default async function CategoriesPage(){

    const client = getClient()

    //カテゴリー情報取得のためクイズの取得
    let quizzes:QuizForCategories[] =[]
    let token:string | null | undefined = null

    do {
        const { data,errors,nextToken }:{
            data ?: QuizForCategories[],
            errors ?: GraphQLFormattedError[],
            nextToken ?: string | null | undefined
        } = await client.models.Quiz.list({
            limit: 1000,
            nextToken: token,
            selectionSet:['quizId','largeCategory','smallCategory','isPublic']
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
    
        quizzes.push(...data);
        token = nextToken;
    } while (token); // tokenがnullになるまで繰り返す

    //非公開のクイズは除外
    const publicQuizzes:QuizForCategories[] =quizzes.filter(q => q.isPublic)

    const largeCategoryMap:LargeCategoryCountMap = {}
    publicQuizzes.forEach(q =>{
        if (largeCategoryMap[q.largeCategory]){
            largeCategoryMap[q.largeCategory] = largeCategoryMap[q.largeCategory] +1
        }else{
            largeCategoryMap[q.largeCategory] = 1
        }
    })
    
    const largeCategoryCount :LargeCategoryCount[] = []
    for (let k in largeCategoryMap){
        largeCategoryCount.push({largeCategory:k,count:largeCategoryMap[k]})
    }
    largeCategoryCount.sort((a,b) => b.count- a.count)

    return (
        <LargeCategoryRecords largeCategories={largeCategoryCount}></LargeCategoryRecords>
    )
}