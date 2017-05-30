var barra_arriba='';	
if(!barra_arriba){
	var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
		 			db.transaction(function(tx){
					tx.executeSql('SELECT barra_arriba,id FROM empresa ',[],function(tx,results){
								
											for (var i=0; i <= results.rows.length-1; i++){
												var row = results.rows.item(i);
												var id = row.id;
												barra_arriba = row.barra_arriba;
											}
					});
					},errorCB ,successCB);	
		 		}

	
	var idBarraSync=0;
	var id_barra=$.trim($("#deviceid").html()); //"pJosueTerminsaxxczal4x20"; //deviceid
	if(!id_barra) id_barra='a383bc4552bfb701f96a17a4541b5565';
	var TokenRequest='a383bc4552bfb701f96a17a4541b5565';
	var empresa;
	var apiURL='https://practisis.net/connectnubepos/api.php';
	var apiFolder='https://practisis.net/connectnubepos/';
	var globalContProductosNube=-1;
	var globalTSNube="";

function validateToken(){
	var quien=$("#user2").val();
	var pass=$("#pass2").val();	
	$('#btnvalida2').html("<img src='images/loader.gif' width='20px'/>");
	$.get(apiURL,{ idBarraSync : idBarraSync, TokenRequest : id_barra , id : quien , pass : pass  },function(data){
		
		//	json = $.parseJSON(data);
		//	if(json.valid=='true'){
				/*VALID TOKEN*/
				
				$("#divdatoslogin").html(data);
/*					$.get(apiURL + "?id="+quien+"&pass="+pass + "&KeyRequest=loginUser" ).done(function(data){
						if(data != 'error'){
							
						}
					});*/


			//}else{
			//	alert("Invalid Token");
			//}
	});
}



	function loginEmpresa(id_emp,nombreempresa){
		
			$("#fadeRow").fadeOut();
			 $("#contentStepSincro").fadeIn();
				localStorage.setItem("empresa", id_emp);

				localStorage.setItem("nombreempresa",nombreempresa );
				localStorage.setItem("id_barra", id_barra);


				 empresa = localStorage.getItem('empresa');
				 $('#id_emp').html('Emp'+empresa);
				var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
					tx.executeSql('SELECT COUNT(id) as cuantos FROM empresa',[],function(tx,res){
						var existen=res.rows.item(0).cuantos;
						if(existen==0){
							db.transaction(
								function (tx){
									tx.executeSql('INSERT INTO empresa (nombre,nombreempresa,id_barra) VALUES ('+id_emp+',"'+nombreempresa+'","'+id_barra+'");',[],
									 function(tx,res){
										
										console.log("Insert ID Empresa Sql:"+res.insertId);
										console.log(res);										
									});				
								},errorCB,successCB
							);
						}
						sincronizarProcess2();
					});
				
				},errorCB,successCB);
	
			}



/*----------- 
		Process:
		    0.1.sincronizarProcess();
			0.2 obtenerDatosNube();
		1.1  compararJSONproductos();
		1.2	sincronizacionCategorias();
	------------>
	*/
	
