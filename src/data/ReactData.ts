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
    let MyReactFnMap: Record<string, ReactFn[]> = {};
    let NextCallPropertyList: string[] = [];

    const obj =  Proxy.revocable(orgData, {
        get(target: T, p: string): any {
            if(cur_react_fn) {
                let list = MyReactFnMap[p]
                if(!list) {
                    MyReactFnMap[p] = [cur_react_fn]
                } else if(list.findIndex(v=>isSameFn(v,cur_react_fn))<0) {
                    list.push(cur_react_fn)
                }
            }
            return target[p]
        },
        set(target: T, p: string, value: any): boolean {
            /** todo
             * check same value
             * recursion call by set in render
             * same call from other ReactData
             */
            target[p] = value
            if(NextCallPropertyList.indexOf(p)<0) {
                NextCallPropertyList.push(p)
                if (NextCallPropertyList.length == 1) {
                    nextFrame(callReactFn, null);
                }
            }
            return true
        }
    })

    function callReactFn() {
        let callList: ReactFn[] = [];//exclude same call from different property
        for(let property of NextCallPropertyList) {
            let list = MyReactFnMap[property];
            if(!!list) {
                for(let reactFn of list) {
                    if(callList.findIndex(v=>isSameFn(v,reactFn))<0) {
                        callList.push(reactFn)
                    }
                }
            }
        }
        NextCallPropertyList.length = 0
        for(let [fn, caller] of callList) {
            fn.call(caller)
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