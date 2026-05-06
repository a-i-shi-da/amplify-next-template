export type Nullable<T> = {
    [P in keyof T]: T[P] | null
}

export type PartialNullable<T> = {
    [P in keyof T]?: T[P] | null
}

export type DeepPartialNullable<T> = {
    [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartialNullable<U>[] | null
    : T[P] extends object
    ? DeepPartialNullable<T[P]> | null
    : T[P] | null
}