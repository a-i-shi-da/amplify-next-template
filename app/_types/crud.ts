import {GraphQLFormattedError} from '@aws-amplify/data-schema/runtime'
import {z} from 'zod'

export type CreateResult<T> = {
    data?:T | null,
    validationErrors?:z.core.$ZodIssue[],
    graphqlErrors?:GraphQLFormattedError[],
    systemError?:string
}

export type DeleteResult<T> = {
    data?:T | null,
    graphqlErrors?:GraphQLFormattedError[],
    systemError?:string
}