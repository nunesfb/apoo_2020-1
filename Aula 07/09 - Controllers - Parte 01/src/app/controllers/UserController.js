// o Yup nao tem um export default, desta forma precisamos importar tudo com *
import * as Yup from 'yup';
import { Op } from 'sequelize';
import User from '../models/User';

class UserController {
  // store pode ser feito por um user sem estar logado
  // que vai efetuar se cadastro no sistema
  async store(req, res) {
    // aqui estou validando o objeto, pois o req.body é um objeto
    // e estou passando o formato que eu quero que ele tenha
    // neste formato passo todas propriedades de cada atributo do model
    const schema = Yup.object().shape({
      name: Yup.string()
        .required()
        .max(100),
      cpf: Yup.string()
        .required() 
        .max(20),
      email: Yup.string()
        .email()
        .required()
        .max(50),
      telephone: Yup.string()
        .required()
        .max(20),
      date_birth: Yup.date().required(),
      gender: Yup.string()
        .required()
        .max(1),
      admin: Yup.boolean(),
      password: Yup.string()
        .required()
        .min(6)
        .max(8),
    });

    // aqui verifico se o schema anterior é valido, passando os dados do req.body
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const userExists = await User.findOne({
      attributes: ['id_user', 'cpf', 'email'],
      where: {
        [Op.or]: {
          cpf: req.body.cpf,
          email: req.body.email,
        },
      },
    });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists!' });
    }

    const { id_user, name, email } = await User.create(req.body);
    return res.json({
      id_user,
      name,
      email,
    });
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    // faço isso e busca todos os tipos de usuarios
    // entao precisamos inserir uma condicao
    // passa um objeto para pegar os usuarios que não sao admin
    // posso escolher tbm somente os atributos que eu quero que retorne
    const users = await User.findAll({
      where: { admin: false },
      limit: 20,
      order: ['name'],
      offset: (page - 1) * 20,
      attributes: [
        'id_user',
        'name',
        'email',
        'cpf',
        'telephone',
        'date_birth',
      ],
    });
    // retorno os dados dos atributos selecionados anteriormente
    return res.json(users);
  }

  async details(req, res) {
    // faço isso e busca todos os tipos de usuarios
    // entao precisamos inserir uma condicao
    // passa um objeto para pegar os usuarios que não sao admin
    // posso escolher tbm somente os atributos que eu quero que retorne
    const user = await User.findOne({
      where: { id_user: req.params.id_user },
      attributes: [
        'id_user',
        'name',
        'email',
        'cpf',
        'telephone',
        'date_birth',
        'gender',
      ], 
    });

    if (!user) {
      return res.status(400).json({ error: 'User not exists!' });
    }

    // retorno os dados dos atributos selecionados anteriormente
    return res.json(user);
  }
}

export default new UserController();
