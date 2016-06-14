document.addEventListener("deviceready", dispositivopronto, false);

function dispositivopronto(){
	console.log ("DISPOSITIVO PRONTO...");
	console.log(cordova.file);
	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem; 
	window.directoryEntry = window.directoryEntry || window.webkitDirectoryEntry;
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 1024*1024, onInitFs, errorHandler);
	function onInitFs(fileSystem) {
	

	var debug = {hello: "world"};
	var blob = new Blob([JSON.stringify(debug, null, 2)], {type : 'application/json'});
    
    fileSystem.root.getDirectory("dir", {create: true}, function(dirEntry){
        console.log(fileSystem.root);
        dirEntry.getFile("foo.json", {create: true}, function(fileEntry){       
            console.log (fileEntry.fullPath);
            console.log(fileSystem.root);
            fileEntry.createWriter(function(writer){
            	console.log ("Escrevendo...");
                writer.write(blob);
            }, onfail);
        }, onfail);
    }, onfail);
	}
	function onfail(error)
	{
	    console.log(error.code);
	}

	function errorHandler(){
		console.log ("ERRO!!!");
	}

	

}

document.addEventListener("backbutton", function(e){
	var whichPageId = $.mobile.activePage.attr( "id" );
	console.log ("Page:"+whichPageId);
    if($.mobile.activePage.is('#home')){
        /* 
         Event preventDefault/stopPropagation not required as adding backbutton
          listener itself override the default behaviour. Refer below PhoneGap link.
        */
        //e.preventDefault();
        navigator.app.exitApp();
    }
    else {
        navigator.app.backHistory()
    }
}, false);

function setNeedReload(){
	localStorage.setItem('needReload',1);
}

function exitApp(){
	$(".btn-home").addClass('ui-disabled');
}

function enableApp(){
	$(".btn-home").removeClass('ui-disabled');
}

function doGarbage(trash){
	
	if (trash == "init"){
		localStorage.setItem('iniciado',0);
		localStorage.setItem('last_com_id',"");
		localStorage.setItem('last_ocor_id',"");
		sessionStorage.setItem ('pe_com',"");
		sessionStorage.setItem ('tipoConsulta',"");
		sessionStorage.setItem ('alteraComunicacao',"");
	} else if (trash == "forms"){
		localStorage.setItem('data_imediato',"");
		localStorage.setItem('data_mediato',"");
		localStorage.setItem('data_relacionado',"");
		localStorage.setItem('tipo_imediato',"");
		localStorage.setItem('tipo_mediato',"");
		localStorage.setItem('tipo_relacionado',"");
		sessionStorage.setItem ('id_comunicacao',"");
		sessionStorage.setItem ('alteraComunicacao',"");

	}
	
}

function populaSelIML(callback){
	var imls = [];
	var consulta = "select iml from iml";	
	db.transaction(function (tx) {
		tx.executeSql(consulta, [], function (tx, results) {
			var len = results.rows.length;
			var iml = "";	
			for (i=0;i < len; i++) {
				iml = results.rows.item(i).iml;
				imls[i] = iml;
			}
			callback(imls);
		});
	});
}

function deletaIML(callback){
	db.transaction(function (tx) {
		var consulta="delete from iml";
		tx.executeSql(consulta);	
		callback();
	});
}

function populaIML(cfg){
	if (!(cfg)) {return;}
	var cfgObj = JSON.parse(cfg);
	deletaIML(function(){
		db.transaction(function (tx) {
			for (i=0;i<cfgObj.length;i++){
				query = "insert into iml values (null, '" + cfgObj[i].iml + "')";
				tx.executeSql(query);
			}
		});
	});
	
}

function resetAuth(){
	localStorage.removeItem("HS");
	localStorage.removeItem("DBlogin");
	localStorage.removeItem("CFE");
}


function authUser(){
	// Precisamos saber se o programa está sendo executado pela primeira vez. 
    if (!(localStorage.DBlogin)) {
    	
    	$.mobile.changePage( "#cadPassDB", { role: "dialog" } );;

    }
    else {
    	authCloudServer(localStorage.DBlogin);
    }
    //if ((!(localStorage.CFE)) && (localStorage.TRL <= 0)) {exitApp();} else {enableApp();}
}

function authCloudServer (DBlogin){
	var vectorStr="";
	var jsonObj = {}; 
	vectorStr = encodeURIComponent(DBlogin);
	jsonObj["ath"] = vectorStr;
		$.ajax({
			//url: "http://localhost/PROTEUS/cloudath.php",
			url: "http://chralex.esy.es/proteus/cloudath.php",
			dataType: "json",
			method: "post",
			data: jsonObj, 
			success: function(result) {
				// Mostra mensagem de retorno
			},
			error: function(result) {
				var responseText = result.responseText;
				if (responseText.substr(0,3) == "NEW"){
					hs = responseText.substring(3,responseText.length);
					localStorage.HS = hs;
					responseText = "NEW";
				}
				if (responseText.substr(0,4) == "NDEV"){
					hs = responseText.substring(4,responseText.length);
					localStorage.HS = hs;
					responseText = "PCH";
				}

				if (responseText.substr(0,3) == "CFG"){
					var cfg = responseText.substring(3,responseText.length);
					populaIML(cfg);
					responseText = "CFG";
				}
				if (responseText.substr(0,5) == "TRIAL"){
					var cfg = responseText.substring(5,responseText.length);
					populaIML(cfg);
					responseText = "TRIAL";
				}
				if (responseText=="VALID") {
					enableApp();
					$("#comunicados").html("");
					localStorage.CFE='%AF%28-%15%B4%07%84mW%3C%18E%0D%60%5B%3F';
					localStorage.TMR=3;
					$.mobile.changePage( "#backupDialog", { role: "dialog" } );;
				} 
				else {
					switch (responseText){
						case "NEW":{
							alert ("Usuário novo inserido, contacte o Administrador para liberação de acesso.(chdenizard@gmail.com)");
							break;
						}
						case "INVALID":{
							alert ("Usuário bloqueado temporariamente no servidor, favor contactar o Administrador. (chdenizard@gmail.com)");
							break;
						}
						case "CFG":{
							alert ("Configuração atualizada, contacte servidor novamente para continuar...");
							break;
						}
						case "NOAUTH":{
							localStorage.removeItem("DBlogin");
							exitApp();
							alert ("Problemas de autenticação, favor contactar o Administrador. (chdenizard@gmail.com)");
							break;
						}
						case "PCH":{
							enableApp();
							$("#comunicados").html("");
							localStorage.CFE='%AF%28-%15%B4%07%84mW%3C%18E%0D%60%5B%3F';
							localStorage.TMR=3;
							break;
						}
						case "RENT":{
							localStorage.removeItem("DBlogin");
							localStorage.TRL = 0;
							localStorage.removeItem("CFE");
							responseText = "TRIAL";
						}
						case "TRIAL":{
							if (localStorage.TRL > 0) {
								enableApp();
							} else {
								exitApp();
							}
							break;
						}
					}


				}

			}
		});
}

function incluiDBPass(){
	var DBPassObj = {};
	var DBPassStr = "";
	sessionStorage.ath = 1;
	DBPassObj.nome = $("#dbauthnome").val();
	DBPassObj.email = $("#dbauthemail").val();
	DBPassObj.pass = "";
	DBPassObj.pass = $("#dbauthpass").val();
	DBPassObj.uf = $("#dbauthuf").val();
	if (($("#dbauthnome").val() == "") || $("#dbauthemail").val() == "" || $("#dbauthpass").val() == "") {
		return false;
	}
	DBPassStr = JSON.stringify(DBPassObj);
	localStorage.DBlogin = DBPassStr;
	localStorage.User = DBPassObj.email;
	localStorage.username = DBPassObj.nome;
	localStorage.userUF = DBPassObj.uf;
	authCloudServer(localStorage.DBlogin);
	$.mobile.changePage( "#home" );;
	$( '#cadPassDB' ).dialog( 'close' );
	//enableApp();

}

function sendDatatoCloud(){
	var htmlstr="";
	$("#backupPanel").html("");
	$("#backupPanel").css("font-family",'Courier New');
	htmlstr="Contacting Cloud Rest Server...OK<br>";
	htmlstr+="Performing authentication.........OK<br>";
	htmlstr+="Initiating JSON Protocol............OK<br>";
	htmlstr+="Setting DATA to SEND.............OK<br>";
	$("#backupPanel").html(htmlstr);
	$("#backupPanel").trigger('create');
	sessionStorage.jsonerror = 0;
	exportTables();
}

function retrieveDatafromCloud(){
	var htmlstr="";
	$("#backupPanel").html("");
	$("#backupPanel").css("font-family",'Courier New');
	htmlstr="Contacting Cloud Rest Server........OK<br>";
	htmlstr+="Performing authentication...........OK<br>";
	htmlstr+="Initiating JSON Protocol............OK<br>";
	htmlstr+="Setting DATA to RECEIVE.............OK<br>";
	$("#backupPanel").html(htmlstr);
	$("#backupPanel").trigger('create');
	sessionStorage.jsonerror = 0;
	importTables()
}


//function replacer(key, value) {
  //if (typeof value === "string") {
   // return value.replace(/\ /g,"%20");
  //}
  //return value;
//}

function exportToCloud(table, vectorObj,callback){
	var i = 0;
	var vectorStr="";
	var jsonObj = {};
	var hs = localStorage.HS; 
	vectorStr = encodeURIComponent(JSON.stringify (vectorObj));
	jsonObj[table] = vectorStr;
	jsonObj["HS"] = hs;
		$.ajax({
			//url: "http://localhost/PROTEUS/cloudserver.php",
			url: "http://chralex.esy.es/proteus/cloudserver.php",
			dataType: "json",
			method: "post",
			data: jsonObj, 
			success: function(result) {
				callback ();
			},
			error: function(result) {
				sessionStorage.jsonerror = 1;
				if (result.responseText=="NOUSER") {sessionStorage.jsonerror = 2;}
				callback ("ERRO");
			}
		});
	
}

function consultaDBexportTables(tabela,vet_colunas,callback) {
	
	var vectorObj = [];
	var consulta; 
	consulta = "select * from ";
	consulta+= tabela;
	db.transaction(function (tx) {
	tx.executeSql(consulta, [], function (tx, results) {
		var len = results.rows.length,i;
			for (i=0;i < len; i++) {
				var tempobj = {};
				vet_colunas.forEach(function(entry){
					tempobj[entry] = results.rows.item(i)[entry];
				});

				vectorObj.push(tempobj);
			}
			
			callback(tabela,vectorObj);
		});
	});
}

