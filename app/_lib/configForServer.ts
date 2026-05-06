import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data'

import { cookies } from 'next/headers' 
import {Schema} from '@/amplify/data/resource'
import { createServerRunner  } from '@aws-amplify/adapter-nextjs'
import { getCurrentUser,fetchUserAttributes } from '@aws-amplify/auth/server'
import {  } from '@aws-amplify/auth/cognito'
import config from '@/amplify_outputs.json'

export const getClient = () => {
    return generateServerClientUsingCookies<Schema>({
        config,
        cookies,
    })
}

export const { runWithAmplifyServerContext } = createServerRunner({
  config,
});

export async function getUserForServer(){
    return await runWithAmplifyServerContext({
        nextServerContext: { cookies: () => cookies() },
        operation: (contextSpec) => getCurrentUser(contextSpec),
    })
}

export async function fetchUserAttributesForServer(){
    return await runWithAmplifyServerContext({
        nextServerContext: { cookies: () => cookies() },
        operation: (contextSpec) => fetchUserAttributes(contextSpec),
    })
}