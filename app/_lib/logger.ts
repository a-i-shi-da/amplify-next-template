import { hostname } from 'node:os'
import pino from 'pino'

const isDev = process.env.NODE_ENV === "development"

export const logger = pino({
    level:process.env.LOG_LEVEL || "info",
    timestamp: pino.stdTimeFunctions.isoTime,
    //マスキング　一致するキーの値をマスキング
    redact : {
        paths:['password','email','createdBy'],
        censor:'*******'
    },

    // 不要な情報を出力しない  
    base:{
        pid:undefined,
        hostname:undefined
    },

    browser : {
        asObject:true
    },

    ... (isDev &&
        {
            transport : {
                target:'pino-pretty',
                options: {
                    colorize:true,
                    tarnslateTime:'SYS:standard',
                    ignore:'pid,hostname'
                }
            }
        }
    )

})