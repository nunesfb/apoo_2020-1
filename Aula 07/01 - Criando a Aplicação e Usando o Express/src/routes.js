// aqui não preciso desta forma importar todo express, mas somente o Router
const { Router } = require('express');

// usando o metodo Router no routes
const routes = new Router();

//crio uma rota de teste
routes.get('/test', (req, res) => {
    return res.json ({ message: 'OK!' });
});

module.exports = routes;

//para testar
//node src/server.js