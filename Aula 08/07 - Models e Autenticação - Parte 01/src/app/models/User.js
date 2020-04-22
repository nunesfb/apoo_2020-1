import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    // aqui estou chamando o metodo init da classe model
    super.init(
      {
        // estes campos sao apenas os campos que o usuario vai poder preencher
        // eles nao sao necessariamente um reflexo dos campos da tabela no bd
        id_user: Sequelize.INTEGER,
        name: Sequelize.STRING,
        cpf: Sequelize.STRING,
        email: Sequelize.STRING,
        telephone: Sequelize.STRING,
        date_birth: Sequelize.DATEONLY,
        gender: Sequelize.STRING,
        admin: Sequelize.BOOLEAN,
        // virtual = significa um campo que nunca vai existir na base de dados, apenas no código
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    // hooks sao trechos de código executados de forma automatica
    // e sao baseados em acoes que acontecem no nosso model
    // quando adicionar o hook beforeSave, antes de qualquer usuario ser salvo no banco de dados
    // ou seja, tanto criado ou editado
    // este trecho de codigo vai ser executado automaticamente antes disso
    // neste caso estamos recebendo os dados do usuario como parametro e podemos alterar estes dados
    this.addHook('beforeSave', async user => {
      // aqui seria que todos nomes ficariam felipe
      // user.name = 'Felipe';

      // vai ser preenchido o campo password
      // vou verificar se existe um password (cadastrando ou atualizando)
      // o hash de senha só vai ser gerado nestas condicoes
      if (user.password) {
        // aqui esta sendo feita a criptografia com 8 rounds (força da criptografia)
        // eslint-disable-next-line no-param-reassign
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    // sempre vou retornar o model que acabou de ser inicializado
    return this;
  }

  // posso colocar este metodo dentro do model, pois nao é uma regra de negocio
  // e assim nao preciso chamar o bcrypt novamente no controller
  // verifico a senha
  checkPassword(password) {
    // comparo aqui a senha que ta sendo passada com a senha do usuario armazenada
    // retorna true ou false
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
