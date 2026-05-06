import {Card,FormControl,FormControlLabel,FormHelperText,
    TextField,Checkbox,
    FormGroup,Button} from '@mui/material'


import {QuizForCreate} from '@/app/_types/quiz'
import {UseFormRegister,FormState} from 'react-hook-form'
import { Delete } from '@mui/icons-material'


type Props = {
    register: UseFormRegister<QuizForCreate>,
    index:number,
    formState:FormState<QuizForCreate>,
    isCorrect : boolean,
    deleteChoice : (index:number) => void,
    toggleChoiceIsCorrect:(index:number) => void
}

function ensureArrayChoicesChoiceText(formState:FormState<QuizForCreate>,index:number){
    const choices = formState.errors.choices
    if (Array.isArray(choices)) {
        return choices.at(index)?.choiceText?.message?.toString?.()
    }
    return ""
}

function ensureArrayChoicesIsCorrect(formState:FormState<QuizForCreate>,index:number){
    const choices = formState.errors.choices
    if (Array.isArray(choices)) {
        return choices.at(index)?.choiceText?.message?.toString?.()
    }
    return ""
}


export function ChoiceInput({register,index,formState,isCorrect,deleteChoice,toggleChoiceIsCorrect}:Props){
    const helperTextChoices = formState.errors.choices
    return (
        <Card variant='outlined' className="p-3">
            <TextField
                label={`選択肢`}
                {...register(`choices.${index}.choiceText`)}
                error={!!formState.errors?.choices?.[index]?.choiceText}
                helperText={formState?.errors?.choices && ensureArrayChoicesChoiceText(formState,index)}
                multiline
                fullWidth
                minRows={3}
                maxRows={8}
                
            />
            <FormControl error={!!formState.errors?.choices?.[index]?.isCorrect}>
                <FormGroup>
                    <FormControlLabel 
                    control={<Checkbox {...register(`choices.${index}.isCorrect`)} 
                    checked={isCorrect ?? false} 
                    onChange={() => toggleChoiceIsCorrect(index)}
                    color={formState.errors?.choices?.[index]?.isCorrect ? "error":"primary"}
                        />} label="正解" 
                    />
                </FormGroup>
                {formState.errors?.choices?.[index]?.isCorrect && 
                <FormHelperText>
                    {formState?.errors?.choices && formState.errors?.choices?.[index]?.isCorrect.message }
                </FormHelperText>}
            </FormControl>
            <Button variant='outlined' onClick={() => deleteChoice(index)} startIcon={<Delete />}>Delete</Button>
        </Card>
    )
}