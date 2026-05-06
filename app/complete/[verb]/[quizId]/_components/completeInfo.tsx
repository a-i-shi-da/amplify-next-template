'use client'

import {Typography,Divider} from '@mui/material'
import {Link as MUILink} from '@mui/material'
import Link  from 'next/link' 
import { useEffect, useState } from 'react'

type Verb = "create" | "change" 

type Props = {
    quizId:string,
    verb: Verb
}

export function CompleteInfo({quizId,verb}:Props){
    const [solveURL,setSolveURL] = useState<string>("")
    const [myquizzesURL,setMyquizzesURL] = useState<string>("")
    
    useEffect(()=>{
        setSolveURL(`${window.location.protocol}//${window.location.host}/solve/${quizId}`)
        setMyquizzesURL(`${window.location.protocol}//${window.location.host}/myquizzes`)
    },[])

    return (
        <>
        <Typography variant="h4" gutterBottom>
        クイズを{verb === "create" ? "作成" : "変更" }しました。
        </Typography>
        <Divider></Divider>
        <Typography variant="body1" gutterBottom>
        クイズは下記にて挑戦可能です。
        </Typography>
        <Link href={solveURL} className="text-blue-600 hover:text-blue-800 underline">{solveURL}</Link>
        <Divider></Divider>
        <Typography variant="body1" gutterBottom>
        クイズは下記にて管理可能です。
        </Typography>
        <Link href={myquizzesURL} className="text-blue-600 hover:text-blue-800 underline">{myquizzesURL}</Link>
      </>
    )
}