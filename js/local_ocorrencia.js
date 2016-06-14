/**
 * Oculta todos os blocos de formulários
 */
function hide_blocks() {
	$("#cad_ocor_local_construcao").hide();
	$("#cad_ocor_local_rodovia").hide();
	$("#cad_ocor_local_rua").hide();
}

/**
 * Mostra o formulário correspondente ao tipo selecionado
 */
function show_block(tipo) {
	if (tipo==localStorage.TIPO_CONSTRUCAO) {
		$("#cad_ocor_local_construcao").show();
	} else if (tipo==localStorage.TIPO_RODOVIA) {
		$("#cad_ocor_local_rodovia").show();
	} else if (tipo==localStorage.TIPO_VIA_PUBLICA) {
		$("#cad_ocor_local_rua").show();
	}
}

/**
 * Limpa todos os fomulários 
 */
function limpaForms() {
	limpaFormConstrucao();
	limpaFormRodovia();
	limpaFormViaPublica();
}

/**
 * Limpa o formulário de Construção
 */
function limpaFormConstrucao() {
	$('#formConstrucao')[0].reset();
}

/**
 * Limpa o formulário de Rodovia
 */
function limpaFormRodovia() {
	$('#formRodovia')[0].reset();
}

/**
 * Limpa o formulário de Via Pública
 */
function limpaFormViaPublica() {
	$('#formViaPublica')[0].reset();
}

/**
 * Carrega os dados da aba fornecida 
 */
function loadData(aba) { // ok
	var tipo = 0;
	if (aba == localStorage.TAB_IMEDIATO) {
		tipo = localStorage.tipo_imediato;
	} else if (aba == localStorage.TAB_MEDIATO) { 
		tipo = localStorage.tipo_mediato;
	} else if (aba == localStorage.TAB_RELACIONADO) { 
		tipo = localStorage.tipo_relacionado;
	}
	
	if (tipo==localStorage.TIPO_CONSTRUCAO) {
		loadFormConstrucao(aba);
	} else if (tipo==localStorage.TIPO_RODOVIA) {
		loadFormRodovia(aba);
	} else if (tipo==localStorage.TIPO_VIA_PUBLICA) {
		loadFormViaPublica(aba);
	}
}

/**
 * Carrega os dados da aba fornecida no formulário de Construção
 */
function loadFormConstrucao(aba) {
	var dataStr = getData(aba);
	var dados = JSON.parse(dataStr);
	var tetostr = "";
	$("#endereco_site").val(dados.endereco);
	$("#tipo_site").val(dados.tipo);
	$("#construcao").val(dados.construcao);
	$("#acabamento").val(dados.acabamento);
	$("#corinterna").val(dados.cor_interna);
	$("#corexterna").val(dados.cor_externa);
	$("#piso").val(dados.piso);
	$("#corpiso").val(dados.cor_piso);
	$("#teto").html("<option value='telplan'>telhas plan</option><option value='gesso'>gesso</option><option value='forro'>forro</option><option value='amianto'>telhas amianto</option><option value='metal'>metal</option><option value='laje'>laje</option><option value='PVC'>PVC</option><option value='sem cobertura'>sem cobertura</option>");
	tetostr = dados.teto;
	var vteto = tetostr.split(",");
	for (i=0;i<vteto.length;i++){
		$("#teto option[value='" + vteto[i] + "']").attr("selected", "selected");
	}
	$("#iluminacao_site").val(dados.iluminacao_site);
	$("#visibilidade_site").val(dados.visibilidade_site);
	$("#acesso").val(dados.acesso);
	$("#guarnicao").val(dados.guarnicao);
	
}

/**
 * Carrega os dados da aba fornecida no formulário de Rodovia
 */
