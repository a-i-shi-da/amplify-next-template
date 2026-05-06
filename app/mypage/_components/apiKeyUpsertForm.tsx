'use client'

import {APIKey} from '@/app/_types/apikey'
import {
    Card,
    TextField,
    Typography,
    Button,
    Box
} from '@mui/material'
import { useEffect, useState, useTransition } from 'react'
import ConfirmDialog from '@/app/_components/confirmDialog'
import {logger} from '@/app/_lib/logger'
import {toggleDissableAPIKeyAction} from '@/app/_action/toggleDissableAPIKey'
import { upSertAPIKeyAction } from '@/app/_action/upsertAPIKey'
import ErrorDialog from '@/app/_components/errorDialog'


type Props = {
    apiKeyInfo?:APIKey
}

type DialogProps = {
  open:boolean,
  title:string,
  text:string,
  handleCancel:()=>void,
  handleConfirm:()=>void,
}


export function ApiKeyUpsertForm({apiKeyInfo}:Props){
    const [isPending,startTransition] = useTransition() 
    
    //ダイアログを閉じるための関数
    const cancelHandler = () =>{
        setDialogState(prev => {return {...prev,open:false}})
    }

    //ダイアログの結果OKのときに実行する処理（APIキー有効化/無効化）
    const toggleDissableAPIKey = (dissabled:boolean) =>{
        startTransition(async() => {
        const result = await toggleDissableAPIKeyAction(dissabled)
        if(result){
            logger.error(result)
            setOpenE(true)
        }
            setDialogState(prev => {return {...prev,open:false}})
        }
        )
    }

    //ダイアログの結果OKのときに実行する処理（APIキー作成/更新）
    const upsertAPIKey = () =>{
        startTransition(async() => {
        const result = await upSertAPIKeyAction()
        if(result){
            logger.error(result)
            setOpenE(true)
        }
            setDialogState(prev => {return {...prev,open:false}})
        })
    }

    //ダイアログを表示する(有効化／無効化)
    const showDialogForToggleDissable = (disabled:boolean) =>{
        setDialogState(prev=> { return {
            ...prev,
            open:true,
            title:`APIキー${disabled ? "有効化" : "無効化"}確認`,
            text:`APIキーを${disabled ? "有効化" : "無効化"}してもよいですか？`,
            handleConfirm:()=>{toggleDissableAPIKey(disabled)}
        }})
    }

    //ダイアログを表示する(更新/作成)
    const showDialogForUpsert = (isUpdate:boolean) =>{
        setDialogState(prev=> { return {
            ...prev,
            open:true,
            title:`APIキー${isUpdate ? "更新" : "作成"}確認`,
            text:`APIキーを${isUpdate ? "更新してもよいですか？（無効化している場合は自動で有効化されまます。）" : "作成"}してもよいですか？`,
            handleConfirm:()=>{upsertAPIKey()}
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

    const [expireString,setExpireString] = useState<string>()
    
    useEffect(() => {
        setExpireString(prev => apiKeyInfo ? new Date(apiKeyInfo.expiredAt).toLocaleDateString() : "")
    },[])

    //エラーダイアログ対応
    const [openE,setOpenE] = useState<boolean>(false)
    const handleCloseE = () => {
        setOpenE(false)
    }

    const editErrorMessage = ():string => {
        return "エラーが発生しました。"
    }

    
    return (apiKeyInfo ? (
        <Card className="max-w-2xl mx-auto mt-3 shadow-lg">
            <Typography variant='body2'>
                APIキーは下記です。
                {apiKeyInfo.dissabled ? "無効化されているため、有効化が必要です。" : "有効となっています。"}
                有効期限は{expireString}
            </Typography>
            <TextField label="APIキー" defaultValue={apiKeyInfo.apiKey} 
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
            <Box className="mt-3 space-y-3">            
                <Button color={apiKeyInfo.dissabled ? 'primary':'error'} 
                onClick={() => showDialogForToggleDissable(apiKeyInfo.dissabled)}
                variant="contained"
                size="large"
                >
                    {apiKeyInfo.dissabled ? '有効化する':'無効化する'}
                </Button>
            </Box>
            <Box className="mt-3 space-y-3">                
                <Button color='success' onClick={() => showDialogForUpsert(true)}
                variant="contained"
                size="large"
                >
                    更新する
                </Button>
            </Box>
            <ConfirmDialog {...dialogState}></ConfirmDialog>
            <ErrorDialog open={openE} title='エラー発生' text={editErrorMessage()}
            handleConfirm={handleCloseE}
            ></ErrorDialog>
        </Card>
    ) : (
            <Card className="max-w-2xl mx-auto mt-3 shadow-lg">
                <Typography variant='body2'>
                    APIキーは登録されていません。
                </Typography>
                <Box className="mt-3 space-y-3">
                    <Button color='success' onClick={() => showDialogForUpsert(false)}
                    variant="contained"
                    size="large"
                    >
                        作成する
                    </Button>
                </Box>
                <ConfirmDialog {...dialogState}></ConfirmDialog>
                <ErrorDialog open={openE} title='エラー発生' text={editErrorMessage()}
                handleConfirm={handleCloseE}
                ></ErrorDialog>
            </Card>
        )
    )
}