import { getClient } from "@/app/_lib/configForServer"
import { QuizForCatScreen } from '@/app/_types/quiz'
import { GraphQLFormattedError} from 'graphql'
import {logger} from '@/app/_lib/logger'
import {CategoryFilteredTable} from '../_components/categoryFilteredTable'


type Props = {
    params:Promise<{largeCategory:string}>
}


export default async function CategoryPage({params}:Props){
    const {largeCategory} = await params
    const decordedLargeCategory = decodeURIComponent(largeCategory)

    const client = getClient()

    //カテゴリーでフィルター済みのクイズの取得
    let quizzes:QuizForCatScreen[] =[]
    let token:string | null | undefined = null

    do {
        const { data,errors,nextToken }:{
            data ?: QuizForCatScreen[],
            errors ?: GraphQLFormattedError[],
            nextToken ?: string | null | undefined
        } = await client.models.Quiz.listQuizByLargeCategoryAndSmallCategory(
            {
                largeCategory:decordedLargeCategory,
            },
            {
                limit: 1000,
                nextToken: token,
                selectionSet:['quizId','largeCategory','smallCategory','question','isPublic','createdAt','createdBy']
            }
        )
        
    
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

    quizzes = quizzes.filter(q => q.isPublic).map(q => {
        q.createdAt = new Date(q.createdAt!).toLocaleDateString()
        return q
    })


   return (
        <CategoryFilteredTable
        largeCategory={decordedLargeCategory}
        quizzes={quizzes}
        />
   )
}