function loadFormRodovia(aba) {
	var dataStr = getData(aba);
	var dados = JSON.parse(dataStr);
	var condpistastr = "";
	$("#endereco_rodovia").val(dados.endereco_rodovia);
	$("#pavimento_rodovia").val(dados.pavimento_rodovia);
	$("#condicoes_rodovia").html("<option value='seca'>seca</option><option value='molhada'>molhada</option><option value='enlameada'>enlameada</option><option value='oleosa'>oleosa</option><option value='esburacada'>esburacada</option>");
	condpistastr = dados.condicoes_rodovia;
	var vcondpista = condpistastr.split(",");
	for (i=0;i<vcondpista.length;i++){
		$("#condicoes_rodovia option[value='" + vcondpista[i] + "']").attr("selected", "selected");
	}
	$("#perfil_rodovia").val(dados.perfil_rodovia);
	$("#acostamento_rodovia").val(dados.acostamento_rodovia);
	$("#meiofio_rodovia").val(dados.meiofio_rodovia);
	$("#iluminacao_rodovia").val(dados.iluminacao_rodovia);
	$("#tempo_rodovia").val(dados.tempo_rodovia);
	$("#visibilidade_rodovia").val(dados.visibilidade_rodovia);
	$("#sinalizacao_rodovia").html("<option value='horizontal'>horizontal</option><option value='vertical'>vertical</option>");
	condpistastr="";
	condpistastr = dados.sinalizacao_rodovia;
	vcondpista = condpistastr.split(",");
	for (i=0;i<vcondpista.length;i++){
		$("#sinalizacao_rodovia option[value='" + vcondpista[i] + "']").attr("selected", "selected");
	}				    
	$("#pista_rodovia").val(dados.pista_rodovia);
	$("#sentido_rodovia").val(dados.sentido_rodovia);
	$("#talude_rodovia").val(dados.talude_rodovia);
	$("#largura_rodovia").val(dados.largura_rodovia);
	$("#conservacao_rodovia").val(dados.conservacao_rodovia);
	$("#periodo_rodovia").val(dados.periodo_rodovia);
	$("#areacircundante_rodovia").val(dados.areacircundante_rodovia);
}

/**
 * Carrega os dados da aba fornecida no formulário de Via Pública
 */
function loadFormViaPublica(aba) {
	var dataStr = getData(aba);
	var dados = JSON.parse(dataStr);
	var condpistastr = "";
	
	$("#endereco_via").val(dados.endereco_via);
	$("#pavimento_via").val(dados.pavimento_via);
	$("#condicoes_via").html("<option value='seca'>seca</option><option value='molhada'>molhada</option><option value='enlameada'>enlameada</option><option value='oleosa'>oleosa</option><option value='esburacada'>esburacada</option>");
	condpistastr = dados.condicoes_via;
	var vcondpista = condpistastr.split(",");
	for (i=0;i<vcondpista.length;i++){
		$("#condicoes_via option[value='" + vcondpista[i] + "']").attr("selected", "selected");
	}
	$("#perfil_via").val(dados.perfil_via);
	$("#acostamento_via").val(dados.acostamento_via);
	$("#meiofio_via").val(dados.meiofio_via);
	$("#iluminacao_via").val(dados.iluminacao_via);
	$("#tempo_via").val(dados.tempo_via);
	$("#visibilidade_via").val(dados.visibilidade_via);
	$("#sinalizacao_via").html("<option value='horizontal'>horizontal</option><option value='vertical'>vertical</option>");
	condpistastr = dados.sinalizacao_via;
	var vcondpista = condpistastr.split(",");
	for (i=0;i<vcondpista.length;i++){
		$("#sinalizacao_via option[value='" + vcondpista[i] + "']").attr("selected", "selected");
	}
	$("#pista_via").val(dados.pista_via);
	$("#sentido_via").val(dados.sentido_via);
	$("#talude_via").val(dados.talude_via);
	$("#largura_via").val(dados.largura_via);
	$("#conservacao_via").val(dados.conservacao_via);
	$("#periodo_via").val(dados.periodo_via);
	$("#areacircundante_via").val(dados.areacircundante_via);
}

/**
 * Recupera os dados da Aba fornecida
 */
function getData(aba) {
	var dataStr = "";
	if (aba == localStorage.TAB_IMEDIATO) {
		dataStr = localStorage.getItem('data_imediato');
	} else if (aba == localStorage.TAB_MEDIATO) { 
		dataStr = localStorage.getItem('data_mediato');
	} else if (aba == localStorage.TAB_RELACIONADO) { 
		dataStr = localStorage.getItem('data_relacionado');
	}
	return dataStr;
}

/**
 * Grava os dados do formulário na variável relacionada à aba fornecida
 */
function conservaData(aba) {
	var tipo = 0;
	if (aba == localStorage.TAB_IMEDIATO) {
		tipo = localStorage.tipo_imediato;
	} else if (aba == localStorage.TAB_MEDIATO) { 
		tipo = localStorage.tipo_mediato;
	} else if (aba == localStorage.TAB_RELACIONADO) { 
		tipo = localStorage.tipo_relacionado;
	}
	
	if (tipo>0) { // posso ter dados a conservar
		if (tipo==localStorage.TIPO_CONSTRUCAO) {
			conservaFormConstrucao(aba);
		} else if (tipo==localStorage.TIPO_RODOVIA) {
			conservaFormRodovia(aba);
		} else if (tipo==localStorage.TIPO_VIA_PUBLICA) {
			conservaFormViaPublica(aba);
		}
	}
}

