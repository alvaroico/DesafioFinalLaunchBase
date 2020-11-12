const User = require("../models/User");
const Recipe = require("../models/Recipe");
const File = require("../models/File");
const Chef = require("../models/Chef");
const { date } = require("../../lib/uteis");

module.exports = {
  async home(req, res) {
    let results = await Recipe.all();
    let recipes = results.rows;

    async function getImage(recipeId) {
      let results = await Recipe.files(recipeId);
      const filesId = results.rows.map((result) => result.file_id);
      let filesPromise = filesId.map((id) => File.find(id));
      results = await Promise.all(filesPromise);
      let files = results.map((result) => result.rows[0]);
      const filesURL = files.map(
        (file) =>
          `${req.protocol}://${req.headers.host}${file.path.replace(
            "public",
            ""
          )}`
      );
      return filesURL[0];
    }

    const recipesPromise = recipes.map(async (recipe) => {
      recipe.img = await getImage(recipe.id);
      return recipe;
    });

    recipes = await Promise.all(recipesPromise);

    return res.render("users/home", { recipes });
  },

  about(req, res) {
    return res.render("users/about");
  },

  async search(req, res) {
    try {
      let { filter, page, limit } = req.query;

      page = page || 1;
      limit = limit || 6;
      let offset = limit * (page - 1);

      const params = {
        filter,
        page,
        limit,
        offset,
      };

      let results = await User.recipesSearch(params);
      let recipes = results.rows;

      const pagination = {
        total: Math.ceil(recipes[0].total / limit),
        page,
      };

      async function getImage(recipeId) {
        let results = await Recipe.files(recipeId);
        const filesId = results.rows.map((result) => result.file_id);
        let filesPromise = filesId.map((id) => File.find(id));
        results = await Promise.all(filesPromise);
        let files = results.map((result) => result.rows[0]);
        const filesURL = files.map(
          (file) =>
            `${req.protocol}://${req.headers.host}${file.path.replace(
              "public",
              ""
            )}`
        );
        return filesURL[0];
      }

      const recipesPromise = recipes.map(async (recipe) => {
        recipe.img = await getImage(recipe.id);
        return recipe;
      });

      lastRecipes = await Promise.all(recipesPromise);

      return res.render("users/search", {
        recipes: lastRecipes,
        filter,
        pagination,
      });
    } catch (err) {
      console.error(err);
    }
  },

  async recipes(req, res) {
    let results = await Recipe.all();
    const recipes = results.rows;

    async function getImage(recipeId) {
      let results = await Recipe.files(recipeId);
      const filesId = results.rows.map((result) => result.file_id);
      let filesPromise = filesId.map((id) => File.find(id));
      results = await Promise.all(filesPromise);
      let files = results.map((result) => result.rows[0]);
      const filesURL = files.map(
        (file) =>
          `${req.protocol}://${req.headers.host}${file.path.replace(
            "public",
            ""
          )}`
      );
      return filesURL[0];
    }

    const recipesPromise = recipes.map(async (recipe) => {
      recipe.img = await getImage(recipe.id);
      return recipe;
    });

    lastRecipes = await Promise.all(recipesPromise);

    return res.render("users/recipes", { recipes: lastRecipes });
  },

  async show(req, res) {
    const { id } = req.params;
    let result = await Recipe.find(id);
    const recipe = result.rows[0];
    recipe.updated_at = date(recipe.updated_at).BRformat;

    // get images
    let results = await Recipe.files(recipe.id);
    let recipe_files = results.rows;
    let filesId = recipe_files.map((row) => row.file_id);

    let filesPromise = filesId.map((id) => File.find(id));
    results = await Promise.all(filesPromise);

    const files = results.map((result) => ({
      ...result.rows[0],
      src: `${req.protocol}://${req.headers.host}${result.rows[0].path.replace(
        "public",
        ""
      )}`,
    }));

    return res.render("users/recipe", { recipe, files });
  },

  async chefs(req, res) {
    let results = await User.chefs();
    let chefs = results.rows;

    async function getImage(fileId) {
      let result = await Chef.file(fileId);
      const file = result.rows[0];
      fileURL = `${req.protocol}://${req.headers.host}${file.path.replace(
        "public",
        ""
      )}`;
      return fileURL;
    }

    await getImage(70);

    const chefsPromise = chefs.map(async (chef) => {
      chef.img = await getImage(chef.file_id);
      return chef;
    });

    chefs = await Promise.all(chefsPromise);

    return res.render("users/chefs", { chefs });
  },
};
