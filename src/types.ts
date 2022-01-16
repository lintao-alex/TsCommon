export interface IClear {
    clear(): void
}

export interface IClass<R> {
    new(...args: any): R
}

export interface IAnyCall<R=any> {
    (...args: any): R
}

export type ICallback<T extends IAnyCall<R>, R=any> = [
    callback: T,
    ...args: Parameters<T>
]

export  type ICallbackThis<T extends IAnyCall<R>, R=any> = [
    any,
    ...ICallback<T, R>
]