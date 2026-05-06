import {Card} from '@mui/material'
import {CompleteInfo} from './_components/completeInfo'

type Verb = "create" | "change" 

type Props = {
    params:Promise<{verb:Verb,quizId:string}>
}


export default async function CompeletePage({params}:Props){

    const {verb,quizId} = await params

    return (
         <Card className="max-w-4xl mx-auto mt-3 shadow-lg">
            <CompleteInfo quizId={quizId} verb={verb}></CompleteInfo>
        </Card>
    )
}