'use client'
import {Card,Typography,Divider,Button} from '@mui/material'
import { useState,useTransition } from 'react'
import {logger} from '@/app/_lib/logger'
import ConfirmDialog from '@/app/_components/confirmDialog'
import {resignUser} from '@/app/_clientapi/user'
import { useRouter } from 'next/navigation'
import {deleteAllInfoUserResignAction} from '@/app/_action/deleteAllInfoUserResign'
import ErrorDialog from '@/app/_components/errorDialog'

type DialogProps = {
  open:boolean,
  title:string,
  text:string,
  handleCancel:()=>void,
  handleConfirm:()=>void,
}


export function ResignForm(){
    const [isPending,startTransition] = useTransition() 
    const router = useRouter()

    //ダイアログを閉じるための関数
    const cancelHandler = () =>{
        setDialogState(prev => {return {...prev,open:false}})
    }    

    //ダイアログの結果OKのときに実行する処理（ユーザ削除）
    const resignUserExecute = () =>{
        startTransition(async() => {
            const result = await deleteAllInfoUserResignAction()
            if(result){
                logger.error(result)
                setDialogState(prev => {return {...prev,open:false}})
                setOpenE(true)
                return
            }
            await resignUser()
            setDialogState(prev => {return {...prev,open:false}})
            router.replace("/login")
        })
    }


    //ダイアログの状態
    const [dialogState,setDialogState] = useState<DialogProps>({
        open:false,
        title:"",
        text:"",
        handleCancel:cancelHandler,
        handleConfirm:()=>{}
    })



    //ダイアログを表示する(ユーザ名更新)
    const showDialog = () =>{
        setDialogState(prev=> { return {
            ...prev,
            open:true,
            title:`ユーザ情報削除確認`,
            text:`ユーザ情報を削除してもよいですか？（あなたが作成した情報はすべて削除されます）`,
            handleConfirm:()=>{resignUserExecute()}
        }})
    }

    //エラーダイアログ対応
    const [openE,setOpenE] = useState<boolean>(false)
    const handleCloseE = () => {
        setOpenE(false)
    }

    const editErrorMessage = ():string => {
        return "エラーが発生しました。"
    }


    return(
        <>
            <Card className="max-w-2xl mx-auto mt-3 shadow-lg">
                <Divider/>
                    <Typography variant='body1'>
                    ユーザ情報を削除したい場合は下のボタンを押下してください。
                    ユーザ情報を削除すると、ユーザが登録した情報は削除されます。
                    削除すると情報は復元不可能です。
                    </Typography>
                <Divider/>
                <Button color='error'
                variant="contained"
                size="large"
                onClick={()=>{showDialog()}}
                >ユーザ情報を削除する</Button>
            </Card>
            <ConfirmDialog {...dialogState}></ConfirmDialog>
            <ErrorDialog open={openE} title='エラー発生' text={editErrorMessage()}
                handleConfirm={handleCloseE}
            ></ErrorDialog>   
       </>
    )
    
}