function coordenaExportTables(callback){

	// Para portabilidade das funcoes, vamos definir metadados para as sucessivas chamadas...
	var htmlstr;
	var tabela,vet_colunas;
	var tabelas = ['agente','alocacao','comunicacao','fato','local','ocorrencia','paf','site','transito','veiculo','vestigio','municipio','vitima'];
    var colunas = {
    	'agente': ['agente_id','nome','matricula','lotacao','cargo_id'],
    	'alocacao': ['alocacao_id','agente_id','ocorrencia_id','vtr'],
    	'comunicacao': ['comunicacao_id','pe','comunicante_id','local_comunicacao','data_comunicacao','requerente_id','local_requisicao','data_requisicao','natureza','fato','endereco','municipio'],
    	'fato': ['fato_id','ocorrencia_id','fato','natureza','morte','modus','forma','tipo','sinistro','obs'],
    	'local': ['local_id','ocorrencia_id','local_classe','endereco','local_tipo'],
    	'ocorrencia': ['ocorrencia_id','comunicacao_id','pe','data_ocorrencia_ini','data_ocorrencia_fim','equipe_nome'],
    	'paf': ['paf_id','vitima_id','ocorrencia_id','entrada','saida'],
    	'site': ['site_id','local_id','site_tipo','modelo','construcao','acabamento','cor_interna','cor_externa','piso','cor_piso','teto','forro','acesso','guarnicao','iluminacao','visibilidade'],
    	'transito': ['transito_id','local_id','pavimento','acostamento','condicao_pista','perfil_pista','condicao_tempo','meio_fio','visibilidade','iluminacao','pista','sentido','largura_pista','tracado','area_circundante','conservacao','sinalizacao','periodo'],
    	'veiculo': ['veiculo_id','ocorrencia_id','veiculo_tipo','veiculo_marca','cor','placa','proprietario','chassis','seguro','renavam'],
    	'vestigio': ['vestigio_id','ocorrencia_id','exame','tipo','quantidade','local','coleta'],
    	'municipio': ['municipio_id','municipio'],
    	'vitima': ['vitima_id','ocorrencia_id','nome','sexo','fase','iml','paf','observacao']
    }
	sessionStorage.jsonerror = 0;
    // Percorrer as tabelas e enviar para processamento...

    for (key1 in colunas) {
    	tabela = key1;
    	vet_colunas = colunas[key1];

    	consultaDBexportTables(tabela, vet_colunas, function(table,vectorObj){
    		vectorObj.forEach(function(entry){
    			//console.log ("___________________");
    			//console.log (table);
		    	//console.log ("___________________");
    			for (key2 in entry) {
    				//console.log (key2+" "+entry[key2]);
    			}
    		});
    		if (vectorObj.length > 0){
	    		
	    		exportToCloud(table, vectorObj, function(resultado){
					//if (resultado == "ERRO") {
						//sessionStorage.jsonerror = 1;
					//}
						if (table == "vitima") {
							$.mobile.loading( "hide" );
							if (sessionStorage.jsonerror === "0") {
							htmlstr='<b><h3 style="color:red"><b>PROCESSAMENTO BEM SUCEDIDO!!!!!!</h3></b>';
							$("#backupPanel").append(htmlstr);
							$("#backupPanel").trigger('create');
							sessionStorage.jsonerror = 0;
							}
						    if (sessionStorage.jsonerror === "1") {
							htmlstr='<b><h2 style="color:red"><b>FALHA NO PROCESSAMENTO!!!!!!</h2></b>';
							$("#backupPanel").append(htmlstr);
							$("#backupPanel").trigger('create');
							sessionStorage.jsonerror = 0;
							} 
							if (sessionStorage.jsonerror === "2") {
							htmlstr='<b><h3 style="color:red"><b>PROBLEMAS COM O USUÁRIO, CONTACTE ADMIN!!!!!!</h3></b>';
							$("#backupPanel").append(htmlstr);
							$("#backupPanel").trigger('create');
							sessionStorage.jsonerror = 0;
							} 
						}
				});
    		}
    	});
    }

}

function exportTables(){
		$.mobile.loading( "show");
		coordenaExportTables(function(status){
			if (status == "ERRO") {
				console.log ("Erro no processamento...");
				
			}
		});
}

function importTables(){
	$.mobile.loading( "show");
	// Precisamos inicialmente fazer a carga nas tabelas temporarias e depois de certificado virar as tabelas
	coordenaImportTables(function(){

	});
}

function coordenaImportTables(){
	sessionStorage.rollbackDB=0;
	sessionStorage.jsonerror = 0;
	// Para portabilidade das funcoes, vamos definir metadados para as sucessivas chamadas...
	var tabela,vet_colunas;
	var tabelas = ['agente','alocacao','comunicacao','fato','local','ocorrencia','paf','site','transito','veiculo','vestigio','municipio','vitima'];
    var colunas = {
    	'agente': ['agente_id','nome','matricula','lotacao','cargo_id'],
    	'alocacao': ['alocacao_id','agente_id','ocorrencia_id','vtr'],
    	'comunicacao': ['comunicacao_id','pe','comunicante_id','local_comunicacao','data_comunicacao','requerente_id','local_requisicao','data_requisicao','natureza','fato','endereco','municipio'],
    	'fato': ['fato_id','ocorrencia_id','fato','natureza','morte','modus','forma','tipo','sinistro','obs'],
    	'local': ['local_id','ocorrencia_id','local_classe','endereco','local_tipo'],
    	'ocorrencia': ['ocorrencia_id','comunicacao_id','pe','data_ocorrencia_ini','data_ocorrencia_fim','equipe_nome'],
    	'paf': ['paf_id','vitima_id','ocorrencia_id','entrada','saida'],
    	'site': ['site_id','local_id','site_tipo','modelo','construcao','acabamento','cor_interna','cor_externa','piso','cor_piso','teto','forro','acesso','guarnicao','iluminacao','visibilidade'],
    	'transito': ['transito_id','local_id','pavimento','acostamento','condicao_pista','perfil_pista','condicao_tempo','meio_fio','visibilidade','iluminacao','pista','sentido','largura_pista','tracado','area_circundante','conservacao','sinalizacao','periodo'],
    	'veiculo': ['veiculo_id','ocorrencia_id','veiculo_tipo','veiculo_marca','cor','placa','proprietario','chassis','seguro','renavam'],
    	'vestigio': ['vestigio_id','ocorrencia_id','exame','tipo','quantidade','local','coleta'],
    	'municipio': ['municipio_id','municipio'],
    	'vitima': ['vitima_id','ocorrencia_id','nome','sexo','fase','iml','paf','observacao']
    }

    // Precisamos chamar a API para cada tabela

    for (key1 in colunas) {
    	vet_tabela = key1;
    	vet_colunas = colunas[key1];
    	// Chamando API
    	console.log ("Chamando API para tabela:"+vet_tabela);
    	importfromCloud(vet_tabela, function(tabela,resultado){
    		//Precisamos validar o dado para cada tabela.
    		if ((resultado[0].tam) == "NOUSER") {sessionStorage.rollbackDB=1;sessionStorage.jsonerror = 2}
    		if ((resultado[0].tam) == null) {sessionStorage.rollbackDB=1;}
    		//Estamos prontos para enviar para o banco
    		if (tabela == "vitima") {
				$.mobile.loading( "hide" );
			    if ((sessionStorage.jsonerror == 0) && (sessionStorage.rollbackDB == 0)) {
				htmlstr='<b><h3 style="color:red"><b>PROCESSAMENTO BEM SUCEDIDO!!!!!!</h2></b>';
				$("#backupPanel").append(htmlstr);
				$("#backupPanel").trigger('create');
				} else if (sessionStorage.jsonerror == 2) {
					htmlstr='<b><h3 style="color:red"><b>PROBLEMAS COM O USUÁRIO, CONTACTE ADMIN!!!!!!</h3></b>';
					$("#backupPanel").append(htmlstr);
					$("#backupPanel").trigger('create');
				} else {
					htmlstr='<b><h2 style="color:red"><b>FALHA NO PROCESSAMENTO!!!!!!</h3></b>';
					$("#backupPanel").append(htmlstr);
					$("#backupPanel").trigger('create');
				}
			}
    		//Inicialmente vamos destruir o dado atual
    		if ((sessionStorage.jsonerror == 0) && (sessionStorage.rollbackDB == 0)){
	    		deleteDBA(tabela, function(){
	    			// Callback para escrita após deleção
	    			carregaDBA(tabela,colunas[tabela],resultado);
	    		});
    		}
    	});
    }
}

function deleteDBA(tabela, callback) {

	db.transaction(function (tx) {
			var consulta="delete from "+ tabela;
			tx.executeSql(consulta);	
			callback();
		});	
}

function carregaDBA(tabela, colunas, resultado){
	db.transaction(function (tx) {
		for (i=1;i<resultado.length;i++) {

			var query = "insert into "+tabela+" (";
			var values = "values (";
			for (j in colunas){
				// Precisamos montar o comando de insercao...
				query += colunas[j] + ",";
				if (typeof(resultado[i][j]) == "string") {
					values += "'"+resultado[i][j] + "'" + ",";
				} else {
					values += resultado[i][j] + ",";
				}
			}
			query = query.substr(0,query.length-1);
			query = query + ") ";
			values = values.substr(0,values.length-1);
			values = values + ") ";
			query = query + values;
			tx.executeSql(query);	
			
		}
	});
}


function importfromCloud(tabela, callback){
	var testObj={};
	var hs = localStorage.HS;
	testObj.tabela=tabela;
	testObj.HS = hs;
	$.ajax({
			//url: "http://localhost/PROTEUS/cloudprovider.php",
			url: "http://chralex.esy.es/proteus/cloudprovider.php",
			dataType: "json",
			type: "post",
			data: testObj, 
			success: function(result) {
				console.log ("AJAX BEM SUCEDIDO!!!"+tabela);
				callback(tabela,result);
			},
			error: function(result) {
				sessionStorage.jsonerror = 1;
				console.log ("AJAX MAL SUCEDIDO!!!");
				callback(tabela,result);
			}
		});
}

 
function deletaComunicacao(){
	var pe_com = sessionStorage.pe_com;
	verificaOcorrencia(pe_com,function(status){
		if (status=="true"){
			alert("Não é possível deletar uma comunicacao com uma ocorrencia associada...");
			$.mobile.navigate("#home");
		}
		else{
			deleteCAD (function(){
				$.mobile.navigate("#home");
			});
		}
	});
}

function alterarComunicacao(){
	sessionStorage.writeSemaphore = 1;
	deleteCAD (function(){
		encerrarComunicacao();
	});
}


function deleteCAD(callback){
	var altcom = sessionStorage.id_comunicacao;
	db.transaction(function (tx) {	
		consulta = "delete from comunicacao where comunicacao_id = "+altcom;
		tx.executeSql(consulta);		
		callback();
	});	
			
}



function alteraComunicacao(altcom){
	carregaDBFormComunicacao (altcom, function(){
	});
}

function carregaDBFormComunicacao (altcom, callback){
	var consulta, comstr = "";
	
	consulta = "select pe, comunicante_id, local_comunicacao, data_comunicacao, requerente_id, local_requisicao, data_requisicao, natureza, fato, endereco, municipio from comunicacao where comunicacao_id = " + altcom;
	db.transaction(function (tx) {
		tx.executeSql(consulta, [], function (tx, results) {
					var pe = results.rows.item(0).pe;
					var comunicante_id = results.rows.item(0).comunicante_id;
					var local_comunicacao = results.rows.item(0).local_comunicacao;
					var data_comunicacao = results.rows.item(0).data_comunicacao;
					var requerente_id = results.rows.item(0).requerente_id;
					var local_requisicao = results.rows.item(0).local_requisicao;
					var data_requisicao = results.rows.item(0).data_requisicao;
					var natureza = results.rows.item(0).natureza;
					var fato = results.rows.item(0).fato;
					var endereco = results.rows.item(0).endereco;
					var municipio = results.rows.item(0).municipio;
				    var data_hora_com = [];
				    var data_hora_req = [];
				    var pess = "" + pe;
					pess = pess.substring(0,4) + "-" + pess.substring(4,pess.length);
				    $("#penum").val(pess);
				    $("#comunicante").val(comunicante_id);
				    $("#local_comunicante").val(local_comunicacao);
				    $("#requerente").val(requerente_id);
				    $("#local_requerente").val(local_requisicao);
				    $("#natureza").val(natureza);
				    $("#fato").val(fato);
				    $("#endereco").val(endereco);
				    $("#municipio").val(municipio);
				    data_hora_com = data_comunicacao.split(" ");
				    data_hora_req = data_requisicao.split(" ");
					$("#data_comunicacao").val(data_hora_com[0]);
					$("#hora_comunicacao").val(data_hora_com[1]);
					$("#data_requisicao").val(data_hora_req[0]);
					$("#hora_requisicao").val(data_hora_req[1]);
		
				    callback();
	});
});
}

