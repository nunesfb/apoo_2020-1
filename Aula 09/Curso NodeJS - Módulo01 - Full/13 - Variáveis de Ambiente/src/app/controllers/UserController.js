// o Yup nao tem um export default, desta forma precisamos importar tudo com *
import * as Yup from 'yup';
import { Op } from 'sequelize';
import User from '../models/User';

class UserController {
  // store pode ser feito por um user sem estar logado
  // que vai efetuar se cadastro no sistema
  async store(req, res) {
    try {
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
    } catch (err) {
      return res.status(400).json({
        message: `Ocorreu um erro(${err.message}). Por favor entre em contato com o administrador do sistema`,
      });
    }
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    // faço isso e busca todos os tipos de usuarios
    // entao precisamos inserir uma condicao
    // passa um objeto para pegar os usuarios que não sao admin
    // posso escolher tbm somente os atributos que eu quero que retorne

    // adicionei o try e o catch
    try {
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
          'avatar_image',
          'url',
        ],
      });
      // retorno os dados dos atributos selecionados anteriormente
      return res.json(users);
      // aqui to pegando o erro e imprimindo
    } catch (err) {
      return res.status(400).json({
        message: `Ocorreu um erro(${err.message}). Por favor entre em contato com o administrador do sistema`,
      });
    }
  }

  async details(req, res) {
    try {
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
    } catch (err) {
      return res.status(400).json({
        message: `Ocorreu um erro(${err.message}). Por favor entre em contato com o administrador do sistema`,
      });
    }
  }

  async update(req, res) {
    try {
      // aqui estou validando o objeto, pois o req.body é um objeto
      // e estou passando o formato que eu quero que ele tenha
      // neste formato passo todas propriedades de cada atributo do model
      // aqui no update tenho que alterar algumas propriedades
      const schema = Yup.object().shape({
        name: Yup.string(),
        email: Yup.string().email(),
        cpf: Yup.string().max(20),
        telephone: Yup.string().max(20),
        date_birth: Yup.date(),
        gender: Yup.string().max(1),
        oldPassword: Yup.string(),
        // aqui só valido o password quando tiver algo escrito no old password
        // desta forma passo o when, que me dá acesso aos demais atributos do Yup
        // no segundo paramentro recebo uma funcao
        // essa funcao recebe 2 paramentros: o oldPassword e o proprio password (field)
        // dai verifico se existe um oldPassword, caso exista ele vai aplicar no password o required
        // caso nao exista, ele mantem a configuracao original
        password: Yup.string()
          .min(6)
          .max(8)
          .when('oldPassword', (oldPassword, field) =>
            oldPassword ? field.required() : field
          ),
        // aqui foi criado um repetir senha para garantir que a senha está correta
        // cria o campo confirmPassword, ele verifica se o password existe (required)
        // depois ele verifica se está igual com o oneOf e diz para comparar com o password(ref)
        // se estiver igual, ai troca, senao manter as configuracoes originais
        confirmPassword: Yup.string().when('password', (password, field) =>
          password ? field.required().oneOf([Yup.ref('password')]) : field
        ),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation fails!' });
      }

      // desta forma, vindo do auth.js na pasta middleware
      // aqui eu posso pegar no req o id do usuario
      // e ai posso fazer o que desejar neste metodo com o id do usuario
      // console.log(req.userId);

      const { email, cpf, oldPassword } = req.body;

      const user = await User.findByPk(req.idUser);

      // caso ele esteja alterando seu email
      // precisamos saber se ele nao colocou outro email que ja existe no bd
      if (email && email !== user.email) {
        const emailExists = await User.findOne({
          where: { email: req.body.email },
        });

        if (emailExists) {
          return res.status(400).json({ error: 'Email already exists!' });
        }
      }

      if (cpf && cpf !== user.cpf) {
        const cpfExists = await User.findOne({
          where: { cpf: req.body.cpf },
        });

        if (cpfExists) {
          return res.status(400).json({ error: 'CPF already exists!' });
        }
      }

      // aqui verificamos se o password antigo bate com o que esta gravado no banco
      // tambem verificamos se ele quer alterar a senha ou somente outro dado
      if (oldPassword && !(await user.checkPassword(oldPassword))) {
        return res.status(401).json({ error: 'Password does not match' });
      }

      // se todas estas verificacoes anteriores deram acerto
      // ai vou atualizar o usuario
      const {
        id_user,
        name,
        telephone,
        gender,
        date_birth,
      } = await user.update(req.body);
      return res.json({
        id_user,
        name,
        email,
        cpf,
        telephone,
        gender,
        date_birth,
      });
    } catch (err) {
      return res.status(400).json({
        message: `Ocorreu um erro(${err.message}). Por favor entre em contato com o administrador do sistema`,
      });
    }
  }
}

export default new UserController();
