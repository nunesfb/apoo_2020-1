// o Yup nao tem um export default, desta forma precisamos importar tudo com *
import * as Yup from 'yup';
import { Op } from 'sequelize';
import Driver from '../models/Driver';
import User from '../models/User';
import Vehicle from '../models/Vehicle';

class DriverController {
  async store(req, res) {
    // aqui estou validando o objeto, pois o req.body é um objeto
    // e estou passando o formato que eu quero que ele tenha
    // neste formato passo todas propriedades de cada atributo do model
    const schema = Yup.object().shape({
      cnh: Yup.number().required(),
      active: Yup.boolean(),
      id_vehicle: Yup.number().required(),
    });

    // aqui verifico se o schema anterior é valido, passando os dados do req.body
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const driverExists = await Driver.findOne({
      attributes: ['id_driver', 'cnh', 'id_user'],

      where: {
        [Op.or]: {
          cnh: req.body.cnh,
          id_user: req.idUser,
        },
      },
    });

    if (driverExists) {
      return res.status(400).json({ error: 'Driver already exists!' });
    }

    const vehicleExists = await Driver.findOne({
      attributes: ['id_vehicle'],
      where: {
        id_vehicle: req.body.id_vehicle,
      },
    });

    if (vehicleExists) {
      return res.status(400).json({ error: 'Vehicle already exists!' });
    }
    req.body.id_user = req.idUser;
    const { id_driver, cnh } = await Driver.create(req.body);
    return res.json({
      id_driver,
      cnh,
    });
  }

  async index(req, res) { 
    const { page = 1 } = req.query;
    // faço isso e busca todos os tipos de usuarios
    // entao precisamos inserir uma condicao
    // passa um objeto para pegar os usuarios que não sao admin
    // posso escolher tbm somente os atributos que eu quero que retorne
    const drivers = await Driver.findAll({
      order: ['cnh'],
      attributes: ['id_driver', 'cnh'],
      // aqui estou limitando o num de registros a 20 por pagina
      // faz o calculo para mostrar 20 em 20 sequencial
      limit: 20,
      offset: (page - 1) * 20,
    });
    // retorno os dados dos atributos selecionados anteriormente
    return res.json(drivers);
  }

  async details(req, res) {
    // faço isso e busca todos os tipos de usuarios
    // entao precisamos inserir uma condicao
    // passa um objeto para pegar os usuarios que não sao admin
    // posso escolher tbm somente os atributos que eu quero que retorne
    const driver = await Driver.findOne({
      where: { id_driver: req.params.id_driver },
      attributes: ['id_driver', 'cnh', 'active'],
      // aqui eu posso incluir um model para mostrar
      // ai dou um apelido para ele
      // e seleciono somente os atributos que eu quero
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id_user', 'name'],
        },
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id_vehicle', 'license_plate'],
        },
      ],
    });

    if (!driver) {
      return res.status(400).json({ error: 'User not exists!' });
    }

    // retorno os dados dos atributos selecionados anteriormente
    return res.json(driver);
  }

  async update(req, res) {
    // aqui estou validando o objeto, pois o req.body é um objeto
    // e estou passando o formato que eu quero que ele tenha
    // neste formato passo todas propriedades de cada atributo do model
    // aqui no update tenho que alterar algumas propriedades
    const schema = Yup.object().shape({
      cnh: Yup.number(),
      active: Yup.boolean(),
      id_vehicle: Yup.number(),
    }); 

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }
    const { cnh, id_vehicle } = req.body;

    const driver = await Driver.findOne({
      attributes: ['id_driver', 'cnh', 'id_vehicle'],
      where: {
        id_user: req.idUser,
      },
    });
 
    if (cnh && cnh.toString() !== driver.cnh) {
      const driverExists = await Driver.findOne({
        where: { cnh: req.body.cnh },
      });

      if (driverExists) {
        return res
          .status(400)
          .json({ error: 'Driver already exists or not found!' });
      }
    }

    if (id_vehicle && id_vehicle !== driver.id_vehicle) {
      const vehicleExists = await Driver.findOne({
        where: { id_vehicle: req.body.id_vehicle },
      });

      if (vehicleExists) {
        return res.status(400).json({ error: 'Vehicle already exists!' });
      }
    }

    // se todas estas verificacoes anteriores deram acerto
    // ai vou atualizar o usuario
    const { id_driver, active } = await driver.update(req.body);
    return res.json({
      id_driver,
      cnh,
      active,
      id_vehicle,
    });
  }
}

export default new DriverController();