function consultaDBComboAgente (callback){
	var agentes = [];
	var consulta = "select nome, cargo_id from agente";	
	var agente_nome = "", agente_cargo = "";
	db.transaction(function (tx) {
	tx.executeSql(consulta, [], function (tx, results) {
		var len = results.rows.length,i;
			for (i=0;i < len; i++) {
				agente_nome = results.rows.item(i).nome;
				agente_cargo = results.rows.item(i).cargo_id;
				agente_txt = agente_nome+","+agente_cargo;
				agentes[i] = agente_txt;
			}
			callback(agentes);
		});
	});
	
	
}

function consultaDBComboMunicipio (callback){
	var municipios = [];
	var municipio = "";
	var consulta = "select municipio from municipio";	
	db.transaction(function (tx) {
	tx.executeSql(consulta, [], function (tx, results) {
		var len = results.rows.length,i;
			for (i=0;i < len; i++) {
				municipio = results.rows.item(i).municipio;
				municipios[i] = municipio;
			}
			callback(municipios);
		});
	});
	
	
}

	
function populaComboMunicipio(){
	consultaDBComboMunicipio(function(municipios){
		var htmlIns = "";
		for (i=0;i<municipios.length;i++){
			htmlIns += "<a href=\"#\" class=\"ui-screen-hidden iden\" data-role=\"button\" onclick='populaCampo(\"municipio\",\""+municipios[i]+"\")'>"+municipios[i]+"</a>";
			$("#populaComboMunicipio").html(htmlIns);
			$("#populaComboMunicipio").trigger('create');	
		}
	});
}

function populaComboAgente(origem){
	
	consultaDBComboAgente(function(agentes){
		var hashAgente = [];
		var htmlIns1 = "";
		var htmlIns2 = "";
		for (i=0;i<agentes.length;i++){
			hashAgente = agentes[i].split(",");

			switch (origem){
				case "COMUNICACAO":{
					htmlIns1 += "<a href=\"#\" class=\"ui-screen-hidden iden\" data-role=\"button\" onclick='populaCampo(\"comunicacao\",\""+hashAgente[0]+"\")'>"+hashAgente[0]+"</a>";
					htmlIns2 += "<a href=\"#\" class=\"ui-screen-hidden iden\" data-role=\"button\" onclick='populaCampo(\"requerente\",\""+hashAgente[0]+"\")'>"+hashAgente[0]+"</a>";
					break;
				}
				case "PERITO":{
					if (hashAgente[1] == "Perito Criminal"){
						htmlIns1 += "<a href=\"#\" class=\"ui-screen-hidden iden\" data-role=\"button\" onclick='populaCampo(\"peritocomp\",\""+hashAgente[0]+"\")'>"+hashAgente[0]+"</a>";
					}
					break;
				}
				case "MOTORISTA":{
					if (hashAgente[1] == "Motorista"){
						htmlIns1 += "<a href=\"#\" class=\"ui-screen-hidden iden\" data-role=\"button\" onclick='populaCampo(\"motoristacomp\",\""+hashAgente[0]+"\")'>"+hashAgente[0]+"</a>";
						
					}
					break;
				}
				case "NECRO":{
					if (hashAgente[1] == "Auxiliar de Necropsia"){
						htmlIns1 += "<a href=\"#\" class=\"ui-screen-hidden iden\" data-role=\"button\" onclick='populaCampo(\"necro\",\""+hashAgente[0]+"\")'>"+hashAgente[0]+"</a>";
						
					}
					break;
				}
				case "PM":{
					if (hashAgente[1] == "PM"){
						htmlIns1 += "<a href=\"#\" class=\"ui-screen-hidden iden\" data-role=\"button\" onclick='populaCampo(\"pmnome\",\""+hashAgente[0]+"\")'>"+hashAgente[0]+"</a>";
						
					}
					break;
				}
				case "BM":{
					if (hashAgente[1] == "BM"){
						htmlIns1 += "<a href=\"#\" class=\"ui-screen-hidden iden\" data-role=\"button\" onclick='populaCampo(\"bmnome\",\""+hashAgente[0]+"\")'>"+hashAgente[0]+"</a>";
						
					}
					break;
				}
				case "PC":{
					if (hashAgente[1] == "PC"){
						htmlIns1 += "<a href=\"#\" class=\"ui-screen-hidden iden\" data-role=\"button\" onclick='populaCampo(\"pcnome\",\""+hashAgente[0]+"\")'>"+hashAgente[0]+"</a>";
						
					}
					break;
				}
				case "OU":{
					if (hashAgente[1] == "OU"){
						htmlIns1 += "<a href=\"#\" class=\"ui-screen-hidden iden\" data-role=\"button\" onclick='populaCampo(\"ounome\",\""+hashAgente[0]+"\")'>"+hashAgente[0]+"</a>";
						
					}
					break;
				}
			}

		}

		switch (origem){
				case "COMUNICACAO":{
					$("#populaComboComunicante").html(htmlIns1);
					$("#populaComboComunicante").trigger('create');	
					$("#populaComboRequerente").html(htmlIns2);
					$("#populaComboRequerente").trigger('create');
					break;
				}
				case "PERITO":{
					$("#populaComboPerito").html(htmlIns1);
					$("#populaComboPerito").trigger('create');
					break;	
				}
				case "MOTORISTA":{
					$("#populaComboMotorista").html(htmlIns1);
					$("#populaComboMotorista").trigger('create');
					break;	
				}
				case "NECRO":{
					$("#populaComboNecro").html(htmlIns1);
					$("#populaComboNecro").trigger('create');
					break;	
				}
				case "PM":{
					$("#populaComboPM").html(htmlIns1);
					$("#populaComboPM").trigger('create');
					break;	
				}
				case "BM":{
					$("#populaComboBM").html(htmlIns1);
					$("#populaComboBM").trigger('create');
					break;	
				}
				case "PC":{
					$("#populaComboPC").html(htmlIns1);
					$("#populaComboPC").trigger('create');
					break;	
				}
				case "OU":{
					$("#populaComboOU").html(htmlIns1);
					$("#populaComboOU").trigger('create');
					break;	
				}
			}
		
		
	});
		
}

function populaCampo(campo,nome){
	switch (campo){
		case "peritocomp": 
			$("#peritocomp").val(nome);
			$(".iden").addClass('ui-screen-hidden');
			break;
		case "motoristacomp": 
			$("#motoristacomp").val(nome);
			$(".iden").addClass('ui-screen-hidden');
			break;
		case "necro": 
			$("#necro").val(nome);
			$(".iden").addClass('ui-screen-hidden');
			break;
		case "pmnome": 
			$("#pmnome").val(nome);
			$(".iden").addClass('ui-screen-hidden');
			break;	
		case "bmnome": 
			$("#bmnome").val(nome);
			$(".iden").addClass('ui-screen-hidden');
			break;
		case "pcnome": 
			$("#pcnome").val(nome);
			$(".iden").addClass('ui-screen-hidden');
			break;
		case "ounome": 
			$("#ounome").val(nome);
			$(".iden").addClass('ui-screen-hidden');
			break;	
		case "motorista": 
			$("#motoristacomp").val(nome);
			$(".iden").addClass('ui-screen-hidden');
			break;
		case "comunicacao": 
			$("#comunicante").val(nome);
			$(".iden").addClass('ui-screen-hidden');
			break;
		case "requerente": 
			$("#requerente").val(nome);
			$(".iden").addClass('ui-screen-hidden');
			break;
		case "fato": 
			$("#fato").val(nome);
			$(".iden").addClass('ui-screen-hidden');
			break;
		case "natureza": 
			$("#natureza").val(nome);
			$(".iden").addClass('ui-screen-hidden');
			break;
		case "fatoReal": 
			$("#fatoReal").val(nome);
			$(".iden").addClass('ui-screen-hidden');
			break;
		case "naturezaReal": 
			$("#naturezaReal").val(nome);
			$(".iden").addClass('ui-screen-hidden');
			break;
		case "municipio": 
			$("#municipio").val(nome);
			$(".iden").addClass('ui-screen-hidden');
			break;
	}
	sessionStorage.passthru=1;
}

function verificaOcorrencia(pe_com,callback){
	var status = "false";
	
	var consulta = "select * from ocorrencia where pe = '" + pe_com + "'";	
	
	function queryDB(tx) {
    	tx.executeSql(consulta, [], querySuccess, errorCB2);
	}
	
	function querySuccess(tx, results) {
    	var len = 0;
		len = results.rows.length;
		if (len == 0){status = "false";} else {status = "true";}
		callback(status);
    }
	
	function errorCB1(err) {
    	alert("Error CB1 processing SQL: "+err.code);
	}
	
	function errorCB2(err) {
    	alert("Error CB2 processing SQL: "+err.code);
	}
	
	db.transaction(queryDB, errorCB1);
	
}

function consultaTabelaFato(campo, tabela, index, callback){
	status = "true";
	var chave = "";
	
	var consulta = "select * from "+tabela+" where "+index+" = '" + campo + "'";	
	
	function queryDB(tx) {
    	tx.executeSql(consulta, [], querySuccess, errorCB2);
	}
	
	function querySuccess(tx, results) {
    	var len = 0;
		len = results.rows.length;
		if (len == 0){status = "true";} else {status = "false";}
		callback(status);
    }
	
	function errorCB1(err) {
    	alert("Error CB1 processing SQL: "+err.code);
	}
	
	function errorCB2(err) {
    	alert("Error CB2 processing SQL: "+err.code);
	}
	
	db.transaction(queryDB, errorCB1);
	
}
	


function checaTabelaFato(campo, tabela, index){
	//Verificar se existe o item na tabela fato
	if (sessionStorage.passthru) {sessionStorage.removeItem("clearDetected");sessionStorage.removeItem("passthru");}
	if (sessionStorage.clearDetected == 1) {sessionStorage.clearDetected=0; return false}
	if (sessionStorage.clearDetected == 0) {sessionStorage.removeItem("clearDetected"); return false}
	consultaTabelaFato(campo, tabela, index, function(status){
		var field="";texto = "";
		if (sessionStorage.populaComboFlag == 1) {status = "false"; sessionStorage.removeItem("populaComboFlag");}
		if (status == "true" && campo != ""){
			texto = campo+","+tabela+","+index;
			sessionStorage.setItem("tabelaFato",texto);
			field = sessionStorage.agenteDialogCaller;
			if ($(field).val()) {
				if (tabela == "agente") {$.mobile.changePage( "#dialogPage", { role: "dialog" } );;}
				if (tabela == "municipio") {$.mobile.changePage( "#dialogPageM", { role: "dialog" } );;}
			}	
		}
	});
	
}

