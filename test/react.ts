import {clearReactFn, createReactData, markReactFn} from "../src/data/ReactData";

interface IStudentData {
    name: string,
    age: number,
    lv: number,
    quality: number
}
let orgStudent: IStudentData = {
    name: "aa",
    age: 18,
    lv: 3,
    quality: 3,
}

let reactStudent = createReactData(orgStudent)

function displayStudent() {
    let result = JSON.stringify(reactStudent,null,2)
    console.log(result)
    return result
}

markReactFn(displayStudent)

console.log("First call")
displayStudent()

clearReactFn()

console.log("Then react")

reactStudent.lv++