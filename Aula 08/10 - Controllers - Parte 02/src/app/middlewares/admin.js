import { Op } from 'sequelize';
import User from '../models/User';

export default async (req, res, next) => {
  const isAdmin = await User.findOne({
    where: {
      [Op.and]: {
        id_user: req.idUser,
        admin: true,
      },
    },
  });

  if (!isAdmin) {
    return res
      .status(401)
      .json({ error: 'Only users with status of admin can access this page!' });
  }

  return next();
};