function consultaPE(pe,callback){
	var status = "true";
	
	var consulta = "select * from ocorrencia where pe = '" + pe + "'";	
	
	function queryDB(tx) {
    	tx.executeSql(consulta, [], querySuccess, errorCB2);
	}
	
	function querySuccess(tx, results) {
    	var len = 0;
		len = results.rows.length;
		if (len == 0){status = "true";} else {status = "false";}
		callback(status);
    }
	
	function errorCB1(err) {
    	alert("Error CB1 processing SQL: "+err.code);
	}
	
	function errorCB2(err) {
    	alert("Error CB2 processing SQL: "+err.code);
	}
	
	db.transaction(queryDB, errorCB1);
	
}
	

function validaPE(pe){
	//Verificar se existe o item na tabela fato
	consultaPE(pe, function(status){
		if (status == "false"){
			alert ("PE ja existe!!!");
			$(".pe_val").val("");
			$(".pe_val").focus();
			status="";
		}
	});
	
}

function incluiMunicipioTabelaFato(municipio){
	var consulta = "";
	municipio = municipio.toUpperCase();
	$("#municipio").val(municipio);
	consulta = "insert into municipio (municipio_id, municipio) values (null, \""+municipio+"\")";
	
	db.transaction(function (tx) {
		tx.executeSql(consulta);
	});
	$( '#dialogPageM' ).dialog( 'close' );
	sessionStorage.removeItem("tabelaFato");
	sessionStorage.passthru=1;
}

function incluiItemTabelaFato(){
	var texto = "", consulta = "", cargoFato = "", matriculaFato = "", lotacaoFato = "";
	var itens = [];
	texto = sessionStorage.tabelaFato;
	itens = texto.split(",");
	cargoFato = $("#cargofato").val();
	matriculaFato = $("#matriculafato").val();
	lotacaoFato = $("#lotacaofato").val();

	consulta = "insert into "+itens[1]+" (agente_id, nome, matricula, lotacao, cargo_id) values (null, \""+itens[0]+"\", \""+matriculaFato+"\",\""+lotacaoFato+"\",\""+cargoFato+"\")";
	
	db.transaction(function (tx) {
		tx.executeSql(consulta);
	});
	$( '#dialogPage' ).dialog( 'close' );
	sessionStorage.removeItem("tabelaFato");
}

function carregaComunicacao(){
	if (localStorage.mantemFormComunicacao != 1){
	$('#testaFormComunicacao')[0].reset();
	}
	localStorage.setItem('mantemFormComunicacao',0);
	sessionStorage.alteraComunicacao = 0;
}

function validaFormComunicacao(){
	status = "true";
	if (($("#comunicante").val() == null) || ($("#comunicante").val() == "")){
		alert("Favor preencher o nome do Comunicante");
		status = "false";
		return (status);
	}
	

	if (($("#data_comunicacao").val() == null) || ($("#data_comunicacao").val() == "")){
		alert("Favor preencher a data da comunicacao");
		status = "false";
		return (status);
	}
	
	if (($("#hora_comunicacao").val() == null) || ($("#hora_comunicacao").val() == "")){
		alert("Favor preencher a hora da comunicacao");
		status = "false";
		return (status);
	}
	
	if (($("#fato").val() == null) || ($("#fato").val() == "")){
		alert("Favor preencher o FATO");
		status = "false";
		return (status);
	}
	
	if (($("#natureza").val() == null) || ($("#natureza").val() == "")){
		alert("Favor preencher a NATUREZA");
		status = "false";
		return (status);
	}
	
	if (($("#endereco").val() == null) || ($("#endereco").val() == "")){
		alert("Favor preencher o ENDERECO");
		status = "false";
		return (status);
	}
	
	var str = $("#municipio").val();
	if (str.search(/ICIPIO.../) > 0) {
		alert("Favor preencher o MUNICIPIO");
		status = "false";
		return (status);
	}
	
	
	
	return (status);
}

function encerrarComunicacao(){
	
	status = validaFormComunicacao();
		if (status == "true") {
			insereComunicacao();
		}
	    else {
	    	alert ("Falha no preenchimento");
	    	localStorage.setItem('mantemFormComunicacao',1);
	    }
}
	


function insereComunicacao() {		
	// TENTATIVA DE RECUPERAR OS CAMPOS DO FORMULÁRIO
	
	var divcadcom = document.getElementById("cadcom");
	var camposcom = divcadcom.getElementsByTagName("input");
	var idcom = sessionStorage.id_comunicacao;
	var db = openDatabase('csidb', '1.0', 'my first database', 2 * 1024 * 1024);
	var inserttxt = "";
	    var comunicante_id = camposcom[1].value;
	    var requerente_id = camposcom[5].value;
	    var pe = $("#penum").val();
	    var obito = $("#obito").val();
	    if (pe.indexOf("-") > 0) {
	    	var pess = "" + pe;
			pess = pess.substring(0,4) + pess.substring(5,pess.length);
			pe = pess;
	    } else {
	    	var ano = $("#data_comunicacao").val();
	   	 	ano = ano.substring(0,4);
	    	pe = ano + pe;
	    }
	    var local_comunicacao = $("#local_comunicante").val();
		var data_comunicacao = $("#data_comunicacao").val() + " " + $("#hora_comunicacao").val();
		var local_requisicao = $("#local_requerente").val();
		var data_requisicao = $("#data_requisicao").val() + " " + $("#hora_requisicao").val();
		var fato = $("#fato").val();
		var natureza = $("#natureza").val();
		var endereco = $("#endereco").val();
		var municipio = $("#municipio").val();
		if ((pe == null) || (pe == "")){
			pe = 0;
		}
		
		if (sessionStorage.alteraComunicacao == 1){
			inserttxt = "insert into comunicacao (comunicacao_id, pe,comunicante_id,local_comunicacao,data_comunicacao,requerente_id,local_requisicao,data_requisicao,natureza,fato,endereco,municipio) ";	
		    inserttxt = inserttxt + "values (" + idcom +"," + pe +"," + "\"" + comunicante_id + "\"" + "," + "\"" + local_comunicacao + "\"" + "," + "\"" + data_comunicacao + "\"" + "," + "\"" + requerente_id + "\"" + ", " + "\"" + local_requisicao + "\"" + "," + "\"" + data_requisicao + "\"" + ", " + "\"" + fato + "\"" + ", " + "\"" + natureza + "\"" + ", " + "\"" + endereco + "\"" + ", " + "\"" + municipio + "\"" + ")";
		}
		else {
			inserttxt = "insert into comunicacao (pe,comunicante_id,local_comunicacao,data_comunicacao,requerente_id,local_requisicao,data_requisicao,natureza,fato,endereco,municipio) ";
			inserttxt = inserttxt + "values (" + pe +"," + "\"" + comunicante_id + "\"" + "," + "\"" + local_comunicacao + "\"" + "," + "\"" + data_comunicacao + "\"" + "," + "\"" + requerente_id + "\"" + ", " + "\"" + local_requisicao + "\"" + "," + "\"" + data_requisicao + "\"" + ", " + "\"" + fato + "\"" + ", " + "\"" + natureza + "\"" + ", " + "\"" + endereco + "\"" + ", " + "\"" + municipio + "\"" + ")";
		}
		
		
		
		db.transaction(function (tx) {
  			tx.executeSql(inserttxt);
  			consulta = "select max(comunicacao_id) last_com_id from comunicacao";
			tx.executeSql(consulta, [], function (tx, results) {
		  		last_com_id = results.rows.item(0).last_com_id;
		  		localStorage.setItem('last_com_id',last_com_id);
			});
		});
   
}

function iniciarPE()
{
	var hora_inicio = $(".hora_inicio").val();
	var data_inicio = $(".data_inicio").val();
	
	if ((!data_inicio) || (!hora_inicio)) 
	{
		var now = new Date();
		var day = ("0" + now.getDate()).slice(-2);
		var month = ("0" + (now.getMonth() + 1)).slice(-2);
		var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
		$(".data_inicio").val (today);
		var hours = ("0" + now.getHours()).slice(-2);
		var minutes = ("0" + now.getMinutes()).slice(-2);
		var seconds= ("0" + now.getSeconds()).slice(-2);
		var hour = (hours)+":"+(minutes)+":"+(seconds);
		$(".hora_inicio").val (hour);
	}
	$(".topo").addClass('ui-disabled');
	$(".btnEncerrar").removeClass('ui-disabled');
	$(".data_fim").removeClass('ui-disabled');
	$(".hora_fim").removeClass('ui-disabled');
	//localStorage.atividadeSemaphore = 1;
}

function recuperaId (tabela, id, campo, valor, callback)
{
	var consulta = "select " + id + " from " + tabela + " where " + campo + " = \"" + valor + "\"";	
	db.transaction(function (tx) {
	tx.executeSql(consulta, [], function (tx, results) {
		agente_id = results.rows.item(0).agente_id;
		callback (agente_id);
		});
	});
}


function alocaAgente(agente_id, ocor_id, vtr){
	
	var inserttxt = "INSERT INTO alocacao (alocacao_id, agente_id , ocorrencia_id, vtr)  ";
	inserttxt = inserttxt + "values (null, " + agente_id + "," + ocor_id + "," + "\"" + vtr + "\" )";
	db.transaction(function (tx) {
		tx.executeSql(inserttxt);
	});
}

function insereEquipe (last_com_id, data_ocorrencia_ini, data_ocorrencia_fim){
	var last_ocor_id = 0;
	var pe = $(".pe_val").val();
	var perito = $("#peritocomp").val();
	var motorista = $("#motoristacomp").val();
	var vtr = $("#VTR").val();
	var necro = $("#necro").val();
	var pm = $("#pm").val();
	var pmnome = $("#pmnome").val();
	var vtrpm = $("#vtrpm").val();
	var bm = $("#bm").val();
	var bmnome = $("#bmnome").val();
	var vtrbm = $("#vtrbm").val();
	var pc = $("#pc").val();
	var pcnome = $("#pcnome").val();
	var vtrpc = $("#vtrpc").val();
	var outros = $("#outros").val();
	var ounome = $("#ounome").val();
	var vtrou = $("#vtrou").val();
	var db = openDatabase('csidb', '1.0', 'my first database', 2 * 1024 * 1024);
	var pess = "" + pe;
	pess = pess.substring(0,4) + pess.substring(5,pess.length);
	pe = pess;
	var inserttxt = "INSERT INTO ocorrencia (comunicacao_id, pe, data_ocorrencia_ini, data_ocorrencia_fim, equipe_nome)  ";
	inserttxt = inserttxt + "values (" + last_com_id +"," + pe + "," + "\"" + data_ocorrencia_ini + "\"" + "," + "\"" + data_ocorrencia_fim + "\"" + "," + "\"PROTEUS\")";
	db.transaction(function (tx) {
		tx.executeSql(inserttxt);
		consulta = "select max(ocorrencia_id) last_ocor_id from ocorrencia";
		tx.executeSql(consulta, [], function (tx, results) {
			var last_ocor_id = results.rows.item(0).last_ocor_id;
			localStorage.setItem('last_ocor_id',last_ocor_id);
			recuperaId ("agente","agente_id","nome", perito, function(perito_id) {
		     $.jStorage.set ("perito_id", perito_id);
		     alocaAgente(perito_id,last_ocor_id, vtr);
		    });
		    recuperaId ("agente","agente_id","nome", motorista, function(motorista_id) {
		     $.jStorage.set ("motorista_id", motorista_id);
		     alocaAgente(motorista_id,last_ocor_id, vtr);
		    });
		    if (necro != ""){
		    	recuperaId ("agente","agente_id","nome", necro, function(necro_id) {
			     	$.jStorage.set ("necro_id", necro_id);
			     	alocaAgente(necro_id,last_ocor_id, vtr);
		    	});
		    }
			if (pmnome != ""){
				recuperaId ("agente","agente_id","nome", pmnome, function(pmnome_id) {
			     $.jStorage.set ("pmnome_id", pmnome_id);
			     alocaAgente(pmnome_id,last_ocor_id, vtrpm);
			    });
		    }
		    if (bmnome != ""){
				recuperaId ("agente","agente_id","nome", bmnome, function(bmnome_id) {
			     $.jStorage.set ("bmnome_id", bmnome_id);
			     alocaAgente(bmnome_id,last_ocor_id, vtrbm);
			    });
		    }
			if (pcnome != ""){
				recuperaId ("agente","agente_id","nome", pcnome, function(pcnome_id) {
			     $.jStorage.set ("pcnome_id", pcnome_id);
			     alocaAgente(pcnome_id,last_ocor_id, vtrpc);
			    });
		    }
		    if (ounome != ""){
			    recuperaId ("agente","agente_id","nome", ounome, function(ounome_id) {
			     $.jStorage.set ("ounome_id", ounome_id);
			     alocaAgente(ounome_id,last_ocor_id, vtrou);
			    });
		    }
			insereLocal();
			insereFato();
			insereVitimas();
			insereVestigios();
		});
	});
	
	//Recuperando Ids da Equipe na tabela de Equipe
	
	
// Preenchimento da tabela de alocacao para equipes

}

