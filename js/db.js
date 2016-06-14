//CRIACAO DO BANCO
//alert ("Iniciando DB");
localStorage.iniciado = 0;
sessionStorage.writeSemaphore = 0;
sessionStorage.dialogSemaphore = 0;
var db = openDatabase('csidb', '1.0', 'my first database', 2 * 1024 * 1024);
var agentes = [];
var output = '';


db.transaction(function (tx) {

  tx.executeSql('CREATE TABLE IF NOT EXISTS cargo (cargo_id INTEGER PRIMARY KEY NOT NULL, nome text NOT NULL)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS unidade (unidade_id INTEGER PRIMARY KEY NOT NULL, nome text NOT NULL)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS agente (agente_id INTEGER PRIMARY KEY NOT NULL, nome text NOT NULL,	matricula text,	lotacao text, cargo_id INTEGER NOT NULL)'); 
  tx.executeSql('CREATE TABLE IF NOT EXISTS comunicacao (comunicacao_id INTEGER PRIMARY KEY NOT NULL, pe INTEGER, comunicante_id TEXT, local_comunicacao text, data_comunicacao text, requerente_id TEXT, local_requisicao text, data_requisicao text, natureza text, fato text, endereco text, municipio text);');
  tx.executeSql('CREATE TABLE IF NOT EXISTS ocorrencia (ocorrencia_id INTEGER PRIMARY KEY NOT NULL, comunicacao_id INTEGER, pe INTEGER, data_ocorrencia_ini text, data_ocorrencia_fim text, equipe_nome text)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS alocacao (alocacao_id INTEGER PRIMARY KEY NOT NULL, agente_id INTEGER NOT NULL, ocorrencia_id INTEGER NOT NULL, vtr text)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS local (local_id INTEGER PRIMARY KEY NOT NULL, ocorrencia_id INTEGER NOT NULL, local_classe text, endereco text, local_tipo text)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS transito (transito_id INTEGER PRIMARY KEY NOT NULL, local_id INTEGER NOT NULL, pavimento TEXT, acostamento INTEGER, condicao_pista text, perfil_pista text, condicao_tempo text, meio_fio INTEGER, visibilidade TEXT, iluminacao INTEGER, pista text, sentido text, largura_pista REAL, tracado text, area_circundante text, conservacao text, sinalizacao text, periodo text)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS site (site_id INTEGER PRIMARY KEY NOT NULL, local_id INTEGER NOT NULL, site_tipo text, modelo text, construcao text, acabamento text, cor_interna text, cor_externa text, piso text, cor_piso text, teto text, forro text, acesso text, guarnicao text, iluminacao TEXT, visibilidade TEXT)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS fato (fato_id INTEGER PRIMARY KEY NOT NULL, ocorrencia_id INTEGER NOT NULL, fato text, natureza text, morte TEXT, modus text, forma text, tipo text, sinistro text, obs text)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS veiculo_tipo (veiculo_tipo_id INTEGER PRIMARY KEY NOT NULL, tipo text)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS veiculo_marca (veiculo_marca_id INTEGER PRIMARY KEY NOT NULL, marca text)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS veiculo (veiculo_id INTEGER PRIMARY KEY NOT NULL, ocorrencia_id INTEGER NOT NULL, veiculo_tipo TEXT, veiculo_marca TEXT, cor text, placa text, proprietario text, chassis text, seguro text, renavam text)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS vitima (vitima_id INTEGER PRIMARY KEY NOT NULL, ocorrencia_id INTEGER NOT NULL, nome text, sexo text, fase text, iml text, paf text, observacao text)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS exames (exame_id INTEGER PRIMARY KEY NOT NULL, nome text, laboratorio text)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS vestigio (vestigio_id INTEGER PRIMARY KEY NOT NULL, ocorrencia_id INTEGER NOT NULL, exame TEXT, tipo text, quantidade INTEGER, local text, coleta TEXT)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS paf (paf_id INTEGER PRIMARY KEY NOT NULL, vitima_id INTEGER, ocorrencia_id INTEGER, entrada TEXT, saida TEXT)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS municipio (municipio_id INTEGER PRIMARY KEY NOT NULL, municipio text)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS iml (iml_id INTEGER PRIMARY KEY NOT NULL, iml text)');

});

