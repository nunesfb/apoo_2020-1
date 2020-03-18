const app = require('./app.js');

// aqui eu inicio o servidor
// com essa divisão não preciso ter a execução do servidor junto
// isso ajuda bastante nos testes automatizados
app.listen(3000);
