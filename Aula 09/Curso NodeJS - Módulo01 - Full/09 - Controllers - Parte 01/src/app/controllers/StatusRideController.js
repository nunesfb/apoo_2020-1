// o Yup nao tem um export default, desta forma precisamos importar tudo com *
import * as Yup from 'yup';
import StatusRide from '../models/Status_Ride';

class StatusRideController {
  async store(req, res) {
    // aqui estou validando o objeto, pois o req.body é um objeto
    // e estou passando o formato que eu quero que ele tenha
    // neste formato passo todas propriedades de cada atributo do model
    const schema = Yup.object().shape({
      id_ride: Yup.number().required(),
    });

    // aqui verifico se o schema anterior é valido, passando os dados do req.body
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const { id_ride } = req.body;

    const statusRideExists = await StatusRide.findOne({
      attributes: ['id_status_ride'],
      where: {
        id_ride,
        id_user: req.idUser,
      },
    });

    if (statusRideExists) {
      return res
        .status(400)
        .json({ error: 'You already requested this ride!' });
    }

    const { status } = await StatusRide.create({
      status: 'Requested',
      id_ride,
      id_user: req.idUser,
    });
    return res.json({ id_ride, status });
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    // faço isso e busca todos os tipos de usuarios
    // entao precisamos inserir uma condicao
    // passa um objeto para pegar os usuarios que não sao admin
    // posso escolher tbm somente os atributos que eu quero que retorne
    const status_ride_requested = await StatusRide.findAll({
      order: ['id_status_ride'],
      attributes: ['id_status_ride', 'status', 'id_ride'],
      where: {
        id_user: req.idUser,
      },
      // aqui estou limitando o num de registros a 20 por pagina
      // faz o calculo para mostrar 20 em 20 sequencial
      limit: 20,
      offset: (page - 1) * 20,
    });

    // retorno os dados dos atributos selecionados anteriormente
    return res.json(status_ride_requested);
  }
}

export default new StatusRideController();
