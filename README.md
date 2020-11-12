
<h1 align="center">
FOODFY
  <br>
  <br>
  <img src="/.github/chef.png" alt="FOODFY LOGO" width="200">

<br>  
<br>
 DESAFIO FINAL DO BOOTCAMP LAUNCHBASE
</h1>

<p align="center">Projeto do desafio final Rocketseat.</p>

<p align="center">
  <a href="/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License MIT">
  </a>
</p>

<hr />

## Características

Desafio de construir um site completo para uma empresa de receitas chamada Foodfy.

## Ingredientes

- NodeJS v14.15.0
- NPM 7.0.10
- Docker
- PostgreSQL
- Nunjucks
- VScode
- GitHub CLI

## Modo de preparo

1. Copie este repositório `gh repo clone alvaroico/desafio` e entre no diretório;
2. No terminal, digite `docker-compose up -d`
<img src="/.github/Docker.gif" alt="Docker-compose">

3. No terminal, execute o comando `npm install` para instalar todas as dependências;
<img src="/.github/NPM.gif" alt="npm">

4. Adicione as credenciais de acesso ao banco de dados no arquivo src/app/config/db.js. Se utilizar o Docker não precisa ajustar este arquivo;
<img src="/.github/dbconfig.gif" alt="DBconfig">

5. Criar as tabelas do banco de dados com o <a href="https://www.beekeeperstudio.io/">Beekeeper Studio</a> usando o arquivo SQL foodfy.sql;
<img src="/.github/foodfySQL.gif" alt="DBconfig">

6. Execute a aplicação com o comando `npm start`.
7. Carregue no banco de dados o arquivo seed.js utilizando o comando `node seed.js`;
<img src="/.github/seed.gif" alt="DBconfig">

8. Voce pode trocar a imagem padrão na pasta public/images 'placeholder.png'.
9. Usuário padrão para acessar como administrador 
> email: alvaro.r.p@hotmail.com 
> Senha: alvaroico

<img src="/.github/user.gif" alt="user">

## Observações

Para acessar a área restrita utilize o usuário do item 9

Para utilizar a função de recuperação de senha inclua a configuração do <a href="https://mailtrap.io/">Mailtrap</a> no arquivo src/lib/mailer.js.
```
var transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "XXXXXXXXXXXX",
    pass: "XXXXXXXXXXXX"
  }
});
```
  
Caso seu banco de dados já esteja populado rode o SQL do arquivo foodfyDel.sql

## Licença

Esse projeto está sob a licença MIT. Veja a página [LICENSE](https://opensource.org/licenses/MIT) para mais detalhes.