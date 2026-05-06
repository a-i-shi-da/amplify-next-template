import { defineFunction } from "@aws-amplify/backend";
export const createQuizForAPI = defineFunction({
    entry:"./handler.ts",
    name:"createQuizForAPI",
    runtime:22,
    timeoutSeconds:10,
    resourceGroupName:"data"
})