function consultaIdVitima(callback){
		db.transaction(function (tx) {
		// Consultando o id da última vitima inserida
		consulta = "select max(vitima_id) last_vit_id from vitima";
		tx.executeSql(consulta, [], function (tx, results) {
	  		last_vit_id = results.rows.item(0).last_vit_id;
	  		callback (last_vit_id);
		});
	});
	
}

function Vitima(vitimaID){
	this.id = vitimaID;
	this.idDB = null;
	this.nome = $("#nome_vitima"+vitimaID).val();
	this.sexo = $("#sexo"+vitimaID).val();
	this.fase = $("#fase"+vitimaID).val();
	this.iml = $("#iml"+vitimaID).val();
	this.obs = $("#obsVitima"+vitimaID).val();
	this.paf = $("#existePaf"+vitimaID).val();
	this.npafs = $("#qtde_paf"+vitimaID).val();
}

function Paf (pafID,vitimaID, vitimaidDB){
	this.id = pafID;
	this.vitimaID = vitimaidDB;
	this.entrada = 	$("#paf_ent"+vitimaID+pafID).val();
	this.saida = $("#paf_saida"+vitimaID+pafID).val();
}

function DBVitimas(vitimas,ult_vitima,last_ocor_id){
	var inserttxt = "";
	var paf, j;
	j = ult_vitima + 1;	
	db.transaction(function (tx) {
		for (i=0;i<vitimas.length;i++){
			inserttxt = "INSERT INTO vitima (vitima_id, ocorrencia_id, nome, sexo, fase, iml, paf, observacao)  ";
			inserttxt = inserttxt + "values (" + vitimas[i].idDB + "," + last_ocor_id + ",\"" + vitimas[i].nome + "\", \"" + vitimas[i].sexo + "\",\"" + vitimas[i].fase + "\",\"" + vitimas[i].iml + "\",\"" + vitimas[i].paf + "\",\"" + vitimas[i].obs + "\" )";
			vitimas[i].idDB = j;
			j++;
			tx.executeSql(inserttxt);	
		}
	});
}

function DBPafs(pafs, last_ocor_id){
	var inserttxt = "";	
	var vitID=0;
	db.transaction(function (tx) {
		for (i=0;i<pafs.length;i++){
			vitID = pafs[i].vitimaID;
			vitDBID = 
			inserttxt = "INSERT INTO paf (vitima_id, ocorrencia_id, entrada, saida)  ";
			inserttxt = inserttxt + "values (" + vitID + "," + last_ocor_id + ",\"" + pafs[i].entrada + "\", \"" + pafs[i].saida + "\")";
			tx.executeSql(inserttxt);	
		}
	});
}

function insereVitimas(){
	// Precisamos saber inicialmente o numero de vitimas na ocorrencia.
	var nvits = $("#qtdeVitimas").val();
	var vitimas = [], pafs = [];
	var last_ocor_id = localStorage.getItem('last_ocor_id');
	var pftot=0,vitIDDB=0;
	var db = openDatabase('csidb', '1.0', 'my first database', 2 * 1024 * 1024);
	// Recuperando a ultima vitima inserida no BD
	consultaIdVitima(function callback(vitima_id){
		$.jStorage.deleteKey("last_vit_id");
		$.jStorage.set ("last_vit_id", vitima_id);
		vitIDDB = vitima_id + 1;
		for (i=0;i<nvits;i++){
			vitimas[i] = new Vitima(i);
			vitimas[i].idDB = vitIDDB;
			if (vitimas[i].paf == "sim") {
				npafs = vitimas[i].npafs;
				for (j=0;j<npafs;j++){
					pafs[pftot] = new Paf(j,i,vitIDDB);
					pftot++;
				}
			}
			vitIDDB++;
		}
		ult_vitima = $.jStorage.get("last_vit_id");
		DBVitimas(vitimas,ult_vitima,last_ocor_id);
		DBPafs(pafs, last_ocor_id);
	});
	
	// Passaremos a utilizar uma abordagem orientada a objetos para representação de todas as vítimas e funções intrinsecas...
	
		
}	



function consultaExames(callback){	
		var exame=[];
		db.transaction(function (tx) {
		var consulta = "select exame_id, nome from exames order by exame_id";
		tx.executeSql(consulta, [], function (tx, results) {
			var len = results.rows.length,i;
			for (i=0;i < len; i++) {
				exame[results.rows.item(i).exame_id] = results.rows.item(i).nome;
			}
	    	callback(exame);
		});
	});
	    
}

function Vestigios(vestigioID){
	this.id = vestigioID;
	this.tipo = $("#tipo"+vestigioID).val();
	this.local = $("#local"+vestigioID).val();
	this.exame = $("#exame"+vestigioID).val();
	this.exameId = null;
	this.coletado = $("#coletado"+vestigioID).val();
	
}

function DBVestigios(vestigios, last_ocor_id){
	var inserttxt = "";
	var coleta=0;	
	db.transaction(function (tx) {
		for (i=0;i<vestigios.length;i++){
			inserttxt = "INSERT INTO vestigio (ocorrencia_id, exame, tipo, quantidade, local, coleta)  ";
			inserttxt = inserttxt + "values (" + last_ocor_id + ",\"" + vestigios[i].exame + "\",\"" + vestigios[i].tipo + "\",1,\"" + vestigios[i].local + "\",\"" + vestigios[i].coletado + "\")";
			tx.executeSql(inserttxt);	
		}
	});
}

function insereVestigios(){
	var nvestg = $("#qtdeVestigio").val();
	var vestigios=[], exames=[];
	var last_ocor_id = localStorage.getItem('last_ocor_id');
	var db = openDatabase('csidb', '1.0', 'my first database', 2 * 1024 * 1024);
	//Inicialmente precisamos recuperar a tabela de consulta de exames
		for (i=0;i<nvestg;i++){
			vestigios[i] = new Vestigios(i);
		}
		DBVestigios (vestigios, last_ocor_id);
}

function Sitio(){
	this.destruicao = $("#destruicao").is(':checked') ? 1 : 0;
	this.escalada = $("#escalada").is(':checked') ? 1 : 0;
	this.desarranjo = $("#desarranjo").is(':checked') ? 1 : 0;
	this.arrombamento = $("#arrombamento").is(':checked') ? 1 : 0;
	this.negligencia = $("#negligencia").is(':checked') ? 1 : 0;
	this.impericia = $("#impericia").is(':checked') ? 1 : 0;
	this.imprudencia = $("#imprudencia").is(':checked') ? 1 : 0;
	this.curto = $("#curto").is(':checked') ? 1 : 0;
	this.raio = $("#raio").is(':checked') ? 1 : 0;
	this.combustao = $("#combustao").is(':checked') ? 1 : 0;
	this.obs = $("#obsFatoSite").val();
}

function FatoTransito(){
	this.sinistro = $("#sinistro").val();
	this.fatal = (($("#fatal").val()) == "sim") ? 1 : 0;
}

function Veiculo(veiculoID){
	this.id = veiculoID;
	this.tipo = $("#tipoveic"+veiculoID).val();
	this.marca = $("#marcaveic"+veiculoID).val();
	this.cor = $("#corveic"+veiculoID).val();
	this.placa = $("#placa"+veiculoID).val();
}

function Fato(){
	this.fato = $("#fatoReal").val();
	this.natureza = $("#naturezaReal").val();
	this.forma = $("#intencional").is(':checked') ? "intencional" : "acidental";
	this.fatal = $("#fatal").is(':checked') ? "nao" : "sim";
}

function DBFato(fato,site,fatotransito){
	var last_ocor_id = localStorage.getItem('last_ocor_id');
	var inserttxt = "";	
	var modus = "", tipo = "";
	modus += (site.escalada == 1) ? "escalada;" : "";
	modus += (site.destruicao == 1) ? "destruicao;" : "";
	modus += (site.desarranjo == 1) ? "desarranjo;" : "";
	modus += (site.arrombamento == 1) ? "arrombamento;" : "";
	if (modus.length > 0) {modus = modus.slice(0, modus.length-1);}
	tipo += (site.negligencia == 1) ? "negligencia;" : "";
	tipo += (site.impericia == 1) ? "impericia;" : "";
	tipo += (site.imprudencia == 1) ? "imprudencia;" : "";
	tipo += (site.curto == 1) ? "curto;" : "";
	tipo += (site.raio == 1) ? "raio;" : "";
	tipo += (site.combustao == 1) ? "combustao;" : "";
	if (tipo.length > 0) {tipo = tipo.slice(0, tipo.length-1);}
	db.transaction(function (tx) {
		inserttxt = "INSERT INTO fato (ocorrencia_id, fato, natureza, morte, modus, forma, tipo, sinistro, obs)  ";
			inserttxt = inserttxt + "values (" + last_ocor_id + ", \"" + fato.fato + "\", \"" + fato.natureza + "\", \"" + fato.fatal + "\" , \"" + modus + "\", \"" + fato.forma + "\", \"" + tipo + "\", \"" + fatotransito.sinistro + "\", \"" + site.obs + "\" )";
			tx.executeSql(inserttxt);
		
	});
	
}

function DBVeiculo(veiculo){
	var last_ocor_id = localStorage.getItem('last_ocor_id');

	db.transaction(function (tx) {
		for (i=0;i<veiculo.length;i++){
		inserttxt = "INSERT INTO veiculo (ocorrencia_id, veiculo_tipo, veiculo_marca, cor, placa)  ";
			inserttxt = inserttxt + "values (" + last_ocor_id + ", \"" + veiculo[i].tipo + "\", \"" + veiculo[i].marca + "\", \"" + veiculo[i].cor + "\" , \"" + veiculo[i].placa + "\" )";
			tx.executeSql(inserttxt);
		}
	});
}

