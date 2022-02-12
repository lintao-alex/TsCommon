import {IAnyCall, ICallback, ICallbackThis} from "../types";

const RESOLVE_PMS = Promise.resolve()
export function nextFrame<T extends IAnyCall<void>>(...callbackParam: ICallbackThis<T>) {
    const [callback, ...last] = callbackParam;
    RESOLVE_PMS.then(callback.bind(...last))
}