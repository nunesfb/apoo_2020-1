// o Yup nao tem um export default, desta forma precisamos importar tudo com *
import * as Yup from 'yup';
import Vehicle from '../models/Vehicle';

class VehicleController {
  async store(req, res) {
    // aqui estou validando o objeto, pois o req.body é um objeto
    // e estou passando o formato que eu quero que ele tenha
    // neste formato passo todas propriedades de cada atributo do model
    const schema = Yup.object().shape({
      brand: Yup.string()
        .required()
        .max(50),
      model: Yup.string()
        .required()
        .max(50),
      license_plate: Yup.string()
        .required()
        .max(10),
      color: Yup.string()
        .required()
        .max(15),
    });

    // aqui verifico se o schema anterior é valido, passando os dados do req.body
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const vehicleExists = await Vehicle.findOne({
      attributes: ['license_plate'],
      where: {
        license_plate: req.body.license_plate,
      },
    });

    if (vehicleExists) {
      return res.status(400).json({ error: 'Vehicle already exists!' });
    }

    const {
      id_driver,
      brand,
      model,
      license_plate,
      color,
    } = await Vehicle.create(req.body);
    return res.json({
      id_driver,
      brand,
      model,
      license_plate,
      color,
    });
  }

  async index(req, res) {
    // aqui defino que por padrao será a pagina 1
    // se nao for passado algo, caso seja, usa o do query
    const { page = 1 } = req.query;
    // faço isso e busca todos os tipos de veiculos
    // posso escolher tbm somente os atributos que eu quero que retorne
    const vehicles = await Vehicle.findAll({
      order: ['id_vehicle'],
      attributes: ['id_vehicle', 'license_plate'],
      // aqui estou limitando o num de registros a 20 por pagina
      // faz o calculo para mostrar 20 em 20 sequencial
      limit: 20,
      offset: (page - 1) * 20,
    });
    // retorno os dados dos atributos selecionados anteriormente
    return res.json(vehicles);
  }

  async details(req, res) {
    // faço isso e busca todos os tipos de veiculos
    // entao precisamos inserir uma condicao
    // posso escolher tbm somente os atributos que eu quero que retorne
    const vehicle = await Vehicle.findOne({
      where: { id_vehicle: req.params.id_vehicle },
      attributes: ['id_vehicle', 'brand', 'model', 'license_plate', 'color'],
    });

    if (!vehicle) {
      return res.status(400).json({ error: 'Vehicle not exists!' });
    }

    // retorno os dados dos atributos selecionados anteriormente
    return res.json(vehicle);
  }

  async update(req, res) {
    // aqui estou validando o objeto, pois o req.body é um objeto
    // e estou passando o formato que eu quero que ele tenha
    // neste formato passo todas propriedades de cada atributo do model
    // aqui no update tenho que alterar algumas propriedades
    const schema = Yup.object().shape({
      brand: Yup.string().max(50),
      model: Yup.string().max(50),
      license_plate: Yup.string().max(10),
      color: Yup.string().max(15),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }
    const { license_plate } = req.body;

    const vehicle = await Vehicle.findByPk(req.params.id_vehicle);

    // caso ele esteja alterando a placa
    // precisamos saber se ele nao colocou outra placa que ja existe no bd
    if (license_plate && license_plate !== vehicle.license_plate) {
      const vehicleExists = await Vehicle.findOne({
        where: { license_plate: req.body.license_plate },
      });

      if (vehicleExists) {
        return res.status(400).json({ error: 'Vehicle already exists!' });
      }
    }

    // se todas estas verificacoes anteriores deram acerto
    // ai vou atualizar o veiculo
    const { id_vehicle, brand, model, color } = await vehicle.update(req.body);
    return res.json({
      id_vehicle,
      brand,
      model,
      license_plate,
      color,
    });
  }

  async delete(req, res) {
    const vehicle = await Vehicle.findByPk(req.params.id_vehicle);

    if (!vehicle) {
      return res.status(400).json({ error: 'Vehicle not exists!' });
    }
    await vehicle.destroy(req.params.id_vehicle);

    return res.json({ message: 'Vehicle excluded with success!' });
  }
}

export default new VehicleController();