/**
 * Grava os dados do formulário de Construção na variável relacionada à aba fornecida
 */
function conservaFormConstrucao(aba) {
	var dados = {"tipo_dado" : "<string>",
				 "endereco" : "<string>", 
				 "tipo" : "<string>",
				 "construcao" : "<string>",
				 "acabamento" : "<string>",
				 "cor_interna" : "<string>",
				 "cor_externa" : "<string>",
				 "piso" : "<string>",
				 "cor_piso" : "<string>",
				 "teto" : "<string>",
				 "iluminacao_site" : "<string>",
				 "visibilidade_site" : "<string>",
				 "acesso" : "<string>",
				 "guarnicao" : "<string>"
				 };
	var vctstr=[];
	
	// TODO Buscar dados do formulário de construção e construir um JSON
	dados.tipo_dado = "site";
	dados.endereco = $("#endereco_site").val();
	dados.tipo = $("#tipo_site").val();
	dados.construcao = $("#construcao").val();
	dados.acabamento = $("#acabamento").val();
	dados.cor_interna = $("#corinterna").val();
	dados.cor_externa = $("#corexterna").val();
	dados.piso = $("#piso").val();
	dados.cor_piso = $("#corpiso").val();
	vctstr = $("#teto").val();
	if (vctstr) {dados.teto = vctstr.toString();}
	dados.iluminacao_site = $("#iluminacao_site").val();
	dados.visibilidade_site = $("#visibilidade_site").val();
	dados.acesso = $("#acesso").val();
	dados.guarnicao = $("#guarnicao").val();
	
	gravaDados(aba, dados);
}

/**
 * Grava os dados do formulário de Rodovia na variável relacionada à aba fornecida
 */
function conservaFormRodovia(aba) {
	var dados = {"tipo_dado" : "<string>",
				 "endereco_rodovia" : "<string>", 
				 "pavimento_rodovia" : "<string>",
				 "condicoes_rodovia" : "<string>",
				 "perfil_rodovia" : "<string>",
				 "acostamento_rodovia" : "<string>",
				 "meiofio_rodovia" : "<string>",
				 "iluminacao_rodovia" : "<string>",
				 "tempo_rodovia" : "<string>",
				 "visibilidade_rodovia" : "<string>",
				 "sinalizacao_rodovia" : "<string>",
				 "pista_rodovia" : "<string>",
				 "sentido_rodovia" : "<string>",
				 "talude_rodovia" : "<string>",
				 "largura_rodovia" : "<string>",
				 "conservacao_rodovia" : "<string>",
				 "periodo_rodovia" : "<string>",
				 "areacircundante_rodovia" : "<string>"
				 };
	var vctstr=[];
	
	// TODO Buscar dados do formulário de construção e construir um JSON
	dados.tipo_dado = "rodovia";
	dados.endereco_rodovia = $("#endereco_rodovia").val();
	dados.pavimento_rodovia = $("#pavimento_rodovia").val();
	vctstr = $("#condicoes_rodovia").val();
	if (vctstr) {dados.condicoes_rodovia = vctstr.toString();}
	dados.perfil_rodovia = $("#perfil_rodovia").val();
	dados.acostamento_rodovia = $("#acostamento_rodovia").val();
	dados.meiofio_rodovia = $("#meiofio_rodovia").val();
	dados.iluminacao_rodovia = $("#iluminacao_rodovia").val();
	dados.tempo_rodovia = $("#tempo_rodovia").val();
	dados.visibilidade_rodovia = $("#visibilidade_rodovia").val();
	vctstr = $("#sinalizacao_rodovia").val();
	if (vctstr) {dados.sinalizacao_rodovia = vctstr.toString();}
	dados.pista_rodovia = $("#pista_rodovia").val();
	dados.sentido_rodovia = $("#sentido_rodovia").val();
	dados.talude_rodovia = $("#talude_rodovia").val();
	dados.largura_rodovia = $("#largura_rodovia").val();
	dados.conservacao_rodovia = $("#conservacao_rodovia").val();
	dados.periodo_rodovia = $("#periodo_rodovia").val();
	dados.areacircundante_rodovia = $("#areacircundante_rodovia").val();
	
	
	gravaDados(aba, dados);
}

/**
 * Grava os dados do formulário de Via Pública na variável relacionada à aba fornecida 
 */
