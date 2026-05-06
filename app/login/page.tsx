import AuthenticatorWrapper from '@/app/_components/authWrapper'
import { redirect } from 'next/navigation'
import {getUserForServer} from '@/app/_lib/configForServer'
import { logger } from '../_lib/logger'
import {Redirector} from '@/app/_components/redirector'


type Props = {
    searchParams : Promise<{[key:string]:string | undefined}>
}
export default async function LoginPage({searchParams}:Props){
    const {redirectTo} = await searchParams
    const redirectURL = typeof redirectTo === 'string' ? redirectTo : "/"
    
    try{
        await getUserForServer()    
        logger.info("ログイン済みです")
    }catch(e){
        return (
            <AuthenticatorWrapper>
                <Redirector redirectTo={redirectURL}></Redirector>
            </AuthenticatorWrapper>
        )
    }
    redirect(`${redirectURL}`)
}