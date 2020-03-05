//aqui estamos chamando a biblioteca do express
//a partir daqui usamos a const express somente
const express = require('express');

//estamos dizendo que nossa aplicacao vai ser
//gerenciada pelo express
const server = express();

//estamos dizendo que vamos usar dados no formato json
server.use(express.json());

//criei aqui um array com 3 elementos
const users = ["Felipe", "Becker", "Nunes"];

//esta rota traz todos usuarios do array
server.get('/users/', (req, res) => {
    return res.json(users);
});

//esta rota recebe no body um novo nome
//eu adiciono este novo nome no array
//e imprimo o array atualizado
server.post('/users/', (req, res) => {
    const { name } = req.body;
    users.push(name);
    res.json(users);
});

//esta rota busca um usuario de acordo
//com sua posicao no array(index)
server.get('/users/:index', (req, res) => {
    //query params
    /*const name = req.query.name;
    return res.json({message: `Hello ${name}`});*/

    //route params
    /*const id = req.params.id;
    return res.json({message: `ID: ${id}`});*/

    //request body
    const {index} = req.params;
    //const index = req.params.index;
    return res.json(users[index]);
});

//esta rota atualiza um nome do array
//eu busco o elemento por sua posicao(index)
//e atualizo seu valor com o novo novo
//e imprimo o array atualizado
server.put('/users/:index', (req, res) => {
    const {index} = req.params;
    const {name} = req.body;

    users[index] = name;
    return res.json(users);
});

//esta rota remove um nome do array 
//com base em sua posicao(index)
//o splice tira o elemento na posicao
//e imprimo o array atualizado
server.delete('/users/:index', (req, res) => {
    const {index} = req.params;
    users.splice(index, 1);
    return res.json(users);
});

//defino a porta da minha aplicacao
server.listen(3000);