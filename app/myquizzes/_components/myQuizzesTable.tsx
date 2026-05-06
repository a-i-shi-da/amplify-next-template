import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import {QuizForMyQuizzes} from '@/app/_types/quiz'
import Link from 'next/link';
import { Button } from '@mui/material';
import { useState, useTransition } from 'react';
import {DeleteQuizAction} from '@/app/_action/deleteQuiz'
import {togglePublicAction} from '@/app/_action/togglePublic'
import { logger } from '@/app/_lib/logger';
import ConfirmDialog from '@/app/_components/confirmDialog'
import { CreateResult, DeleteResult } from '@/app/_types/crud';
import {Quiz} from '@/app/_types/quiz'
import ErrorDialog from '@/app/_components/errorDialog'

type Props = {
    myQuizzes:QuizForMyQuizzes[]
}


type DialogProps = {
  open:boolean,
  title:string,
  text:string,
  handleCancel:()=>void,
  handleConfirm:()=>void,
}


export function MyQuizzesTable({myQuizzes}:Props){


  const [isPending,startTransition] = useTransition()

  //エラーダイアログ対応
  const [err,setErr] = useState<CreateResult<Quiz>| DeleteResult<Quiz>>()
      //エラーダイアログ対応
  const [openE,setOpenE] = useState<boolean>(false)
  const handleCloseE = () => {
        setOpenE(false)
  }

    const editErrorMessage = ():string => {
        return "エラーが発生しました。"
    }


  //ダイアログを閉じるための関数
  const cancelHandler = () =>{
    setDialogState(prev => {return {...prev,open:false}})
  }
  

  //ダイアログの結果OKのときに実行する処理（削除）
  const deleteQuiz = (quizId:string) =>{
    startTransition(async() => {
      const result = await DeleteQuizAction(quizId)
      if(result.systemError || result.systemError){
        logger.error(result,"クイズ削除失敗")
         setOpenE(true)
      }
        setDialogState(prev => {return {...prev,open:false}})
      }
    )
  }

  //ダイアログの結果OKのときに実行する処理（公開/非公開）
  const togglePublicQuiz = (quizId:string,isPublic:boolean) =>{
    startTransition(async() => {
      const result = await togglePublicAction(quizId,isPublic)
      if(result.systemError || result.systemError){
        logger.error(result,"クイズ公開非公開切り替え失敗")
        setOpenE(true)
      }
      setDialogState(prev => {return {...prev,open:false}})
    })
  }

  //ダイアログを表示する(削除)
  const showDialogForDelete = (quizId:string) =>{
    setDialogState(prev=> { return {
        ...prev,
        open:true,
        title:"削除確認ダイアログ",
        text:"本当にこのクイズを削除してよいですか？（操作は取り消しできません。）",
        handleConfirm:()=>{deleteQuiz(quizId)}
    }})
  }

  //ダイアログを表示する(公開非公開)
  const showDialogForTogglePublic = (quizId:string,isPublic:boolean) =>{
    setDialogState(prev=> { return {
        ...prev,
        open:true,
        title:"公開／非公開確認ダイアログ",
        text:isPublic ? "本当にこのクイズを非公開にしてよいですか？" : "本当にこのクイズを公開にしてよいですか？" ,
        handleConfirm:()=>{togglePublicQuiz(quizId,isPublic)}
    }})
  }

    //ダイアログの状態
  const [dialogState,setDialogState] = useState<DialogProps>({
    open:false,
    title:"",
    text:"",
    handleCancel:cancelHandler,
    handleConfirm:()=>{}
  })



  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="My Quizzess">
          <TableHead>
            <TableRow>
              <TableCell>問題文</TableCell>
              <TableCell>プレビュー</TableCell>
              <TableCell>変更</TableCell>
              <TableCell sx={{fontSize:'15px',whiteSpace:'nowrap'}}>公開／非公開</TableCell>
              <TableCell>削除</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {myQuizzes.map((q,index) => (
              <TableRow
                key={q.quizId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row" sx={{whiteSpace: "pre-line"}}>
                  {q.question}
                </TableCell>
                <TableCell><Link href={`/preview/${q.quizId}`}><Button variant="contained" color='primary' sx={{fontSize:'10px',whiteSpace:'nowrap'}}>プレビュー</Button></Link></TableCell>
                <TableCell><Link href={`/change/${q.quizId}`}><Button variant="contained" color='warning' sx={{fontSize:'10px'}}>変更</Button></Link></TableCell>
                <TableCell>
                  <Button variant="contained" color={q.isPublic ? 'success' :'secondary'} 
                  sx={{fontSize:'10px',whiteSpace:'nowrap'}} onClick={()=>{showDialogForTogglePublic(q.quizId,q.isPublic)}}>{q.isPublic ? '公開中' :'非公開中'}</Button>
                </TableCell>
                <TableCell>
                  <Button variant="contained" color='error' sx={{fontSize:'10px'}} onClick={() => {showDialogForDelete(q.quizId)}}>削除</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmDialog {...dialogState}></ConfirmDialog>
                
      <ErrorDialog open={openE} title='エラー発生' text={editErrorMessage()}
      handleConfirm={handleCloseE}
      ></ErrorDialog> 
    </>
  );
}