var globalContProductosLocal=-1;		

	function sincronizarProcess2(){
			empresa = localStorage.getItem('empresa');
			obtenerDatosNube2(empresa);
			muestraJSONLOCALCategorias();					
	}


	function saberIdBarraLocal(){

		



	}
	function saberIdBarra(jsonProductos){
		obj=$.parseJSON(jsonProductos);
		idBarraSync= obj.Productos[0].id_barra;
		db.transaction(function(tx){
		tx.executeSql('SELECT barra_arriba,id FROM empresa ',[],function(tx,results){
					
								for (var i=0; i <= results.rows.length-1; i++){
									var row = results.rows.item(i);
									var id = row.id;
									barra_arriba = row.barra_arriba;
								}
								if(!barra_arriba){
									
										db.transaction(function(tx){
										tx.executeSql('UPDATE empresa SET barra_arriba=?' ,[idBarraSync],function(tx,results){
										});
										},errorCB ,successCB);

								}
		});
		},errorCB ,successCB);
	}
		function existeCategoria(formulado_tipo,id_formulado_tipo,formulado_tipo_timespan){
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
				tx.executeSql('SELECT * FROM CATEGORIAS',[],function(tx,results){
				if(formulado_tipo_timespan=='0') formulado_tipo_timespan='8';
					
								for (var i=0; i <= results.rows.length-1; i++){
									var row = results.rows.item(i);
									var idCat = row.id;
									var timeSpan = row.timespan;
									var categoria = row.categoria;
									var activo = row.activo;
									var existe = row.existe;
									if(timeSpan==formulado_tipo_timespan || timespan == id_formulado_tipo ){
										return true;
									}else{
										return false;
									}
								}
							
								
							
			},errorCB ,successCB);
		});
						
			

		}	
		var productosJsonActualizar='';
		var contProductosActualizar=-1;

		function nuevoProductoAbajo(jsonSync){
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
			contProductosActualizar++;
			i=contProductosActualizar;
			if(contProductosActualizar > (jsonSync.Productos.length-1)){
				idBarraSync=barra_arriba;
				limpiarSincronizaDatos();
				$("#theProgress").css("width" , "25%");
				sincronizarFacturas();
				return;	
			}
			
			//for(i=0; i<=(jsonSync.Productos.length-1); i++  ){
				row=jsonSync.Productos[i];
				id=row.id;
		 		formulado=row.formulado;

		 		formulado_timespan=row.timespan;
		 		activo=row.activo;
		 		ivacomprareal=row.ivacomprareal;
		 		id_formulado_tipo=row.id_formulado_tipo;
		 		formulado_tipo=row.formulado_tipo;
		 		formulado_codigo=row.formulado_codigo;
		 		formulado_tipo_timespan=row.formulado_tipo_timespan;
		 		precio=row.precio;
		 		if(!barra_arriba){
		 			db.transaction(function(tx){
					tx.executeSql('SELECT barra_arriba,id FROM empresa ',[],function(tx,results){
								
											for (var i=0; i <= results.rows.length-1; i++){
												var row = results.rows.item(i);
												var id = row.id;
												barra_arriba = row.barra_arriba;
											}
					});
					},errorCB ,successCB);	
		 		}
		 		
		 		
		 				db.transaction(function(tx2){
						tx2.executeSql('SELECT * FROM CATEGORIAS',[],function(tx2,results){
							//if(formulado_tipo_timespan=='0') formulado_tipo_timespan='8';
							
								var hayCategory= false;
								for (var i=0; i <= results.rows.length-1; i++){
									var row = results.rows.item(i);
									var idCat = row.id;
									var timeSpan = row.timespan;
									var categoria = row.categoria;
									var activo = row.activo;
									var existe = row.existe;
									if(timeSpan==formulado_tipo_timespan ){
										hayCategory=true;
									}
								}
								//alert(formulado + "<<" + hayCategory + "<<");
								if(!hayCategory){
									db.transaction(function(tx3){
											tx3.executeSql('INSERT INTO CATEGORIAS(categoria,timespan,activo,existe,sincronizar) VALUES("'+formulado_tipo+'" , "'+id_formulado_tipo+'",1,0,"false")',[],function(tx3,results){
												$.post(apiURL,{ KeyRequest : "UpdateTimeSpanCategory" , id_formulado_tipo: id_formulado_tipo , empresa : empresa , id_barra : id_barra , barra_arriba : barra_arriba  }).done(function(data){
														
														db.transaction(function(tx3){
														tx3.executeSql('INSERT INTO PRODUCTOS(formulado,codigo,precio,categoriaid,cargaiva,productofinal,materiaprima,timespan,servicio,activo) VALUES("'+formulado+'", "'+codigo+'" , '+precio+', '+id_formulado_tipo+' , 1,1,1,"'+formulado_timespan+'" , 1 , '+activo+' ) ',[],function(tx3,results){
																
																nuevoProductoAbajo(jsonSync);

														},errorCB ,successCB);
														});	


												});
											
										},errorCB ,successCB);
										});

								}else{
									if(formulado_timespan==0){
										/* Formulado Nuevo creado desde arriba sin timespan */
									
										db.transaction(function(tx3){
											tx3.executeSql('INSERT INTO PRODUCTOS(formulado,codigo,precio,categoriaid,cargaiva,productofinal,materiaprima,timespan,servicio) VALUES("'+formulado+'", "'+codigo+'" , '+precio+', '+id_formulado_tipo+' , 1,1,1,"'+formulado_timespan+'" , 1  ) ',[],function(tx3,results){

												nuevoProductoAbajo(jsonSync);

										},errorCB ,successCB);
										});
												}else{
													console.log('UPDATE PRODUCTOS SET formulado ="'+formulado+'" ,codigo="'+formulado_codigo+'", precio='+precio+' , categoriaid='+id_formulado_tipo+',cargaiva=1,productofinal=1,materiaprima=1 WHERE timespan =' + formulado_timespan );
													/*Formulado Con timespan, puede ser creado desde otro terminal nubepos*/
											db.transaction(function(tx3){
											tx3.executeSql('UPDATE PRODUCTOS SET formulado ="'+formulado+'" ,codigo="'+formulado_codigo+'", precio='+precio+' , categoriaid='+id_formulado_tipo+',cargaiva=1,productofinal=1,materiaprima=1 WHERE timespan =' + formulado_timespan,[],function(tx3,results){
													
															nuevoProductoAbajo(jsonSync);

										},errorCB ,successCB);
										});
													/*db.transaction(function(tx3){
													tx3.executeSql('SELECT * FROM PRODUCTOS WHERE timespan=' + formulado_timespan,[],function(tx3,results){
													if(formulado_tipo_timespan=='0') formulado_tipo_timespan='8';
										
													for (var i=0; i <= results.rows.length-1; i++){
														var row = results.rows.item(i);
														var idCat = row.id;
														var timeSpan = row.timespan;
														var categoria = row.categoria;
													}
												},errorCB ,successCB);
												});*/
												}
											}
							
														
							},errorCB ,successCB);
						});

	}

		function obtenerDatosNube2(empresa){
							
			$.post(apiURL,{
								id_emp : empresa ,
								KeyRequest : 'datosIniciales',
								id_barra : id_barra,
								yaConectado : yaConectado,
								idBarraSync : idBarraSync
						}).done(function(response){
							
							if(yaConectado){
								console.log(response);

								 	jsonSync=$.parseJSON(response);
								 	if(jsonSync.Productos.length){
								 		productosJsonActualizar=response;
								 		nuevoProductoAbajo(jsonSync);
								 	}else{
								 		/*No hay Productos*/
								 		$("#theProgress").css("width" , "25%");
								 		sincronizarFacturas();

								 	}
								 	
								 	

							}else{
								var arraydatos=JSON.parse(response); 
								JSONproductosNube=arraydatos.productos;
								JSONcategoriasNube=arraydatos.categorias;
								JSONclientesNube=arraydatos.clientes;
								//alert(JSONclientesNube);
								$("#JSONclientesNube").html(JSONclientesNube);
								$("#JSONCategoriasNube").html(JSONcategoriasNube);
								$("#JSONproductosNube").html(JSONproductosNube);
								saberIdBarra(JSONproductosNube);
								$("#JSONproductosLocal").html('');
								JSONproductosLocal='{ "Productos" : [';
								$("#JSONproductosLocal").append(JSONproductosLocal);
								var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
								db.transaction(function(tx){
								tx.executeSql('SELECT p.*,c.categoria as nombrec , p.timespan as timespan ,  c.id as idcat FROM PRODUCTOS p,CATEGORIAS c WHERE p.categoriaid=c.timespan ORDER BY p.formulado ASC',[],function(tx,results){
								for (var i=0; i <= results.rows.length-1; i++){
								var row = results.rows.item(i);
								var formulado = row.formulado;
								var codigo = row.codigo;
								var precio = row.precio;
								var categoriaid = row.idcat;
								var categorianombre = row.nombrec;
								var timespan = row.timespan;
								var cargaiva = row.cargaiva;
								var productofinal = row.productofinal;
								var materiaprima = row.materiaprima;
								JSONproductosLocal='{ "formulado" : "'+formulado+'"  , "codigo" : "'+codigo+'" , "precio" : "'+precio+'" , "categoriaid" : "'+categoriaid+'" , "categorianombre" : "'+categorianombre+'" , "cargaiva" : "'+cargaiva+'" , "productofinal" : "'+productofinal+'" , "materiaprima" : "'+materiaprima+'" , "timespan" : "'+timespan+'"},';
							if(i==results.rows.length-1) JSONproductosLocal=JSONproductosLocal.substring(0,JSONproductosLocal.length-1);
								$("#JSONproductosLocal").append(JSONproductosLocal);
								}
								$("#JSONproductosLocal").append(']}');
								if(!yaConectado){
									 compararJSONproductos(); 
									}else{

									} 


						});
					},errorCB ,successCB);
						
					
			
							}

			});	
		}



		function compararJSONproductos(){
			JSONproductosLocal=$("#JSONproductosLocal").html();
			JSONproductosNube=$("#JSONproductosNube").html();
			JLocal=jQuery.parseJSON(JSONproductosLocal);
			JNube=$.parseJSON(JSONproductosNube);
			arrayProductosLocalFaltantes= new Array();
			contTsNube=-1;
			
			for(j=0; j<= (JLocal.Productos.length -1); j++ ){
				hayProductoEnNube=false;
				pLocal=JLocal.Productos[j];		
				tsLocal=$.trim(pLocal.timespan);
				formuladoLocal=pLocal.formulado;
				for(k=0; k<= (JNube.Productos.length -1); k++ ){
						pNube=JNube.Productos[k];		
						tsNube=$.trim(pNube.formulado_timespan);
						if(tsLocal==tsNube) { 
						hayProductoEnNube=true; }
				}

				if(hayProductoEnNube==false){
					arrayProductosLocalFaltantes[arrayProductosLocalFaltantes.length]=tsLocal;
				}
			}
			
			sincronizaFaltanteProductosLocal();
			
		}
		

		
		function sincronizaFaltanteProductosLocal(){
			if( (globalContProductosLocal + 1) > (arrayProductosLocalFaltantes.length-1 ) ){
				console.log("fin bucle");//fin Sincronizacion Local
				$("#theProgress").css("width" , "12.5%");

				sincronizaFaltanteProductosNube();
				return ;
			}else{
				globalContProductosLocal++;
				actualTimeSpan=arrayProductosLocalFaltantes[globalContProductosLocal];
				JSONproductosLocal=$("#JSONproductosLocal").html();
				JLocal=jQuery.parseJSON(JSONproductosLocal);
				var formulado="";
				for(j=0; j<= (JLocal.Productos.length -1); j++ ){
					pLocal=JLocal.Productos[j];		
					if(pLocal.timespan==actualTimeSpan){
						formulado= pLocal.formulado;
						codigo= pLocal.codigo;
						categoriaid= pLocal.categoriaid;
						categorianombre= pLocal.categorianombre;
						precio= pLocal.precio;
						cargaiva= pLocal.cargaiva;
						productofinal= pLocal.productofinal;
						materiaprima= pLocal.materiaprima;
						
					}
				}
				
				if(formulado){

						//$.post('http://practisis.net/practipos2/ajax/apiSincronizador/apiSincronizaNubeposProductosNew.php',{
						$.post(apiURL,{
							KeyRequest : 'insertProductLocal',
							empresa : empresa , 
							formulado : formulado ,
							 codigo : codigo , 
							 precio : precio , 
							 categorianombre : categorianombre , 
							 cargaiva : cargaiva , 
							 productofinal : productofinal , 
							 materiaprima : materiaprima, 
							 timespan : actualTimeSpan
						}).done(function(data){
							
							$("#theProgress").css("width" , "12.5%");
							prc=( 12.5 / arrayProductosLocalFaltantes.length ) * globalContProductosLocal ;
							$("#theProgress").css("width" , prc + "%");
							console.log(data);
						});
				}
				
				sincronizaFaltanteProductosLocal();
			}
			
		}



		var arrayProductosNubeFaltantes;
		
		function sincronizaFaltanteProductosNube(){			
			JSONproductosLocal=$("#JSONproductosLocal").html();
			JSONproductosNube=$("#JSONproductosNube").html();
			JLocal=jQuery.parseJSON(JSONproductosLocal);
			JNube=$.parseJSON(JSONproductosNube);
			arrayProductosNubeFaltantes= new Array();
			contTsNube=-1;
			
			for(j=0; j<= (JNube.Productos.length -1); j++ ){
				hayProductoEnNube=false;
				pNube=JNube.Productos[j];		
				tsNube=$.trim(pNube.formulado_timespan);
				formuladoNube=pNube.formulado_nombre;
				formuladoNubeID=pNube.formulado_id;
				
				for(k=0; k<= (JLocal.Productos.length -1); k++ ){
						pLocal=JLocal.Productos[k];		
						tsLocal=$.trim(pLocal.timespan);
						if(tsLocal==tsNube) { 
							
							hayProductoEnNube=true;
	
						}
				}
				if(hayProductoEnNube==false){
					arrayProductosNubeFaltantes[arrayProductosNubeFaltantes.length]=formuladoNubeID;
				}
			}
			
			sincronizaProductoNube();
			
		}
		

		function sincronizaProductoNube(){
				if(!arrayProductosNubeFaltantes.length) {
					$("#theProgress").css("width" , "25%");
					sincronizacionCategorias();
					return;
				}
			if( (globalContProductosNube + 1) > (arrayProductosNubeFaltantes.length-1 ) ){
				console.log("fin bucle Nube Productos");//fin Sincronizacion Local
				$("#theProgress").css("width" , "25%");
				sincronizacionCategorias();
				
				return ;
			}else{
				globalContProductosNube++;		
				currentFormulado=arrayProductosNubeFaltantes[globalContProductosNube];
				JSONproductosNube=$("#JSONproductosNube").html();
				JNube=jQuery.parseJSON(JSONproductosNube);
				var formulado="";
				timeSpan="";
				for(j=0; j<= (JNube.Productos.length -1); j++ ){
					pNube=JNube.Productos[j];		
					if(pNube.formulado_id==currentFormulado){
						formulado= pNube.formulado_nombre;
						codigo= pNube.formulado_codigo;
						precio= pNube.formulado_precio;
						impuesto = pNube.formulado_impuesto;
						tipo= pNube.formulado_tipo;
						categoriaid= pNube.categoria_id;
						categorianombre= pNube.categoria_nombre;
						cargaiva= pNube.cargaiva;
						productofinal= pNube.formulado_productofinal;
						materiaprima= pNube.formulado_matprima;
						timeSpan=  pNube.formulado_timespan;
						formulado_id=pNube.formulado_id;
						cargaservicio = pNube.carga_servicio;
						
					}
				}
				
				if(formulado){
					actualTimeSpan=timeSpan;
					globalTSNube=timeSpan;
					if(actualTimeSpan=="0"){
						actualTimeSpan=getTimeSpan();
						globalTSNube= actualTimeSpan ;
						}
					
						//$.post('http://practisis.net/practipos2/ajax/apiSincronizador/apiSincronizaNubeposProductosNew.php',{ tipo : "actualizar" ,
						$.post(apiURL,{ 
							KeyRequest : "updateProductTimeSpan"  ,
							tipo : "actualizar" ,
							formulado_id : formulado_id , 
							empresa : empresa , 
							formulado : formulado , 
							codigo : codigo , 
							precio : precio , 
							categorianombre : categorianombre , 
							cargaiva : cargaiva , 
							productofinal : productofinal , 
							materiaprima : materiaprima, 
							timespan : globalTSNube
						}).done(function(data){
						
							prc=( 12.5 / arrayProductosNubeFaltantes.length ) * (globalContProductosNube +1) ;
							$("#theProgress").css("width" , (12.5 + prc )+ "%");
							
							// 1. Validar Si existe  Categoria
							//2. Meter Categoria si no existe
							categoria=categorianombre;
							
							var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
								db.transaction(function(tx){
								timeSpanCat=getTimeSpan();
								tx.executeSql('INSERT INTO CATEGORIAS(categoria,activo,existe , timespan,sincronizar ) SELECT "'+categoria+'",1,0,'+categoriaid+' , "false" WHERE NOT EXISTS(SELECT 1 FROM CATEGORIAS WHERE categoria = "'+categoria+'");',[],function(tx,results){
								
									$('#idcategoria').val(results.insertId);
									console.log("categ:"+results.insertId);
									
									//idcategoria=results.insertId;//$('#idcategoria').val();
									 idcategoria=localCategoriaID(categoriaid);//categoriaid;
									//if(!idcategoria)
									if( !cargaiva )  cargaiva = '0';
									if( !productofinal )  productofinal = '0';
									if( !materiaprima )  materiaprima = '0';
									
									
									db.transaction(function(tx){
										tx.executeSql('INSERT INTO PRODUCTOS(id,formulado,codigo,precio,categoriaid,cargaiva,productofinal,materiaprima,timespan,servicio) SELECT 0,"'+formulado+'","'+codigo+'","'+precio+'",'+idcategoria+','+cargaiva+','+productofinal+','+materiaprima+','+globalTSNube+' , "'+cargaservicio+'" WHERE NOT EXISTS(SELECT 1 FROM PRODUCTOS WHERE formulado like "'+formulado+'" or codigo like "'+codigo+'");',[],function(tx,results){
										console.log("prod:"+results.insertId);
											sincronizaProductoNube();
											
										});
									},errorCB,successCB);
								});
								},errorCB,successCB);
							
							
							
							console.log(data);
							
						});
					
				}
				
				
			}
		
		}
		


