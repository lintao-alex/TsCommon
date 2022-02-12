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
    console.log(`hello my name is ${reactStudent.name}, lv${reactStudent.lv}, at quality ${reactStudent.quality}`)
}

markReactFn(displayStudent)

console.log("First call")
displayStudent()

clearReactFn()
console.log("Then react")
reactStudent.lv++
reactStudent.quality++