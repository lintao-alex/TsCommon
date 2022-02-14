// type Primitive = string | boolean | number | null | undefined;
// type PureData = Record<string, Primitive|Array<Primitive>>
import {nextFrame} from "../utils/nextFrame";

type PureData = object;

type ReactFn = [
    callback: ()=>void,
    caller?: any
];

let cur_react_fn: ReactFn|undefined;

export function markReactFn(...args: ReactFn) {
    cur_react_fn = args;
}

export function clearReactFn() {
    cur_react_fn = undefined;
}

export function createReactData<T extends PureData>(orgData: T): T {
    let myReactFnList: ReactFn[] = [];
    let callCnt = 0; //make reactFn only be called once at next frame

    const obj =  Proxy.revocable(orgData, {
        get(target: T, p: string | symbol, receiver: any): any {
            if(cur_react_fn && myReactFnList.findIndex(v=>isSameFn(v, cur_react_fn))<0) {
                myReactFnList.push(cur_react_fn)
            }
            return target[p]
        },
        set(target: T, p: string | symbol, value: any, receiver: any): boolean {
            /** todo
             * check same value
             * recursion call by set in render
             */
            target[p] = value
            ++callCnt
            nextFrame(callReactFn, null);
            return true
        }
    })

    function callReactFn() {
        --callCnt
        if(callCnt == 0) {
            for(let [fn, caller] of myReactFnList) {
                fn.call(caller)
            }
        } else if(callCnt<0) {
            throw "call too much"
        }
    }
    return obj.proxy
    //todo revoke
}

function isSameFn(fn1: ReactFn, fn2: ReactFn) {
    if(fn1[0]!=fn2[0]) return false
    const caller1 = fn1[1]
    const caller2 = fn2[1]
    if(!caller1 && !caller2) return true
    return caller1 == caller2
}