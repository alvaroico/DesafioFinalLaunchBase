const UserModel = require("../models/UserModel");
const User = require("../models/User");

async function post(req, res, next) {
  const keys = Object.keys(req.body);

  for (key of keys) {
    if (req.body[key] == "") {
      return res.send("Por favor preencha todos os campos");
    }
  }

  const { email } = req.body;
  const user = await UserModel.findOne({
    where: { email },
  });

  if (user)
    return res.render("admins/user/register", {
      user: req.body,
      createError: "Usuário já cadastrado",
    });

  next();
}

async function adminCannotDeleteOwnAccount(req, res, next) {
  const users = await UserModel.all();

  if (req.session.userId == req.body.id) {
    return res.render("admins/user/index", {
      users,
      createError: "Um administrador não pode deletar a própria conta.",
    });
  }

  next();
}

module.exports = {
  post,
  adminCannotDeleteOwnAccount,
};