function Site(tipo_local){
	this.tipoLocal = tipo_local;
	this.tipo = $("#tipo"+tipo_local).val();
	this.endereco = $("#endereco_site"+tipo_local).val();
	this.construcao = $("#construcao"+tipo_local).val();
	this.acabamento = $("#acabamento"+tipo_local).val();
	this.corInterna = $("#corinterna"+tipo_local).val();
	this.corExterna = $("#corexterna"+tipo_local).val();
	this.piso = $("#piso"+tipo_local).val();
	this.corPiso = $("#corpiso"+tipo_local).val();
	this.teto = $("#teto"+tipo_local).val();
	this.iluminacao = $("#iluminacao"+tipo_local).is(':checked') ? 1 : 0;
	this.visibilidade = $("#visibilidade"+tipo_local).is(':checked') ? 1 : 0;
	this.acesso = $("#acesso"+tipo_local).val();
	this.guarnicao = $("#guarnicao"+tipo_local).val();
}

function Transito(tipo_local,tipo_via){
	this.tipoLocal = tipo_local;
	this.trecho = tipo_via;
	this.endereco = $("#endereco_"+tipo_via+tipo_local).val();
	this.pavimento = $("#pavimento_"+tipo_via+tipo_local).val();
	this.condicao = $("#condicoes_"+tipo_via+tipo_local).val();
	this.perfil = $("#perfil_"+tipo_via+tipo_local).val();
	this.acostamento = $("#acostamento"+tipo_via+tipo_local).is(':checked') ? 1 : 0;
	this.meiofio = $("#meiofio"+tipo_via+tipo_local).is(':checked') ? 1 : 0;
	this.iluminacao = $("#iluminacao"+tipo_via+tipo_local).is(':checked') ? 1 : 0;
	this.tempo = $("#tempo"+tipo_via+tipo_local).val();
	this.visibilidade = $("#visibilidade"+tipo_via+tipo_local).val();
	this.sinalizacao = $("#sinalizacao"+tipo_via+tipo_local).val();
	this.pista = $("#pista"+tipo_via+tipo_local).val();
	this.sentido = $("#sentido"+tipo_via+tipo_local).val();
	this.talude = $("#talude"+tipo_via+tipo_local).val();
	this.largura = $("#largura"+tipo_via+tipo_local).val();
	this.conservacao = $("#conservacao"+tipo_via+tipo_local).val();
	this.periodo = $("#periodo"+tipo_via+tipo_local).val();
	this.circundante = $("#talude"+tipo_via+tipo_local).val();
}

function recuperaLocalId (callback)
{
	
	consulta = "select max(local_id) max_id from local";	
	db.transaction(function (tx) {
	tx.executeSql(consulta, [], function (tx, results) {
	  	var loca_id=0;
	  	loca_id = results.rows.item(0).max_id;
		callback (loca_id);
		});
	});
}

function DBSite(local_tipo, dados){
	var last_ocor_id = localStorage.getItem('last_ocor_id');
	db.transaction(
		function (tx) {
			inserttxt = "INSERT INTO local (ocorrencia_id, local_classe, endereco, local_tipo)  ";
			inserttxt = inserttxt + "values (" + last_ocor_id + ",\"" + local_tipo + "\",\"" + dados.endereco + "\",\"" + dados.tipo_dado + "\" )";
			tx.executeSql(inserttxt);
			insertsite = "INSERT INTO site (local_id, site_tipo, construcao, acabamento, cor_interna, cor_externa, piso, cor_piso, teto, acesso, guarnicao, iluminacao, visibilidade)  ";
			insertsite += "values ((select local_id from local where ocorrencia_id = " + last_ocor_id + " and local_classe = \"" + local_tipo + "\" and endereco = \"" + dados.endereco + "\" ";
			insertsite += "and local_tipo = \"" + dados.tipo_dado + "\"),";
			insertsite += " \"" + dados.tipo + "\",\"" + dados.construcao + "\",\"" + dados.acabamento + "\",\"" + dados.cor_interna + "\",\"" + dados.cor_externa + "\",\"" + dados.piso + "\",\"" + dados.cor_piso + "\",\"" + dados.teto + "\",\"" + dados.acesso + "\",\"" + dados.guarnicao + "\",\"" + dados.iluminacao_site + "\",\"" + dados.visibilidade_site + "\" )";
			tx.executeSql(insertsite);
			
		},
		function(tx) {
			// erro
			console.log("erro no db site: "+tx);
		}, 
		function(tx) {
			// sucesso

		}
	);
	
	
}

function DBRodovia(local_tipo, dados){
	var last_ocor_id = localStorage.getItem('last_ocor_id');
	db.transaction(function (tx) {
		inserttxt = "INSERT INTO local (ocorrencia_id, local_classe, endereco, local_tipo)  ";
		inserttxt = inserttxt + "values (" + last_ocor_id + ",\"" + local_tipo + "\",\"" + dados.endereco_rodovia + "\",\" " + dados.tipo_dado + "\" )";
		tx.executeSql(inserttxt);	
	});
	
	recuperaLocalId (function (local_id){
		db.transaction(function (tx) {
			inserttxt = "INSERT INTO transito (local_id, pavimento, acostamento, condicao_pista, perfil_pista, condicao_tempo, meio_fio, visibilidade, iluminacao, pista, sentido, largura_pista, tracado, area_circundante, conservacao, sinalizacao, periodo)  ";
			inserttxt = inserttxt + "values (" + local_id + ",\"" + dados.pavimento_rodovia + "\",\"" + dados.acostamento_rodovia + "\",\"" + dados.condicoes_rodovia + "\",\"" + dados.perfil_rodovia + "\",\"" + dados.tempo_rodovia + "\",\"" + dados.meiofio_rodovia + "\",\"" + dados.visibilidade_rodovia + "\",\"" + dados.iluminacao_rodovia + "\",\"" + dados.pista_rodovia + "\",\"" + dados.sentido_rodovia + "\",\"" + dados.largura_rodovia + "\",\"" + dados.talude_rodovia + "\",\"" + dados.areacircundante_rodovia + "\",\"" + dados.conservacao_rodovia + "\",\"" + dados.sinalizacao_rodovia + "\",\"" + dados.periodo_rodovia + "\" )";
			tx.executeSql(inserttxt);
		});		
	});
	
}

function DBVia(local_tipo, dados){
	var last_ocor_id = localStorage.getItem('last_ocor_id');
	db.transaction(function (tx) {
		inserttxt = "INSERT INTO local (ocorrencia_id, local_classe, endereco, local_tipo)  ";
		inserttxt = inserttxt + "values (" + last_ocor_id + ",\"" + local_tipo + "\",\"" + dados.endereco_via + "\",\" " + dados.tipo_dado + "\" )";
		tx.executeSql(inserttxt);	
	});
	
	recuperaLocalId (function (local_id){
		db.transaction(function (tx) {
			inserttxt = "INSERT INTO transito (local_id, pavimento, acostamento, condicao_pista, perfil_pista, condicao_tempo, meio_fio, visibilidade, iluminacao, pista, sentido, largura_pista, tracado, area_circundante, conservacao, sinalizacao, periodo)  ";
			inserttxt = inserttxt + "values (" + local_id + ",\"" + dados.pavimento_via + "\",\"" + dados.acostamento_via + "\",\"" + dados.condicoes_via + "\",\"" + dados.perfil_via + "\",\"" + dados.tempo_via + "\",\"" + dados.meiofio_via + "\",\"" + dados.visibilidade_via + "\",\"" + dados.iluminacao_via + "\",\"" + dados.pista_via + "\",\"" + dados.sentido_via + "\",\"" + dados.largura_via + "\",\"" + dados.talude_via + "\",\"" + dados.areacircundante_via + "\",\"" + dados.conservacao_via + "\",\"" + dados.sinalizacao_via + "\",\"" + dados.periodo_via + "\" )";
			tx.executeSql(inserttxt);
		});		
	});
	
}

function insereImediato(dataStr){
	var dados = JSON.parse(dataStr);
	var local_tipo = "imediato";
	if (dados.tipo_dado == "site") {DBSite(local_tipo, dados)};
	if (dados.tipo_dado == "rodovia") {DBRodovia(local_tipo, dados)};
	if (dados.tipo_dado == "via publica") {DBVia(local_tipo, dados)};
}

function insereMediato(dataStr){
	var dados = JSON.parse(dataStr);
	var local_tipo = "mediato";
	if (dados.tipo_dado == "site") {DBSite(local_tipo, dados)};
	if (dados.tipo_dado == "rodovia") {DBRodovia(local_tipo, dados)};
	if (dados.tipo_dado == "via publica") {DBVia(local_tipo, dados)};
}

function insereRelacionado(dataStr){
	var dados = JSON.parse(dataStr);
	var local_tipo = "relacionado";
	if (dados.tipo_dado == "site") {DBSite(local_tipo, dados)};
	if (dados.tipo_dado == "rodovia") {DBRodovia(local_tipo, dados)};
	if (dados.tipo_dado == "via publica") {DBVia(local_tipo, dados)};
}

function insereLocal(){
	conservaData(localStorage.selectedTabLocal);
	dataStr = localStorage.getItem('data_imediato');
	if (dataStr != "") {insereImediato(dataStr);}
	dataStr = localStorage.getItem('data_mediato');
	if (dataStr != "") {insereMediato(dataStr);}
	dataStr = localStorage.getItem('data_relacionado');
	if (dataStr != "") {insereRelacionado(dataStr);}
    doGarbage("forms");
    sessionStorage.writeSemaphore = 0;
}

function insereFato(){
	var ncars = $("#qtdeveiculos").val();
	var veiculos=[];
	sitio = new Sitio();
	fatotransito = new FatoTransito();
	transito = new Transito();
	fato = new Fato();
	for (i=0;i<ncars;i++){
		veiculos[i] = new Veiculo(i);
	}
	DBFato(fato,sitio,fatotransito);
	DBVeiculo(veiculos);
}
	
function encerrarPE()
{
	var last_com_id = sessionStorage.id_comunicacao;
	var data_inicio = $(".data_inicio").val();
	var hora_inicio = $(".hora_inicio").val();
	var data_ocorrencia_ini = data_inicio + " " + hora_inicio;
	// Implementando rotina para insercao da data e hora do final da ocorrencia
	var data_ocorrencia_fim = "";
	
	var hora_fim = $(".hora_fim").val();
	var data_fim = $(".data_fim").val();
	data_ocorrencia_fim = data_fim + " " + hora_fim;
	if ((!data_fim) || (!hora_fim)) 
	{
		var now = new Date();
		var day = ("0" + now.getDate()).slice(-2);
		var month = ("0" + (now.getMonth() + 1)).slice(-2);
		var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
		$(".data_fim").val (today);
		var hours = ("0" + now.getHours()).slice(-2);
		var minutes = ("0" + now.getMinutes()).slice(-2);
		var seconds= ("0" + now.getSeconds()).slice(-2);
		var hour = (hours)+":"+(minutes)+":"+(seconds);
		$(".hora_fim").val (hour);
		data_ocorrencia_fim = today + " " + hour;
	}
	// Cria um semaforo para escrita
	sessionStorage.writeSemaphore = 1;
	sessionStorage.atividadeSemaphore = 0;
	if (validaFormOcorrencia()) {
		//Criando novo registro na tabela de Ocorrencias para acomodar a nova ocorrencia
		insereEquipe(last_com_id, data_ocorrencia_ini, data_ocorrencia_fim);	
		
		// Restaura o cabeçalho da página de ocorrencias
		
		$(".topo").removeClass('ui-disabled');
		$(".btnEncerrar").addClass('ui-disabled');
	}
	
	
	
}

