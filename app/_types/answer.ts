import {z} from 'zod'
import { Choice } from "./quiz"
import {DeepPartialNullable, PartialNullable} from '@/app/_types/common'


export type ChoiceForSolve = {
    isSelected:boolean,
    choiceText:string,
    isCorrect:boolean,
}


export const answer_schema = z.object({
    choices : z.array(z.object({
        isSelected:z.boolean(),
        choiceText: z.string(),
        isCorrect: z.boolean()
    })),
    correctCount : z.int(),
    selectCount : z.int(),
    displaySelectCount:z.boolean(),
    answerStatus:z.string()
}).superRefine((a,ctx) => {
    if(a.displaySelectCount && (a.correctCount !== a.choices.filter(c => c.isSelected).length)){
        a.choices.forEach((c,index) =>{
            ctx.addIssue({
                code:'custom',
                message:'正解の選択肢数と正解に指定された選択肢の数が違います',
                path:["choices",index,"isSelected"]
            })
        })
    }
}).superRefine((a,ctx) => {
    if(a.choices.filter(c => c.isSelected).length === 0){
        a.choices.forEach((c,index) =>{
            ctx.addIssue({
                code:'custom',
                message:'未回答です。',
                path:["choices",index,"isSelected"]
            })
        })
    }
}) 

export type Answer = z.infer<typeof answer_schema>