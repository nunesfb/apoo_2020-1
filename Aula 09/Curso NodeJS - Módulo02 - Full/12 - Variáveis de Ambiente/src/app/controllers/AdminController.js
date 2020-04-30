import Company from '../schemas/Company';
import Announcement from '../schemas/Announcement';

class AdminController {
  // SOMENTE ADMIN
  async indexCompany(req, res) {
    try {
      // body - corpo da requisicao
      // params - id definido na rota e outras info
      // query - parametros get (pego o parametro page que esta no get, posso definir valor default)
      const { page } = req.query;

      // depois posso usar o paginate
      // limite de 10 pagina e inicia na 1
      // https://www.npmjs.com/package/mongoose-paginate-v2
      const companyData = await Company.paginate(
        {},
        // { page, limit: 5, sort: { name: 'desc' } }
        {
          page,
          limit: 5,
          sort: { name: 'asc' },
          select: 'cnpj name email telephone.commercial_phone',
        }
      );

      return res.json(companyData);
    } catch (err) {
      return res.status(400).json({
        message: `Ocorreu um erro(${err.message}). Por favor entre em contato com o administrador do sistema`,
      });
    }
  }

  // SOMENTE ADMIN
  async detailsCompany(req, res) {
    try {
      // a requisicao traz os parametros informados, sendo buscado o id (GET)
      const companyData = await Company.findById(req.params.id_company).select(
        'cnpj corporate_name name email address telephone active'
      );

      if (!companyData) {
        return res.status(400).json({ error: 'Company not exists!' });
      }

      // return res.json(companyData.address);
      return res.json(companyData);
    } catch (err) {
      return res.status(400).json({
        message: `Ocorreu um erro(${err.message}). Por favor entre em contato com o administrador do sistema`,
      });
    }
  }

  async updateCompanyStatus(req, res) {
    try {
      const companyData = await Company.findByIdAndUpdate(
        req.params.id_company,
        req.body,
        {
          new: true,
        }
      ).select('cnpj name email telephone.commercial_phone active');

      if (!companyData) {
        return res.status(400).json({ error: 'Company not exists!' });
      }

      return res.json(companyData);
    } catch (err) {
      return res.status(400).json({
        message: `Ocorreu um erro(${err.message}). Por favor entre em contato com o administrador do sistema`,
      });
    }
  }

  // SOMENTE ADMIN
  async indexAnnouncement(req, res) {
    try {
      // body - corpo da requisicao
      // params - id definido na rota e outras info
      // query - parametros get (pego o parametro page que esta no get, posso definir valor default)
      const { page } = req.query;

      // depois posso usar o paginate
      // limite de 10 pagina e inicia na 1
      // https://www.npmjs.com/package/mongoose-paginate-v2
      const announcementData = await Announcement.paginate(
        {},
        // { page, limit: 5, sort: { name: 'desc' } }
        {
          page,
          limit: 5,
          sort: 'validity',
          select: {
            topic: 'topic',
            validity: 'validity',
          },
          populate: 'idCompany',
        }
      );

      return res.json(announcementData);
    } catch (err) {
      return res.status(400).json({
        message: `Ocorreu um erro(${err.message}). Por favor entre em contato com o administrador do sistema`,
      });
    }
  }

  // SOMENTE ADMIN
  async detailsAnnouncement(req, res) {
    // a requisicao traz os parametros informados, sendo buscado o id (GET)

    // adicionei o try e o catch
    try {
      const announcementData = await Announcement.findById(
        req.params.id_announcement
      ).populate('idCompany');

      const {
        topic,
        description,
        validity,
        image,
        value,
        idCompany: {
          cnpj,
          email,
          corporate_name,
          name,
          city,
          state,
          telephone: { commercial_phone },
        },
      } = announcementData;

      // return res.json(companyData.address);
      return res.json({
        topic,
        description,
        validity,
        image,
        value,
        cnpj,
        email,
        corporate_name,
        name,
        city,
        state,
        commercial_phone,
      });
    } catch (err) {
      return res.status(400).json({
        message: `Ocorreu um erro(${err.message}). Por favor entre em contato com o administrador do sistema`,
      });
    }
  }
}

export default new AdminController();
