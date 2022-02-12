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
    let myReactFn: ReactFn|undefined;
    let callCnt = 0; //make reactFn only be called once at next frame

    const obj =  Proxy.revocable(orgData, {
        get(target: T, p: string | symbol, receiver: any): any {
            if(!myReactFn) {
                myReactFn = cur_react_fn;
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
            if(myReactFn) myReactFn[0].call(myReactFn[1])
        } else if(callCnt<0) {
            throw "call too much"
        }
    }
    return obj.proxy
    //todo revoke
}

function test() {
}