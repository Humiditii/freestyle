export interface Err {
    readonly message:string
    readonly status:number
}


export interface MainStackRes {
    readonly message:string
    readonly statusCode:number
    readonly data:object
}