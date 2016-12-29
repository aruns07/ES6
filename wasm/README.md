
https://blog.mozilla.org/luke/2014/01/14/asm-js-aot-compilation-and-startup-performance/#jit

js compiler execution pipeline
https://blogs.windows.com/msedgedev/2015/05/07/bringing-asm-js-to-chakra-microsoft-edge/#8xvCI4CsJigkBc1M.97
Bailout
https://blogs.msdn.microsoft.com/ie/2014/10/09/announcing-key-advances-to-javascript-performance-in-windows-10-technical-preview/

https://hacks.mozilla.org/2015/12/compiling-to-webassembly-its-happening/

Emscripten : c/c++ -> asm.js -> wasm
binaryen : asm.js -> wasm

Binaryen bin
wasm-opt: Optimize .wast files
wasm-as: Assemble a .wast (WebAssembly text format) into a .wasm (WebAssembly binary format)
wasm-dis: Un-assemble a .wasm (WebAssembly binary format) into a .wast (WebAssembly text format)
wasm-shell: Execute .wast files 

An issue with WASM import https://bugs.chromium.org/p/chromium/issues/detail?id=663717
If I remove all imports from the add.wast, then it works fine.
