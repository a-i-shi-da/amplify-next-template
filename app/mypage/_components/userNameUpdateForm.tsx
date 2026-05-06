'use client'

import { TextField,Button,Card,Box } from "@mui/material"
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {usernameSchema,UserNameInput} from '@/app/_types/user'
import {updateUserName} from '@/app/_clientapi/user'
import { useTransition,useState } from "react"
import ConfirmDialog from '@/app/_components/confirmDialog'
import {logger} from '@/app/_lib/logger'
import {UpdateUserAttributesOutput} from 'aws-amplify/auth'
import {updateQuizForPostUserNameUpdatedAction} from '@/app/_action/updateQuizForPostUserNameUpdated'
import ErrorDialog from '@/app/_components/errorDialog'

type Props = {
    username:string
}


type DialogProps = {
  open:boolean,
  title:string,
  text:string,
  handleCancel:()=>void,
  handleConfirm:()=>void,
}


export function UserNameUpdateForm({username}:Props){
    
    //ダイアログを閉じるための関数
    const cancelHandler = () =>{
        setDialogState(prev => {return {...prev,open:false}})
    }

    //ダイアログの結果OKのときに実行する処理（ユーザ名更新）
    const updateUserNameExecute = (username:string) =>{
        startTransition(async() => {
        const output:UpdateUserAttributesOutput = await updateUserName(username)
        if(!output){
            logger.error("ユーザ名更新失敗（クライアント）")
            setOpenE(true)
        }
        await updateQuizForPostUserNameUpdatedAction()
            setDialogState(prev => {return {...prev,open:false}})
        })
    }

    //ダイアログを表示する(ユーザ名更新)
    const showDialog = (usename:string) =>{
        setDialogState(prev=> { return {
            ...prev,
            open:true,
            title:`ユーザ名更新確認`,
            text:`ユーザ名を更新してもよいですか？（作成したクイズすべての情報も変更されます）`,
            handleConfirm:()=>{updateUserNameExecute(usename)}
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

    const submitHandler = (data:UserNameInput) => {
        logger.info(data)
        showDialog(data.username)
    }
    const errorHandler = (err:any) => {logger.info(err)}


    const [isPending,startTransition] = useTransition()

    const {register,handleSubmit,control,formState:{errors}} = useForm<UserNameInput>({
        defaultValues:{username:""},
        resolver:zodResolver(usernameSchema)
    })

    //エラーダイアログ対応
    const [openE,setOpenE] = useState<boolean>(false)
    const handleCloseE = () => {
        setOpenE(false)
    }

    const editErrorMessage = ():string => {
        return "エラーが発生しました。"
    }

    return (
        <Card className="max-w-2xl mx-auto mt-3 shadow-lg">
             <Box className="mt-3 space-y-3">
                <TextField label="ユーザ名" defaultValue={username} 
                    variant='filled'
                    fullWidth
                    size='medium'
                    slotProps={
                        {
                            input:{readOnly:true}
                        }
                    }
                    sx={{
                        '& .MuiInputBase-root': {
                        height: 56,
                        },
                    }}
                />
            </Box>
            <form noValidate onSubmit={handleSubmit(submitHandler,errorHandler)}>
                 <Box className="mt-3 space-y-3">
                    <TextField
                        label="変更後ユーザ名"
                        {...register('username')}
                        error={'username' in errors}
                        helperText={errors.username?.message?.toString()}
                        size="medium"
                        fullWidth
                        sx={{
                            '& .MuiInputBase-root': {
                            height: 56,
                            },
                        }}
                    />
                </Box>
                <Box className="mt-3 space-y-3">
                    <Button type="submit"
                    variant="contained"
                    size="large"
                    >
                        ユーザ名を変更する
                    </Button>
                </Box>
            </form> 
            <ConfirmDialog {...dialogState}></ConfirmDialog>
            <ErrorDialog open={openE} title='エラー発生' text={editErrorMessage()}
                handleConfirm={handleCloseE}
            ></ErrorDialog>    
        </Card>
    )
}