function conservaFormViaPublica(aba) {
	var dados = {"tipo_dado" : "<string>",
				 "endereco_via" : "<string>", 
				 "pavimento_via" : "<string>",
				 "condicoes_via" : "<string>",
				 "perfil_via" : "<string>",
				 "acostamento_via" : "<string>",
				 "meiofio_via" : "<string>",
				 "iluminacao_via" : "<string>",
				 "tempo_via" : "<string>",
				 "visibilidade_via" : "<string>",
				 "sinalizacao_via" : "<string>",
				 "pista_via" : "<string>",
				 "sentido_via" : "<string>",
				 "talude_via" : "<string>",
				 "largura_via" : "<string>",
				 "conservacao_via" : "<string>",
				 "periodo_via" : "<string>",
				 "areacircundante_via" : "<string>"
				 };
	var vctstr=[];
	
	// TODO Buscar dados do formulário de via pública e construir um JSON
	dados.tipo_dado = "via publica";
	dados.endereco_via = $("#endereco_via").val();
	dados.pavimento_via = $("#pavimento_via").val();
	vctstr = $("#condicoes_via").val();
	if (vctstr) {dados.condicoes_via = vctstr.toString();}
	dados.perfil_via = $("#perfil_via").val();
	dados.acostamento_via = $("#acostamento_via").val();
	dados.meiofio_via = $("#meiofio_via").val();
	dados.iluminacao_via = $("#iluminacao_via").val();
	dados.visibilidade_via = $("#visibilidade_via").val();
	dados.tempo_via = $("#tempo_via").val();
	vctstr = $("#sinalizacao_via").val();
	if (vctstr) {dados.sinalizacao_via = vctstr.toString();}
	dados.pista_via = $("#pista_via").val();
	dados.sentido_via = $("#sentido_via").val();
	dados.talude_via = $("#talude_via").val();
	dados.largura_via = $("#largura_via").val();
	dados.conservacao_via = $("#conservacao_via").val();
	dados.periodo_via = $("#periodo_via").val();
	dados.areacircundante_via = $("#areacircundante_via").val();
	
	gravaDados(aba, dados);
	
}

/**
 * Grava o objeto dados em uma string, no localStorage
 */
function gravaDados(aba, dados) {
	if (aba == localStorage.TAB_IMEDIATO) {
		// Put the object into storage
		localStorage.setItem('data_imediato', JSON.stringify(dados));
	} else if (aba == localStorage.TAB_MEDIATO) { 
		localStorage.setItem('data_mediato', JSON.stringify(dados));
	} else if (aba == localStorage.TAB_RELACIONADO) { 
		localStorage.setItem('data_relacionado', JSON.stringify(dados));
	}
}

/**
 * Carrega os dados de local a partir do banco de dados
 */

function loadLocaisDB (ocor_val, callback){
	var consulta = "";
	var localstr = "";
	var locais = [];

	consulta = "select * from local where ocorrencia_id = " + ocor_val;
	db.transaction(function (tx) {
		tx.executeSql(consulta, [], function (tx, results) {
			  	var len = results.rows.length,i;
				for (i=0;i < len; i++) {
					var local = new Object();
					local.id = results.rows.item(i).local_id;
					local.classe = results.rows.item(i).local_classe;
					local.endereco = results.rows.item(i).endereco;
					local.tipo = results.rows.item(i).local_tipo;
					// define tabela da subconsulta com base no tipo
					locais.push (local);
					
				}
				localstr = JSON.stringify(locais);
				sessionStorage.local = localstr;
				callback (ocor_val);
		});
	 });
}

