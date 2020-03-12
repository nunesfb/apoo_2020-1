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

server.use( (req, res, next) => {
    console.time('Request');
    console.log(`Método: ${req.method}; URL: ${req.url}`);
    //se não tiver o next, ele vai parar aqui e não continuar a execução
    //return next();

    next();
    console.timeEnd('Request');
});

//middleware
//vai verificar se existe o nome do usuário
//se não encontrar retorna uma mensagem de erro
//se encontrar, chama o middleware da rota normalmente
//aí podemos colocar no post e put (que dependem desta info)
function checkUsersExists (req, res, next) {
    if (!req.body.name){
        return res.status(400).json({error: 'User not found!'});
    };

    return next();
};

function checkUsersInArray (req, res, next) {
    const user = users[req.params.index];
    if (!user){
        return res.status(400).json({error: 'User not exists!'});
    };
    //adicionando uma nova variavel dentro do req com o valor de user
    //todos que chamarem a funcao, vao ter acesso ao user
    req.user = user;

    return next();
};

//esta rota traz todos usuarios do array
server.get('/users/', (req, res) => {

    return res.json(users);
});

//esta rota busca um usuario de acordo
//com sua posicao no array(index)
server.get('/users/:index', checkUsersInArray, (req, res) => {
    //return res.json({message: 'Hello World'})

    // Query Params = ?teste=1
    //const nome = req.query.nome;
    //return res.json({message: `Hello ${nome}`})

    // Route Params = /users/1
    //const id = req.params.id;
    //return res.json({message: `ID: ${id}`});

    //const { index } = req.params;
    //return res.json(users[index]);

    return res.json(req.user);
});
//esta rota recebe no body um novo nome
//eu adiciono este novo nome no array
//e imprimo o array atualizado
server.post('/users/', checkUsersExists, (req, res) => {

    const { name } = req.body;

    users.push(name);

    res.json(users);
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