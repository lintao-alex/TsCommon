import path from 'path'
import ts from 'rollup-plugin-typescript2'

const tsPlugin = ts({
    cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
    tsconfig: path.resolve(__dirname,'tsconfig.json'),
    tsconfigOverride: {
        compilerOptions: {
            module: "esnext"
        }
    }
})
export default {
    input: "test/react.ts",
    output: {
        file: "bin/bundle.js",
        format: "es"
    },
    plugins: [
        tsPlugin
    ]
}