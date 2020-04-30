const app = require("./app.js");

// aqui eu inicio o servidor
// com essa divisão não preciso ter a execução do servidor junto
// isso ajuda bastante nos testes automatizados
app.listen(3000);

// para instalar o eslint
// yarn add eslint -D
// yarn eslint --init
// configurar o arquivo
/*
1 – Última opção 
2 – JS Modules (import / export)
3 – None of these
4 - TypeScript No
5 – Deselecionar o browser e selecionar o node
6 – User popular style guide
7 – Airbnb
8 – JS
9 - Yes
//instalar a extensao eslint
*/

// prettier
// yarn add prettier eslint-config-prettier eslint-plugin-prettier -D
