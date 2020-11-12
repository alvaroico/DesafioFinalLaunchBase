const Recipe = require("../models/Recipe");
const File = require("../models/File");

module.exports = {
  async index(req, res) {
    let results = await Recipe.all();
    const recipes = results.rows;
    const recipesId = recipes.map((recipe) => recipe.id);
    const recipeFilesRowsPromise = recipesId.map((id) => File.findForIndex(id));
    results = await Promise.all(recipeFilesRowsPromise);
    recipeFilesRows = results.map((result) => result.rows[0]);
    filesPromise = recipeFilesRows.map((row) => File.find(row.file_id));
    results = await Promise.all(filesPromise);
    files = results.map((result) => result.rows[0]);
    files = files.map((file) => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace(
        "public",
        ""
      )}`,
    }));
    res.render("admins/recipes/index", { recipes, files });
  },

  async create(req, res) {
    let results = await Recipe.chefsSelectOptions();
    const options = results.rows;

    return res.render("admins/recipes/create", { chefOptions: options });
  },

  async post(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "")
        return res.send("Por favor preencha todos os dados da receita.");
    }

    if (req.files.length == 0) {
      return res.send("Envie ao menos uma imagem!");
    }

    req.body.user_id = req.session.userId;
    let results = await Recipe.create(req.body);
    const recipeId = results.rows[0].id;

    const filesPromise = req.files.map((file) => File.create(file));
    const filesResults = await Promise.all(filesPromise);

    const recipeFilesPromises = filesResults.map((file) => {
      const fileId = file.rows[0].id;

      File.createAtRecipeFiles(fileId, recipeId);
    });

    await Promise.all(recipeFilesPromises);

    return res.redirect(`/admin/recipes/${recipeId}`);
  },

  async show(req, res) {
    let result = await Recipe.find(req.params.id);
    recipe = result.rows[0];

    if (!recipe) return res.send("recipe not found");

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

    return res.render("admins/recipes/show", { recipe, files });
  },

  async edit(req, res) {
    try {
      let results = await Recipe.find(req.params.id);
      const recipe = results.rows[0];

      if (!recipe) return res.send("Receita não encontrada");

      results = await Recipe.chefsSelectOptions();
      options = results.rows;

      results = await Recipe.files(recipe.id);
      let filesId = results.rows;
      filesId = filesId.map((file) => file.file_id);

      let filesPromise = filesId.map((id) => File.find(id));
      results = await Promise.all(filesPromise);

      let files = results.map((result) => ({
        ...result.rows[0],
        src: `${req.protocol}://${
          req.headers.host
        }${result.rows[0].path.replace("public", "")}`,
      }));

      return res.render("admins/recipes/edit", {
        recipe,
        chefOptions: options,
        files,
      });
    } catch (err) {
      console.error();
    }
  },

  async put(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "" && key != "removed_files")
        return res.send("Por favor preencha todos os dados da receita.");
    }

    if (req.files.length != 0) {
      const newFilesPromise = req.files.map((file) => File.create(file));
      let results = await Promise.all(newFilesPromise);

      const recipeFilesPromises = results.map((file) => {
        const fileId = file.rows[0].id;
        File.createAtRecipeFiles(fileId, req.body.id);
      });
      await Promise.all(recipeFilesPromises);
    }

    if (req.body.removed_files) {
      const removedFiles = req.body.removed_files.split(",");
      const lastIndex = removedFiles.length - 1;
      removedFiles.splice(lastIndex, 1);

      const removedFilesPromise = removedFiles.map((id) => {
        File.deleteAtRecipeFiles(id);
        File.delete(id);
      });
      await Promise.all(removedFilesPromise);
    }

    await Recipe.update(req.body);

    return res.redirect(`/admin/recipes/${req.body.id}`);
  },

  delete(req, res) {
    Recipe.delete(req.body.id, function () {
      return res.redirect("/admin/recipes");
    });
  },
};
