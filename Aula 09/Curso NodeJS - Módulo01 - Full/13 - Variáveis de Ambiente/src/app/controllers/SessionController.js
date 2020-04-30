import jwt from 'jsonwebtoken';
// o Yup nao tem um export default, desta forma precisamos importar tudo com *
import * as Yup from 'yup';
import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async session(req, res) {
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email()
          .required(),
        password: Yup.string().required(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation fails!' });
      }

      const { email, password } = req.body;
      const user = await User.findOne({
        where: { email },
        attributes: ['id_user', 'name', 'admin', 'password_hash'],
      });

      if (!user) {
        return res.status(401).json({ error: 'User not found!' });
      }

      if (!(await user.checkPassword(password))) {
        return res.status(401).json({ error: 'Password does not match!' });
      }
      // aqui pego o id e nome do usuario, o email ja tenho anteriormente
      const { id_user, name, admin } = user;

      return res.json({
        // aqui retorno o id, nome e email, além do token
        user: {
          id_user,
          name,
          email,
          admin,
        },
        // aqui retorno o token
        // no sign passamos 3 parametros
        // o primeiro parametro é o que vai estar no payload, neste caso o id do usuario
        // assim tenho acesso ao id do usuario quando usar o token
        // no segundo parametro eu passo uma frase bem aleatoria, uma string que seja segura
        // gobarberrocketseat123 - gerou o hash
        // o terceiro parametro é o tempo de expiracao, neste caso ficou 7 dias
        token: jwt.sign({ id_user }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });
    } catch (err) {
      return res.status(400).json({
        message: `Ocorreu um erro(${err.message}). Por favor entre em contato com o administrador do sistema`,
      });
    }
  }
}

export default new SessionController();
