'use client';
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
    Divider,
    Alert
  } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import { Quiz } from "../_types/quiz";
import {Answer,ChoiceForSolve,answer_schema} from '../_types/answer'
import {zodResolver} from '@hookform/resolvers/zod'
import { ZodError } from 'zod';
import AnswerChoice from '@/app/_components/answerChoice'

import {useForm} from 'react-hook-form'
import { get } from 'node:http';
import { logger } from '../_lib/logger';

type Props={
    quiz:Quiz
}


export function AnswerQuizForm({quiz}:Props){
    //quizからanswerを作成
    //const answer:Answer = {...quiz}
    const choicesForSolve:ChoiceForSolve[] = quiz?.choices?.map(c => {
        return {isCorrect:c?.isCorrect,choiceText:c?.choiceText,isSelected:false}
    })!

    const answer:Answer = {...quiz,choices:choicesForSolve,answerStatus:"NOT_ANSWERED"}

    logger.info(answer,"取得したクイズ情報")

    const {register,handleSubmit,formState,reset,getValues} = useForm<Answer>(
        {
            resolver:zodResolver(answer_schema),
            defaultValues:answer
        }
    )

    const  toggleChoiceIsCorrect = (index:number) =>{
        reset(
            {   ...getValues(),
                choices:getValues().choices.map((c,i) => {
                    if (index === i){
                        return {...c,isSelected :!c.isSelected}
                    }else{
                        return c
                    }
                }),answerStatus:"NOT_ANSWERED"
            })
    }

    const  toggleChoiceIsCorrectRadio = (index:number) =>{
        logger.info(getValues(),"変更前情報")
        reset(
            {   ...getValues(),
                choices:getValues().choices.map((c,i) => {
                    if (index === i){
                        return {...c,isSelected : true}
                    }
                    return {...c,isSelected : false}
                }),answerStatus:"NOT_ANSWERED"
            })
        logger.info(getValues(),"変更後情報")
    }

    const submitHandler = (ans:Answer,event?: React.BaseSyntheticEvent) => {
        try {
            
            console.log('検証開始')
            answer_schema.parse(ans)
            console.log('検証成功')
            
            const answerResult = judgeCorrect()
            reset({...getValues(),answerStatus:answerResult ? "ANSWER_CORRECT":"ANSWER_INNCORRECT"})
            
            
        }catch(e){
            if (e instanceof ZodError){
                console.error(JSON.stringify(e))
            }
        }
    }

    const judgeCorrect = () =>{
        const ans = getValues()
        //選ばれた選択肢数と選ばれた選択肢が正解であること
        const condition1 = ans.choices.filter(c => c.isCorrect && c.isSelected).length === getValues().correctCount
        //選ばれた選択肢数と正解の選択肢数が一致すること
        const condition2 = ans.choices.filter(c => c.isSelected).length === getValues().correctCount
        return  condition1 && condition2
    }

    
    const errorHandler = (err:any) => {
        console.log(JSON.stringify(err))
    }


    return (
        <form 
        onSubmit={handleSubmit(submitHandler,errorHandler)}
        noValidate
        >
                <Card className="max-w-5xl mx-auto mt-6 shadow-lg">
                <Alert icon={<CheckCircleIcon fontSize="inherit" />} severity="success" hidden={getValues().answerStatus !== "ANSWER_CORRECT"}>
                    正解！おめでとうございます！
                </Alert>
                <Alert icon={<CancelIcon fontSize="inherit" />} severity="error" hidden={getValues().answerStatus !== "ANSWER_INNCORRECT"}>
                    不正解です。残念。。。
                </Alert>
                
                <CardContent sx={{overflow:'auto'}}>
                <Typography variant="body2" className="mb-4 font-bold" sx={{whiteSpace: "pre-line"}}>
                    {quiz.question}
                </Typography>

                
                <Divider />

                    <Box className="mt-3 space-y-3">
                        <Grid container spacing={2}>
                            <AnswerChoice formState={formState}
                            answer={getValues()}
                            register={register}
                            toggleChoiceIsCorrect={toggleChoiceIsCorrect}
                            toggleChoiceIsCorrectRadio={toggleChoiceIsCorrectRadio}
                            ></AnswerChoice>
                        </Grid>
                    </Box>

                {/* 回答 */}
                <Box className="mt-4 text-right">
                    <Button
                    variant="contained"
                    size="large"
                    type="submit"
                    >
                    回答する
                    </Button>
                </Box>
                </CardContent>
            </Card>
        </form>
    )
}