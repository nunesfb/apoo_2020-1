import { subDays } from 'date-fns';

import Announcement from '../schemas/Announcement';

// carrego o modelo de dados

class AllAnnouncementController {
  async index(req, res) {
    try {
      const announcement = await Announcement.find({
        idCompany: { $ne: req.idCompany },
        validity: { $gt: subDays(new Date(), 1) },
      });

      return res.json(announcement);
    } catch (err) {
      return res.status(400).json({
        message: `Ocorreu um erro(${err.message}). Por favor entre em contato com o administrador do sistema`,
      });
    }
  }
}

export default new AllAnnouncementController();
