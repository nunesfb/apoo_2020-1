// o Yup nao tem um export default, desta forma precisamos importar tudo com *
import * as Yup from 'yup';
import { isBefore, parseISO } from 'date-fns';
import Ride from '../models/Ride';
import Driver from '../models/Driver';
import User from '../models/User';
import Vehicle from '../models/Vehicle';

class RideController {
  async store(req, res) {
    // aqui estou validando o objeto, pois o req.body é um objeto
    // e estou passando o formato que eu quero que ele tenha
    // neste formato passo todas propriedades de cada atributo do model
    const schema = Yup.object().shape({
      date_time: Yup.date().required(),
      status: Yup.boolean(),
      individual_amount: Yup.number(),
      number_seats: Yup.number(),
    });

    // aqui verifico se o schema anterior é valido, passando os dados do req.body
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const { status, individual_amount, number_seats } = req.body;

    const driverExists = await Driver.findOne({
      attributes: ['id_driver'],
      where: {
        id_user: req.idUser,
      },
    });

    if (!driverExists) {
      return res.status(400).json({ error: 'Driver not exists!' });
    }

    const { id_driver } = driverExists;

    // o parseISO transforma em um objeto date do JS
    const dateTime = parseISO(req.body.date_time);

    // vou verificar se a hora inicial está antes
    // da data e hora atual
    // se passar, significa que a data que esta tentando usar ja passou
    // ai gera um erro
    if (isBefore(dateTime, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    // a segunda verificacao é saber se este horario ja esta ocupado
    // procuro se existe um registro neste horario (hourStart)
    // e com este id
    // e ver tbm se o agendamento nao foi finalizado, apesar de existir
    const checkAvailabilty = await Ride.findOne({
      where: {
        id_driver,
        status: true,
        date_time: dateTime,
      },
    });
    // caso ache um registro, entao gera uma mensagem de erro
    if (checkAvailabilty) {
      return res
        .status(400)
        .json({ error: 'Ride date and hour already reserved by you' });
    }

    const ride = await Ride.create({
      date_time: dateTime,
      status,
      individual_amount,
      number_seats,
      id_driver,
    });
    return res.json(ride);
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const ride_available = await Ride.findAll({
      attributes: ['id_ride', 'date_time', 'status', 'individual_amount'],
      include: [
        {
          model: Driver,
          as: 'driver',
          attributes: ['id_driver'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['name', 'telephone', 'gender'],
            },
            {
              model: Vehicle,
              as: 'vehicle',
              attributes: ['brand', 'model', 'color', 'license_plate'],
            },
          ],
        },
      ],
      // aqui estou limitando o num de registros a 20 por pagina
      // faz o calculo para mostrar 20 em 20 sequencial
      limit: 20,
      offset: (page - 1) * 20,
    });

    // retorno os dados dos atributos selecionados anteriormente
    return res.json({ ride_available });
  }

  async details(req, res) {
    const { page = 1 } = req.query;
    // faço isso e busca todos os tipos de usuarios
    // entao precisamos inserir uma condicao
    // passa um objeto para pegar os usuarios que não sao admin
    // posso escolher tbm somente os atributos que eu quero que retorne]
    const { id_driver } = await Driver.findOne({
      attributes: ['id_driver'],
      where: { id_user: req.idUser },
    });

    const ride_offered = await Ride.findAll({
      order: ['date_time'],
      attributes: ['id_ride', 'date_time', 'status', 'individual_amount'],
      where: {
        id_driver,
      },
      // aqui estou limitando o num de registros a 20 por pagina
      // faz o calculo para mostrar 20 em 20 sequencial
      limit: 20,
      offset: (page - 1) * 20,
    });

    // retorno os dados dos atributos selecionados anteriormente
    return res.json(ride_offered);
  }

  async update(req, res) {
    // aqui estou validando o objeto, pois o req.body é um objeto
    // e estou passando o formato que eu quero que ele tenha
    // neste formato passo todas propriedades de cada atributo do model
    // aqui no update tenho que alterar algumas propriedades
    const schema = Yup.object().shape({
      date_time: Yup.date(),
      status: Yup.boolean(),
      amount: Yup.number(),
      number_seats: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const ride = await Ride.findByPk(req.params.id_ride);

    // o parseISO transforma em um objeto date do JS
    const dateTime = parseISO(req.body.date_time);

    // vou verificar se a hora inicial está antes
    // da data e hora atual
    // se passar, significa que a data que esta tentando usar ja passou
    // ai gera um erro
    if (isBefore(dateTime, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    // a segunda verificacao é saber se este horario ja esta ocupado
    // procuro se existe um registro neste horario (hourStart)
    // e com este id
    // e ver tbm se o agendamento nao foi finalizado, apesar de existir
    if (dateTime && dateTime.toString() !== ride.date_time.toString()) {
      const checkAvailabilty = await Ride.findOne({
        where: {
          id_driver: ride.id_driver,
          status: true,
          date_time: dateTime,
        },
      });
      // caso ache um registro, entao gera uma mensagem de erro
      if (checkAvailabilty) {
        return res
          .status(400)
          .json({ error: 'Ride date and hour already reserved by you' });
      }
    }

    // se todas estas verificacoes anteriores deram acerto
    // ai vou atualizar o veiculo
    const {
      id_ride,
      status,
      individual_amount,
      id_driver,
      date_time,
    } = await ride.update(req.body);
    return res.json({
      id_ride,
      status,
      individual_amount,
      date_time,
      id_driver,
    });
  }
}

export default new RideController();
