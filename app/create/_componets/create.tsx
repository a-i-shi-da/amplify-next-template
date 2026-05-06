'use client';
import CreateQuizForm from '@/app/_components/createQuizForm'
import AuthenticatorWrapper from '@/app/_components/authWrapper'

export function CreateQuiz(){

    return (
        <AuthenticatorWrapper>
            <CreateQuizForm/>
        </AuthenticatorWrapper>
    )
}