"use client";

import { Button,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Radio,
    RadioGroup,
    styled,
    TextField,
    IconButton,
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    Divider
  } from '@mui/material'
import { useActionState,useEffect,useState,useTransition } from 'react';

import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import { ZodError } from 'zod';

import { useFormState } from 'react-dom';

import {updateQuizAction} from '@/app/_action/updateQuiz'
import {client_update_schema,Mode} from '@/app/_types/quiz'
import {CreateResult} from '@/app/_types/crud'
import { Quiz } from '@/app/_types/quiz';
import { ChoiceInputForUpdate } from './choiceInputForUpdate';
import {Add} from '@mui/icons-material'
import { logger } from '../_lib/logger';

import BasicModal from '@/app/_components/modalComponent'
import {AnswerQuizForm} from '@/app/_components/answerQuiz'
import ErrorDialog from '@/app/_components/errorDialog'

type Props = {
    quiz:Quiz
}

export default function UpdateQuizForm({quiz}:Props){
    const [choicesNumber,setChoicesNumber] = useState<number>(quiz.choices.length)
    
    const {register,handleSubmit,control,formState,reset,getValues} = useForm<Quiz>({
        resolver : zodResolver(client_update_schema),
        defaultValues: {...quiz}
    })

    useEffect(()=>{
        if (choicesNumber < getValues().choices.length){
            reset({...getValues(),choices: getValues().choices.filter((choice,index) => index < choicesNumber)})
        }else if ((choicesNumber > getValues().choices.length)){
            //UIで1つずつしか増えないため、一度に２つ以上の増減は考慮不要
            //npm run devではuseEffectは２回動いてしまうため、else ifが必要
            reset({...getValues(),choices: [...getValues().choices ,{choiceText:"",isCorrect:false}]})
        }
    },[choicesNumber])

    const addChoice = () => {
        reset({...getValues(),choices: [...getValues().choices ,{choiceText:"",isCorrect:false}]})
        setChoicesNumber((prev) => prev + 1)
    }

    const deleteChoice = (index:number) => {
        reset({...getValues(),choices: getValues().choices.filter((_choice,i) => index !== i )})
        setChoicesNumber((prev) => prev - 1)
    }

    const toggleChoiceIsCorrect =(index:number) =>{
        reset({...getValues(),choices: getValues().choices.map((c,i) =>{
            if (i === index){
                return {...c,isCorrect:!c.isCorrect}
            }
            return c
        })})
    }

    const [isPending,startTransition] = useTransition()

    const submitHandler = async(quiz:Quiz) => {
        try {
            
            client_update_schema.parse(quiz)
            logger.info('クライアント検証成功')
            startTransition(async() =>{await actionHandler(quiz)})
            
            
        }catch(e){
            if (e instanceof ZodError){
                logger.info(e,"クライアント検証エラー")
            }
        }
    }
    
    const errorHandler = (err:any) => {
        logger.error(err,"フォーム送信エラー")
    }
    
    //const [state,actionHandler,_isPending] = useActionState<any,QuizForCreate>(createQuizAction,null)
    //const [createResult,actionHandler,_isPending] = useActionState<CreateResult<PartialQuiz>,QuizForCreate>(createQuizAction,{})
    const [createResult,actionHandler,_isPending] = useActionState<CreateResult<Quiz>,Quiz>(updateQuizAction,{})

    //プレビュー対応
    const [open,setOpen] = useState<boolean>(false)
    const handleClose = () => {
        setOpen(false)
    }

    //エラーダイアログ対応
    const [openE,setOpenE] = useState<boolean>(false)
    const handleCloseE = () => {
        setOpenE(false)
    }

    const editErrorMessage = ():string => {
        return createResult.systemError ? createResult.systemError : "クイズ登録機能バックエンドでエラーが発生しました。"
    }


    return (
        <div>
            <form
            noValidate
            onSubmit={handleSubmit(submitHandler, errorHandler)}
            >
                <Card className="max-w-3xl mx-auto mt-6 shadow-lg">
                    <CardContent>
                    <Typography variant="h5" className="mb-4 font-bold">
                        問題更新フォーム
                    </Typography>

                    {/* 入力部品のないプロパティ */}
                    <input type="hidden" {...register('quizId')}/>
                    <input type="hidden" {...register('userId')}/>
                    <input type="hidden" {...register('createdBy')}/>

                    {/* カテゴリ */}
                    <Grid container spacing={2}>
                        <Grid size={{xs:12,md:6}}>
                        <TextField
                            fullWidth
                            label="大カテゴリ"
                            {...register('largeCategory')}
                            error={'largeCategory' in formState.errors}
                            helperText={formState.errors.largeCategory?.message?.toString()}
                            size="medium"
                            sx={{
                                '& .MuiInputBase-root': {
                                height: 56,
                                },
                            }}
                        />
                        </Grid>

                        <Grid size={{xs:12,md:6}}>
                        <TextField
                            fullWidth
                            label="小カテゴリ"
                            {...register('smallCategory')}
                            error={'smallCategory' in formState.errors}
                            helperText={formState.errors.smallCategory?.message?.toString()}
                            size="medium"
                            sx={{
                                '& .MuiInputBase-root': {
                                height: 56,
                                },
                            }}                    
                        />
                        </Grid>
                    </Grid>

                    {/* 問題文 */}
                    <Box className="mt-3">
                        <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        maxRows={10}
                        label="問題文"
                        {...register('question')}
                        error={'question' in formState.errors}
                        helperText={formState.errors.question?.message?.toString()}
                        />
                    </Box>

                    {/* 数値系 */}
                    <Grid container spacing={2} className="mt-3">
                        <Grid size={{xs:6,md:8}}>
                        <TextField
                            fullWidth
                            label="正解数"
                            type="number"
                            {...register('correctCount', { valueAsNumber: true })}
                            error={'correctCount' in formState.errors}
                            helperText={formState.errors.correctCount?.message?.toString()}
                            size="medium"
                            sx={{
                                '& .MuiInputBase-root': {
                                height: 56,
                                },
                            }}
                            slotProps={{
                                input: {
                                inputProps: {
                                    min: 1,
                                    max: 100,
                                    step: 1,
                                    onKeyDown:(e:any) => e.preventDefault() 
                                },
                                },
                            }}
                        />
                        </Grid>

                        <Grid size={{xs:6,md:8}}>
                        <TextField
                            fullWidth
                            label="選択可能数"
                            type="number"
                            {...register('selectCount', { valueAsNumber: true })}
                            error={'selectCount' in formState.errors}
                            helperText={formState.errors.selectCount?.message?.toString()}
                            sx={{
                                '& .MuiInputBase-root': {
                                height: 56,
                                },
                            }}
                            slotProps={{
                                input: {
                                    inputProps: {
                                        min: 1,
                                        max: 100,
                                        step: 1,
                                        onKeyDown:(e:any) => e.preventDefault() 
                                    },
                                },
                            }}
                        />
                        </Grid>
                    </Grid>

                    {/* 選択肢 */}
                    <Box className="mt-4">
                        <Box className="flex items-center justify-between mb-2">
                        <Typography variant="h6">選択肢</Typography>

                        <div className="flex items-center gap-2">
                            <IconButton color="primary" onClick={addChoice}>
                            <Add />
                            </IconButton>

                            <TextField
                            size="small"
                            label="選択肢数"
                            type="number"
                            value={choicesNumber}
                            onChange={(e) =>
                                setChoicesNumber(parseInt(e.target.value))
                            }
                            sx={{
                                '& .MuiInputBase-root': {
                                height: 30,width:100
                                },
                            }}
                            slotProps={{
                                input: {
                                    inputProps: {
                                        min: 2,
                                        max: 100,
                                        step: 1,
                                        onKeyDown:(e:any) => e.preventDefault() 
                                    },
                                },
                            }}
                            />
                        </div>
                        </Box>

                        <Divider />

                        <Box className="mt-3 space-y-3">
                        {getValues().choices.map((choice, index) => (
                            <Card
                            key={index}
                            variant="outlined"
                            className="p-2 bg-gray-50"
                            >
                            <ChoiceInputForUpdate
                                formState={formState}
                                register={register}
                                index={index}
                                isCorrect={choice.isCorrect}
                                deleteChoice={deleteChoice}
                                toggleChoiceIsCorrect={toggleChoiceIsCorrect}
                            />
                            </Card>
                        ))}
                        </Box>
                    </Box>

                    {/* 更新 */}
                    <Box className="mt-4 text-right">
                        <Button
                            variant="contained"
                            size="large"
                            type="button"
                            disabled={isPending}
                            color='secondary'
                            onClick={()=>{setOpen(true)}}
                            >
                            プレビュー
                        </Button>
                        <Button
                        variant="contained"
                        size="large"
                        type="submit"
                        disabled={isPending}
                        >
                        更新
                        </Button>
                    </Box>
                    </CardContent>
                </Card>
            </form>
            <BasicModal open={open} handleClose={handleClose}>
                <AnswerQuizForm quiz={getValues()}></AnswerQuizForm>
            </BasicModal>
            <ErrorDialog open={openE} title='エラー発生' text={editErrorMessage()}
            handleConfirm={handleCloseE}
            ></ErrorDialog>
        </div>
    )
}