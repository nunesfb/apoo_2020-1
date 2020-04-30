// o Yup nao tem um export default, desta forma precisamos importar tudo com *
import * as Yup from 'yup';
import { Op } from 'sequelize';
import StatusRide from '../models/Status_Ride';
import Ride from '../models/Ride';

class StatusRideController {
  async store(req, res) {
    try {
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
          [Op.and]: {
            id_ride,
            id_user: req.idUser,
          },
        },
      });

      if (statusRideExists) {
        return res
          .status(400)
          .json({ error: 'You already requested this ride!' });
      }

      // verificar se as vagas não estão ocupadas
      const numberUsersRide = await StatusRide.count({
        where: {
          [Op.not]: {
            status: 'Canceled',
          },
          [Op.and]: {
            id_ride,
          },
        },
      });

      const { number_seats } = await Ride.findOne({
        attributes: ['number_seats'],
        where: {
          id_ride,
        },
      });

      if (numberUsersRide === number_seats) {
        return res.status(400).json({ error: 'There is no more vacancies' });
      }

      const { status } = await StatusRide.create({
        status: 'Requested',
        id_ride,
        id_user: req.idUser,
      });
      return res.json({ id_ride, status });
    } catch (err) {
      return res.status(400).json({
        message: `Ocorreu um erro(${err.message}). Por favor entre em contato com o administrador do sistema`,
      });
    }
  }

  async index(req, res) {
    try {
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
        status: Yup.string(),
        user_classification: Yup.number(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation fails!' });
      }

      const status_ride = await StatusRide.findByPk(req.params.id_status_ride);

      // se todas estas verificacoes anteriores deram acerto
      // ai vou atualizar o veiculo
      const { status, user_classification } = await status_ride.update(
        req.body
      );
      return res.json({
        status,
        user_classification,
      });
    } catch (err) {
      return res.status(400).json({
        message: `Ocorreu um erro(${err.message}). Por favor entre em contato com o administrador do sistema`,
      });
    }
  }
}

export default new StatusRideController();
