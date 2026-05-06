import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import {createQuizForAPI } from '../function/createQuizForAPI/resource'


const schema = a.schema({
  Quiz : a.model({
    quizId : a.id().required(),
    userId : a.string(),
    createdAt : a.datetime(),
    largeCategory : a.string().required(),
    smallCategory : a.string().required(),
    question : a.string().required(),
    choices : a.ref("Choice").required().array().required(),
    correctCount : a.integer().required(),//正解の選択肢数
    selectCount: a.integer().required(),//選択させる選択肢数　
    displaySelectCount:a.boolean().required(),// ※N個選択してくださいを表示。
    isPublic : a.boolean().required(),
    explanationText : a.string(),
    hintText : a.string(),
    updateAt : a.datetime(),
    createdBy: a.string()
  })
  .identifier(["quizId"])
  .secondaryIndexes(index => [
  index("largeCategory").sortKeys(["smallCategory"]).projection('INCLUDE',['question','createdAt','createdBy',"isPublic"])
  ,index("userId").sortKeys(["createdAt"]).projection('INCLUDE',['question','isPublic'])
  ])
  .authorization((allow) => [
    allow.publicApiKey().to(["read"]),
    allow.ownerDefinedIn('userId').to(["create","update", "delete", "read"]),
    allow.groups(["admin"])
  ])
  ,

  Choice : a.customType({
      choiceText : a.string().required(),
      isCorrect:a.boolean().required(),
  }),

  //API経由の登録の場合のインプットタイプ
  I_Quiz : a.customType({
    quizId : a.id().required(),
    userId : a.string(),
    createdAt : a.datetime(),
    largeCategory : a.string().required(),
    smallCategory : a.string().required(),
    question : a.string().required(),
    choices : a.ref("Choice").required().array().required(),
    correctCount : a.integer().required(),
    selectCount: a.integer().required(),
    displaySelectCount:a.boolean().required(),
    isPublic : a.boolean().required(),
    explanationText : a.string(),
    hintText : a.string(),
    updatedAt : a.datetime(),
    createdBy: a.string()
  }),

  ApiKey : a.model({
    userId : a.id().required(),
    apiKey : a.string().required(),
    userName: a.string().required(),
    dissabled : a.boolean().required(),
    expiredAt : a.datetime().required()
  })
  .identifier(["userId"])
  .secondaryIndexes(index => [
    index("apiKey").projection('INCLUDE',['userName','dissabled','expired'])
  ])
  .authorization(
    (allow) => [
      allow.ownerDefinedIn('userId').to(["create","update", "delete", "read"]),
      allow.groups(["admin"])
    ]
  ),

  CreateQuizForAPI: a.query().returns(a.string()).arguments({
    apiKey:a.string().required(),
    quiz:a.ref("I_Quiz").required()
  })
  .authorization(
    (allow) => [allow.publicApiKey()]
  ).handler(a.handler.function(createQuizForAPI))

  /*
  QuizList : a.model({
    userId : a.id().required(),
    groupName: a.string().required(),
    quizzes: a.string().array(),
    isPublic : a.boolean().required()
  })
    公開しているリストを作成するか。。。
  */
})


export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 365,//1年後に突然使えなくなるためデプロイが必要
    },
  },
  logging:true
});