function carregaCadastro(){
	limpaFormularios();
	$(".topo").removeClass('ui-disabled');
	$(".btnEncerrar").removeClass('ui-disabled');
	$(".btnIniciar").removeClass('ui-disabled');
	$(".btnAlterar").addClass('ui-disabled');
	$(".btnDeletar").addClass('ui-disabled');
	$(".btnEncerrar").addClass('ui-disabled');
	}

function setaFlagConsulta(){
	sessionStorage.tipoConsulta = "comunicacao";
	}
	
function consultaOcorrencia(){
	limpaFormularios();
	sessionStorage.tipoConsulta = "ocorrencia";
}

function limpaFormularios() {

	$('#formEquipe1')[0].reset();
	$('#formEquipe2')[0].reset();
	$('#formFato')[0].reset();
	$('#formVitima')[0].reset();
	$('#formVestigios')[0].reset();
	localStorage.iniciado = 0;
	// remove vitimas
	$("#painelVitimas").children().remove()
	
	// remove vestigios
	$("#painelVestigios").children().remove();
	limpaForms();
	// limpa formularios da aba Local
	
	
	// Limpa outros formulários
	// TODO Limpar formularios
	//$('#nomeForm')[0].reset();
	

}

function recuperaOcorrenciafromComunicacao(pe_val, callback){
	var ocor_val = 0;
	var data_ocorrencia_ini = "", data_ocorrencia_fim = "";
	//Recuperando a ocorrencia correspondente ao chamado
	consulta = "select ocorrencia_id, data_ocorrencia_ini, data_ocorrencia_fim from ocorrencia where pe in (select pe from comunicacao where pe=" + pe_val + ")";
	db.transaction(function (tx) {	
		tx.executeSql(consulta, [], function (tx, results) {
	  		ocor_val = results.rows.item(0).ocorrencia_id;
	  		data_ocorrencia_ini = results.rows.item(0).data_ocorrencia_ini;
	  		data_ocorrencia_fim = results.rows.item(0).data_ocorrencia_fim;
	  		callback (ocor_val, data_ocorrencia_ini, data_ocorrencia_fim);
		});
	});
}

function carregaDBFormEquipe(ocor_val, callback){
	consulta = "select agente.nome nome, agente.cargo_id cargo, alocacao.vtr vtr from agente inner join alocacao on alocacao.agente_id = agente.agente_id where ocorrencia_id = " + ocor_val;
	db.transaction(function (tx) {	
		tx.executeSql(consulta, [], function (tx, results) {
	  		var len = results.rows.length,i;
			var cargo = "";
			for (i=0;i < len; i++) {
				cargo = results.rows.item(i).cargo;
				switch (cargo) {
					case "Perito Criminal":
					{
						$("#peritocomp").val(results.rows.item(i).nome);
						$("#VTR").val(results.rows.item(i).vtr);
						break;
					}
					case "Motorista":
					{
						$("#motoristacomp").val(results.rows.item(i).nome);
						break;
					}
					case "Auxiliar de Necropsia":
					{
						$("#necro").val(results.rows.item(i).nome);
						break;
					}
					case "PM":
					{
						$("#pmnome").val(results.rows.item(i).nome);
						$("#vtrpm").val(results.rows.item(i).vtr);
						break;
					}
					case "BM":
					{
						$("#bmnome").val(results.rows.item(i).nome);
						$("#vtrbm").val(results.rows.item(i).vtr);
						break;
					}
					case "PC":
					{
						$("#pcnome").val(results.rows.item(i).nome);
						$("#vtrpc").val(results.rows.item(i).vtr);
						break;
					}
					case "Outros":
					{
						$("#ounome").val(results.rows.item(i).nome);
						$("#vtrou").val(results.rows.item(i).vtr);
						break;
					}
				}
				
			}
			callback(ocor_val);
		});
		
	});
	
}

function carregaDBFormFato (ocor_val,callback){
	
	consulta = "select fato.fato, fato.natureza, fato.modus, fato.forma, fato.tipo, fato.obs, fato.sinistro, fato.morte from fato where ocorrencia_id = " + ocor_val;
	db.transaction(function (tx) {	
		tx.executeSql(consulta, [], function (tx, results) {
			$("#fatoReal").val(results.rows.item(0).fato);
			$("#naturezaReal").val(results.rows.item(0).natureza);
			$("#fatoReal").val(results.rows.item(0).fato);
			var forma = results.rows.item(0).forma;
			var modus = results.rows.item(0).modus;
			var modusArray = modus.split(';');
			for (i=0;i<modusArray.length;i++)
			{ 
				switch (modusArray[i]) {
						case "escalada":
						{
							$( "#escalada" ).prop( "checked", true );
							break;
						}
						case "destruicao":
						{
							$( "#destruicao" ).prop( "checked", true );
							break;
						}
						case "desarranjo":
						{
							$( "#desarranjo" ).prop( "checked", true );
							break;
						}
						case "arrombamento":
						{
							$( "#arrombamento" ).prop( "checked", true );
							break;
						}
						
					}
			}
			
			var sinistro = results.rows.item(0).sinistro;
			$( "#sinistro" ).val(sinistro);
				
			var fatal = results.rows.item(0).morte;
			$( "#fatal" ).val(fatal);
			
			var tipo = results.rows.item(0).tipo;
			var tipoArray = tipo.split(';');
			for (i=0;i<tipoArray.length;i++)
			{ 
				switch (tipoArray[i]) {
						case "negligencia":
						{
							$( "#negligencia" ).prop( "checked", true );
							break;
						}
						case "impericia":
						{
							$( "#impericia" ).prop( "checked", true );
							break;
						}
						case "imprudencia":
						{
							$( "#imprudencia" ).prop( "checked", true );
							break;
						}
						case "curto":
						{
							$( "#curto" ).prop( "checked", true );
							break;
						}
						case "raio":
						{
							$( "#raio" ).prop( "checked", true );
							break;
						}
						case "combustao":
						{
							$( "#combustao" ).prop( "checked", true );
							break;
						}
						
					}
			}
			
			if (forma == "intencional") {
				$( "#intencional" ).prop( "checked", true );
			} else {
				$( "#acidental" ).prop( "checked", true );
			}
			$("#obsFatoSite").val(results.rows.item(0).obs);
		});
		
		  consulta2 = "select veiculo_tipo tipo, veiculo_marca marca, cor, placa from veiculo where ocorrencia_id = " + ocor_val;
		  
		  tx.executeSql(consulta2, [], function (tx, results) {
		  	var len = results.rows.length,i;
			$( "#qtdeveiculos" ).val(len);
			
			if (len > 0){
				incluiVeiculo();
				for (i=0;i < len; i++) {
					var tipoveic = results.rows.item(i).tipo;
					var marcaveic = results.rows.item(i).marca;
					var corveic = results.rows.item(i).cor;
					var placa = results.rows.item(i).placa;
					$( "#tipoveic"+i ).val(tipoveic).selectmenu('refresh');;
					$( "#marcaveic"+i ).val(marcaveic);
					$( "#corveic"+i ).val(corveic).selectmenu('refresh');
					$( "#placa"+i ).val(placa);
					
				}
			}
			callback(ocor_val);
		  });
		callback(ocor_val);  
	});

}

function carregaDBFormVitima (ocor_val, callback){
	var consulta, vitstr = "", pafstr = "";
	var vitimas = [], pafs = [];
	
	consulta = "select vitima_id, nome, sexo, fase, iml, paf, observacao from vitima where ocorrencia_id = " + ocor_val;
	db.transaction(function (tx) {
		tx.executeSql(consulta, [], function (tx, results) {
			  	var len = results.rows.length,i;
				for (i=0;i < len; i++) {
					var vitima_id = results.rows.item(i).vitima_id;
					var nome = results.rows.item(i).nome;
					var sexo = results.rows.item(i).sexo;
					var fase = results.rows.item(i).fase;
					var iml = results.rows.item(i).iml;
					var paf = results.rows.item(i).paf;
					var obs = results.rows.item(i).observacao;
					var vitobj = new Object();
					vitobj.id = vitima_id;
					vitobj.nome = nome;
					vitobj.sexo = sexo;
					vitobj.fase = fase;
					vitobj.iml = iml;
					vitobj.paf = paf;
					vitobj.obs = obs;
					vitimas.push (vitobj);	
				}			
				    vitstr = JSON.stringify(vitimas);
				    sessionStorage.vitimas = vitstr;    
		});
		consulta = "select vitima_id, entrada, saida from paf where ocorrencia_id = " + ocor_val;
		tx.executeSql(consulta, [], function (tx, results) {
			  	var len = results.rows.length,i;
			  	for (i=0;i < len; i++) {
					var vitima_id = results.rows.item(i).vitima_id;
					var entrada = results.rows.item(i).entrada;
					var saida = results.rows.item(i).saida;
					var pafobj = new Object();
					pafobj.vitima_id = vitima_id;
					pafobj.entrada = entrada;
					pafobj.saida = saida;
					pafs.push (pafobj);
				}
					pafstr = JSON.stringify(pafs);
					sessionStorage.pafs = pafstr;
					callback(ocor_val);
		});
	});
}

function carregaFormEquipe(pe_val,ocor_val){
		$("#peritocomp").val ("Carregando dados..."+pe_val+" "+ocor_val);
		carregaDBFormEquipe(ocor_val, function(ocor_val) {
		   loadLocalData(ocor_val);
		});
}

function loadLocalData(ocor_val){
	loadLocalDataFromDB(ocor_val, function(ocor_val){
		carregaFormFato(ocor_val);
	});
}


function carregaFormFato (ocor_val){
	carregaDBFormFato (ocor_val, function(ocor_val){
		carregaFormVitima(ocor_val);
	});
}

// Não podemos mostrar a vitima antes da conclusão da carga do popIML

function carregaIML(nvits, callback){
	var vhtmlins = [];
	populaSelIML(function(vIML){
		for (i = 0; i < nvits; i++){
			var htmlIns2 = "<option value=\"Não encaminhado\">Não disponível</option>";
			for (k=0;k<vIML.length;k++){
				htmlIns2 += "<option value='"+vIML[k]+"'>"+vIML[k]+"</option>";
			}
			vhtmlins.push(htmlIns2);
		}
		callback(vhtmlins);
	});
}

function displayFormVitima (){
	// Nesse ponto, podemos realizar a carga e html da parte do IML e depois de pronto, podemos popular
	var vitimas_str,pafs_str = "";
	var vitimas,pafs, pafsatual = [];
	var qtdeVitimas = 0;
	vitimas_str = sessionStorage.vitimas;
	pafs_str = sessionStorage.pafs;
	vitimas = JSON.parse(vitimas_str);
	pafs = JSON.parse(pafs_str);
	qtdeVitimas = vitimas.length;
	carregaIML(qtdeVitimas, function(vhtmlins){
		var vitimas_str,pafs_str = "";
		var vitimas,pafs, pafsatual = [];
		var qtdeVitimas = 0;
		vitimas_str = sessionStorage.vitimas;
		pafs_str = sessionStorage.pafs;
		vitimas = JSON.parse(vitimas_str);
		pafs = JSON.parse(pafs_str);
		qtdeVitimas = vitimas.length;
		$( "#qtdeVitimas" ).val(qtdeVitimas);
		incluirVitima();
		for (i=0;i<vitimas.length;i++){
			$( "#nome_vitima"+i ).val(vitimas[i].nome);
			$( "#obsVitima"+i ).val(vitimas[i].obs);
			$( "#sexo"+i ).val(vitimas[i].sexo);
			$( "#sexo"+i ).flipswitch( "refresh" );
			$( "#fase"+i ).val(vitimas[i].fase).selectmenu('refresh');
			$("#iml"+i).html(vhtmlins[i]);
			$("#iml"+i).trigger('create');
			$( "#iml"+i ).val(vitimas[i].iml).selectmenu('refresh');
			$( "#existePaf"+i ).val(vitimas[i].paf);
			$( "#existePaf"+i ).flipswitch( "refresh" );
			if (vitimas[i].paf == "sim"){
				pafsqtdeatual = 0;
				pafsatual = [];
				for (j=0;j<pafs.length;j++){
					if (pafs[j].vitima_id == vitimas[i].id){
						pafsqtdeatual++;
						pafsatual.push(pafs[j]);
					}
				}
			    $( "#qtde_paf"+i ).val(pafsqtdeatual); 
			    incluiPaf(i);
			    for (k=0;k<pafsatual.length;k++){
			    	$("#paf_ent"+i+k).val(pafsatual[k].entrada);
			    	$("#paf_saida"+i+k).val(pafsatual[k].saida);
			    }
			    
			}
		}
	});
	
}

