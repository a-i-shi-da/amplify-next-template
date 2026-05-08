'use client';

import {useRouter} from 'next/navigation'
import { useEffect } from 'react'
import Spinner from '@/app/_components/spinner'

type Props = {
    redirectTo?:string
}

export function Redirector({redirectTo="/"}:Props){
    const router = useRouter()
    useEffect(() =>{
        router.replace(`${redirectTo}`)
    },[])
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <Spinner/>
        </div>
    )
}