function loadDetalhe(tabela, id, tipo, classe, endereco, callback){
	var detalha = "select * from "+tabela+" where local_id = "+id;
	// console.log("Consulta detalhe:"+detalha);
	db.transaction(function (tx) {
			tx.executeSql(detalha, [], function (tx, results) {
			  	var len = results.rows.length,j;
				for (k=0;k < len; k++) {
					switch (tipo) {
						case "site":
							var dados = new Object();
								// Carrega os dados de cada aba  
								dados.tipo_dado = "site";
								dados.classe = classe;
								dados.endereco = endereco; // = banco.endereco;
								dados.tipo = results.rows.item(k).site_tipo;
								dados.construcao = results.rows.item(k).construcao;
								dados.acabamento = results.rows.item(k).acabamento;
								dados.cor_interna = results.rows.item(k).cor_interna;
								dados.cor_externa = results.rows.item(k).cor_externa;
								dados.piso = results.rows.item(k).piso;
								dados.cor_piso = results.rows.item(k).cor_piso;
								dados.teto = results.rows.item(k).teto;
								dados.iluminacao_site = results.rows.item(k).iluminacao;
								dados.visibilidade_site = results.rows.item(k).visibilidade;
								dados.acesso = results.rows.item(k).acesso;
								dados.guarnicao = results.rows.item(k).guarnicao;
								break;
						case "rodovia":
							var dados = new Object();
								// Carrega os dados de cada aba  
								dados.tipo_dado = "rodovia";
								dados.classe = classe;
								dados.endereco_rodovia = endereco;
								dados.pavimento_rodovia = results.rows.item(k).pavimento;
								dados.condicoes_rodovia = results.rows.item(k).condicao_pista;
								dados.perfil_rodovia = results.rows.item(k).perfil_pista;
								dados.acostamento_rodovia = results.rows.item(k).acostamento;
								dados.meiofio_rodovia = results.rows.item(k).meio_fio;
								dados.iluminacao_rodovia = results.rows.item(k).iluminacao;
								dados.tempo_rodovia = results.rows.item(k).condicao_tempo;
								dados.visibilidade_rodovia = results.rows.item(k).visibilidade;
								dados.sinalizacao_rodovia = results.rows.item(k).sinalizacao;
								dados.pista_rodovia = results.rows.item(k).pista;
								dados.sentido_rodovia = results.rows.item(k).sentido;
								dados.talude_rodovia = results.rows.item(k).tracado;
								dados.largura_rodovia = results.rows.item(k).largura_pista;
								dados.conservacao_rodovia = results.rows.item(k).conservacao;
								dados.periodo_rodovia = results.rows.item(k).periodo;
								dados.areacircundante_rodovia = results.rows.item(k).area_circundante;
								break;
						case "via publica":
							var dados = new Object();
								// Carrega os dados de cada aba  
								dados.tipo_dado = "via publica";
								dados.classe = classe;
								dados.endereco_via = endereco;
								dados.pavimento_via = results.rows.item(k).pavimento;
								dados.condicoes_via = results.rows.item(k).condicao_pista;
								dados.perfil_via = results.rows.item(k).perfil_pista;
								dados.acostamento_via = results.rows.item(k).acostamento;
								dados.meiofio_via = results.rows.item(k).meio_fio;
								dados.iluminacao_via = results.rows.item(k).iluminacao;
								dados.tempo_via = results.rows.item(k).condicao_tempo;
								dados.visibilidade_via = results.rows.item(k).visibilidade;
								dados.sinalizacao_via = results.rows.item(k).sinalizacao;
								dados.pista_via = results.rows.item(k).pista;
								dados.sentido_via = results.rows.item(k).sentido;
								dados.talude_via = results.rows.item(k).tracado;
								dados.largura_via = results.rows.item(k).largura_pista;
								dados.conservacao_via = results.rows.item(k).conservacao;
								dados.periodo_via = results.rows.item(k).periodo;
								dados.areacircundante_via = results.rows.item(k).area_circundante;
								break;
					}
					

				}
				callback(dados);
			});
		});
	
}

function loadLocalDataFromDB(ocor_val, callback) {
	loadLocaisDB (ocor_val, function (ocor_val){
	var local_str = "";
	var locals = [];
	var numlocals = 0;
	local_str = sessionStorage.local;
	// console.log("LocalStr:"+local_str);
	locals = JSON.parse(local_str);
	numlocals = locals.length;
	for (j=0;j<numlocals;j++){
		var tabela = "";
		var tipoe = locals[j].tipo;
		var id = locals[j].id;
		var endereco = locals[j].endereco;
		var classe = locals[j].classe;
		tipo = tipoe.trim();
		if (tipo === "rodovia") {
			tabela = "transito";
		} else if (tipo === "via publica") {
			tabela = "transito";
				} else if (tipo === "site") {
					tabela = "site";
					}


		loadDetalhe(tabela, id, tipo, classe, endereco, function (dados){

			preencheAbaLocal(dados.classe, dados.tipo_dado, JSON.stringify(dados));
		});
		
	}
	sessionStorage.removeItem('local');	
	callback(ocor_val);
	});
	
}
	

function preencheAbaLocal(aba, tipo, dados) {
	var tpo = 0;
	
	switch (tipo) {
		case "site": {
			tpo = 1;
			break;
		}
		case "rodovia": {
			tpo = 2;
			break;
		}
		case "via publica": {
			tpo = 3;
			break;
		}
	}
	
	localStorage.setItem('prevConsultaLocal',1);
	if (aba == "imediato") {
		localStorage.setItem('tipo_imediato',    tpo);
		localStorage.setItem('data_imediato',    dados);
	} else if (aba == "mediato") {
		localStorage.setItem('tipo_mediato',     tpo);
		localStorage.setItem('data_mediato',     dados);
	} else if (aba == "relacionado") {
		localStorage.setItem('tipo_relacionado', tpo);
		localStorage.setItem('data_relacionado', dados);
	} 
	
}