function carregaDBFormEvidencia (ocor_val, callback){
	var consulta, evidstr = "";
	var evidencias = [];
	//sessionStorage.removeItem("vitimas");
	//sessionStorage.removeItem("pafs");
	consulta = "select tipo, local, exame, coleta from vestigio where ocorrencia_id = " + ocor_val;
	db.transaction(function (tx) {
		tx.executeSql(consulta, [], function (tx, results) {
			  	var len = results.rows.length,i;
				for (i=0;i < len; i++) {
					var tipo = results.rows.item(i).tipo;
					var local = results.rows.item(i).local;
					var exame = results.rows.item(i).exame;
					var coleta = results.rows.item(i).coleta;
					var evidobj = new Object();
					evidobj.tipo = tipo;
					evidobj.local = local;
					evidobj.exame = exame;
					evidobj.coleta = coleta;
					evidencias.push (evidobj);	
				}			
				    evidstr = JSON.stringify(evidencias);
				    sessionStorage.evidencias = evidstr;
				    callback(ocor_val);
		});
	});
}

function displayFormEvidencia(){
	var evidencia_str = "";
	var evidencias = [];
	var qtdeEvidencias = 0;
	evidencia_str = sessionStorage.evidencias;
	evidencias = JSON.parse(evidencia_str);
	qtdeEvidencias = evidencias.length;
	$( "#qtdeVestigio" ).val(qtdeEvidencias);
	incluiVestigio();
	for (i=0;i<evidencias.length;i++){
		$( "#tipo"+i ).val(evidencias[i].tipo).selectmenu('refresh');
		$( "#local"+i ).val(evidencias[i].local);
		$( "#exame"+i ).val(evidencias[i].exame).selectmenu('refresh');
		$( "#coletado"+i ).val(evidencias[i].coleta);
		$( "#coletado"+i ).flipswitch( "refresh" );
	}
	sessionStorage.removeItem("evidencias");
}


function carregaFormEvidencia (ocor_val){
	carregaDBFormEvidencia (ocor_val, function(ocor_val){
		displayFormEvidencia();
	});
}

function carregaFormVitima (ocor_val){
	carregaDBFormVitima (ocor_val, function(ocor_val){
		displayFormVitima();
		carregaFormEvidencia(ocor_val);
	});
}

function carregaFormOcorrencia(pe_val){
	var ocorr_val = 0;
	var data_hora_ini = [], data_hora_fim = [];
	recuperaOcorrenciafromComunicacao(pe_val, function(ocor_val,data_ocorrencia_ini, data_ocorrencia_fim){
	// xxxxxx Proximo passo é chamar as funcoes de carga para cada formulario aqui e escrever cada funcao xxxxx
		carregaFormEquipe(pe_val,ocor_val);
		data_hora_ini = data_ocorrencia_ini.split(" ");
		data_hora_fim = data_ocorrencia_fim.split(" ");
		$(".data_inicio").val (data_hora_ini[0]);
		$(".hora_inicio").val (data_hora_ini[1]);
		$(".data_fim").val (data_hora_fim[0]);
		$(".hora_fim").val (data_hora_fim[1]);
		$(".btnAlterar").removeClass('ui-disabled');
		$(".btnDeletar").removeClass('ui-disabled');
		$(".btnEncerrar").addClass('ui-disabled');
		$(".btnIniciar").addClass('ui-disabled');
	});
	
	
}

function deletarPE(){
	sessionStorage.writeSemaphore = 1;
	var id_com = sessionStorage.id_comunicacao;
	var pe_val = $(".pe_val").val();
	var pess = "" + pe_val;
	pess = pess.substring(0,4) + pess.substring(5,pess.length);
	pe_val = pess;
	doGarbage("forms");
	recuperaOcorrenciafromComunicacao(pe_val, function(ocor_val, data_ocorrencia_ini, data_ocorrencia_fim){
			deleteDB ("site",ocor_val,function(ocor_val){
				//console.log ("Volta do site");
				deleteDB ("transito",ocor_val,function(ocor_val){
				//console.log ("Volta do transito");
					deleteDB ("vestigio",ocor_val,function(ocor_val){
					//console.log ("Volta do vestigio");
						deleteDB ("veiculo",ocor_val,function(ocor_val){
						//console.log ("Volta do veiculo");
							deleteDB ("fato",ocor_val,function(ocor_val){
							//console.log ("Volta do fato");
								deleteDB ("local",ocor_val,function(ocor_val){
								//console.log ("Volta do fato");
									deleteDB ("ocorrencia",ocor_val,function(ocor_val){
									//console.log ("Volta do ocorrencia");
										deleteDB ("alocacao",ocor_val,function(ocor_val){
										//console.log ("Volta do alocacao");
											deleteDB ("vitima",ocor_val,function(ocor_val){
											//console.log ("Volta do alocacao");
												deleteDB ("paf",ocor_val,function(ocor_val){
												//console.log ("Volta do vitima");
												});
											});
										});
									});
								});
							});
						});
					});
				});
			});
	});
}


function alterarPE(){
	//Inicialmente vamos trabalhar com as tabelas que exigem subconsulta, ou seja, site e transito
	sessionStorage.writeSemaphore = 1;
	var id_com = sessionStorage.id_comunicacao;
	var pe_val = $(".pe_val").val();
	var pess = "" + pe_val;
	pess = pess.substring(0,4) + pess.substring(5,pess.length);
	pe_val = pess;
	var delArray = ["vitima","vestigio","veiculo","paf","fato","alocacao","local","ocorrencia"];
	var consulta="";
	$( "#testa_click_cad_local" ).click();
	recuperaOcorrenciafromComunicacao(pe_val, function(ocor_val, data_ocorrencia_ini, data_ocorrencia_fim){
		
		loadLocaisDB (ocor_val, function (ocor_val){
			var local_str = "";
			var locals = [];
			var numlocals = 0;
			local_str = sessionStorage.local;
			locals = JSON.parse(local_str);
			numlocals = locals.length;
			
			for (j=0;j<numlocals;j++){
				var tabela = "";
				var tipo = locals[j].tipo;
				var id = locals[j].id;
				if ((tipo == "rodovia") || (tipo == "via publica")) {tabela = "transito";} else {tabela = "site";}
				delArray.push(tipo);
			 
			}
			
			deleteDB ("site",ocor_val,function(ocor_val){
				//console.log ("Volta do site");
				deleteDB ("transito",ocor_val,function(ocor_val){
				//console.log ("Volta do transito");
					deleteDB ("vestigio",ocor_val,function(ocor_val){
					//console.log ("Volta do vestigio");
						deleteDB ("veiculo",ocor_val,function(ocor_val){
						//console.log ("Volta do veiculo");
							deleteDB ("fato",ocor_val,function(ocor_val){
							//console.log ("Volta do fato");
								deleteDB ("local",ocor_val,function(ocor_val){
								//console.log ("Volta do fato");
									deleteDB ("ocorrencia",ocor_val,function(ocor_val){
									//console.log ("Volta do ocorrencia");
										deleteDB ("alocacao",ocor_val,function(ocor_val){
										//console.log ("Volta do alocacao");
											deleteDB ("vitima",ocor_val,function(ocor_val){
											//console.log ("Volta do alocacao");
												deleteDB ("paf",ocor_val,function(ocor_val){
												//console.log ("Volta do vitima");
													encerrarPE();
												});
											});
										});
									});
								});
							});
						});
					});
				});
			});
		});	
	});
	
}

function deleteDB(tabela,ocor_val, callback){
	db.transaction(function (tx) {
				var consulta="";	
				if ((tabela == "site") || (tabela == "transito")){
					consulta = "delete from "+tabela+" where local_id in (select local_id from local where ocorrencia_id = "+ocor_val+")";
					tx.executeSql(consulta);
				}
				else{
					consulta = "delete from "+tabela+" where ocorrencia_id = "+ocor_val;
					tx.executeSql(consulta);
				}
		callback(ocor_val);
	});	
			
}

function validaFormOcorrencia() {
	
	// jogar aba atual na memória
	conservaData(localStorage.selectedTabLocal);
	
	return true;
	
	// Validando os dados do formulários de Equipes
	
	if (($("#perito").val() == null) || ($("#perito").val() == "")){
		alert("Favor preencher o nome do Perito Criminal");
		return false;
	}
	if (($("#motorista").val() == null) || ($("#motorista").val() == "")){
		alert("Favor preencher o nome do motorista");
		return false;
	}
	if (($("#VTR").val() == null) || ($("#VTR").val() == "")){
		alert("Favor preencher a identificacao da VTR");
		return false;
	}
	if (($("#necro").val() == null) || ($("#necro").val() == "")){
		alert("Favor preencher o nome do Aux.Autopsia");
		return false;
	}
	
	// Validando formulário referete ao FATO
	
	if (($("#fatoReal").val() == null) || ($("#fatoReal").val() == "")){
		alert("Favor preencher o campo FATO");
		return false;
	}
	
	if (($("#naturezaReal").val() == null) || ($("#naturezaReal").val() == "")){
		alert("Favor preencher o campo NATUREZA");
		return false;
	}
	
	
	
	// validar tudo em memória
	var data_imediato = localStorage.getItem('data_imediato');
	var data_mediato = localStorage.getItem('data_mediato');
	var data_relacionado = localStorage.getItem('data_relacionado');
	
	//////////////////////////////// ABA IMEDIATO //////////////////////////////// 
	if (data_imediato==null || data_imediato=="") {
		alert("Favor preencher a aba Imediato");
		return false;
	} else {
		// se preencheu, valida os campos
		var imediato = JSON.parse(data_imediato);
		
		// campo endereço do site na aba imediato
		if (imediato.endereco==null || imediato.endereco=="") {
			alert("Endereço na aba imediato deve ser preenchido.");
			return false;
		}
	}
	
	//////////////////////////////// ABA MEDIATO //////////////////////////////// 
	if (data_mediato==null || data_mediato=="") {
		alert("Favor preencher a aba Mediato");
		return false;
	} else {
		// se preencheu, valida os campos
		var mediato = JSON.parse(data_mediato);
	}
	
	//////////////////////////////// ABA RELACIONADO //////////////////////////////// 
	if (data_relacionado==null || data_relacionado=="") {
		alert("Favor preencher a aba Relacionado");
		return false;
	} else {
		// se preencheu, valida os campos
		var relacionado = JSON.parse(data_relacionado);
	}
	
	//////////////////////////////// FORMULÁRIO VALIDADO //////////////////////////////// 
	return true;
}

