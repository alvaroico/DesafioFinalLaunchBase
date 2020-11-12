const crypto = require("crypto");
const UserModel = require("../models/UserModel");
const mailer = require("../../lib/mailer");
const { hash } = require("bcryptjs");

module.exports = {
  loginForm(req, res) {
    return res.render("admins/session/login");
  },
  login(req, res) {
    req.session.userId = req.user.id;

    return res.redirect("/admin/recipes");
  },
  logout(req, res) {
    req.session.destroy();

    return res.redirect("/login");
  },
  forgotForm(req, res) {
    return res.render("admins/session/forgot-password");
  },
  async forgot(req, res) {
    try {
      const { user } = req;

      const token = crypto.randomBytes(20).toString("hex");

      let now = new Date();
      now = now.setHours(now.getHours() + 1);

      await UserModel.update(user.id, {
        reset_token: token,
        reset_token_expires: now,
      });

      await mailer.sendMail({
        to: user.email,
        from: "no-reply@foodfy.com.br",
        subject: "Recuperação de senha",
        html: `<h2>Esqueceu sua senha?</h2>
                <p>Não se preocupe, clique no link abaixo para redefinir sua senha!<p>
                <p>
                    <a href="http://localhost:3000/password-reset?token=${token}" target="_blank">
                        clique aqui
                    </a>
                <p>
                `,
      });

      return res.render("admins/session/forgot-password", {
        success: "Verifique seu email!",
      });
    } catch (err) {
      console.error(err);
      return res.render("admins/session/forgot-password", {
        error: "Erro inesperado! Tente novamente.",
      });
    }
  },
  resetForm(req, res) {
    const token = req.query.token;
    return res.render("admins/session/password-reset", { token });
  },
  async reset(req, res) {
    try {
      const { user } = req;
      const { password } = req.body;

      const newPassword = await hash(password, 8);

      await UserModel.update(user.id, {
        password: newPassword,
        reset_token: "",
        reset_token_expires: "",
      });

      return res.render("admins/session/login", {
        user: req.body,
        success: "Senha atualizada! Faça seu login.",
      });
    } catch (err) {
      console.error(err);
      return res.render("admins/session/password-reset", {
        error: "Erro inesperado! Tente novamente.",
      });
    }
  },
};
