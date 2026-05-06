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
    Checkbox,
    FormGroup
  } from '@mui/material'

import {UseFormRegister,FormState, Controller} from 'react-hook-form'


import { Answer } from '../_types/answer'


type ChoiceCheckProps = {
    choice : {
        isSelected : boolean,
        isCorrect:boolean,
        choiceText:string
    },
    formState:FormState<Answer>,
    register:UseFormRegister<Answer>,
    toggleChoiceIsCorrect:(index:number) => void,
    index:number
    answerStatus:string
}

type ChoiceRadioProps = {
    choice : {
        isSelected : boolean,
        isCorrect:boolean,
        choiceText:string
    },
    formState:FormState<Answer>,
    register:UseFormRegister<Answer>,
    toggleChoiceIsCorrectRadio: (index:number) => void,
    index:number,
    answerStatus:string
}

const getPostAnsweredColor = (choice: {
        isSelected : boolean,
        isCorrect:boolean,
        choiceText:string
    },answerStatus:string
    ) => {
        if(answerStatus === "NOT_ANSWERED"){
            return "white"
        }

        if(choice.isCorrect && !choice.isSelected && answerStatus === "ANSWER_INNCORRECT"){
            return "red"
        }

        if(!choice.isCorrect && choice.isSelected && answerStatus === "ANSWER_INNCORRECT"){
            return "silver"
        }
        return "white"
} 

const  wrapperClickHandler = (e:React.MouseEvent,handler:(index:number) => void,index:number) =>{
    e.stopPropagation()
    handler(index)
}


export function AnswerChoiceRadio({choice,formState,register,toggleChoiceIsCorrectRadio,index,answerStatus}:ChoiceRadioProps){
    return (
        <Grid size={{xs:12,md:6}}>
            <Box sx={{margin:'10px',backgroundColor:getPostAnsweredColor(choice,answerStatus)}}>
                <Card variant='outlined' className="p-2" sx={{backgroundColor:getPostAnsweredColor(choice,answerStatus)}}
                onClick={(e)=>{wrapperClickHandler(e,toggleChoiceIsCorrectRadio,index)}}
                >
                    <FormControl error={!!formState.errors?.choices?.[index]?.isSelected}>
                        <FormGroup>
                            <FormControlLabel 
                            control={<Radio {...register(`choices.${index}.isSelected`)} 
                            checked={choice.isSelected ?? false} 
                            //onChange={() => toggleChoiceIsCorrectRadio(index)}
                            onClick={(e)=>{wrapperClickHandler(e,toggleChoiceIsCorrectRadio,index)}}
                            color={formState.errors?.choices?.[index]?.isSelected ? "error":"primary"}
                                />} label={choice.choiceText} 
                            />
                        </FormGroup>
                        {formState.errors?.choices?.[index]?.isSelected && 
                        <FormHelperText>
                            {formState?.errors?.choices && formState.errors?.choices?.[index]?.isSelected.message }
                        </FormHelperText>}
                    </FormControl>
                </Card>
            </Box>
        </Grid>
    )
}



export function AnswerChoiceCheckBox({choice,formState,register,toggleChoiceIsCorrect,index,answerStatus}:ChoiceCheckProps){
    return (
        <Grid size={{xs:12,md:6}}>
            <Box sx={{margin:'10px',backgroundColor:getPostAnsweredColor(choice,answerStatus)}}>
                <Card variant='outlined' className="p-2" sx={{backgroundColor:getPostAnsweredColor(choice,answerStatus)}}
                onClick={(e)=>{wrapperClickHandler(e,toggleChoiceIsCorrect,index)}}
                >
                    <FormControl error={!!formState.errors?.choices?.[index]?.isSelected}>
                        <FormGroup>
                            <FormControlLabel sx={{whiteSpace: "pre-line"}}
                            control={<Checkbox {...register(`choices.${index}.isSelected`)} 
                            checked={choice.isSelected ?? false} 
                            //onChange={() => toggleChoiceIsCorrect(index)}
                            onClick={(e)=>{wrapperClickHandler(e,toggleChoiceIsCorrect,index)}}
                            color={formState.errors?.choices?.[index]?.isSelected ? "error":"primary"}
                                />} label={choice.choiceText} 
                            />
                        </FormGroup>
                        {formState.errors?.choices?.[index]?.isSelected && 
                        <FormHelperText>
                            {formState?.errors?.choices && formState.errors?.choices?.[index]?.isSelected.message }
                        </FormHelperText>}
                    </FormControl>
                </Card>
            </Box>
        </Grid>
    )
}

export function AnswerChoiceRadioV2({choice,formState,register,toggleChoiceIsCorrectRadio,index,answerStatus}:ChoiceRadioProps){
    return (
        <Grid size={{xs:12,md:6}}>
            <Box sx={{margin:'10px',backgroundColor:getPostAnsweredColor(choice,answerStatus)}}>
                <Card variant='outlined' className="p-2" sx={{backgroundColor:getPostAnsweredColor(choice,answerStatus)}}
                onClick={(e)=>{wrapperClickHandler(e,toggleChoiceIsCorrectRadio,index)}}
                >
                    <FormControl error={!!formState.errors?.choices?.[index]?.isSelected}>
                        <FormGroup>
                            <FormControlLabel sx={{whiteSpace: "pre-line"}}
                            control={<Checkbox {...register(`choices.${index}.isSelected`)} 
                            checked={choice.isSelected ?? false} 
                            //onChange={() => toggleChoiceIsCorrectRadio(index)}
                            onClick={(e)=>{wrapperClickHandler(e,toggleChoiceIsCorrectRadio,index)}}
                            color={formState.errors?.choices?.[index]?.isSelected ? "error":"primary"}
                                />} label={choice.choiceText} 
                            />
                        </FormGroup>
                        {formState.errors?.choices?.[index]?.isSelected && 
                        <FormHelperText>
                            {formState?.errors?.choices && formState.errors?.choices?.[index]?.isSelected.message }
                        </FormHelperText>}
                    </FormControl>
                </Card>
            </Box>
        </Grid>
    )
}


type Props = {
    answer:Answer,
    formState:FormState<Answer>,
    register:UseFormRegister<Answer>,
    toggleChoiceIsCorrect:(index:number) => void
    toggleChoiceIsCorrectRadio:(index:number) => void
}

export default function AnswerChoice({ answer,formState,register,toggleChoiceIsCorrect,toggleChoiceIsCorrectRadio }: Props) {
  return (
    answer.correctCount > 1
      ? answer.choices.map((c, index) => {
          return (
            <AnswerChoiceCheckBox key={index} 
            choice={c} formState={formState} register={register}
            toggleChoiceIsCorrect={toggleChoiceIsCorrect} 
            index={index} answerStatus={answer.answerStatus} />
          );
        })
      : 
       answer.choices.map((c, index) => {
        return (
            <AnswerChoiceRadioV2 key={index} choice={c} 
            formState={formState} register={register}
            toggleChoiceIsCorrectRadio={toggleChoiceIsCorrectRadio}
            index={index} answerStatus={answer.answerStatus}
            />
        );
    })
  );
}