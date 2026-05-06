import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { createQuizForAPI } from './function/createQuizForAPI/resource.js';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';

const backend = defineBackend({
  auth,
  data,
  createQuizForAPI
});

const QUIZ_TABLE_NAME = backend.data.resources.tables["Quiz"].tableName;
const APIKEY_TABLE_NAME = backend.data.resources.tables["ApiKey"].tableName;
const COGNITO_POOL_ID = backend.auth.resources.identityPoolId
const LAMBDA_CREATEQUIZFORAPI = backend.createQuizForAPI.resources.lambda.functionName

backend.addOutput({
  custom:{
    quizTableName:QUIZ_TABLE_NAME,
    apiKeyTableName:APIKEY_TABLE_NAME,
    cognitoPoolID:COGNITO_POOL_ID,
    lambda_createQuizForAPI:LAMBDA_CREATEQUIZFORAPI
  }
})

backend.createQuizForAPI.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect:Effect.ALLOW,
    actions:["dynamodb:PutItem"],
    resources:[
      backend.data.resources.tables["Quiz"].tableArn
    ]
  })
)

backend.createQuizForAPI.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect:Effect.ALLOW,
    actions:["dynamodb:Query","dynamodb:GetItem"],
    resources:[
      backend.data.resources.tables["ApiKey"].tableArn,
      `${backend.data.resources.tables["ApiKey"].tableArn}/index/*`
    ]
  })
)


backend.createQuizForAPI.addEnvironment(
  "QUIZ_TABLE_NAME",QUIZ_TABLE_NAME,
)
backend.createQuizForAPI.addEnvironment(
  "APIKEY_TABLE_NAME",
  APIKEY_TABLE_NAME
)