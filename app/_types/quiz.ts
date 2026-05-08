import {z} from 'zod';
import { Schema } from '@/amplify/data/resource';

export type Quiz = Schema['Quiz']['type']

export type Choice = {
    choiceText : string,
    isCorrect : boolean
}

export type Mode = "CLIENT_CREATE" | "SERVER_CREATE" | "CLIENT_UPDATE" | "SERVER_UPDATE"


//クライアントから作成リクエストが来た時の検証スキーマ（サーバで詰める項目は不要）
export const client_create_schema = z.object({
    largeCategory : z.string().min(1,"必須項目です。").max(50,"50文字以内で入力してください。"),
    smallCategory : z.string().min(1,"必須項目です。").max(50,"50文字以内で入力してください。"),
    question :  z.string().min(1,"必須項目です。").max(3000,"3000文字以内で入力してください。"),
    choices : z.array(z.object({
        choiceText: z.string().min(1,"必須項目です。").max(1000,"1000文字以内で入力してください。"),
        isCorrect: z.boolean()
    })),
    correctCount : z.int().gt(0,"正解の選択肢数は１以上に設定してください"),
    selectCount : z.int().min(1,"選択可能な選択肢数は1つ以上にしてください。"),
    displaySelectCount:z.boolean(),
    isPublic : z.boolean(),
    explanationText : z.string().max(2000,"2000文字以内で入力してください。"), 
    hintText : z.string().max(1000,"1000文字以内で入力してください。"),
}).superRefine((q,ctx) => {
    if(q.correctCount !== q.choices.filter(c => c.isCorrect).length){
        q.choices.forEach((c,index) =>{
            ctx.addIssue({
                code:'custom',
                message:'正解の選択肢が正解の選択肢数と異なります。',
                path:["choices",index,"isCorrect"]
            })
        })
    }
}).superRefine((q,ctx) => {
    if(q.correctCount > q.selectCount){ 
            ctx.addIssue({
                code:'custom',
                message:'選択可能数が正解数より小さいです。',
                path:["selectCount"]
            })
    }
})

const partial_schema_create_server = z.object({
    quizId: z.string(),
    userId: z.string(),
    createdBy: z.string().min(1,"作成者の設定がされていません"),
})

const partial_schema_update = z.object({
    createdAt: z.iso.datetime()
})
// const partial_schema_update_server = z.object({
//     updatedAt: z.iso.datetime()
// })


//サーバアクション内で付与する値を加えた後検証するためのスキーマ
// export const server_create_schema = z.object({...client_create_schema.shape, ...partial_schema_create_server.shape})
// export const client_update_schema = z.object({...client_create_schema.shape, ...partial_schema_create_server.shape, ...partial_schema_update.shape})
// export const server_update_schema = z.object({...client_create_schema.shape, ...partial_schema_update.shape})
export const server_create_schema = client_create_schema.extend(partial_schema_create_server.shape)
export const client_update_schema = client_create_schema.extend(partial_schema_create_server.shape).extend(partial_schema_update.shape)
export const server_update_schema = client_create_schema.extend(partial_schema_update.shape)


export type QuizForCreate = z.infer<typeof client_create_schema>
export type QuizForCreateForServer = z.infer<typeof server_create_schema>
export type QuizForUpdate = z.infer<typeof client_update_schema>
export type QuizForUpdateForServer = z.infer<typeof server_update_schema>

export const valdateQuizInput = (obj:Object,mode:Mode) => {
    let parseResult;
    
    switch(mode){
         
        case "CLIENT_CREATE":
            parseResult = client_create_schema.safeParse(obj)
            break
        case "SERVER_CREATE":
            parseResult =server_create_schema.safeParse(obj)
            break
        case "CLIENT_UPDATE":
            parseResult = client_update_schema.safeParse(obj)
            break
        case "SERVER_UPDATE":
            parseResult = server_update_schema.safeParse(obj)
            break
        //defaultはTypeScriptでコンパイルエラーとなるため考慮不要。
    }

    if (!parseResult.success){
        return parseResult.error.issues
    }

}

export type QuizForMyQuizzes = Pick<Quiz,'quizId'| 'createdAt' |'question'| 'isPublic'>
export type QuizForCategories = Pick<Quiz,'quizId' | 'largeCategory' | 'smallCategory' | 'isPublic'>
export type QuizForCatScreen = Pick<Quiz,'quizId' | 'largeCategory' | 'smallCategory' | 'question' | 'isPublic' | 'createdAt' | 'createdBy'>
export type QuizForAllQuizzes = Pick<Quiz,'quizId'| 'userId' | 'createdBy' |'createdAt' |'question'| 'isPublic'>

//export type PartialQuiz = DeepPartialNullable<Schema['Quiz']['type']>
//export type QuizForSolve = NonNullable<Required<Schema['Quiz']['type']>>

// export const batch_regist_schema = z.object(
//     {
//         quizzes:z.array(z.object({
//             largeCategory : z.string().min(1,"必須項目です。"),
//             smallCategory : z.string().min(1,"必須項目です。"),
//             question :  z.string().min(1,"必須項目です。"),
//             choices : z.array(z.object({
//                 choiceText: z.string(),
//                 isCorrect: z.boolean()
//             })),
//             correctCount : z.int(),
//             selectCount : z.int(),
//             displaySelectCount:z.boolean(),
//             isPublic : z.boolean(),
//             explanationText : z.string(),
//             hintText : z.string()
//         })
//     )}
// )
// 上を部品を再利用して記載。(api/batchQuizzes用)
export const batch_regist_schema = z.object(
    {
        quizzes:z.array(client_create_schema)
    }
)