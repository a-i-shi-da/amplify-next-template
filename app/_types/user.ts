import {z} from 'zod'

export const usernameSchema = z.object({
 username:z.string().min(1,"1文字以上入力してください。").max(50,"50字以内で入力してください")
})


export type UserNameInput = z.infer<typeof usernameSchema> 

