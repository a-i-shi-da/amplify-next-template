"use client"

import type { ReactNode } from "react"
import { Amplify } from "aws-amplify"
import outputs from "@/amplify_outputs.json"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";


type Props = {
    children :ReactNode
}

Amplify.configure(outputs,{ssr:true})
export const client = generateClient<Schema>();

export default function AmplifyProvider({ children }:Props) {
  return children
}