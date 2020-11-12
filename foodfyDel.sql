-- Apagar Banco 
DROP DATABASE IF EXISTS foodfy;

-- Apagar dados da Tabela
DELETE FROM recipe_files;
DELETE FROM recipes;
DELETE FROM users;
DELETE FROM chefs;
DELETE FROM files;

-- Resetar  contadores
ALTER SEQUENCE recipes_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE files_id_seq RESTART WITH 1;
ALTER SEQUENCE recipe_files_id_seq RESTART WITH 1;
ALTER SEQUENCE chefs_id_seq RESTART WITH 1;