function localCategoriaID(categoriaid){
			JSONCategoriasLocal=$("#JSONCategoriasLocal").text();
			JLocalCat=$.parseJSON(JSONCategoriasLocal);
			hayMatch=false;
			for(i=0;i<=(JLocalCat.Categorias.length-1); i++){
				id=JLocalCat.Categorias[i].id;
				timespan=JLocalCat.Categorias[i].timespan;
				if(categoriaid == timespan){
					hayMatch=true;
					return id;
					
				}
			}
			if(hayMatch==false){
			return categoriaid;
			}

		}
		
		function sincronizacionCategorias(){
			
			
			
		//	$.post('https://www.practisis.net/nubeposboot/www/ajax/dataserviceNew.php',{
				$.post(apiURL,{
								KeyRequest : "datosIniciales" , 
								id_emp : empresa,
								id_barra : id_barra
						}).done(function(response){
					var arraydatos=JSON.parse(response); 
					JSONproductosNube=arraydatos.productos;
					JSONcategoriasNube=arraydatos.categorias;
					$("#JSONCategoriasNube").html(JSONcategoriasNube);
					$("#JSONproductosNube").html(JSONproductosNube);
					//$("#JSONproductosLocal").html('');
						cargarJSONLocalCategorias();
						
					});
			
		}
		function cargarJSONLocalCategorias(){
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
			tx.executeSql('SELECT * FROM CATEGORIAS',[],function(tx,results){
					$("#JSONCategoriasLocal").html(' { "Categorias" :  [ ');
					txt='';
								for (var i=0; i <= results.rows.length-1; i++){
									var row = results.rows.item(i);
									var idCat = row.id;
									var timeSpan = row.timespan;
									var categoria = row.categoria;
									var activo = row.activo;
									var existe = row.existe;
									txt+='{  "id" : "'+idCat+'" ,  "categoria" : "'+categoria+'" ,  "activo" : "'+activo+'" ,  "existe" : "'+existe+'" ,  "timespan" : "'+timeSpan+'"  },';
									//$("#JSONCategoriasLocal").append(txt);
								}
								txt=txt.substring(0,txt.length-1);
								$("#JSONCategoriasLocal").append(txt+" ]}");
								validarJsonCategorias();
			},errorCB ,successCB);
		});
						
			
		}
		var arrayFaltanteCategoryLocal=new Array();
		function validarJsonCategorias(){
			if(yaConectado) return;
			JSONCategoriasNube= $("#JSONCategoriasNube").text();
			JSONCategoriasLocal=  $("#JSONCategoriasLocal").text();
			JCNube=jQuery.parseJSON(JSONCategoriasNube);
			JCLocal=jQuery.parseJSON(JSONCategoriasLocal);
			for(i=0;i<=(JCLocal.Categorias.length-1);i++){
				catLocal=JCLocal.Categorias[i];
				timeSpan=catLocal.timespan;
				idCatLocal=catLocal.id;
				categoriaLocal=$.trim(catLocal.categoria).toLowerCase();
				var hayMatchCat=false;
				var hayMatchNombre=false;
				for(j=0; j<=JCNube.Categorias.length-1; j++){
					catNube=JCNube.Categorias[j];
					idNube=catNube.categoria_id;
					categoriaNube=$.trim(catNube.categoria_nombre).toLowerCase();
					if(timeSpan==idNube){
						hayMatchCat=true;
					}
					
					
					
					if(categoriaNube==categoriaLocal){
						hayMatchNombre=true;
					}
				}
				if(hayMatchCat==false && hayMatchNombre==true){
					arrayFaltanteCategoryLocal[arrayFaltanteCategoryLocal.length]=idCatLocal+"|"+idNube;
					var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
						db.transaction(function(tx){
						
							tx.executeSql("UPDATE PRODUCTOS SET categoriaid=? WHERE categoriaid=?;",[idNube,timeSpan],function(tx,results){
								
							});
							console.log("UPDATE PRODUCTOS SET categoriaid=? WHERE categoriaid=?" + idNube + " <> " + timeSpan);
						},errorCB ,successCB);	
					console.log("actualizar timespan abajo>>" + catLocal.categoria +  ">>" + idNube);
				}
			}

			actualizarCategoriasID();
			
			
			
		}
		
		var arrayCategoriasFaltantesNube = new Array();
		function validarJsonCategoriasNube(){
			
			JSONCategoriasNube= $("#JSONCategoriasNube").text();
			JSONCategoriasLocal=  $("#JSONCategoriasLocal").text();
			JCNube=jQuery.parseJSON(JSONCategoriasNube);
			JCLocal=jQuery.parseJSON(JSONCategoriasLocal);
			var hayMatchCat=false;
			for(i=0;i<=(JCNube.Categorias.length-1);i++){
				catNube=JCNube.Categorias[i];
				idCatNube=catNube.categoria_id;
				nombreCat=catNube.categoria_nombre;
				for(j=0; j<=JCLocal.Categorias.length-1; j++){
					
					catLocal=JCLocal.Categorias[j];
					timespanLocal=catLocal.timespan;
					if(timespanLocal==idCatNube){
						hayMatchCat=true;
					}
				}
				if(hayMatchCat==false){
					arrayCategoriasFaltantesNube[arrayCategoriasFaltantesNube.length] = nombreCat + "|" + idCatNube;
					
				}
			}
			agregarCategoriasFalatantesNube();
			
			
			
		}
		globalContCatFaltantesNube=-1;
		function sincronizarFacturas(){
			$('#theProgress').width("50%");
			$("#txtSincro").html('<i>(1/2) Sincronizando Facturas</i>');
			db.transaction(function(tx){
			tx.executeSql('SELECT * FROM FACTURAS',[],function(tx,results){
					jsonClientesLocal='{ "JsonFacturas" : [ "cliente" : ';
					JsonFacturasNew='';
						for (var i=0; i <= results.rows.length-1; i++){
							
								var row = results.rows.item(i);
								id=row.id;		
								clientName=row.clientName;
								fetchJson=row.fetchJson;
								paymentsUsed=row.paymentsUsed;
								cash=row.cash;
								fecha=row.fecha;
								obj=$.parseJSON(fetchJson);
								idCliente=obj.Pagar[0].cliente.id_cliente;

								$.post(apiFolder+"sincronizador_nubepos.php" , { id : 'sub' , emp : empresa , local : 2 , caj : id_barra , js : fetchJson}).done(function(data){
									
								});
								/*
								db.transaction(function(tx){
								tx.executeSql('SELECT * FROM CLIENTES WHERE id='+idCliente,[],function(tx,results2){
										for (var j=0; j <= results2.rows.length-1; j++){
											nombreCliente='';
											cedulaCliente='';
											emailCliente='';
											direccion='';
											timeSpan='';
											var row2 = results2.rows.item(j);
											nombreCliente=row2.nombre;
											cedulaCliente=row2.cedula;
											emailCliente=row2.email;
											direccion = row2.direccion;
											telefono=row2.telefono;
											timeSpan = row2.timespan;
											
									}
									
								});
								},errorCB,successCB);
						*/
								
							}
					});
			},errorCB,successCB);
			if(!yaConectado) sincronizarClientes(); else bajaClientes();
		}
		
		
		function bajaClientes(){
			
			$.post(apiURL, {   KeyRequest : "bajarClientes" , id_barra : id_barra , empresa : empresa, barra_arriba : barra_arriba } ).done(function(data){
				objClient=$.parseJSON(data);
					console.log(data);
				var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
					tx.executeSql('SELECT * FROM CLIENTES',[],function(tx,results){
						
						for(j=0; j<= (objClient.Clientes.length-1) ; j++){
									rowUP=objClient.Clientes[j];
									idUP=rowUP.id;
									cedulaUP=rowUP.cedula;
									nombreUP=rowUP.nombre + " " + rowUP.apellido ;
									direccionUP=rowUP.direccion;
									emailUP=rowUP.email;
									telefonoUP=rowUP.telefono;

										for (var i=0; i <= results.rows.length-1; i++){
											var row = results.rows.item(i);
											var cedula = $.trim(row.cedula);
											existeClient=false;
											
											if(cedula==$.trim(cedulaUP)){
												existeClient=true;
											}
										}
										if(existeClient){

											tx.executeSql('UPDATE clientes SET nombre = "'+nombreUP+' ",email="'+emailUP+'",direccion = "'+direccionUP+'",telefono = "'+telefonoUP+'",timespan="'+idUP+'"  WHERE cedula="'+cedulaUP+'"  ',[],function(tx,results){

													console.log(cedulaUP + "<<Edited" );
											});

										}else{
											tx.executeSql('INSERT INTO CLIENTES(nombre,cedula,email,direccion,telefono,timespan) VALUES("'+nombreUP+'" , "'+cedulaUP+'" , "'+emailUP+'" , "'+direccionUP+'" , "'+telefonoUP+'" , "'+idUP+'"  )',[],function(tx,results){

													console.log(cedulaUP + "<<New" );

											});

										} 
									
								}

								
								sincronizaPresupuesto();
								$("#theProgress").css("width" , "100%");
								//limpiarSincronizaDatos();




					
				});
				},errorCB,successCB);
			});

		}
		/*Sincronizacion Clientes STEP 3*/
		function sincronizarClientes(){
			$('#theProgress').width("75%");
			$("#txtSincro").html('<i>(1/2)Sincronizando Clientes</i>');
				var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
					tx.executeSql('SELECT * FROM CLIENTES',[],function(tx,results){
					jsonClientesLocal='{ "JsonClientes" : [ ';
						for (var i=0; i <= results.rows.length-1; i++){
								var row = results.rows.item(i);
								var nombre = row.nombre;
								var cedula = row.cedula;
								var email = row.email;
								var telefono = row.telefono;
								var timespan = row.timespan;
								var direccion = row.direccion;
								jsonClientesLocal+=' { "timespan" : "'+timespan+'" , "nombre" : "'+nombre+'" , "cedula" : "'+cedula+'" , "email" : "'+email+'" , "telefono" : "'+telefono+'", "direccion" : "'+direccion+'"  },';
								}
								jsonClientesLocal= jsonClientesLocal.substring(0,jsonClientesLocal.length-1);
								jsonClientesLocal +=']}';
								$("#JSONclientesLocal").html(jsonClientesLocal);
								compararJsonLocalClientes(jsonClientesLocal);
								//$("#JSONclientesLocal").html();
					});
				},errorCB,successCB);
		}
		
		
		var arrayFaltanteClienteLocal= new Array();
		function compararJsonLocalClientes(json){
		 objLocal=$.parseJSON(json);
		 jsonNube=$("#JSONclientesNube").text();
		 objNube=$.parseJSON(jsonNube);
		 
		 for(j=0; j<= (objLocal.JsonClientes.length-1); j++){
			element=objLocal.JsonClientes[j];
			currentClientLocal=element.timespan;
			currentClientLocal.cedula
			if(currentClientLocal.cedula == '9999999999999'){
				
				currentClientLocal=-1	;
			} 

			var matchClient=false;
			var  matchClientCedula=false;
			for( k=0;k<=(objNube.Clientes.length -1); k++){
				currentClientNube = objNube.Clientes[k].timespan;

				if(currentClientLocal == currentClientNube){
					
					matchClient=true;
				}
			}
			
			if(matchClient==false){
				
				arrayFaltanteClienteLocal[arrayFaltanteClienteLocal.length] = currentClientLocal;
				console.log(arrayFaltanteClienteLocal);
				
			}
		 }
		 
		 agregarClientesFaltanteLocal();
		}
		var contFaltanteClienteLocal=-1;
		function agregarClientesFaltanteLocal(){
			contFaltanteClienteLocal++;
			if(contFaltanteClienteLocal > (arrayFaltanteClienteLocal.length-1) ){
			compararJsonNubeClientes();
			
			contFaltanteClienteLocal=-1;
			return;
			}
			if(arrayFaltanteClienteLocal.length!=-1){
				/*Json Detect Element of array*/
				var nombre='';var email=''; var telefono='';var cedula='';
				var currentClientPost=arrayFaltanteClienteLocal[contFaltanteClienteLocal];
				 objLocal=$.parseJSON($("#JSONclientesLocal").text());
				for(j=0; j<= (objLocal.JsonClientes.length-1); j++){
					element=objLocal.JsonClientes[j];
					currentClientLocal=element.timespan;
					if(currentClientLocal == currentClientPost ){
						nombre = element.nombre;
						email = element.email;
						cedula = element.cedula;
						telefono = element.telefono;
						direccion = element.direccion;
						
					}
				}
				
				
				
				
				$.post('https://www.practisis.net/nubeposboot/www/ajax/addNewClient.php', { 
					dbID : empresa ,
					nombre : nombre,
					timespan : currentClientLocal,
					email : email,
					telefono : telefono,
					cedula : cedula,
					direccion : direccion
					}).done(function(data){
					
					agregarClientesFaltanteLocal();
				});
			}
			
		}
		var arrayClientesFaltanteNube=new Array();
		function compararJsonNubeClientes(){
			 objLocal=$.parseJSON($("#JSONclientesLocal").text());
			 objNube=$.parseJSON($("#JSONclientesNube").text());
			 for(i=0; i<= (objNube.Clientes.length-1); i++ ) {
				match=false;
				//matchCedula=false;
				currentClientNube=  objNube.Clientes[i].timespan;
				currentClientNubeCedula=  objNube.Clientes[i].cedula;
				for(j=0; j<= (objLocal.JsonClientes.length-1); j++ ) {
					currentClientLocal=objLocal.JsonClientes[j].timespan;
					currentClientLocalCedula=objLocal.JsonClientes[j].cedula;
					if( currentClientNube == currentClientLocal ) {match=true; }
				//	if( currentClientLocalCedula == currentClientNubeCedula){matchCedula=true;}
					
				}
				
				if(!match){
				
					arrayClientesFaltanteNube[arrayClientesFaltanteNube.length]=i;
					console.log( currentClientNube + ">Falta Cliente nube" );
				}
				
			 }
			 agregarClientesFaltanteNube();
		}
		
	

		var contFaltanteClienteNube=-1;
		var rebelTimeSpan=0;

		function limpiarSincronizaDatos(){
			$.post(apiURL, { idBarraSync : idBarraSync,  id_barra : id_barra , id_emp : empresa , KeyRequest : "limpiarSincronizaDatos"  }).done(function(data){
				console.log("Fin sincronizacion Limpio?");
			 
				envia("cloud");
			});
		}
		function agregarClientesFaltanteNube(){
			contFaltanteClienteNube++;
			if(contFaltanteClienteNube > (arrayClientesFaltanteNube.length-1) ){

				
				$("#theProgress").width("100%");
				sincronizaPresupuesto();
			
				
				//envia("cloud");
				return;
			}


			
			
			
			
				var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
				currentIndex= arrayClientesFaltanteNube[contFaltanteClienteNube] ;
				objNube=$.parseJSON($("#JSONclientesNube").text());
				for(i=0; i<= (objNube.Clientes.length-1); i++ ) {
					match=false;
					currentClientNube=  objNube.Clientes[i].timespan;
					if(i==currentIndex){
					
					nombre = objNube.Clientes[i].nombre;
					cedula = objNube.Clientes[i].cedula;
					telefono = objNube.Clientes[i].telefono;
					direccion = objNube.Clientes[i].direccion;
					email = objNube.Clientes[i].email;
					if(currentClientNube != '') {
						timespan = currentClientNube; 
						console.log("con timespan>>" + nombre + "<<" + timespan);
						rebelTimeSpan=timespan;
						}else{
						 timespan = getTimeSpan();
						 rebelTimeSpan = timespan;
						 console.log("Sin timespan>>" + nombre + "<<" + timespan );
					}
					idCliente= objNube.Clientes[i].id;
					}
				}
					
				
								tx.executeSql('INSERT INTO CLIENTES (nombre,cedula,telefono,direccion,email,timespan,existe) VALUES(?,?,?,?,?,?,?) ',[nombre,cedula,telefono,direccion,email,rebelTimeSpan,0],function(tx,results){
								
												$.post('https://www.practisis.net/nubeposboot/www/ajax/updateClient.php', { 
													dbID : empresa ,
													nombre : nombre,
													timespan : rebelTimeSpan,
													idCliente : idCliente
													}).done(function(data){
													
														agregarClientesFaltanteNube();
													});
												
												
										});
									},errorCB,successCB);
									
			
			
		}
		
		/*Fin Sincronizacion Clientes STEP 3*/
		
		/*SINCRONIZAR TABLA PRESUPUESTOS*/

		function sincronizaPresupuesto(){
			
				$.post('http://practisis.net/practipos2/ajax/apiSincronizador/apiSincronizaNubeposPresupuesto.php',{
							 empresa : empresa
						}).done(function(data){
							console.log(data);
							
							json=$.parseJSON(data);
							if(json.Presupuesto[0].error){
								console.log("no presupuesto");
							}
							var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
							db.transaction(function(tx){
							tx.executeSql("DELETE FROM PRESUPUESTO",[],function(tx,results){
																				
										});
							},errorCB,successCB);		
							for(i=0;i<=json.Presupuesto.length-1;i++){
								id=json.Presupuesto[i].id ;
								valor=json.Presupuesto[i].valor ;
								transacciones=json.Presupuesto[i].transacciones ;
								fecha=json.Presupuesto[i].fecha ;
								idlocal=json.Presupuesto[i].idlocal ;
					db.transaction(function(tx){
										tx.executeSql('INSERT INTO PRESUPUESTO(timespan,valor,fecha,transacciones) VALUES("'+id+'",'+valor+','+fecha+','+transacciones+')',[],function(tx,results){
										
										});
									},errorCB,successCB);

							}
							
						
							if(yaConectado){
								syncLocal();

							}else{
								limpiarSincronizaDatos();	
							}
						});
			
			

			
		}
		var globalLocalCategory=0;
		var ContGlobalLocalCategory=0;
		function syncLocal(){
			$("#theProgress").removeClass();
			$("#theProgress").attr("class" , "progress-bar progress-bar-success progress-bar-striped");
			$("#theProgress").css("width" ,  "0%");
				var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
				tx.executeSql('SELECT * FROM CATEGORIAS WHERE sincronizar="true"',[],function(tx,results){
						globalLocalCategory=results.rows.length;
						$("#txtSincro").html("<i style='color:green'> (2/2) Sincronizando Datos Locales</i>");
						if(globalLocalCategory){
								for (var i=0; i <= results.rows.length-1; i++){
									var row = results.rows.item(i);
									var idCat = row.id;
									var timeSpan = row.timespan;
									var categoria = row.categoria;
									var activo = row.activo;
									var existe = row.existe;
									json=' { "id" : "'+idCat+'" , "timeSpan" : "'+timeSpan+'" , "categoria" : "'+categoria+'" , "activo" : "'+activo+'"  }';
									$.post(apiURL,{ 
										 KeyRequest : "UpdateOrCreate" , 
										 type : "Category", 
										 empresa : empresa, 
										 id_barra : id_barra , 
										 barra_arriba : barra_arriba , 
										 idBarraSync : barra_arriba,
										 json : json }).done(function(data){
										 	console.log(data);
										 	ContGlobalLocalCategory++;
										 	if(ContGlobalLocalCategory==globalLocalCategory){
										 		//sincronizarProductosLocales();
										 		//alert("Pausa y volvemos!");
										 	}
										 	prc=( 12.5 / globalLocalCategory  ) * (ContGlobalLocalCategory +1) ;
											$("#theProgress").css("width" , (12.5 + prc )+ "%");
										 });
									
								}
							}else{
								$("#theProgress").css("width" , "25%");
								sincronizarProductosLocales();
							}
					},errorCB ,successCB);
					});
		}
		var contGlobalLocalProduct=0;
		var lenGlobalLocalProduct=0;
		function sincronizarProductosLocales(){
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
				tx.executeSql('SELECT * FROM PRODUCTOS WHERE sincronizar="true"',[],function(tx,results){
						lenGlobalLocalProduct=results.rows.length;
						$("#txtSincro").html("<i style='color:green'> (2/2) Sincronizando Datos Locales</i>");
						$("#theProgress").css("width" ,"50%");
						if(results.rows.length){
								for (var i=0; i <= results.rows.length-1; i++){
										var row = results.rows.item(i);
										formulado=row.formulado;
										timespan=row.timespan;
										codigo=row.codigo;
										precio=row.precio;
										cargaiva=row.cargaiva;
										categoriaid=row.categoriaid;
										productofinal=row.productofinal;
										materiaprima=row.materiaprima;

										json='{  "id" : "'+row.id+'" , "formulado" : "'+formulado+'" , "timespan" : "'+timespan+'" , "codigo" : "'+codigo+'" , "precio" : "'+precio+'" , "cargaiva" : "'+cargaiva+'" , "categoriaid" : "'+categoriaid+'" , "productofinal" : "'+productofinal+'" , "materiaprima" : "'+materiaprima+'"}';

										tx.executeSql('UPDATE PRODUCTOS SET sincronizar="false" WHERE timespan='+timespan ,[],function(tx,results){
											$.post(apiURL,{ 
										 KeyRequest : "UpdateOrCreate" , 
										 type : "Productos", 
										 empresa : empresa, 
										 id_barra : id_barra , 
										 barra_arriba : barra_arriba , 
										 idBarraSync : barra_arriba,
										 json : json }).done(function(data){
										 	console.log(data);
										 	console.log(data);
										 	contGlobalLocalProduct++;
										 	prc=( 50 / globalLocalCategory  ) * (ContGlobalLocalCategory +1) ;
											$("#theProgress").css("width" , (50 + prc )+ "%");
											if(contGlobalLocalProduct==lenGlobalLocalProduct){
										 		
										 		$("#theProgress").css("width" , "75%");
										 		
										 		sincronizarClientesLocales();
										 	}

										 });

										},errorCB ,successCB);

								}
							}else{
								//alert("No changes");

									$("#theProgress").css("width" , "75%");

									sincronizarClientesLocales();
							}
					},errorCB ,successCB);
					});

		}

		var lenGlobalLocalClient=0;
		var GlobalLocalClient=0;
		function sincronizarClientesLocales(){
			$("#theProgress").css("width" , "100%");
			

			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
				tx.executeSql('SELECT * FROM CLIENTES WHERE sincronizar="true"',[],function(tx,results){
						lenGlobalLocalClient=results.rows.length;
						$("#txtSincro").html("<i style='color:green'> (2/2) Sincronizando Datos Locales</i>");
						$("#theProgress").css("width" ,"50%");
						if(results.rows.length){
							
								for (var i=0; i <= results.rows.length-1; i++){
										var row = results.rows.item(i);
										formulado=row.formulado;
										timespan=row.timespan;
										cedula=row.cedula;
										
										nombre=row.nombre;
										json='{  "id" : "'+row.id+'" , "cedula" : "'+cedula+'" , "nombre" : "'+nombre+'"  , "email" : "'+row.email+'" , "direccion" : "'+row.direccion+'" , "telefono" : "'+row.telefono+'" }';
										tx.executeSql('UPDATE CLIENTES SET sincronizar="false" WHERE cedula='+cedula ,[],function(tx,results){
											$.post(apiURL,{ 
										 KeyRequest : "UpdateOrCreate" , 
										 type : "Clientes", 
										 empresa : empresa, 
										 id_barra : id_barra , 
										 barra_arriba : barra_arriba , 
										 idBarraSync : barra_arriba,
										 json : json }).done(function(data){
										 	//alert(data);
										 	obj=$.parseJSON(data);
										 	idSync=obj.response;
										 	cedulaSync=obj.cedula;
										 	
										 	
										 	db.transaction(function(tx2){
										 	tx2.executeSql('UPDATE CLIENTES SET sincronizar="false", timespan="'+idSync+'" WHERE cedula='+cedula ,[],function(tx2,results){

										 		},errorCB ,successCB);
										 	});

										 	GlobalLocalClient++;
										 	
										 	prc=( 50 / lenGlobalLocalClient ) * (GlobalLocalClient +1) ;
											$("#theProgress").css("width" , (75 + prc )+ "%");
											if(contGlobalLocalProduct==lenGlobalLocalProduct){
										 		
										 		$("#theProgress").css("width" , "100%");
										 		envia("cloud");
										 		
										 		//sincronizarClientesLocales();
										 	}

										 });

										},errorCB ,successCB);

								}
							}else{
									$("#theProgress").css("width" , "100%");
									envia("cloud");
							}
					},errorCB ,successCB);
					});



		}



		function agregarCategoriasFalatantesNube(){
			globalContCatFaltantesNube++;
			if(globalContCatFaltantesNube > (arrayCategoriasFaltantesNube.length-1) ){
			
			/*Go to section 2*/
			//alert("end of bucle");
			sincronizarFacturas();
			}else{
				
				txt= arrayCategoriasFaltantesNube[globalContCatFaltantesNube] ;
				exp=txt.split("|");
				categoria=exp[0];
				//alert(categoria);
				idReal=exp[1];
				var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
										tx.executeSql('INSERT INTO CATEGORIAS(categoria,existe,activo,timespan,sincronizar) VALUES("'+categoria+'",1,1,'+idReal+',"false")',[],function(tx,results){
										console.log("prod:"+results.insertId);
											agregarCategoriasFalatantesNube(); //sincronizaProductoNube();
											//  alert("InsertadoProdoucto>>" + formulado );
										});
									},errorCB,successCB);
									
				
			}
		
		}
		
		
		var globalCategoriasUpdate=-1;
		var currentIDCatLocal=-1;
		var currentIDCatNube=-1;
		function actualizarCategoriasID(){
			globalCategoriasUpdate++;
			if(globalCategoriasUpdate > (arrayFaltanteCategoryLocal.length-1) ){
				//alert("fin del bucle" + arrayFaltanteCategoryLocal.length );
				/*Sincronizar de nube a local*/
				validarJsonCategoriasNube();
				
				
			}else{
				currentUpdate=arrayFaltanteCategoryLocal[globalCategoriasUpdate];
				//alert("custom: " + currentUpdate + ">>" + arrayFaltanteCategoryLocal.length);
				exp=currentUpdate.split("|");
				currentIDCatLocal=exp[0];
				currentIDCatNube=exp[1];
				//alert("Cambiar timespan Abajo" + idLocal + " por id Arriba " + idNube);
				
				
					var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
						db.transaction(function(tx){
						tx.executeSql("UPDATE CATEGORIAS SET timespan=? WHERE id=?;",[currentIDCatNube,currentIDCatLocal],function(tx,results){
							/*tx.executeSql("UPDATE PRODUCTOS SET categoriaid=? WHERE categoriaid=?;",[currentIDCatLocal,currentIDCatNube],function(tx,results){
								
							});*/
							actualizarCategoriasID();
							
						});
						

						},errorCB ,successCB);
						
			}
				
		
		}
		
		///x.executeSql("UPDATE FACTURAS SET paymentsUsed=?,cash=?,cards=?,cheques=?,vauleCxC=? WHERE id=?;",[cadenapago,efectivo,tarjetas,cheques,cc,miid],function(tx,results){
	
		
		function muestraJSONLOCALCategorias (){

		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
			tx.executeSql('SELECT * FROM CATEGORIAS',[],function(tx,results){
					$("#JSONCategoriasLocal").html(' { "Categorias" :  [ ');
					txt='';
								for (var i=0; i <= results.rows.length-1; i++){
									var row = results.rows.item(i);
									var idCat = row.id;
									var timeSpan = row.timespan;
									var categoria = row.categoria;
									var activo = row.activo;
									var existe = row.existe;
									txt+='{  "id" : "'+idCat+'" ,  "categoria" : "'+categoria+'" ,  "activo" : "'+activo+'" ,  "existe" : "'+existe+'" ,  "timespan" : "'+timeSpan+'"  },';
									//$("#JSONCategoriasLocal").append(txt);
								}
								txt=txt.substring(0,txt.length-1);
								$("#JSONCategoriasLocal").append(txt+" ]}");
								validarJsonCategorias();
			},errorCB ,successCB);
		});
		
		}
		
		
		
		
		
		
		
		
		
		