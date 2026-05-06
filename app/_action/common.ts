import { redirect } from 'next/navigation';
import {getCurrentUser} from '@aws-amplify/auth/server'
import {getUserForServer} from '@/app/_lib/configForServer'


type InputGetUserID = {
    redirectTo?:string
}

export async function getUserId(input:InputGetUserID={}): Promise<string> {
    try {
        const user = await getUserForServer()
        return user!.userId
    }catch(e){
        //リダイレクトのログを吐く
        if (!input?.redirectTo){
            redirect(`/login`)    
        }else{
            redirect(`/login?redirectTo=${input.redirectTo}`)
        }
    }
}