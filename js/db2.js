//CRIACAO DO BANCO
alert ("INSTALANDO NOVO BANCO DE DADOS!!!");
localStorage.iniciado = 0;
sessionStorage.writeSemaphore = 0;
sessionStorage.dialogSemaphore = 0;
var db = openDatabase('csidb', '1.0', 'my first database', 2 * 1024 * 1024);
var agentes = [];
var output = '';


db.transaction(function (tx) {

  tx.executeSql('create table ocorrBackup as select * from ocorrencia');
  tx.executeSql('drop table ocorrencia');
  tx.executeSql('CREATE TABLE ocorrencia (ocorrencia_id INTEGER PRIMARY KEY NOT NULL, comunicacao_id INTEGER, pe INTEGER, data_ocorrencia_ini text, data_ocorrencia_fim text, equipe_nome text)');
  tx.executeSql('insert into ocorrencia (ocorrencia_id, comunicacao_id, pe, data_ocorrencia_ini, equipe_nome) select ocorrencia_id, comunicacao_id, pe, data_ocorrencia, equipe_nome from ocorrbackup'); 
  tx.executeSql('update ocorrencia set data_ocorrencia_fim = "2015-12-17 16:29:00" where pe = 195');
  tx.executeSql('update ocorrencia set data_ocorrencia_fim = "2015-12-18 06:55:00" where pe = 196'); 
  tx.executeSql('drop table ocorrbackup');
  
  
});

