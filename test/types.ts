import {IAnyCall, ICallback, } from "../src/types"

function testTypeCallback<T extends IAnyCall<string>>(...args: ICallback<T>) {
    args[0].apply(null, args.slice(1))
}
testTypeCallback((a:number,b:string)=>b, 1, "1")