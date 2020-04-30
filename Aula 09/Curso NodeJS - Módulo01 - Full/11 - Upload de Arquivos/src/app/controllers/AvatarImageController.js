import User from '../models/User';

class AvatarImageController {
  async update_avatar_image(req, res) {
    // aqui esta ocorrendo uma desestruturacao
    // o filename vai ser salvo no db como path
    const { filename: avatar_image } = req.file;

    // busco o usuario
    const user = await User.findByPk(req.idUser);

    // aqui mando executar e salvar a operacao na tabela
    const userData = await user.update({ avatar_image });
    // retorno os dados do arquivo
    return res.json(userData);
  }
}

export default new AvatarImageController();
