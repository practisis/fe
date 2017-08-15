//inicio nuevo
var procesocount=0;
var yaesta=false;

function SyncStart(){
	console.log("entra syncstart");
	var idbarra = localStorage.getItem('idbarra');
	var categoriasya = localStorage.getItem('categoriasya');
	var productosya = localStorage.getItem('productosya');
	var clientesya = localStorage.getItem('clientesya');
	var presupuestoya = localStorage.getItem('presupuestoya');
	var menucategoriasya = localStorage.getItem('menucategoriasya');
	var menuya = localStorage.getItem('menuya');
	var permisosya = localStorage.getItem('permisosya');
	var mesasya = localStorage.getItem('mesasya');
    var localesya = localStorage.getItem('localesya');

	//setea el session storage de la mesa
	sessionStorage.setItem("mesa_activa","");
	//
	
	console.log(clientesya+'*'+productosya+'*'+categoriasya+'*'+presupuestoya+'*'+menucategoriasya+'*'+menuya+'*'+permisosya+'*'+idbarra+'*'+mesasya+'*'+localesya);
	if((clientesya||productosya||categoriasya||presupuestoya||menucategoriasya||menuya||permisosya||idbarra||mesasya)&&localesya==false){
		//envia('cloud');
		//envia('config');
		localStorage.setItem("idioma",2);
		//$('.navbar').slideDown();
	}
	if(localesya){
		//$('#fadeRow,#demoGratis').css("display","none");
		$('#demoGratis').css("display","none");
		yaesta=true;
		//$('.navbar').slideDown();
		//envia('puntodeventa');
		//Init31();
		if(localStorage.getItem('id_version_nube')!='0'&&localStorage.getItem('id_version_nube')!=null&&localStorage.getItem('telefono_inte')!=''&&localStorage.getItem('telefono_inte')!=null&&localStorage.getItem('id_locales')!='0'&&localStorage.getItem('id_locales')!=null&&localStorage.getItem('terminos')!='false'&&localStorage.getItem('terminos')!=null){
			if($(window).width()>900)
				$('.navbar').slideDown();
			else
				$('#barraalternamovil').slideDown();
			
			//alert("va por aqui");
			setTimeout(function(){envia('puntodeventa')},3000);
			
		}else{
			envia('config');
		}
			
		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
		db.transaction(function(tx){
			tx.executeSql('SELECT count(*) as cp FROM PRODUCTOS WHERE id_local !=-1',[],function(tx,results){
				if(results.rows.item(0).cp==0||results.rows.item(0).cp==null){
					//LaunchBoarding();
				}
			});

			tx.executeSql('SELECT nombre,direccion,telefono from config WHERE id=1',[],function(tx,results){
				var dataemp=results.rows.item(0);
				$('#JSONempresaLocal').html('"empresa":{'+'"nombre":"'+dataemp.nombre+'","direccion":"'+dataemp.direccion+"-"+dataemp.telefono+'"},');
			});
		});
		setTimeout(function(){SincronizadorNormal();},120000);
		//setInterval(function(){SincronizadorNormal();},3000);
	}else if(mesasya){
		ExtraeDatosApi(9);
	}else if(permisosya){
		ExtraeDatosApi(8);
	}else if(menuya){
		ExtraeDatosApi(7);
	}else if(menucategoriasya){
		ExtraeDatosApi(6);
	}else if(presupuestoya){
		ExtraeDatosApi(5);
	}else if(clientesya){
		ExtraeDatosApi(4);
	}else if(productosya){
		ExtraeDatosApi(3);
	}else if(categoriasya){
		ExtraeDatosApi(2);
	}else if(idbarra){
		//alert('quemado');
		DatosIniciales(1);
	}else{
		ExtraeDatosApi(0);
	}
}

function ExtraeDatosApi(donde){
	console.log("saca datos del api"+donde);
	if(donde==0){
		localStorage.setItem("idioma",2);
		//envia('cloud');
		envia('config');
	}else if(donde==1){
		console.log("Datos API 1: Categorias");
		//$(".navbar").slideUp();
		//$("#demoGratis,#fadeRow,#finalizado").css("display","none");
		$("#demoGratis,#finalizado").css("display","none");
		$("#contentStepSincro,#cuentaactiva,#mensajeperso").fadeIn();
		$("#txtSincro").html("0%");
		var jsoncateg=JSON.parse($('#JSONCategoriasNube').html());
		var jsoncategorias=jsoncateg.Categorias;
		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
			db.transaction(function(tx){
				tx.executeSql('delete from categorias',[],function(tx,results){});
				tx.executeSql("delete from sqlite_sequence where name='CATEGORIAS'",[],function(tx,results){});
				
			for(var n=0;n<jsoncategorias.length;n++){
				var item=jsoncategorias[n];
				var timeSpanCat=getTimeSpan();
				tx.executeSql("INSERT OR IGNORE INTO CATEGORIAS(categoria,activo,existe,timespan,sincronizar)values('"+item.categoria_nombre+"','1','1','"+item.categoria_timespan+"','false');",[],function(tx,results){
					console.log("insertada categ:"+results.insertId);
				});
			}
			},errorCB,function(){
				localStorage.setItem("categoriasya",true);
				$("#theProgress").css("width" , "15%");
				ExtraeDatosApi(2);
			});
			
	}else if(donde==2){
		console.log("Datos API 2: Productos y Agregados");
		//$(".navbar").slideUp();
		$("#demoGratis").css("display","none");
		$("#contentStepSincro").fadeIn();
		$("#txtSincro").html("15%");
		
		/*Agregar modificadores*/
		var jsonmodif=JSON.parse($('#JSONModifNube').html());
		var jsonmodificadores=jsonmodif.modificadores;
		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
			db.transaction(function(tx){
				tx.executeSql('delete from MODIFICADORES',[],function(tx,results){});
				tx.executeSql("delete from sqlite_sequence where name='MODIFICADORES'",[],function(tx,results){});
			for(var n=0;n<jsonmodificadores.length;n++){
				var item=jsonmodificadores[n];		
				tx.executeSql('INSERT OR IGNORE INTO MODIFICADORES(no_modificador,id_formulado,nombre,valor,id_formulado_descuento,activo,timespan) VALUES('+item.no_modif+', "'+item.id_formulado+'" ,"'+item.nombre+'",'+item.valor+',"'+item.id_form_desc+'","'+item.activo+'","'+item.timespan+'")',[],function(tx,resultsm){
				console.log("insertado producto:"+resultsm.insertId);
				});
			}
			},errorCB,successCB);
		/*FIN MODIFICADORES*/
		
		var jsonprod=JSON.parse($('#JSONproductosNube').html());
		var jsonproductos=jsonprod.Productos;
		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
			db.transaction(function(tx){
				tx.executeSql('delete from productos',[],function(tx,results){});
				tx.executeSql("delete from sqlite_sequence where name='PRODUCTOS'",[],function(tx,results){});
			for(var n=0;n<jsonproductos.length;n++){
				var item=jsonproductos[n];
				tx.executeSql('INSERT OR IGNORE INTO PRODUCTOS(formulado,codigo,precio,categoriaid,cargaiva,productofinal,materiaprima,timespan,servicio,sincronizar,color,estado,tieneimpuestos) VALUES("'+item.formulado_nombre+'", "'+item.formulado_codigo+'" ,'+item.formulado_precio+','+item.categoria_timespan+','+item.cargaiva+','+item.formulado_productofinal+','+item.formulado_matprima+',"'+item.formulado_timespan+'",'+item.carga_servicio+',"false","'+item.color+'",'+item.activo+',"'+item.tieneimpuestos+'")',[],function(tx,results){
				console.log("insertado producto:"+results.insertId);
				});
			}
			},errorCB,function(){
				localStorage.setItem("productosya",true);
				$("#theProgress").css("width" , "30%");
				ExtraeDatosApi(3);
			});
		
	}else if(donde==3){
		console.log("Datos API 3: Clientes");
		//$(".navbar").slideUp();
		$("#demoGratis").css("display","none");
		$("#contentStepSincro").fadeIn();
		$("#txtSincro").html("30%");
		var jsoncli=JSON.parse($('#JSONclientesNube').html());
		//{"Clientes":[{"id":"1","nombre":" Consumidor Final","cedula":"9999999999999","telefono":"","direccion":"","email":"","timespan" : "0"}]}
		var jsonclientes=jsoncli.Clientes;
		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
			db.transaction(function(tx){
			tx.executeSql('delete from clientes',[],function(tx,results){});
			tx.executeSql("delete from sqlite_sequence where name='CLIENTES'",[],function(tx,results){});
			for(var n=0;n<jsonclientes.length;n++){
				var item=jsonclientes[n];
				var cupo=0;
				if(item.cupo!=null)
					cupo=item.cupo;
				tx.executeSql('INSERT OR IGNORE INTO CLIENTES(nombre,cedula,email,direccion,telefono,sincronizar,existe,timespan,cupo) VALUES("'+item.nombre+'" , "'+item.cedula+'" , "'+item.email+'" , "'+item.direccion+'" ,  "'+item.telefono+'" ,  "false" , "0" , "0",'+cupo+')',[],function(tx,results){
				console.log("insertado cliente:"+results.insertId);
				});
			}
			},errorCB,function(){
				localStorage.setItem("clientesya",true);
				$("#theProgress").css("width" , "45%");
				ExtraeDatosApi(4);
			});
	}else if(donde==4){
		console.log("Datos API 4: Presupuesto");
		//$(".navbar").slideUp();
		$("#demoGratis").css("display","none");
		$("#contentStepSincro").fadeIn();
		$("#txtSincro").html("45%");
		var jsonpres=JSON.parse($('#JSONpresupuestoNube').html());
		var jsonpresupuestos=jsonpres.presupuesto;
		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
		db.transaction(function(tx){
				tx.executeSql('delete from presupuesto',[],function(tx,results){});
				tx.executeSql("delete from sqlite_sequence where name='PRESUPUESTO'",[],function(tx,results){});
				for(var n=0;n<jsonpresupuestos.length;n++){
					var item=jsonpresupuestos[n];
					tx.executeSql('INSERT OR IGNORE INTO PRESUPUESTO(timespan,valor,fecha,transacciones) VALUES("'+item.timespan+'",'+item.valor+','+item.fecha+','+item.transacciones+')',[],function(tx,results){
					console.log("insertado presupuesto:"+results.insertId);
					});
				}
		},errorCB,function(){
				localStorage.setItem("presupuestoya",true);
				$("#theProgress").css("width" , "60%");
				ExtraeDatosApi(5);
		});
	}else if(donde==5){
		console.log("Datos API 5: Categorias Menu");
		//$(".navbar").slideUp();
		$("#demoGratis").css("display","none");
		$("#contentStepSincro").fadeIn();
		$("#txtSincro").html("60%");
		var jsonpres=JSON.parse($('#JSONCatMenuNube').html());
		var jsonpresupuestos=jsonpres.menucategorias;
		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
		db.transaction(function(tx){
				tx.executeSql('delete from MENU_CATEGORIAS',[],function(tx,results){});
				tx.executeSql("delete from sqlite_sequence where name='MENU_CATEGORIAS'",[],function(tx,results){});
				for(var n=0;n<jsonpresupuestos.length;n++){
					var item=jsonpresupuestos[n];
					tx.executeSql('INSERT OR IGNORE INTO MENU_CATEGORIAS(orden,nombre,timespan,activo)VALUES('+item.orden+',"'+item.nombre+'","'+item.timespan+'","'+item.activo+'")',[],function(tx,results){
					console.log("insertada Categoria Menu:"+results.insertId);
					});
				}
		},errorCB,function(){
				localStorage.setItem("menucategoriasya",true);
				$("#theProgress").css("width" , "85%");
				ExtraeDatosApi(6);
		});
	}else if(donde==6){
		console.log("Datos API 6: Menu");
		//$(".navbar").slideUp();
		$("#demoGratis").css("display","none");
		$("#contentStepSincro").fadeIn();
		$("#txtSincro").html("85%");
		var jsonpres=JSON.parse($('#JSONMenuNube').html());
		var jsonpresupuestos=jsonpres.menu;
		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
		db.transaction(function(tx){
				tx.executeSql('delete from MENU',[],function(tx,results){});
				tx.executeSql("delete from sqlite_sequence where name='MENU'",[],function(tx,results){});
				for(var n=0;n<jsonpresupuestos.length;n++){
					var item=jsonpresupuestos[n];
					
					//tx.executeSql('INSERT INTO MENU (fila,columna,idcatmenu,idproducto,timespan,activo) VALUES('+(parseInt(item.fila)+1)+','+item.columna+',"'+item.idcatmenu+'","'+item.idproducto+'","'+item.timespan+'","'+item.activo+'")',[],function(tx,results){
					tx.executeSql('INSERT INTO MENU(fila,columna,idcatmenu,idproducto,timespan,activo,cant_max) SELECT '+(parseInt(item.fila)+1)+','+item.columna+',"'+item.idcatmenu+'","'+item.idproducto+'","'+item.timespan+'","'+item.activo+'","'+item.cant_max+'" WHERE NOT EXISTS(SELECT 1 FROM MENU WHERE timespan like "'+item.timespan+'")',[],function(tx,results){
							console.log("insertado producto menu inicio:"+results.insertId);
					});
					//console.log("insertado producto de menu:"+results.insertId);
					//});
				}
		},errorCB,function(){
				localStorage.setItem("menuya",true);
				$("#theProgress").css("width" , "95%");
				ExtraeDatosApi(7);
		});
	}else if(donde==7){
		console.log("Datos API 7: Permisos e impuestos");
		//$(".navbar").slideUp();
		$("#demoGratis").css("display","none");
		$("#contentStepSincro").fadeIn();
		$("#txtSincro").html("95%");
		//alert($('#JSONPermisosNube').html());
		
		/*json permisos extra*/
		if($('#JSONExtraNube').html()!=''){
			var jsonextra=JSON.parse($('#JSONExtraNube').html());
			var ext=jsonextra.extras;
			//console.log(ext[0]);
			localStorage.setItem("permisos",ext[0].contrasenia);
			localStorage.setItem("msj",ext[0].msj);
			localStorage.setItem("dias",ext[0].dias);
			localStorage.setItem("ultimafact",ext[0].num_factura);

			localStorage.setItem("sin_documento",ext[0].documento);
            localStorage.setItem("con_shop",ext[0].shop);
            localStorage.setItem("idioma",ext[0].idioma);
            localStorage.setItem("con_nombre_orden",ext[0].orden);
            localStorage.setItem("propina",ext[0].propina);
            localStorage.setItem("con_tarjeta",ext[0].tarjeta);
            localStorage.setItem("pais",ext[0].pais);
            localStorage.setItem("encabezado","3");
            localStorage.setItem("largo","18");
			
			localStorage.setItem("con_notas",ext[0].notas);
			localStorage.setItem("con_comandas",ext[0].comanderas);
			localStorage.setItem("con_mesas",ext[0].mesas);
			localStorage.setItem("logo",ext[0].logo);
			localStorage.setItem("imprimelogo",ext[0].imprlogo);
			localStorage.setItem("mensajefinal",ext[0].mensajefinal);
			localStorage.setItem("paquete",ext[0].plan);
			localStorage.setItem("impuestos_personalizados",ext[0].impuestos_personalizados);
			//localStorage.setItem("paquete","36");
			//localStorage.setItem("paquete","37");
			//localStorage.setItem("con_mesas",false);
            localStorage.setItem("con_localhost",ext[0].localhost);
            localStorage.setItem("ip_servidor",ext[0].ipservidor);
            localStorage.setItem("id_version_nube",ext[0].id_version_nube);
            localStorage.setItem("pide_telefono",ext[0].pide_telefono);
            localStorage.setItem("telefono_inte",ext[0].telefono_inte);
            localStorage.setItem("terminos",ext[0].terminos);
            localStorage.setItem("id_locales",ext[0].id_locales);
            localStorage.setItem("id_pais",ext[0].id_pais);
            localStorage.setItem("pagarconcredito",ext[0].pagarconcredito);      
			if(ext[0].aceptanc!=null){
				localStorage.setItem("feaceptanc",ext[0].aceptanc);
			}else{
				localStorage.setItem("feaceptanc",'false');
			}

            if(ext[0].id_version_nube == 4){
              localStorage.setItem("con_profesionales","true");

            var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
          	db.transaction(function(tx){

                tx.executeSql("INSERT OR IGNORE INTO CATEGORIAS(categoria,activo,existe,timespan,sincronizar)values('Personalizada','1','1','-14','true');",[],function(tx,results){
                	console.log("insertada categ:"+results.insertId);
                });

                tx.executeSql('INSERT OR IGNORE INTO PRODUCTOS(formulado,codigo,precio,categoriaid,cargaiva,productofinal,materiaprima,timespan,servicio,sincronizar,color,estado,tieneimpuestos) VALUES("Personalizado", "1414" ,0,-14,0,1,0,"-14",0,"true","",1,"true");',[],function(tx,results){
                  console.log("insertado producto personalizado"+results.insertId);
                });
              },errorCB,function(){
          	});

            }else{
              localStorage.setItem("con_profesionales","false");
            }

            var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
			db.transaction(function(tx){
              tx.executeSql('UPDATE CONFIG SET pais="'+ext[0].pais+'",id_idioma = "'+ext[0].idioma+'",sin_documento="'+ext[0].documento+'",con_nombre_orden="'+ext[0].orden+'",con_propina="'+ext[0].propina+'",con_tarjeta="'+ext[0].tarjeta+'",con_shop="'+ext[0].shop+'",ip_servidor="'+ext[0].ipservidor+'",con_mesas="'+ext[0].mesas+'",logo="'+ext[0].logo+'",id_version_nube="'+ext[0].id_version_nube+'",pide_telefono="'+ext[0].pide_telefono+'",telefono_inte="'+ext[0].telefono_inte+'",mensajefinal="'+ext[0].mensajefinal+'",terminos_condiciones="'+ext[0].terminos+'",id_locales="'+ext[0].id_locales+'",email_fact="'+ext[0].email_fact+'",key="'+ext[0].key+'",numero_contribuyente="'+ext[0].numero_contribuyente+'",obligado_contabilidad="'+ext[0].obligado_contabilidad+'",prueba_produccion="'+ext[0].prueba_produccion+'",tiene_factura_electronica="'+ext[0].tiene_factura_electronica+'",mensaje_factura="'+ext[0].msj_factura_electronica+'",respaldar="'+ext[0].respaldar+'",pagarconcredito="'+ext[0].pagarconcredito+'",impuestos_personalizados="'+ext[0].impuestos_personalizados+'" WHERE id=1',[],function(tx,results){

  				console.log("actualizada empresa permisos");
				if(ext[0].logo!=''&&ext[0].logo!=null){
					var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
					if ( app ) {
						if(ext[0].logo!=null&&ext[0].logo!=''&&ext[0].logo!="null")
							downloadImage(encodeURI("https://www.practisis.net/practipos2/logos/"+ext[0].logo),ext[0].logo);
					}
				}
				
  			  });
            },errorCB,successCB);
		}
		
		/*INSERTA IMPUESTOS*/
			if($('#JSONImpuestosNube').html()!=''){
				var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
				var jsonimp=JSON.parse($('#JSONImpuestosNube').html());
				var imp=jsonimp.impuestos;
				console.log(imp);
				//$('#idiva').html('0');
				for(var t in imp){
					var itemi=imp[t];
					
						tx.executeSql('INSERT OR IGNORE INTO IMPUESTOS (nombre,porcentaje,activo,timespan) values (?,?,?,?)',[itemi.nombre,itemi.porcentaje,itemi.activo,itemi.id],function(tx,results){
							console.log("Insertado impuesto: "+results.insertId);
							if($.trim(itemi.nombre.toLowerCase())=='iva')
								$('#idiva').html(itemi.id);
							
							if($('#impuesto-'+itemi.id).length==0){
								$('#taxes').append('<input id="impuesto-'+itemi.id+'" type="text" value="'+itemi.id+"|"+itemi.nombre+"|"+parseFloat((itemi.porcentaje)/100)+'">');
							}else{
								$("impuesto-"+itemi.id).val(itemi.id+"|"+itemi.nombre+"|"+parseFloat((itemi.porcentaje)/100));
							}
						});
				}
				},errorCB,function(){
					localStorage.setItem("permisosya",true);
					$("#theProgress").css("width" , "98%");
					ExtraeDatosApi(8);
				});
			}			
			/*FIN IMPUESTOS*/
	}else if(donde==8){

		console.log("Datos API 8: Mesas");
		//$(".navbar").slideUp();
		$("#demoGratis").css("display","none");
		$("#contentStepSincro").fadeIn();
		$("#txtSincro").html("98%");
		//alert($('#JSONPermisosNube').html());

		/*json tipos de mesa extra*/
		if($('#JSONTipoMesasNube').html()!=''){
			var jsontipomesa=JSON.parse($('#JSONTipoMesasNube').html());
			var jsontipodemesas=jsontipomesa.tipomesas;
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
			db.transaction(function(tx){
					tx.executeSql('delete from TIPO_MESA',[],function(tx,results){});
					tx.executeSql("delete from sqlite_sequence where name='TIPO_MESA'",[],function(tx,results){});
					for(var n=0;n<jsontipodemesas.length;n++){
						var item=jsontipodemesas[n];
						
						//tx.executeSql('INSERT INTO MENU (fila,columna,idcatmenu,idproducto,timespan,activo) VALUES('+(parseInt(item.fila)+1)+','+item.columna+',"'+item.idcatmenu+'","'+item.idproducto+'","'+item.timespan+'","'+item.activo+'")',[],function(tx,results){
						tx.executeSql('INSERT INTO TIPO_MESA(imagen_activa,imagen_inactiva,es_mesa,timespan) SELECT "'+item.imagen_activa+'","'+item.imagen_inactiva+'","'+item.es_mesa+'","'+item.id+'" WHERE NOT EXISTS(SELECT 1 FROM TIPO_MESA WHERE timespan like "'+item.id+'")',[],function(tx,results){
								console.log("insertado tipo de mesa inicio:"+results.insertId);
						});
						//console.log("insertado producto de menu:"+results.insertId);
						//});
					}
			},errorCB,successCB);
		}
		/**/
		
		/*json mesas*/
		if($('#JSONMesasNube').html()!=''){
			var jsonmesa=JSON.parse($('#JSONMesasNube').html());
			var jsondemesas=jsonmesa.mesas;
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
			db.transaction(function(tx){
					tx.executeSql('delete from MESAS',[],function(tx,results){});
					tx.executeSql("delete from sqlite_sequence where name='MESAS'",[],function(tx,results){});
					for(var n=0;n<jsondemesas.length;n++){
						var item=jsondemesas[n];
						
						//tx.executeSql('INSERT INTO MENU (fila,columna,idcatmenu,idproducto,timespan,activo) VALUES('+(parseInt(item.fila)+1)+','+item.columna+',"'+item.idcatmenu+'","'+item.idproducto+'","'+item.timespan+'","'+item.activo+'")',[],function(tx,results){
						tx.executeSql('INSERT INTO MESAS(left,top,id_tipomesa,activo,nombre,timespan,tab) SELECT '+item.left+','+item.top+',"'+item.tipo_mesa+'","'+item.activo+'","'+item.nombre+'","'+item.id+'","'+item.tab+'" WHERE NOT EXISTS(SELECT 1 FROM MESAS WHERE timespan like "'+item.id+'")',[],function(tx,results){
								console.log("insertado mesa inicio:"+results.insertId);
						});
						//console.log("insertado producto de menu:"+results.insertId);
						//});
					}
			},errorCB,function(){
                localStorage.setItem("mesasya",true);
				$("#theProgress").css("width" , "98%");
				ExtraeDatosApi(9);
			});
		}
		/**/

		
		}else if(donde==9){

		console.log("Datos API 9: Locales");
		$("#demoGratis").css("display","none");
		$("#contentStepSincro").fadeIn();
		$("#txtSincro").html("98%");

		/*json locales*/
		if($('#JSONLocales').html()!=''){
			var jsonlocales=JSON.parse($('#JSONLocales').html());
			var jsonlocalesd=jsonlocales.locales;
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
			db.transaction(function(tx){
					tx.executeSql('delete from LOCALES',[],function(tx,results){});
					tx.executeSql("delete from sqlite_sequence where name='LOCALES'",[],function(tx,results){});
					for(var n=0;n<jsonlocalesd.length;n++){
						var item=jsonlocalesd[n];

						tx.executeSql('INSERT INTO LOCALES(local,activo,timespan) SELECT "'+item.local+'","'+item.activo+'","'+item.timespan+'" WHERE NOT EXISTS(SELECT 1 FROM LOCALES WHERE timespan like "'+item.timespan+'")',[],function(tx,results){
								console.log("insertado locales inicio:"+results.insertId);
						});

					}
			},errorCB,function(){
				localStorage.setItem("localesya",true);
				$("#theProgress").css("width" , "100%");
				$("#txtSincro").html("100%");
				setTimeout(function(){
					$("#theProgress").css("width","0%");
					$("#txtSincro").html("");
				},1000);
				setTimeout(function(){SyncStart()},1500);
			});
		}
		/**/

		
		//evalua si se va a productos
		 if(localStorage.getItem("id_version_nube") == '0'||localStorage.getItem("id_version_nube") == null){
					$('#fadeRow').css('display','none');
					$('#cargandoTabs').modal('hide');
    	            //$('#version_escoje').fadeIn('slow');
					guardaversion('0');
                    //document.getElementById('main').style.display='none';
         }

         if(localStorage.getItem("id_version_nube") != '0' && localStorage.getItem("telefono_inte") == ''){
                    var paisuax = localStorage.getItem("pais");
                    if(paisuax != ''){
                      $('#paiswhat option:contains('+paisuax+')').attr('selected', 'selected');
                      ponerCodigoPais();
                    }
					$('#fadeRow').css('display','none');
					$('#cargandoTabs').modal('hide');
      	            $('#pide_telefono').fadeIn();
                    //document.getElementById('main').style.display='none';
         }

         if(localStorage.getItem("id_version_nube") != '0' && localStorage.getItem("telefono_inte") != '' && localStorage.getItem("id_locales") == '0'){
				$('#fadeRow').css('display','none');
				$('#cargandoTabs').modal('hide');
      	        $('#pide_local').fadeIn('slow');
                // document.getElementById('main').style.display='none';
                ListarLocales();
         }

		}
}

function SincronizadorNormal(){
	
	console.log("sincronizador normal");
	var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
	db.transaction(function(tx){tx.executeSql('insert into LOGACTIONS (time,descripcion) values (?,?)',[new Date().getTime(),"Ready to start the normal synchronizer"]);});
	procesocount=1;
	$('#fadeRow,#demoGratis,#finalizado').css("display","none");
	$('#contentStepSincro,#cuentaactiva,#mensajeperso').fadeIn();
	DatosRecurrentes(0);
}


function registrarUser(){
	if(VerificarConexion()){
		newEmpresa=$("#newEmpresa").val();
		newEmpresa=newEmpresa.replace(/ /g,"_");
		newPais=$("#newPais").val();
		nombrePais=$('#newPais option:selected').text();
		newEmail=$("#newEmail").val();
		newPass=$("#newPass").val();
		newConfirm=$("#newConfirm").val();
		newIdioma = $("#id_idioma").val();
		newRuc= $("#newRuc").val();
		var newTerminos = document.getElementById('terminos').checked;
		var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if(newEmpresa==''){
			if(localStorage.getItem("idioma")==1)
				showalertred('Debe ingresar el nombre de su negocio.');
			else if(localStorage.getItem("idioma")==2)
				showalertred('Please, enter a business name.');
			
			$("#newEmpresa").val('');
		 }else if(newPais=='' || newPais=='0'){
			if(localStorage.getItem("idioma")==1)
				showalertred('Debe ingresar su país para tu negocio.');
			else if(localStorage.getItem("idioma")==2)
				showalertred('Please, enter a country.');
		 }else if(newEmail=='' || !expr.test(newEmail)){
			if(localStorage.getItem("idioma")==1)
				showalertred('Debe ingresar un e-mail valido para su negocio.');
			else if(localStorage.getItem("idioma")==2)
				 showalertred('Enter a valid e-mail.');
			$("#newEmail").val('');
		 }else if(newConfirm != newPass){
			$("#cargandoTabs").modal('hide');
			if(localStorage.getItem("idioma")==1)
				showalertred('Las contraseñas son distintas.');
			else if(localStorage.getItem("idioma")==2)
				showalertred('The passwords are different.');
			$("#newPass").val('');
			$("#newConfirm").val('');
		 }else if(newTerminos == false){
			if(localStorage.getItem("idioma")==1)
				showalertred('Debe aceptar los términos y condiciones.');
			else if(localStorage.getItem("idioma")==2)
				 showalertred('You must accept the terms and conditions.');
		}else if(newRuc == ''||newRuc == null || !validarRucFE(newRuc)){
			if(localStorage.getItem("idioma")==1)
				showalertred('Debe ingresar un número de RUC válido para su negocio.');
			else if(localStorage.getItem("idioma")==2)
				 showalertred('You must input a valid RUC number.');
		}else{
			$("#cargandoTabs").modal('show');
			var nombre=newEmpresa;
			var celular='';
			var email=newEmail;
			var passw=newPass;
			var rpassw=newConfirm;
			var empresa=newEmpresa;
			var planPrecio=2;
			var nTerminales=1;
			var sistema=0;
			var franquicia=0;
			var pais=newPais;
			var ruc=newRuc;
			var versiones=7;
			var plan=0;
			var id_idioma = 1;
			var iddevice=$('#deviceid').html();
			localStorage.setItem('datosquemados',empresa+'|'+pais+'|'+nombrePais+'|'+id_idioma);
			//alert(iddevice+'/'+nombre+'/'+id_idioma+'/'+nombre);
			//$("#btnNewEmp").html('<img src="images/loader.gif"  width="50%" />');
			//$.post("https://practisis.net/registro/registroNubePOS.php", {
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
			db.transaction(function(tx){tx.executeSql('insert into LOGACTIONS (time,descripcion) values (?,?)',[new Date().getTime(),"Ready to send the new register post"]);});
			
			$.post("https://practisis.net/registro/registroFEmovil.php", {
				nombre : nombre,
				celular : celular,
				email :newEmail,
				pass : newPass,
				repass : newConfirm,
				empresa : empresa,
				planPrecio : planPrecio,
				nTerminales : nTerminales,
				sistema : sistema,
				pais : pais,
				franquicia : franquicia,
				versiones : versiones,
				id_idioma : newIdioma,
				terminos : newTerminos,
				ruc : newRuc,
				deviceid:iddevice
			}).done(function(data){
				//alert(data);
				if(data=='existe'){
						$("#cargandoTabs").modal('hide');
						if(localStorage.getItem("idioma")==1)
						showalertred('El correo o ruc ingresado ya existe en el sistema, vuelva a ingresarlos por favor.');
						else if(localStorage.getItem("idioma")==1)
						showalertred('The mail or ruc entered already exists in the system, please enter another.');
						$("#newEmail").val('');
						$("#newRuc").val('');
				}else{
						$("#cargandoTabs").modal('hide');
						var datosback=data.split("||");
						console.log(data);
						localStorage.setItem("userRegister", newEmail);
						localStorage.setItem("userPasswod", newPass);
						localStorage.setItem("empresa",datosback[0]);
						localStorage.setItem("idbarra",datosback[1]);
						var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
						db.transaction(iniciaDB,errorCB,function(){SetDataEmpresa(nombre,celular,newEmail,iddevice,datosback[1],'','','',false,pais);});
							
				}
				
				var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){tx.executeSql('insert into LOGACTIONS (time,descripcion) values (?,?)',[new Date().getTime(),"Get response at the new register post"]);});
				
			}).fail(function(xhr, status, error) {
				
				var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){tx.executeSql('insert into LOGACTIONS (time,descripcion,datos) values (?,?,?)',[new Date().getTime(),"Fail the peticion of the new register post",status]);});
				
				//console.log(xhr);
				console.log(status);
				//console.log(error);
				if(localStorage.getItem('idioma')==1)
					showalertred("Error: Problemas de conexión, por favor intente nuevamente.");
				else
					showalertred("Error: Connection Problems, please try again.");
				$("#cargandoTabs").modal('hide');
			});
		}
	}
}


function LaunchBoarding(){
	
	//alert($(window).width());
	if(parseInt($(window).width())<=900){
		$('#flechamenumovil').css('display','block');
		$('#flechamenu').css('display','none');
		$('#barraalternamovil').slideDown();
	}
	else{
		$('#flechamenu').css('display','block');
		$('#flechamenumovil').css('display','none');
		$('.navbar').slideDown();
	}
	$('#myDash').modal('show');
}

function SetDataEmpresa(nombre,celular,email,deviceid,id_barra_arriba,ruc,direccion,tablet,desde_login, pais){
	if(tablet==''){
		tablet='Tablet '+$('#devicemodel').html();
	}
	var db2 = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
	db2.transaction(
		function (tx){
			tx.executeSql('INSERT INTO CONFIG (nombre,razon,telefono,email,ruc2,direccion,nombreterminal,terminos_condiciones,pide_telefono,telefono_inte) VALUES(?,?,?,?,?,?,?,?,?,?)',[nombre,nombre,celular,email,ruc,direccion,tablet,'true','true','222222'],function(tx,res){
				$('#msjOk').html('Informacion Ingresada con Éxito');
				$('#msjOk').fadeIn('slow');
				$('#campos').css('display','none');
				setTimeout(function() {
					$('#msjOk').fadeOut('slow');
				}, 3000);
			});
				
		},errorCB,function(){$('#JSONempresaLocal').html('"empresa":{'+'"nombre":"'+nombre+'","direccion":"'+direccion+"-"+celular+'"},');});
		
	
	db2.transaction(
		function (tx2){
			tx2.executeSql("INSERT INTO empresa (nombre,nombreempresa,id_barra,barra_arriba) VALUES (?,?,?,?)",[nombre,nombre,deviceid,id_barra_arriba],
			function(tx2,res){
				if(!desde_login){
					//LaunchBoarding();
					//envia("dashboard");
					//envia("puntodeventa");
					StartQuemado();
					//SyncStart();
					$('#demoGratis').fadeOut();
            	    //$('#version_escoje').fadeIn('slow');
					guardaversion(pais);
					
				}else{
					/*tx2.executeSql('SELECT count(*) as cp FROM PRODUCTOS WHERE id_local !=-1 and estado=1',[],function(tx,results){
						if(results.rows.item(0).cp==0||results.rows.item(0).cp==null){
							//LaunchBoarding();
						}
					});*/
					//LaunchBoarding();
					
					/*alert(localStorage.getItem("id_version_nube"));
					
					if(localStorage.getItem("id_version_nube") != '0' && localStorage.getItem("telefono_inte") == ''){
					  var paisuax = localStorage.getItem("pais");
					  if(paisuax != ''){
						$('#paiswhat option:contains('+paisuax+')').attr('selected', 'selected');
						ponerCodigoPais();
					  }
						//envia('config');
						$('#pestanasconfig').fadeOut();
						$('#pide_telefono').fadeIn();
					   // document.getElementById('main').style.display='none';

					}

					if(localStorage.getItem("id_version_nube") != '0' && localStorage.getItem("telefono_inte") != '' && localStorage.getItem("id_locales") == '0'){
					  //envia('config');
					  $('#pestanasconfig').fadeOut();
					  $('#pide_local').fadeIn('slow');
					  //document.getElementById('main').style.display='none';
					}

					ListarLocales();

					if(localStorage.getItem("terminos") == 'false'){
						$('#terminos_condiciones').fadeIn('slow');
						//document.getElementById('main').style.display='none';
					}
							
					if(localStorage.getItem("id_version_nube") != '0'&&localStorage.getItem("id_version_nube") !=null){
						envia('puntodeventa');
						$('.navbar').slideDown();
					}else{
						$('#version_escoje').fadeIn();
					}*/
							//SyncStart();
				}
								
			});						
									
	},errorCB,successCB);
	
}


function UserLogin(){
	if(VerificarConexion()){
		var quien=$("#user2").val();
		var pass=$("#pass2").val();
		var iddevice=$('#deviceid').html();
		auxuser = quien;
		auxpass = pass;
		$('#btnvalida2').html("<img src='images/loader.gif' width='20px'/>");
		var apiURL='https://practisis.net/connectnubepos/api2.php';
		
		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
		db.transaction(function(tx){tx.executeSql('insert into LOGACTIONS (time,descripcion) values (?,?)',[new Date().getTime(),"Ready to send the login post"]);});
		
		$.post(apiURL,{action:"login", user : quien , pass : pass, deviceid : iddevice}).done(function(data){
			//alert(quien+'/'+pass+'/'+iddevice);
			//alert("responde");
			if(data=='error'){
				if(localStorage.getItem("idioma")==1)
					showalert('Los datos son incorrectos.');
				else if(localStorage.getItem("idioma")==2)
					showalert('Please, enter valid information.');
				 $('#btnvalida2').html("Login");
			}
			else{	
				var datosaux = data.split("||");

				if(datosaux[2] == '0'){

				  localStorage.setItem("userRegister", quien);
				  localStorage.setItem("userPasswod", pass);
				  localStorage.setItem("empresa",datosaux[0]);

				  if(localStorage.getItem("idioma")==1){
					showalertred('Su plan actual no permite tener más de un dispositivo activo.');
				  }else if(localStorage.getItem("idioma")==2){
					showalertred('Your current plan does not allow more than one active device.');
				  }

				  $('#fadeRow').fadeOut();
				  $('#noplan').fadeIn();

				}else{
					
					localStorage.setItem("userRegister", quien);
					localStorage.setItem("userPasswod", pass);
					localStorage.setItem("empresa",datosaux[0]);
					localStorage.setItem("idbarra",datosaux[2]);
					
					var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
					db.transaction(iniciaDB,errorCB,function(){SetDataEmpresa(datosaux[1],datosaux[3],quien,iddevice,datosaux[2],datosaux[4],datosaux[5],'',true,'0')});
					
					SyncStart();

					//alert(localStorage.getItem("id_version_nube"));
					//$('.navbar').slideDown();
					$('#btnvalida2').html("Login");
					$('#cargandoTabs').modal('show');
			  }
			  
				var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){tx.executeSql('insert into LOGACTIONS (time,descripcion) values (?,?)',[new Date().getTime(),"Get response at the login post"]);});
			}
			
		}).fail(function(xhr, status, error) {
			//console.log(xhr);
			console.log(status);
			//console.log(error);
			if(localStorage.getItem('idioma')==1)
				showalertred("Error: Problemas de conexión, por favor intente nuevamente.");
			else
				showalertred("Error: Connection Problems, please try again.");
			
			$('#btnvalida2').html("Login");
			
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
			db.transaction(function(tx){tx.executeSql('insert into LOGACTIONS (time,descripcion,datos) values (?,?,?)',[new Date().getTime(),"Fail the peticion of the login post",status]);});
		});
	}
}

function DatosIniciales(cual){
	if(VerificarConexion()){
		var apiURL='https://practisis.net/connectnubepos/api2.php';
		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
		db.transaction(function(tx){tx.executeSql('insert into LOGACTIONS (time,descripcion) values (?,?)',[new Date().getTime(),"Ready to send the initial data post"]);});
		
		$.post(apiURL,{
			id_emp: localStorage.getItem("empresa"),
			action: 'SincStart',
			id_barra: localStorage.getItem("idbarra"),
			deviceid:$("#deviceid").html()
		}).done(function(response){
			//sincronizacion inicial
			if(response!='block' && response!='Desactivado'){
				//$('.navbar').slideDown();
				
				var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){tx.executeSql('insert into LOGACTIONS (time,descripcion) values (?,?)',[new Date().getTime(),"Get response at the initial data post"]);});
				
				var arraydatos=JSON.parse(response);
				console.log(">>>>Iniciar >>>"+response);
				JSONproductosNube=arraydatos.productos;
				JSONcategoriasNube=arraydatos.categorias;
				JSONclientesNube=arraydatos.clientes;
				JSONpresupuestoNube=arraydatos.presupuestos;
				JSONcategoriasMenuNube=arraydatos.menucategorias;
				JSONmenuNube=arraydatos.menu;
				JSONpermisosNube=arraydatos.permisos;
				JSONextraNube=arraydatos.extras;
				JSONimpuestosNube=arraydatos.impuestos;
				JSONmodificadoresNube=arraydatos.modificadores;
				JSONpropinasNube=arraydatos.propinas;
				JSONTipoMesasNube=arraydatos.tipomesas;
				JSONMesasNube=arraydatos.mesas;
				JSONLocales=arraydatos.locales;
				//JSONTipoMesasNube='{"tipomesas":[{"id":"1","imagen_activa":"mesagrandeanchaa.png","imagen_inactiva":"mesagrandeanchai.png","es_mesa":"true"},	{"id":"2","imagen_activa":"mesagrandealtaa.png","imagen_inactiva":"mesagrandealtai.png","es_mesa":"true"}]}';
				
				//JSONMesasNube='{"mesas":[{"id":"1","left":"780","top":"120","tipo_mesa":"1","nombre":"Mesa 1","activo":"true"},{"id":"2","left":"100","top":"120","tipo_mesa":"2","nombre":"Mesa 2","activo":"true"}]}';
				
				
				//JSONmodificadoresNube=arraydatos.propinas;
				//JSONimpuestosNube='{"impuestos":[{"id":"1","nombre":"IVA","porcentaje":"12","activo":"true","timespan":"1245"},{"id":"2","nombre":"Servicio","porcentaje":"10","activo":"true","timespan":"1246"}]}';

				//JSONmodificadoresNube='{"modificadores":[{"id":"1","no_modif":"1","id_formulado":"708331454520391001","nombre":"Con Sal","valor":"0.15","activo":"true","id_form_desc":"0"},{"id":"2","no_modif":"1","id_formulado":"708331454520391001","nombre":"Con Sal2","valor":"0.15","activo":"true","id_form_desc":"0"},{"id":"3","no_modif":"1","id_formulado":"708331454520391001","nombre":"Con Sal3","valor":"0.15","activo":"true","id_form_desc":"0"},{"id":"4","no_modif":"1","id_formulado":"708331454520391001","nombre":"Con Sal4","valor":"0.15","activo":"true","id_form_desc":"0"},{"id":"5","no_modif":"1","id_formulado":"708331454520391001","nombre":"Con Sal5","valor":"0.15","activo":"true","id_form_desc":"0"},{"id":"6","no_modif":"1","id_formulado":"708331454520391001","nombre":"Con Sal6","valor":"0.15","activo":"true","id_form_desc":"0"},{"id":"7","no_modif":"1","id_formulado":"708331454520391001","nombre":"Con Sal7","valor":"0.15","activo":"true","id_form_desc":"0"},{"id":"8","no_modif":"1","id_formulado":"708331454520391001","nombre":"Con Sal8","valor":"0.15","activo":"true","id_form_desc":"0"},{"id":"2","no_modif":"2","id_formulado":"708331454520391001","nombre":"Con Limon","valor":"0.10","activo":"true","id_form_desc":"0"}]}';
				//console.log(JSONextraNube);
				
				$("#JSONclientesNube").html(JSONclientesNube);
				$("#JSONCategoriasNube").html(JSONcategoriasNube);
				$("#JSONproductosNube").html(JSONproductosNube);
				$("#JSONpresupuestoNube").html(JSONpresupuestoNube);
				$('#JSONCatMenuNube').html(JSONcategoriasMenuNube);
				$('#JSONMenuNube').html(JSONmenuNube);
				$('#JSONPermisosNube').html(JSONpermisosNube);
				$('#JSONExtraNube').html(JSONextraNube);
				$('#JSONImpuestosNube').html(JSONimpuestosNube);
				$('#JSONModifNube').html(JSONmodificadoresNube);
				$('#JSONPropinasNube').html(JSONpropinasNube);
				$('#JSONTipoMesasNube').html(JSONTipoMesasNube);
				$('#JSONMesasNube').html(JSONMesasNube);
				$('#JSONLocales').html(JSONLocales);
				ExtraeDatosApi(cual);
			}else if(response=='Desactivado'){
				//envia('cloud');
				envia('config');
				$('#myDash').modal('hide');
				setTimeout(function(){
					$('.navbar,#barraalternamovil').slideUp();
					$("#demoGratis,#fadeRow,#finalizado,#contentStepSincro,#cuentaactiva,#pestanasconfig,#version_escoje").css("display","none");
					$('#desactivo').fadeIn();
				},100);
			}else{
				//envia('cloud');
				envia('config');
				$('#myDash').modal('hide');
				setTimeout(function(){
					$('#linklogin,#linkloginb').attr("href","https://www.practisis.net/index3.php?rvpas="+localStorage.getItem("userPasswod")+"&rvus="+localStorage.getItem("userRegister"));
					$('.navbar,#barraalternamovil').slideUp();
					$("#demoGratis,#fadeRow,#finalizado,#contentStepSincro,#cuentaactiva,#pestanasconfig").css("display","none");
					$('#bloqueo').fadeIn();
				},100);
			}
		}).fail(function(xhr, status, error) {
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
			db.transaction(function(tx){tx.executeSql('insert into LOGACTIONS (time,descripcion,datos) values (?,?,?)',[new Date().getTime(),"Fail the peticion of the initial data post",status]);});
			console.log(status);
		});
	}
}

function DatosRecurrentes(cual){
  if(localStorage.getItem("con_localhost") == 'true'){
    //alert(localStorage.getItem("con_localhost")+'**'+cual);
   var apiURL='http://'+localStorage.getItem("ip_servidor")+'/connectnubepos/api2.php';
  }else{
    //alert('no'+'**'+cual);
   var apiURL='https://practisis.net/connectnubepos/api2.php';
  }
	if(cual==0){
		$.post(apiURL,{
		id_emp : localStorage.getItem("empresa"),
		action : 'SincTabla',
		id_barra : localStorage.getItem("idbarra"),
		deviceid:$("#deviceid").html()
		}).done(function(response){
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
			db.transaction(function(tx){tx.executeSql('insert into LOGACTIONS (time,descripcion) values (?,?)',[new Date().getTime(),"Get the response at the normal synchronizer post"]);});
			
			if(response!='block' && response!='Desactivado'){
				console.log(response);
				jsonSync=JSON.parse(response);
				recurrenteJsonEmpresa=jsonSync.BigJson[0].Empresa;
				console.log(response);
				$('#JSONproductosNube').html(JSON.stringify(jsonSync.BigJson[1].Productos));
				$('#JSONclientesNube').html(JSON.stringify(jsonSync.BigJson[2].Clientes));
				$('#JSONCategoriasNube').html(JSON.stringify(jsonSync.BigJson[3].Categorias));
				$('#JSONpresupuestoNube').html(JSON.stringify(jsonSync.BigJson[4].Presupuesto));
				$('#JSONEmpresaNube').html(JSON.stringify(jsonSync.BigJson[0].Empresa));
				$('#JSONMenuNube').html(JSON.stringify(jsonSync.BigJson[6].Menu));
				//$('#JSONMenuNube').html('[{"fila":"1","columna":"1","timespan":"1111","activo":"true","idproducto":"14561567453299778","idcatmenu":"1112"}]');
				$('#JSONCatMenuNube').html(JSON.stringify(jsonSync.BigJson[5].Menucategorias));
				//$('#JSONCatMenuNube').html('[{"orden": "1","nombre": "Categoria 1","timespan": "1112","activo": "true"}]');
				//$('#JSONPermisosNube').html('[{"id":"1","clave": "1111","configuracion": "true","historial": "true","anular": "true","imprimircierre":"true","productos":"false"}]');
				$('#JSONPermisosNube').html(JSON.stringify(jsonSync.BigJson[8].Permisos));
				$('#JSONImpuestosNube').html(JSON.stringify(jsonSync.BigJson[9].Impuestos));
				$('#JSONModifNube').html(JSON.stringify(jsonSync.BigJson[10].Modificadores));
				$('#JSONPropinasNube').html(JSON.stringify(jsonSync.BigJson[11].Propinas));
				$('#JSONTipoMesasNube').html(JSON.stringify(jsonSync.BigJson[12].Tipomesas));
				$('#JSONMesasNube').html(JSON.stringify(jsonSync.BigJson[13].Mesas));
                $('#JSONLocales').html(JSON.stringify(jsonSync.BigJson[14].Locales));

				//$('#JSONTipoMesasNube').html('{"tipomesas":[{"id":"1","imagen_activa":"mesagrandeanchaa.png","imagen_inactiva":"mesagrandeanchai.png","es_mesa":"true"},	{"id":"2","imagen_activa":"mesagrandealtaa.png","imagen_inactiva":"mesagrandealtai.png","es_mesa":"true"}]}');
			
				//$('#JSONMesasNube').html('{"mesas":[{"id":"1","left":"780","top":"120","tipo_mesa":"1","nombre":"Mesa 1","activo":"true"},{"id":"2","left":"100","top":"120","tipo_mesa":"2","nombre":"Mesa 2","activo":"true"}]}');
				//$('#JSONPropinasNube').html('{"propinas":[{"id":"1","porcentaje":"true","valor":"5","activo":"true"},{"id":"2","porcentaje":"false","valor":"10","activo":"true"}]}');
				//$('#JSONimpuestosNube').html('{"impuestos":[{"id":"1","nombre":"IVA","porcentaje":"12","activo":"true","timespan":"1245"},{"id":"2","nombre":"Servicio","porcentaje":"10","activo":"true","timespan":"1246"}]}');

				//$('#JSONModifNube').html('{"modificadores":[{"id":"1","no_modif":"1","id_formulado":"708331454520391001","nombre":"Con Sal","valor":"0.15","activo":"true","id_form_desc":"0"},{"id":"2","no_modif":"1","id_formulado":"708331454520391001","nombre":"Con Sal2","valor":"0.15","activo":"true","id_form_desc":"0"},{"id":"3","no_modif":"1","id_formulado":"708331454520391001","nombre":"Con Sal3","valor":"0.15","activo":"true","id_form_desc":"0"},{"id":"4","no_modif":"1","id_formulado":"708331454520391001","nombre":"Con Sal4","valor":"0.15","activo":"true","id_form_desc":"0"},{"id":"5","no_modif":"1","id_formulado":"708331454520391001","nombre":"Con Sal5","valor":"0.15","activo":"true","id_form_desc":"0"},{"id":"6","no_modif":"1","id_formulado":"708331454520391001","nombre":"Con Sal6","valor":"0.15","activo":"true","id_form_desc":"0"},{"id":"7","no_modif":"1","id_formulado":"708331454520391001","nombre":"Con Sal7","valor":"0.15","activo":"true","id_form_desc":"0"},{"id":"8","no_modif":"1","id_formulado":"708331454520391001","nombre":"Con Sal8","valor":"0.15","activo":"true","id_form_desc":"0"},{"id":"2","no_modif":"2","id_formulado":"708331454520391001","nombre":"Con Limon","valor":"0.10","activo":"true","id_form_desc":"0"}]}');

				localStorage.setItem("dias",jsonSync.BigJson[7].Extra[0].dias);
				localStorage.setItem("msj",jsonSync.BigJson[7].Extra[0].msj);
				//localStorage.setItem("permisos",jsonSync.BigJson[5].Extra[0].constrasenia);
				localStorage.setItem("permisos",jsonSync.BigJson[7].Extra[0].contrasenia);
				//localStorage.setItem("claveuser","");
				//localStorage.setItem("msj",jsonSync.BigJson[5].Extra[0].diseno);
				//localStorage.setItem("diseno",1);
				//localStorage.setItem("diseno",0);
				$('#dias').html(localStorage.getItem('dias'));
				$('#mensajeperso').html(localStorage.getItem('msj'));
				console.log( ">>>>>>recurrente");
				DatosRecurrentes(1);
				updateOnlineStatus("ONLINE");
			}else if(response=='Desactivado'){
			    //envia('cloud');
			    envia('config');
				setTimeout(function(){
					$('.navbar,#barraalternamovil').slideUp();
					$("#demoGratis,#fadeRow,#finalizado,#contentStepSincro,#cuentaactiva,#pestanasconfig,#version_escoje").css("display","none");
					$('#desactivo').fadeIn();
				},100);
			}else{
				//envia('cloud');
				envia('config');
				setTimeout(function(){
					$('#linklogin,#linkloginb').attr("href","https://www.practisis.net/index3.php?rvpas="+localStorage.getItem("userPasswod")+"&rvus="+localStorage.getItem("userRegister"));
					$('.navbar,#barraalternamovil').slideUp();
					$("#demoGratis,#fadeRow,#finalizado,#contentStepSincro,#cuentaactiva").css("display","none");
					$('#bloqueo').fadeIn();
				},100);

			}

		}).fail(function(xhr, status, error){
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
			db.transaction(function(tx){tx.executeSql('insert into LOGACTIONS (time,descripcion,datos) values (?,?,?)',[new Date().getTime(),"Fail the peticion of the normal synchronizer post",status]);});
			
			updateOnlineStatus("OFFLINE");
			setTimeout(function(){SincronizadorNormal()},180000);
		});
	}
	if(cual==1){
		console.log("Datos Nube 1: Categorias");
		$("#contentStepSincro").fadeIn();
		$("#txtSincro").html("0");
		if($('#JSONCategoriasNube').html().length>0){
			var jsoncategorias=JSON.parse($('#JSONCategoriasNube').html());
			console.log(jsoncategorias);
			localStorage.setItem('dataupdate','');
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
				for(var n=0;n<jsoncategorias.length;n++){
					var item=jsoncategorias[n];
					localStorage.setItem('dataupdate',localStorage.getItem("dataupdate")+item.idreal+',');
					
					tx.executeSql("INSERT OR IGNORE INTO CATEGORIAS (categoria,activo,existe,timespan,sincronizar)values('"+item.formulado_tipo+"','1','1','"+item.timespan+"','false')",[],function(tx,results){
						console.log("insertada categ:"+results.insertId);
					});
					
					tx.executeSql("UPDATE CATEGORIAS SET categoria = '"+item.formulado_tipo+"' WHERE timespan='"+item.timespan+"'",[],function(tx,results){
						console.log("actualizada categ");
					});
					
				}
				},errorCB,function(){
					$("#theProgress").css("width" , "15%");
                    if(localStorage.getItem("con_localhost") == 'true'){
                     var apiURL='http://'+localStorage.getItem("ip_servidor")+'/connectnubepos/api2.php';
                    }else{
                     var apiURL='https://practisis.net/connectnubepos/api2.php';
                    }
					
					$.post(apiURL,{
							id_emp: localStorage.getItem("empresa"),
							action: 'DeleteSinc',
							id_barra: localStorage.getItem("idbarra"),
							tabla: "('formulados_tipo')",
							idreal:localStorage.getItem("dataupdate"),
							deviceid:$("#deviceid").html()
					}).done(function(response){
							localStorage.setItem("dataupdate","");
							DatosRecurrentes(2);
							updateOnlineStatus("ONLINE");
					}).fail(function(xhr,status,error){
						var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
						db.transaction(function(tx){tx.executeSql('insert into LOGACTIONS (time,descripcion,datos) values (?,?,?)',[new Date().getTime(),"Fail deletesinc of: categorias",status]);});
						updateOnlineStatus("OFFLINE");
						setTimeout(function(){SincronizadorNormal()},180000);
					});
					
				});
		}	
	}else if(cual==2){
		console.log("recurrentes 2: Productos y Modificadores");
		$("#contentStepSincro").fadeIn();
		$("#txtSincro").html("15%");
		
		/*Ingreso y actualizacion de modificadores*/
		if($('#JSONModifNube').html()!=''){
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
			localStorage.setItem('dataupdate','');
			db.transaction(function(tx){
				var jsonmodif=JSON.parse($('#JSONModifNube').html());
				for(var n=0;n<jsonmodif.length;n++){
					var item=jsonmodif[n];
					localStorage.setItem('dataupdate',localStorage.getItem("dataupdate")+item.id+',');
						
					tx.executeSql('INSERT OR IGNORE INTO MODIFICADORES(no_modificador,id_formulado,nombre,valor,id_formulado_descuento,activo,timespan) VALUES('+item.no_modif+', "'+item.id_formulado+'" ,"'+item.nombre+'",'+item.valor+',"'+item.id_form_desc+'","'+item.activo+'","'+item.timespan+'")',[],function(tx,resultsm){
						console.log("insertado modificador:"+resultsm.insertId);
					});
						
					tx.executeSql('UPDATE MODIFICADORES SET no_modificador=?,id_formulado=?,nombre=?,valor=?,id_formulado_descuento=?,activo=? WHERE timespan = ?',[item.no_modif,item.id_formulado,item.nombre,item.valor,item.id_form_desc,item.activo,item.timespan],function(tx,resultsm){
						console.log("actualizado modificador:"+item.nombre);
					});
				}
			},errorCB,function(){
				$.post(apiURL,{
					id_emp: localStorage.getItem("empresa"),
					action: 'DeleteSinc',
					id_barra: localStorage.getItem("idbarra"),
					tabla: "('modificadores')",
					idreal:localStorage.getItem("dataupdate"),
					deviceid:$("#deviceid").html()
				}).done(function(response){
					console.log(response);
					localStorage.setItem("dataupdate","");
					//DatosRecurrentes(4);
					updateOnlineStatus('ONLINE');
				}).fail(function(xhr,status,error){
					var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
					db.transaction(function(tx){tx.executeSql('insert into LOGACTIONS (time,descripcion,datos) values (?,?,?)',[new Date().getTime(),"Fail deletesinc of: modificadores",status]);});
					updateOnlineStatus("OFFLINE");
					setTimeout(function(){SincronizadorNormal()},180000);
				});
			});
		}
		/**/
		if($('#JSONproductosNube').html().length>0){
			var jsonproductos=JSON.parse($('#JSONproductosNube').html());
			console.log(jsonproductos);
			localStorage.setItem('dataupdate','');
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
				for(var n=0;n<jsonproductos.length;n++){
					var item=jsonproductos[n];
					localStorage.setItem('dataupdate',localStorage.getItem("dataupdate")+item.id+',');
					
					tx.executeSql('INSERT OR IGNORE INTO PRODUCTOS(formulado,codigo,precio,categoriaid,cargaiva,productofinal,materiaprima,timespan,servicio,sincronizar,color,estado,tieneimpuestos)VALUES("'+item.formulado+'","'+item.formulado_codigo+'",'+item.precio+',"'+item.formulado_tipo_timespan+'",'+item.ivacompra+','+item.esproductofinal+','+item.esmateria+',"'+item.timespan+'" ,'+item.tieneservicio+',"false","'+item.color+'",'+item.activo+',"'+item.tieneimpuestos+'")',[],function(tx,results){
						console.log("insertado prod:"+results.insertId);       
					});
					
					tx.executeSql('UPDATE PRODUCTOS SET formulado="'+item.formulado+'",codigo="'+item.formulado_codigo+'",precio='+item.precio+',categoriaid="'+item.formulado_tipo_timespan+'",cargaiva='+item.ivacompra+',productofinal='+item.esproductofinal+',materiaprima='+item.esmateria+',timespan="'+item.timespan+'",servicio='+item.tieneservicio+',sincronizar="false",color="'+item.color+'",estado='+item.activo+' ,tieneimpuestos="'+item.tieneimpuestos+'" WHERE timespan="'+item.timespan+'"',[],function(tx,results){
						console.log("actualizado prod");
					});
				}
				},errorCB,function(){
					$("#theProgress").css("width" , "30%");
                    if(localStorage.getItem("con_localhost") == 'true'){
                     var apiURL='http://'+localStorage.getItem("ip_servidor")+'/connectnubepos/api2.php';
                    }else{
                     var apiURL='https://practisis.net/connectnubepos/api2.php';
                    }
					$.post(apiURL,{
							id_emp: localStorage.getItem("empresa"),
							action: 'DeleteSinc',
							id_barra: localStorage.getItem("idbarra"),
							tabla: "('formulados','formulados_precios','formulados_impuestos')",
							idreal:localStorage.getItem("dataupdate"),
							deviceid:$("#deviceid").html()
					}).done(function(response){
						console.log(response);
						localStorage.setItem("dataupdate","");
						DatosRecurrentes(3);
						updateOnlineStatus('ONLINE');
					}).fail(function(xhr,status,error){
						var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
						db.transaction(function(tx){tx.executeSql('insert into LOGACTIONS (time,descripcion,datos) values (?,?,?)',[new Date().getTime(),"Fail deletesinc of: productos",status]);});
						updateOnlineStatus("OFFLINE");
						setTimeout(function(){SincronizadorNormal()},180000);
					});
				});
		}
	
	}else if(cual==3){
		console.log("recurrentes 3: Clientes");
		$("#contentStepSincro").fadeIn();
		$("#txtSincro").html("30%");
		if($('#JSONclientesNube').html().length>0){
			var jsonclientes=JSON.parse($('#JSONclientesNube').html());
			console.log(jsonclientes);
			localStorage.setItem('dataupdate','');
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
				for(var n=0;n<jsonclientes.length;n++){
					var item=jsonclientes[n];
					localStorage.setItem('dataupdate',localStorage.getItem("dataupdate")+item.idreal+',');
					var cupo=0;
					if(item.cupo!=null)
						cupo=item.cupo;
					
					tx.executeSql("SELECT COUNT(*) as cuantos FROM FACTURAS WHERE sincronizar='true' and RUC=?",[item.cedula],function(tx,resultf){
						if(resultf.rows.length>0){
							var itemf=resultf.rows.item(0);
							if(parseInt(itemf.cuantos)>0){
								tx.executeSql('INSERT OR IGNORE INTO CLIENTES(nombre,cedula,email,direccion,telefono,sincronizar,existe,timespan) VALUES("'+item.nombre+'" , "'+item.cedula+'" , "'+item.email+'" , "'+item.direccion+'" ,  "'+item.telefono+'" ,  "false" , "0" , "0")',[],function(tx,results){
								console.log("insertado cliente:"+results.insertId);
								});
							
								tx.executeSql('UPDATE CLIENTES SET nombre=  "'+item.nombre+'"  , cedula = "'+item.cedula+'" , email="'+item.email+'"  , direccion = "'+item.direccion+'" , sincronizar="false" WHERE cedula="'+item.cedula+'"',[],function(tx,results){
								console.log("actualizado cliente");
								});
							}else{
								tx.executeSql('INSERT OR IGNORE INTO CLIENTES(nombre,cedula,email,direccion,telefono,sincronizar,existe,timespan,cupo) VALUES("'+item.nombre+'" , "'+item.cedula+'" , "'+item.email+'" , "'+item.direccion+'" ,  "'+item.telefono+'" ,  "false" , "0" , "0",'+cupo+')',[],function(tx,results){
								console.log("insertado cliente:"+results.insertId);
								});
							
								tx.executeSql('UPDATE CLIENTES SET nombre=  "'+item.nombre+'"  , cedula = "'+item.cedula+'" , email="'+item.email+'"  , direccion = "'+item.direccion+'" , sincronizar="false",cupo='+cupo+'  WHERE cedula="'+item.cedula+'"',[],function(tx,results){
								console.log("actualizado cliente");
								});
							}
						}
					});
					
					
				}
				},errorCB,function(){
					$("#theProgress").css("width" , "45%");
                    if(localStorage.getItem("con_localhost") == 'true'){
                     var apiURL='http://'+localStorage.getItem("ip_servidor")+'/connectnubepos/api2.php';
                    }else{
                     var apiURL='https://practisis.net/connectnubepos/api2.php';
                    }
					$.post(apiURL,{
							id_emp: localStorage.getItem("empresa"),
							action: 'DeleteSinc',
							id_barra: localStorage.getItem("idbarra"),
							tabla: "('clientes','clientes_datos')",
							idreal:localStorage.getItem("dataupdate"),
							deviceid:$("#deviceid").html()
					}).done(function(response){
						console.log(response);
						localStorage.setItem("dataupdate","");
						DatosRecurrentes(4);
						updateOnlineStatus('ONLINE');
					}).fail(function(xhr,status,error){
						var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
						db.transaction(function(tx){tx.executeSql('insert into LOGACTIONS (time,descripcion,datos) values (?,?,?)',[new Date().getTime(),"Fail deletesinc of: clientes",status]);});
						updateOnlineStatus("OFFLINE");
						setTimeout(function(){SincronizadorNormal()},180000);
					});
		});
		}
	}else if(cual==4){
		console.log("recurrentes 4: Presupuestos");
		$("#contentStepSincro").fadeIn();
		$("#txtSincro").html("45%");
		if($('#JSONpresupuestoNube').html().length>0){
			var jsonpresup=JSON.parse($('#JSONpresupuestoNube').html());
			console.log(jsonpresup);
			localStorage.setItem('dataupdate','');
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
				for(var n=0;n<jsonpresup.length;n++){
					var item=jsonpresup[n];
					localStorage.setItem('dataupdate',localStorage.getItem("dataupdate")+item.id+',');
					
					tx.executeSql('INSERT OR IGNORE INTO PRESUPUESTO(timespan,valor,fecha,transacciones) VALUES("'+item.id+'",'+item.valor+','+item.fecha+','+item.transacciones+')',[],function(tx,results){
						console.log("insertado presupuesto:"+results.insertId);
					});
					
					tx.executeSql('UPDATE PRESUPUESTO SET timespan=  "'+item.id+'"  , valor = '+item.valor+' , fecha='+item.fecha+', transacciones = '+item.transacciones+' WHERE fecha='+item.fecha,[],function(tx,results){
						console.log("actualizado presupuesto");
					});
				}
				},errorCB,function(){
					$("#theProgress").css("width" , "60%");
                    if(localStorage.getItem("con_localhost") == 'true'){
                     var apiURL='http://'+localStorage.getItem("ip_servidor")+'/connectnubepos/api2.php';
                    }else{
                     var apiURL='https://practisis.net/connectnubepos/api2.php';
                    }
					$.post(apiURL,{
							id_emp: localStorage.getItem("empresa"),
							action: 'DeleteSinc',
							id_barra: localStorage.getItem("idbarra"),
							tabla: "('presupuestos')",
							idreal:localStorage.getItem("dataupdate"),
							deviceid:$("#deviceid").html()
					}).done(function(response){
						
						console.log(response);
						localStorage.setItem("dataupdate","");
						DatosRecurrentes(5);
						updateOnlineStatus('ONLINE');
						
					}).fail(function(xhr,status,error){	
						var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
						db.transaction(function(tx){tx.executeSql('insert into LOGACTIONS (time,descripcion,datos) values (?,?,?)',[new Date().getTime(),"Fail deletesinc of: Presupuestos",status]);});
						updateOnlineStatus("OFFLINE");
						setTimeout(function(){SincronizadorNormal()},180000);
					});
				});
		}
	}else if(cual==5){
		console.log("recurrentes 5: Empresa");
		$("#contentStepSincro").fadeIn();
		$("#txtSincro").html("60%");
		if($('#JSONEmpresaNube').html().length>0){
			var jsonpresup=JSON.parse($('#JSONEmpresaNube').html());
			console.log(jsonpresup);
			localStorage.setItem('dataupdate','');
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
				for(var n=0;n<jsonpresup.length;n++){
					var item=jsonpresup[n];
					localStorage.setItem('dataupdate',localStorage.getItem("dataupdate")+'1,');

					/*tx.executeSql('UPDATE CONFIG SET nombre="'+item.nombreempresa+'",razon = "'+item.razon+'" , ruc="'+item.ruc+'",telefono ="'+item.telefono+'",direccion="'+item.direccion+'",serie="'+item.serie+'",establecimiento="'+item.establecimiento+'",nombreterminal="'+item.nombreterminal+'" WHERE id=1',[],function(tx,results){*/
                    if(localStorage.getItem("con_localhost") == 'true'){
                      tx.executeSql('UPDATE CONFIG SET nombre="'+item.nombreempresa+'",razon = "'+item.razon+'" , ruc2="'+item.ruc+'",telefono ="'+item.telefono+'",direccion="'+item.direccion+'",serie="'+item.serie+'",establecimiento="'+item.establecimiento+'",nombreterminal="'+item.nombreterminal+'" WHERE id=1',[],function(tx,results){
						console.log("actualizada empresa");
					  });
                    }else{
                      localStorage.setItem('idioma',item.idioma);
					  localStorage.setItem('propina',item.propina);
                      localStorage.setItem('sin_documento',item.documento);
                      localStorage.setItem('pais',item.pais);
  					  localStorage.setItem("con_shop",item.shop);
  					  localStorage.setItem("con_nombre_orden",item.orden);
  					  localStorage.setItem("con_tarjeta",item.tarjeta);
  					  localStorage.setItem("con_notas",item.notas);
  					  localStorage.setItem("con_comandas",item.comanderas);
  					  localStorage.setItem("con_mesas",item.mesas);
                      localStorage.setItem("con_localhost",item.localhost);
                      localStorage.setItem("ip_servidor",item.ipservidor);
                      localStorage.setItem("logo",item.logo);
                      localStorage.setItem("imprimelogo",item.imprlogo);
					  localStorage.setItem("id_version_nube",item.id_version_nube);
                      localStorage.setItem("pide_telefono",item.pide_telefono);
                      localStorage.setItem("telefono_inte",item.telefono_inte);
                      localStorage.setItem("mensajefinal",item.mensajefinal);
                      localStorage.setItem("paquete",item.plan);
                      localStorage.setItem("terminos",item.terminos);
                      localStorage.setItem("pagarconcredito",item.pagarconcredito);
                      localStorage.setItem("id_locales",item.id_locales);
                      localStorage.setItem("id_pais",item.id_pais);
                      localStorage.setItem("factelectronica",item.tiene_factura_electronica);
                      localStorage.setItem("impuestos_personalizados",item.impuestos_personalizados);
					  if(item.aceptanc!=null){
						localStorage.setItem("feaceptanc",item.aceptanc);
					  }else{
						localStorage.setItem("feaceptanc",'false');
					  }
                      //localStorage.setItem("paquete","36");
                      //localStorage.setItem("paquete","37");

                      if(item.id_version_nube == 4){
                        localStorage.setItem("con_profesionales","true");

                        var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
                    	db.transaction(function(tx){

                          tx.executeSql("INSERT OR IGNORE INTO CATEGORIAS(categoria,activo,existe,timespan,sincronizar)values('Personalizada','1','1','-14','true');",[],function(tx,results){
                          	console.log("insertada categ:"+results.insertId);
                          });

                          tx.executeSql('INSERT OR IGNORE INTO PRODUCTOS(formulado,codigo,precio,categoriaid,cargaiva,productofinal,materiaprima,timespan,servicio,sincronizar,color,estado,tieneimpuestos) VALUES("Personalizado", "1414" ,0,-14,0,1,0,"-14",0,"true","",1,"true");',[],function(tx,results){
                            console.log("insertado producto personalizado"+results.insertId);
                          });
                        },errorCB,function(){
                    	});
                      }else{
                        localStorage.setItem("con_profesionales","false");
                      }

                      tx.executeSql('UPDATE CONFIG SET nombre="'+item.nombreempresa+'",razon = "'+item.razon+'" , ruc2="'+item.ruc+'",telefono ="'+item.telefono+'",direccion="'+item.direccion+'",serie="'+item.serie+'",establecimiento="'+item.establecimiento+'",nombreterminal="'+item.nombreterminal+'",pais="'+item.pais+'",id_idioma = "'+item.idioma+'",sin_documento="'+item.documento+'",con_nombre_orden="'+item.orden+'",con_propina="'+item.propina+'",con_tarjeta="'+item.tarjeta+'",con_shop="'+item.shop+'",con_notasorden="'+item.notas+'",con_comanderas="'+item.comanderas+'",con_localhost="'+item.localhost+'",ip_servidor="'+item.ipservidor+'",con_mesas="'+item.mesas+'",logo="'+item.logo+'",id_version_nube="'+item.id_version_nube+'",pide_telefono="'+item.pide_telefono+'",telefono_inte="'+item.telefono_inte+'",mensajefinal="'+item.mensajefinal+'",terminos_condiciones="'+item.terminos+'",id_locales="'+item.id_locales+'",email_fact="'+item.email_fact+'",key="'+item.key+'",numero_contribuyente="'+item.numero_contribuyente+'",obligado_contabilidad="'+item.obligado_contabilidad+'",prueba_produccion="'+item.prueba_produccion+'",tiene_factura_electronica="'+item.tiene_factura_electronica+'",mensaje_factura="'+item.msj_factura_electronica+'",respaldar="'+item.respaldar+'",pagarconcredito="'+item.pagarconcredito+'",impuestos_personalizados="'+item.impuestos_personalizados+'" WHERE id=1',[],function(tx,results){
						console.log("actualizada empresa");
						if(item.logo!=''&&item.logo!=null){
							var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
							if ( app ) {
								if(item.logo!=null&&item.logo!=''&&item.logo!="null")
									downloadImage(encodeURI("https://www.practisis.net/practipos2/logos/"+item.logo),item.logo);
							}
						}

                        if(localStorage.getItem("terminos") == 'false'){
            			    $('#terminos_condiciones').fadeIn('slow');
                            //document.getElementById('main').style.display='none';
                        }

					  });
                    }
				}
				},errorCB,function(){
					$("#theProgress").css("width" , "75%");
                    if(localStorage.getItem("con_localhost") == 'true'){
                     var apiURL='http://'+localStorage.getItem("ip_servidor")+'/connectnubepos/api2.php';
                    }else{
                     var apiURL='https://practisis.net/connectnubepos/api2.php';
                    }
					$.post(apiURL,{
							id_emp: localStorage.getItem("empresa"),
							action: 'DeleteSinc',
							id_barra: localStorage.getItem("idbarra"),
							tabla: "('configuraciones_globales,id_barras_cajas')",
							idreal:localStorage.getItem("dataupdate"),
							deviceid:$("#deviceid").html()
					}).done(function(response){
						console.log(response);
						localStorage.setItem("dataupdate","");
						DatosRecurrentes(6);
						updateOnlineStatus('ONLINE');
					}).fail(function(xhr,status,error){
						var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
						db.transaction(function(tx){tx.executeSql('insert into LOGACTIONS (time,descripcion,datos) values (?,?,?)',[new Date().getTime(),"Fail deletesinc of:empresa",status]);});
						updateOnlineStatus("OFFLINE");
						setTimeout(function(){SincronizadorNormal()},180000);
					});
				});
		}
	}else if(cual==6){
		console.log("recurrentes 6: Categorias Diseño Menu");
		$("#contentStepSincro").fadeIn();
		$("#txtSincro").html("75%");
		if($('#JSONCatMenuNube').html().length>0){
			var jsoncatmenu=JSON.parse($('#JSONCatMenuNube').html());
			console.log(jsoncatmenu);
			localStorage.setItem('dataupdate','');
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
				for(var n=0;n<jsoncatmenu.length;n++){
					//alert(n);
					var item=jsoncatmenu[n];
					localStorage.setItem('dataupdate',localStorage.getItem("dataupdate")+item.id+',');
					
					tx.executeSql('INSERT OR IGNORE INTO MENU_CATEGORIAS(orden,nombre,timespan,activo)VALUES('+item.orden+',"'+item.nombre+'","'+item.timespan+'","'+item.activo+'")',[],function(tx,results){
						console.log("insertada categoria menu:"+results.insertId);
					});

					tx.executeSql('UPDATE MENU_CATEGORIAS SET orden='+item.orden+' , nombre = "'+item.nombre+'", activo = "'+item.activo+'" WHERE timespan like "'+item.timespan+'"',[],function(tx,results){
						console.log("actualizada categoria menu.");
					});
				}
				},errorCB,function(){
					$("#theProgress").css("width" , "90%");
                    if(localStorage.getItem("con_localhost") == 'true'){
                     var apiURL='http://'+localStorage.getItem("ip_servidor")+'/connectnubepos/api2.php';
                    }else{
                     var apiURL='https://practisis.net/connectnubepos/api2.php';
                    }
					$.post(apiURL,{
							id_emp: localStorage.getItem("empresa"),
							action: 'DeleteSinc',
							id_barra: localStorage.getItem("idbarra"),
							tabla: "('menu_categorias')",
							idreal:localStorage.getItem("dataupdate"),
							deviceid:$("#deviceid").html()
					}).done(function(response){
						console.log(response);
						localStorage.setItem("dataupdate","");
						DatosRecurrentes(7);
						updateOnlineStatus('ONLINE');
					}).fail(function(xhr,status,response){
						var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
						db.transaction(function(tx){tx.executeSql('insert into LOGACTIONS (time,descripcion,datos) values (?,?,?)',[new Date().getTime(),"Fail deletesinc of: Categorías Menú",status]);});
						updateOnlineStatus("OFFLINE");
						setTimeout(function(){SincronizadorNormal()},180000);
					});
				});
		}
	}	else if(cual==7){
		console.log("recurrentes 7: Productos Diseño de Menu");
		$("#contentStepSincro").fadeIn();
		$("#txtSincro").html("90%");
		if($('#JSONMenuNube').html().length>0){
			var jsonmenu=JSON.parse($('#JSONMenuNube').html());
			console.log(jsonmenu);
			localStorage.setItem('dataupdate','');
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
					for(var n=0;n<jsonmenu.length;n++){
						var item=jsonmenu[n];
						localStorage.setItem('dataupdate',localStorage.getItem("dataupdate")+item.id+',');
						
						/*tx.executeSql('INSERT OR IGNORE INTO MENU(fila,columna,idcatmenu,idproducto,timespan,activo)VALUES('+(parseInt(item.fila)+1)+','+item.columna+',"'+item.idcatmenu+'","'+item.idproducto+'","'+item.timespan+'","'+item.activo+'")',[],function(tx,results){
						console.log("insertado producto menu:"+results.insertId);
						});*/
						

						tx.executeSql('INSERT INTO MENU(fila,columna,idcatmenu,idproducto,timespan,activo,cant_max) SELECT '+(parseInt(item.fila)+1)+','+item.columna+',"'+item.idcatmenu+'","'+item.idproducto+'","'+item.timespan+'","'+item.activo+'","'+item.cant_max+'" WHERE NOT EXISTS(SELECT 1 FROM MENU WHERE timespan like "'+item.timespan+'")',[],function(tx,results){
							console.log("insertado producto menu:"+results.insertId);
						});
						
						tx.executeSql('UPDATE MENU SET fila='+(parseInt(item.fila)+1)+' , columna = '+item.columna+', activo = "'+item.activo+'" ,idproducto="'+item.idproducto+'",idcatmenu="'+item.idcatmenu+'",timespan="'+item.timespan+'",cant_max="'+item.cant_max+'" WHERE timespan like "'+item.timespan+'"',[],function(tx,results){
							console.log("actualizado producto menu.");
						});
					}
				},errorCB,function(){
					$("#txtSincro").html("95%");
                    if(localStorage.getItem("con_localhost") == 'true'){
                     var apiURL='http://'+localStorage.getItem("ip_servidor")+'/connectnubepos/api2.php';
                    }else{
                     var apiURL='https://practisis.net/connectnubepos/api2.php';
                    }
					$.post(apiURL,{
							id_emp: localStorage.getItem("empresa"),
							action: 'DeleteSinc',
							id_barra: localStorage.getItem("idbarra"),
							tabla: "('menu_diseno')",
							idreal:localStorage.getItem("dataupdate"),
							deviceid:$("#deviceid").html()
					}).done(function(response){
						console.log(response);
						localStorage.setItem("dataupdate","");
						DatosRecurrentes(8);
						setTimeout(function(){
							$("#theProgress").css("width" , "95%");
							$("#finalizado").fadeIn();
							$("#contentStepSincro").css("display","none");
							$("#txtSincro").html("");
						},1500);
						updateOnlineStatus('ONLINE');
					}).fail(function(xhr,status,error){
						var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
						db.transaction(function(tx){tx.executeSql('insert into LOGACTIONS (time,descripcion,datos) values (?,?,?)',[new Date().getTime(),"Fail deletesinc of: Productos Menú",status]);});
						updateOnlineStatus("OFFLINE");
						setTimeout(function(){SincronizadorNormal()},180000);
					});
				});
		}
	}
	else if(cual==8){
		console.log("recurrentes 8: Permisos Usuario");
		$("#contentStepSincro").fadeIn();
		$("#txtSincro").html("95%");
		
		if($('#JSONImpuestosNube').html()!=''){
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
			db.transaction(function(tx){
			localStorage.setItem('dataupdate','');
			var jsonimp=JSON.parse($('#JSONImpuestosNube').html());
			var imp=jsonimp;
			console.log(imp);
			//$('#idiva').html('0');
			for(var t in imp){
				var itemi=imp[t];
					localStorage.setItem('dataupdate',localStorage.getItem("dataupdate")+itemi.id+',');
					tx.executeSql('INSERT OR IGNORE INTO IMPUESTOS (nombre,porcentaje,activo,timespan) values (?,?,?,?)',[itemi.nombre,itemi.porcentaje,itemi.activo,itemi.id],function(tx,results){
						console.log("Insertado impuesto: "+results.insertId);
						if($.trim(itemi.nombre.toLowerCase())=='iva')
							$('#idiva').html(itemi.id);
						
						if($('#impuesto-'+itemi.id).length==0){
							$('#taxes').append('<input id="impuesto-'+itemi.id+'" type="text" value="'+itemi.id+"|"+itemi.nombre+"|"+parseFloat((itemi.porcentaje)/100)+'">');
						}else{
							$("impuesto-"+itemi.id).val(itemi.id+"|"+itemi.nombre+"|"+parseFloat((itemi.porcentaje)/100));
						}
					});
					
					tx.executeSql('UPDATE IMPUESTOS SET nombre=?,porcentaje=?,activo=? WHERE timespan = ?',[itemi.nombre,itemi.porcentaje,itemi.activo,itemi.id],function(tx,results){
						console.log("Actualizado impuesto: "+itemi.nombre);
						if($('#impuesto-'+itemi.id).length==0){
							$('#taxes').append('<input id="impuesto-'+itemi.id+'" type="text" value="'+itemi.id+"|"+itemi.nombre+"|"+parseFloat((itemi.porcentaje)/100)+'">');
						}else{
							$("impuesto-"+itemi.id).val(itemi.id+"|"+itemi.nombre+"|"+parseFloat((itemi.porcentaje)/100));
						}
					});		
			}
			},errorCB,function(){
				$.post(apiURL,{
							id_emp: localStorage.getItem("empresa"),
							action: 'DeleteSinc',
							id_barra: localStorage.getItem("idbarra"),
							tabla: "('terminales_impuestos')",
							idreal:localStorage.getItem("dataupdate"),
							deviceid:$("#deviceid").html()
				}).done(function(response){
						console.log(response);
						localStorage.setItem("dataupdate","");
						updateOnlineStatus('ONLINE');
				}).fail(function(xhr,status,error){
						var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
						db.transaction(function(tx){tx.executeSql('insert into LOGACTIONS (time,descripcion,datos) values (?,?,?)',[new Date().getTime(),"Fail deletesinc of: Permisos Usuarios",status]);});
						updateOnlineStatus("OFFLINE");
				});
			});
		}
		
		//modifica propinas
		if($('#JSONPropinasNube').html()!=''){
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
			db.transaction(function(tx){
			var jsonprop=JSON.parse($('#JSONPropinasNube').html());
			var prop=jsonprop;
			console.log(prop);
			//$('#idiva').html('0');
			for(var t in prop){
				var itemi=prop[t];
				
					tx.executeSql('INSERT OR IGNORE INTO PROPINAS (valor,es_porcentaje,activo,timespan) values (?,?,?,?)',[itemi.valor,itemi.porcentaje,itemi.activo,itemi.id],function(tx,results){
						console.log("Insertada Propina rec: "+results.insertId);
					});
					
					tx.executeSql('UPDATE PROPINAS SET valor=?,es_porcentaje=?,activo=? WHERE timespan = ?',[itemi.valor,itemi.porcentaje,itemi.activo,itemi.id],function(tx,results){
						console.log("Actualizada propina: "+itemi.valor);
					});		
			}
			},errorCB,successCB);
		}
		//
		
		if($('#JSONPermisosNube').html().length>0){
			var jsonpermisos=JSON.parse($('#JSONPermisosNube').html());
			console.log(jsonpermisos);
			localStorage.setItem('dataupdate','');
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
				for(var n=0;n<jsonpermisos.length;n++){
					var item=jsonpermisos[n];
					localStorage.setItem('dataupdate',localStorage.getItem("dataupdate")+item.id+',');
					//tx.executeSql('delete from PERMISOS',[],function(tx,results){});
					//tx.executeSql("delete from sqlite_sequence where name='PERMISOS'",[],function(tx,results){});
					
					tx.executeSql('INSERT OR IGNORE INTO PERMISOS(clave,historial,configuracion,anular,impcierre,productos,activo,vertotales,irnube)VALUES("'+item.clave+'","'+item.historial+'","'+item.configuracion+'","'+item.anular+'","'+item.imprimircierre+'","'+item.productos+'","'+item.activo+'","'+item.vertotales+'","'+item.irnube+'")',[],function(tx,results){
						console.log("insertado permiso :"+results.insertId);
					});
					
					tx.executeSql('UPDATE PERMISOS SET clave="'+item.clave+'" , historial = "'+item.historial+'", configuracion = "'+item.configuracion+'" ,anular="'+item.anular+'",impcierre="'+item.imprimircierre+'",productos="'+item.productos+'",activo="'+item.activo+'",vertotales="'+item.vertotales+'",irnube="'+item.irnube+'" WHERE clave like "'+item.clave+'"',[],function(tx,results){
							console.log("actualizado permiso.");
					});
				}
				},errorCB,function(){
					$("#theProgress").css("width" , "100%");
                    if(localStorage.getItem("con_localhost") == 'true'){
                     var apiURL='http://'+localStorage.getItem("ip_servidor")+'/connectnubepos/api2.php';
                    }else{
                     var apiURL='https://practisis.net/connectnubepos/api2.php';
                    }
					$.post(apiURL,{
							id_emp: localStorage.getItem("empresa"),
							action: 'DeleteSinc',
							id_barra: localStorage.getItem("idbarra"),
							tabla: "('permisos_nube')",
							idreal:localStorage.getItem("dataupdate"),
							deviceid:$("#deviceid").html()
					}).done(function(response){
						console.log(response);
						localStorage.setItem("dataupdate","");
						updateOnlineStatus('ONLINE');
						DatosRecurrentes(9);
					}).fail(function(xhr,status,error){
						var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
						db.transaction(function(tx){tx.executeSql('insert into LOGACTIONS (time,descripcion,datos) values (?,?,?)',[new Date().getTime(),"Fail deletesinc of: Permisos ",status]);});
						updateOnlineStatus("OFFLINE");
						setTimeout(function(){$("#theProgress").css("width" , "0%"); SincronizadorNormal()},180000);
					});
				});
		}
	}else if(cual==9){
		console.log("recurrentes 9: Tipos de Mesas");
		$("#contentStepSincro").fadeIn();
		$("#txtSincro").html("98%");
		if($('#JSONTipoMesasNube').html().length>0){
			var jsontiposmesas=JSON.parse($('#JSONTipoMesasNube').html());
			console.log(jsontiposmesas);
			localStorage.setItem('dataupdate','');
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
					for(var n=0;n<jsontiposmesas.length;n++){
						var item=jsontiposmesas[n];
						localStorage.setItem('dataupdate',localStorage.getItem("dataupdate")+item.id+',');
						
						tx.executeSql('INSERT INTO TIPO_MESA(imagen_activa,imagen_inactiva,es_mesa,timespan) SELECT "'+item.imagen_activa+'","'+item.imagen_inactiva+'","'+item.es_mesa+'","'+item.id+'" WHERE NOT EXISTS(SELECT 1 FROM TIPO_MESA WHERE timespan like "'+item.id+'")',[],function(tx,results){
								console.log("insertado tipo de mesa:"+results.insertId);
						});
						
						tx.executeSql('UPDATE TIPO_MESA SET imagen_activa=?,imagen_inactiva=?,es_mesa=? WHERE timespan=?',[item.imagen_activa,item.imagen_inactiva,item.es_mesa,item.id],function(tx,results){
							console.log("actualizado tipo mesa");
						});
					}
				},errorCB,function(){
					$("#txtSincro").html("98%");
					$.post(apiURL,{
							id_emp: localStorage.getItem("empresa"),
							action: 'DeleteSinc',
							id_barra: localStorage.getItem("idbarra"),
							tabla: "('tipomesa')",
							idreal:localStorage.getItem("dataupdate"),
							deviceid:$("#deviceid").html()
					}).done(function(response){
						console.log(response);
						localStorage.setItem("dataupdate","");
						setTimeout(function(){
							$("#theProgress").css("width" , "98%");
						},1500);
						updateOnlineStatus('ONLINE');
						DatosRecurrentes(10);
					}).fail(function(xhr,status,error){
						var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
						db.transaction(function(tx){tx.executeSql('insert into LOGACTIONS (time,descripcion,datos) values (?,?,?)',[new Date().getTime(),"Fail deletesinc of: Tipo Mesas ",status]);});
						updateOnlineStatus("OFFLINE");
						setTimeout(function(){SincronizadorNormal()},180000);
					});
				});
		}
	}
	else if(cual==10){
		console.log("recurrentes 10: Mesas");
		$("#contentStepSincro").fadeIn();
		$("#txtSincro").html("98%");
		if($('#JSONMesasNube').html().length>0){
			var jsonmesas=JSON.parse($('#JSONMesasNube').html());
			console.log(jsonmesas);
			localStorage.setItem('dataupdate','');
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
					for(var n=0;n<jsonmesas.length;n++){
						var item=jsonmesas[n];
						localStorage.setItem('dataupdate',localStorage.getItem("dataupdate")+item.id+',');

						tx.executeSql('INSERT INTO MESAS(left,top,id_tipomesa,activo,nombre,timespan,tab) SELECT '+item.left+','+item.top+',"'+item.tipo_mesa+'","'+item.activo+'","'+item.nombre+'","'+item.id+'","'+item.tab+'" WHERE NOT EXISTS(SELECT 1 FROM MESAS WHERE timespan like "'+item.id+'")',[],function(tx,results){
								console.log("insertada mesa:"+results.insertId);
						});

						tx.executeSql('UPDATE MESAS SET left=?,top=?,id_tipomesa=?,activo=?,nombre=?,tab=? WHERE timespan=?',[item.left,item.top,item.tipo_mesa,item.activo,item.nombre,item.tab,item.id],function(tx,results){
							console.log("actualizada mesa.");
						});
					}
				},errorCB,function(){
					$("#txtSincro").html("100%");
					$.post(apiURL,{
							id_emp: localStorage.getItem("empresa"),
							action: 'DeleteSinc',
							id_barra: localStorage.getItem("idbarra"),
							tabla: "('disenomesas')",
							idreal:localStorage.getItem("dataupdate"),
							deviceid:$("#deviceid").html()
					}).done(function(response){
                        console.log(response);
						localStorage.setItem("dataupdate","");
						setTimeout(function(){
							$("#theProgress").css("width" , "99%");
						},1500);
						updateOnlineStatus('ONLINE');
                        DatosRecurrentes(11);
					}).fail(function(xhr,status,error){
						var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
						db.transaction(function(tx){tx.executeSql('insert into LOGACTIONS (time,descripcion,datos) values (?,?,?)',[new Date().getTime(),"Fail deletesinc of: Mesas ",status]);});
						updateOnlineStatus("OFFLINE");
						setTimeout(function(){SincronizadorNormal()},180000);
					});
				});
			}
		}
        else if(cual==11){
		console.log("recurrentes 11: Locales");
		$("#contentStepSincro").fadeIn();
		$("#txtSincro").html("99%");
		if($('#JSONLocales').html().length>0){
			var jsonlocales=JSON.parse($('#JSONLocales').html());
			console.log(jsonlocales);
			localStorage.setItem('dataupdate','');
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
					for(var n=0;n<jsonlocales.length;n++){
						var item=jsonlocales[n];
                        //alert(item.timespan);
						localStorage.setItem('dataupdate',localStorage.getItem("dataupdate")+item.timespan+',');

						tx.executeSql('INSERT INTO LOCALES(local,activo,timespan) SELECT "'+item.local+'","'+item.activo+'","'+item.timespan+'" WHERE NOT EXISTS(SELECT 1 FROM LOCALES WHERE timespan like "'+item.timespan+'")',[],function(tx,results){
								console.log("insertado local:"+results.insertId);
						});

						tx.executeSql('UPDATE LOCALES SET local=?,activo=? WHERE timespan=?',[item.local,item.activo,item.timespan],function(tx,results){
							console.log("actualizado local.");
						});
					}
				},errorCB,function(){
					$("#txtSincro").html("100%");
					$.post(apiURL,{
							id_emp: localStorage.getItem("empresa"),
							action: 'DeleteSinc',
							id_barra: localStorage.getItem("idbarra"),
							tabla: "('disenomesas')",
							idreal:localStorage.getItem("dataupdate"),
							deviceid:$("#deviceid").html()
					}).done(function(response){
						console.log(response);
						localStorage.setItem("dataupdate","");
						SubirDatosaNube(0);
						setTimeout(function(){
							$("#theProgress").css("width" , "100%");
						},1500);
						updateOnlineStatus('ONLINE');
					}).fail(function(xhr,status,error){
						var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
						db.transaction(function(tx){tx.executeSql('insert into LOGACTIONS (time,descripcion,datos) values (?,?,?)',[new Date().getTime(),"Fail deletesinc of: Locales ",status]);});
						updateOnlineStatus("OFFLINE");
						setTimeout(function(){SincronizadorNormal()},180000);
					});
				});
			}
		}
}

function SubirDatosaNube(cual){
	var cualcosa='Categorias';
	if(cual==1) cualcosa='Productos';
	if(cual==2) cualcosa='Facturas';
	if(cual==3) cualcosa='Empresa';
	if(cual==4) cualcosa='Mesas';
	if(cual==5) cualcosa='Impuestos';
	if(cual==6) cualcosa='Modificadores';
	
	var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
	db.transaction(function(tx){tx.executeSql('insert into LOGACTIONS (time,descripcion,datos) values (?,?,?)',[new Date().getTime(),"Ready to start the upload synchronizer",cualcosa]);},errorCB);
	console.log("sincronizador de subida...");
	var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
	if(cual==0){
		db.transaction(function(tx){
			console.log("subida de categorias");
			tx.executeSql('SELECT * FROM CATEGORIAS WHERE sincronizar="true"',[],function(tx,results){
				console.log(results);
				if(results.rows.length>0){
					var itemsasubir=results.rows;
					console.log(itemsasubir);
					PostaLaNube(itemsasubir,cual,"Categorias",0);
				}else{
					SubirDatosaNube(1);
				}
			});
		},errorCB,successCB);
	}if(cual==1){
		db.transaction(function(tx){
			console.log("subida de productos");
			tx.executeSql('SELECT * FROM PRODUCTOS WHERE sincronizar="true"',[],function(tx,results){
				if(results.rows.length>0){
					var itemsasubir=results.rows;
					PostaLaNube(itemsasubir,cual,"Productos",0);
				}else{SubirDatosaNube(2)}
			});
		},errorCB,successCB);
	}
	/*if(cual==2){
		db.transaction(function(tx){
			console.log("subida de clientes");
			tx.executeSql('SELECT * FROM CLIENTES WHERE sincronizar="true"',[],function(tx,results){
				if(results.rows.length>0){
					var itemsasubir=results.rows;
					PostaLaNube(itemsasubir,cual,"Clientes",0);
				}else{SubirDatosaNube(3)}
			});
		},errorCB,successCB);
	}*/
	if(cual==2){
		db.transaction(function(tx){
			console.log("subida de facturas");
			tx.executeSql('SELECT * FROM FACTURAS WHERE sincronizar="true"',[],function(tx,results){
				if(results.rows.length>0){
					var itemsasubir=results.rows;
					PostaLaNube(itemsasubir,cual,"Facturas",0);
				}else{SubirDatosaNube(3)}
			});
		},errorCB,successCB);
	}
	if(cual==3){
		db.transaction(function(tx){
			console.log("subida de EMPRESA");
			tx.executeSql('SELECT * FROM CONFIG WHERE sincronizar="true"',[],function(tx,results){
				if(results.rows.length>0){
					var itemsasubir=results.rows;
					PostaLaNube(itemsasubir,cual,"Config",0);
				}else{SubirDatosaNube(4)}
			});
		},errorCB,successCB);
	}
	if(cual==4){
		db.transaction(function(tx){
			console.log("subida de MESAS");
			tx.executeSql('SELECT * FROM mesas_datos WHERE sincronizar="true"',[],function(tx,results){
				if(results.rows.length>0){
					var itemsasubir=results.rows;
					PostaLaNube(itemsasubir,cual,"MESAS_DATOS",0);
				}else{SubirDatosaNube(5)}
			});
		},errorCB,successCB);
	}
	if(cual==5){
		db.transaction(function(tx){
			console.log("subida de IMPUESTOS");
			tx.executeSql('SELECT * FROM IMPUESTOS WHERE sincronizar="true"',[],function(tx,results){
				if(results.rows.length>0){
					var itemsasubir=results.rows;
					PostaLaNube(itemsasubir,cual,"IMPUESTOS",0);
				}else{SubirDatosaNube(6)}
			});
		},errorCB,successCB);
	}
	if(cual==6){
		db.transaction(function(tx){
			console.log("subida de MODIFICADORES");
			tx.executeSql('SELECT * FROM MODIFICADORES WHERE sincronizar="true"',[],function(tx,results){
				if(results.rows.length>0){
					var itemsasubir=results.rows;
					PostaLaNube(itemsasubir,cual,"MODIFICADORES",0);
				}else{SubirDatosaNube(7)}
			});
		},errorCB,successCB);
	}
	if(cual==7){
		procesocount=0;
		setTimeout(function(){SincronizadorNormal();},60000);
	}
}

function PostaLaNube(arraydatos,cual,accion,t){
	var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
	var item=arraydatos.item(t);
	var jsonc='';
	if(accion=='Categorias'){
		jsonc='{"id":"'+item.id+'","categoria":"'+item.categoria+'","activo":"'+item.activo+'","timeSpan":"'+item.timespan+'"}';
	}else if(accion=='Productos'){
		var boolactivo='true';
		if(item.estado==0)
			boolactivo='false';
		jsonc='{  "id" : "'+item.id_local+'" , "formulado" : "'+item.formulado+'" , "timespan" : "'+item.timespan+'" , "codigo" : "'+item.codigo+'" , "precio" : "'+item.precio+'" , "cargaiva" : "'+item.cargaiva+'" , "categoriaid" : "'+item.categoriaid+'" , "productofinal" : "'+item.productofinal+'" , "materiaprima" : "'+item.materiaprima+'" , "servicio" : "'+item.servicio+'" , "activo" : "'+boolactivo+'","color":"'+item.color+'","tieneimpuestos":"'+item.tieneimpuestos+'"}';
	}else if(accion=='Clientes'){
		jsonc='{  "id" : "'+item.id+'" , "cedula" : "'+item.cedula+'" , "nombre" : "'+item.nombre+'"  , "email" : "'+item.email+'" , "direccion" : "'+item.direccion+'" , "telefono" : "'+item.telefono+'","cupo":"'+item.cupo+'" }';
	}else if(accion=='Facturas'){
		jsonc=item.fetchJson;
        //alert(jsonc);
	}else if(accion=='Config'){
		jsonc='{"nombreempresa":"'+item.nombre+'","razon":"'+item.razon+'","telefono":"'+item.telefono+'","ruc":"'+item.ruc2+'","direccion":"'+item.direccion+'","email":"'+item.email+'","serie":"'+item.serie+'","establecimiento":"'+item.establecimiento+'","nombreterminal":"'+item.nombreterminal+'","idioma":"'+item.id_idioma+'","documento":"'+item.sin_documento+'","orden":"'+item.con_nombre_orden+'","propina":"'+item.con_propina+'","tarjeta":"'+item.con_tarjeta+'","shop":"'+item.con_shop+'","mesas":"'+item.con_mesas+'","id_version_nube":"'+item.id_version_nube+'","pide_telefono":"'+item.pide_telefono+'","telefono_inte":"'+item.telefono_inte+'","mensajefinal":"'+item.mensajefinal+'","terminos":"'+item.terminos_condiciones+'","id_locales":"'+item.id_locales+'","email_fact":"'+item.email_fact+'","key":"'+item.key+'","numero_contribuyente":"'+item.numero_contribuyente+'","obligado_contabilidad":"'+item.obligado_contabilidad+'","prueba_produccion":"'+item.prueba_produccion+'","tiene_factura_electronica":"'+item.tiene_factura_electronica+'","msj_factura_electronica":"'+item.mensaje_factura+'","respaldar":"'+item.respaldar+'","con_comanderas":"'+item.con_comanderas+'","con_notas":"'+item.con_notasorden+'","pagarconcredito":"'+item.pagarconcredito+'","impuestos_personalizados":"'+item.impuestos_personalizados+'"}';
	}else if(accion=='MESAS_DATOS'){
		jsonc='{"id_mesa":"'+item.id_mesa+'","cliente":"'+item.cliente+'","id_cliente":"'+item.id_cliente+'","activo":"'+item.activo+'","id_factura":"'+item.id_factura+'","hora_activacion":"'+item.hora_activacion+'","hora_desactivacion":"'+item.hora_desactivacion+'","pax":"'+item.pax+'","timespan":"'+item.timespan+'"}';
	}else if(accion=='IMPUESTOS'){
		jsonc='{"id_impuesto":"'+item.timespan+'","nombre":"'+item.nombre+'","valor":"'+item.porcentaje+'","activo":"'+item.activo+'"}';
	}else if(accion=='MODIFICADORES'){
		jsonc='{"no_modificador":"'+item.no_modificador+'","id_formulado":"'+item.id_formulado+'","valor":"'+item.valor+'","activo":"'+item.activo+'","nombre":"'+item.nombre+'","timespan":"'+item.timespan+'"}';
	}
	
	console.log(jsonc);
	if(localStorage.getItem("con_localhost") == 'true'){
     var apiURL='http://'+localStorage.getItem("ip_servidor")+'/connectnubepos/api2.php';
    }else{
     var apiURL='https://practisis.net/connectnubepos/api2.php';
    }
	$.post(apiURL,{
		id_emp: localStorage.getItem("empresa"),
		action: accion,
		id_barra: localStorage.getItem("idbarra"),
		json:jsonc,
		deviceid:$("#deviceid").html()
	}).done(function(response){
		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
		db.transaction(function(tx){tx.executeSql('insert into LOGACTIONS (time,descripcion) values (?,?)',[new Date().getTime(),"Successfully upload of:"+accion]);});
		console.log(response);
		if(parseInt(response)>0){
			db.transaction(function(tx){
				var sentencia='UPDATE '+accion+' SET sincronizar="false" WHERE timespan="'+item.timespan+'"';

				if(accion=='Clientes')
				sentencia='UPDATE '+accion+' SET sincronizar="false" WHERE cedula="'+item.cedula+'"';

				if(accion=='Config')
				sentencia='UPDATE '+accion+' SET sincronizar="false" WHERE id=1';

				tx.executeSql(sentencia,[],function(tx,results){});
			},errorCB,function(){
				if(t<arraydatos.length-1){
					t++;
					PostaLaNube(arraydatos,cual,accion,t);
				}else{
					console.log("Subir a la nube 2");
					SubirDatosaNube(cual+1);
				}
			});
		}else{
			if(t<arraydatos.length-1){
				t++;
				PostaLaNube(arraydatos,cual,accion,t);
			}
			else{
				console.log("Subir a la nube 2");
				SubirDatosaNube(cual+1);
			}
		}
		updateOnlineStatus("ONLINE");
	}).fail(function(xhr,status,error){
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
			db.transaction(function(tx){tx.executeSql('insert into LOGACTIONS (time,descripcion,datos) values (?,?,?)',[new Date().getTime(),"Fail upload synchronizer:",status]);});
			updateOnlineStatus("OFFLINE");
			setTimeout(function(){SincronizadorNormal()},180000);
	});
}

function downloadImage(url, fileName){
	//alert("Entra a funcion download antes del new");
	//alert(url);
    var ft = new FileTransfer();
	//alert("Entra a funcion download");
    //ft.download(url,window.rootFS.fullPath + "/" + fileName,
    ft.download(url,cordova.file.dataDirectory+fileName,
        function(entry) {
            //console.log("download complete: " + entry.fullPath);
			console.log("download complete: "+cordova.file.dataDirectory+'+'+entry.fullPath);
        },
        function(error) {
           // console.log("download error" + error.code);
			console.log("download error" + JSON.stringify(error));
        }
    );
}

function verplanes(){
 //document.getElementById('main').style.height='650px';
  document.getElementById('trans_label_24').style.display='none';
  $('.nav-tabs').css('display','none');
  $('#noplan').fadeOut();
  //$('#escojeIdioma').fadeOut();
  $('#cuentaactiva').fadeIn();
  if(localStorage.getItem("idioma")==2){
    $('#planes_en').fadeIn();
    $('#planes_es').fadeOut();
    $('#volverplan_en').fadeIn();
    $('#volverplan_es').fadeOut();
  }else{
    $('#planes_es').fadeIn();
    $('#planes_en').fadeOut();
    $('#volverplan_en').fadeOut();
    $('#volverplan_es').fadeIn();
  }
  $('#pestanasconfig').fadeIn();
  var maxheight='525px';
  $('.jumbotron').css('height',maxheight);

}

function desactivarterminal(){
  if(localStorage.getItem("idioma")==2){
    var r = confirm("Are you sure you turn off the tablet in use?");
  }else{
    var r = confirm("¿Está seguro de desactivar la tablet en uso?");
  }
  if (r == true) {

    var apiURL='https://practisis.net/connectnubepos/api2.php';
	$.post(apiURL,{
		id_emp: localStorage.getItem("empresa"),
		action: 'DesactivaTerminal',
        deviceid:$("#deviceid").html()

	}).done(function(response){

		//alert(response);
        var res = response.split("||");

        if(res[0] == 'ok'){
          if(localStorage.getItem("idioma")==2){
            showalert('Your tablet will turn off successfully.');
          }else{
            showalert('Su tablet se desactivo con éxito.');
          }
          //location.reload(true);
          UserLogin();
        }else{
          if(localStorage.getItem("idioma")==2){
            showalertred('I can not disable.\nPlease try.');
          }else{
            showalertred('No se puedo desactivar.\nVuelva a intentarlo.');
          }
        }

		updateOnlineStatus("ONLINE");

	}).fail(function(){
			updateOnlineStatus("OFFLINE");
			setTimeout(function(){SincronizadorNormal()},180000);
	});

  } else {
  }
}

function VerOpcionesIngreso(){
  $('#noplan').fadeIn();
  $('#cuentaactiva').fadeOut();
  $('#pestanasconfig').fadeOut();
  $('#planes_en').fadeOut();
  $('#planes_es').fadeOut();
  $('#volverplan_es').fadeOut();
  $('#volverplan_en').fadeOut();
}

function IrTerminos(){
  var url="https://www.practisis.net/avapos/terminosycondiciones.php";
  window.open(url);
}

/*function ImprimirLogo(){
	//alert("va imprimir");
	var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
			db.transaction(function (tx){		
			tx.executeSql('SELECT printer,printercom FROM CONFIG where id=1',[],
			function(tx,res){
				if(res.rows.length>0){
					var milogo=localStorage.getItem("logo");
					var miprint=res.rows.item(0);
					if(miprint.printer!=null){
						StarIOAdapter.printlogo(milogo,miprint.printer, function() {
							//alert("imprime");
						});
					}
				}
			});
			},errorCB,successCB);
}*/

function StartQuemado(){
	console.log(">>>>Iniciar quemado>>>");
	JSONproductosNube='{"Productos":[{"formulado_id":2,"formulado_tipo":"-15","formulado_nombre":"Servicios Varios 1US$","formulado_codigo":"1","formulado_precio":"0.892857142857143","color":"rgb(20, 158, 204)","formulado_impuestos":"","formulado_tax_id":"","formulado_matprima":"0" , "formulado_productofinal":"1" , "formulado_timespan" : "1" , "categoria_id" : "-15" , "categoria_nombre" : "Categoría 1" , "cargaiva" : "1" , "categoria_timespan" : "1" , "carga_servicio" : "1", "activo" : "1","tieneimpuestos":"true"},{"formulado_id":3,"formulado_tipo":"-15","formulado_nombre":"Servicios Varios 2US$","formulado_codigo":"2","formulado_precio":"1.78571428571429","color":"rgb(20, 158, 204)","formulado_impuestos":"","formulado_tax_id":"","formulado_matprima":"0" , "formulado_productofinal":"1" , "formulado_timespan" : "2" , "categoria_id" : "-15" , "categoria_nombre" : "Categoría 1" , "cargaiva" : "1" , "categoria_timespan" : "1" , "carga_servicio" : "1", "activo" : "1","tieneimpuestos":"true"},{"formulado_id":4,"formulado_tipo":"-15","formulado_nombre":"Servicios Varios 5US$","formulado_codigo":"3","formulado_precio":"4.46428571428571","color":"rgb(20, 158, 204)","formulado_impuestos":"","formulado_tax_id":"","formulado_matprima":"0" , "formulado_productofinal":"1" , "formulado_timespan" : "3" , "categoria_id" : "-15" , "categoria_nombre" : "Categoría 1" , "cargaiva" : "1" , "categoria_timespan" : "1" , "carga_servicio" : "1", "activo" : "1","tieneimpuestos":"true"},{"formulado_id":5,"formulado_tipo":"-15","formulado_nombre":"Servicios Varios 10US$","formulado_codigo":"4","formulado_precio":"8.92857142857143","color":"rgb(20, 158, 204)","formulado_impuestos":"","formulado_tax_id":"","formulado_matprima":"0" , "formulado_productofinal":"1" , "formulado_timespan" : "4" , "categoria_id" : "-15" , "categoria_nombre" : "Categoría 1" , "cargaiva" : "1" , "categoria_timespan" : "1" , "carga_servicio" : "1", "activo" : "1","tieneimpuestos":"true"},{"formulado_id":6,"formulado_tipo":"-15","formulado_nombre":"Servicios Varios 25US$","formulado_codigo":"5","formulado_precio":"22.3214285714286","color":"rgb(20, 158, 204)","formulado_impuestos":"","formulado_tax_id":"","formulado_matprima":"0" , "formulado_productofinal":"1" , "formulado_timespan" : "5" , "categoria_id" : "-15" , "categoria_nombre" : "Categoría 1" , "cargaiva" : "1" , "categoria_timespan" : "1" , "carga_servicio" : "1", "activo" : "1","tieneimpuestos":"true"},{"formulado_id":7,"formulado_tipo":"-15","formulado_nombre":"Servicios Varios 50US$","formulado_codigo":"6","formulado_precio":"44.6428571428571","color":"rgb(20, 158, 204)","formulado_impuestos":"","formulado_tax_id":"","formulado_matprima":"0" , "formulado_productofinal":"1" , "formulado_timespan" : "6" , "categoria_id" : "-15" , "categoria_nombre" : "Categoría 1" , "cargaiva" : "1" , "categoria_timespan" : "1" , "carga_servicio" : "1", "activo" : "1","tieneimpuestos":"true"},{"formulado_id":7,"formulado_tipo":"-15","formulado_nombre":"Servicios Varios 50US$","formulado_codigo":"6","formulado_precio":"44.6428571428571","color":"rgb(20, 158, 204)","formulado_impuestos":"","formulado_tax_id":"","formulado_matprima":"0" , "formulado_productofinal":"1" , "formulado_timespan" : "6" , "categoria_id" : "-15" , "categoria_nombre" : "Categoría 1" , "cargaiva" : "1" , "categoria_timespan" : "1" , "carga_servicio" : "1", "activo" : "1","tieneimpuestos":"true"},{"formulado_id":8,"formulado_tipo":"-15","formulado_nombre":"Productos Varios 1US$","formulado_codigo":"7","formulado_precio":"0.892857142857143","color":"rgb(21, 204, 64)","formulado_impuestos":"","formulado_tax_id":"","formulado_matprima":"0" , "formulado_productofinal":"1" , "formulado_timespan" : "7" , "categoria_id" : "-15" , "categoria_nombre" : "Categoría 1" , "cargaiva" : "1" , "categoria_timespan" : "1" , "carga_servicio" : "1", "activo" : "1","tieneimpuestos":"true"},{"formulado_id":9,"formulado_tipo":"-15","formulado_nombre":"Productos Varios 2US$","formulado_codigo":"8","formulado_precio":"1.78571428571429","color":"rgb(21, 204, 64)","formulado_impuestos":"","formulado_tax_id":"","formulado_matprima":"0" , "formulado_productofinal":"1" , "formulado_timespan" : "8" , "categoria_id" : "-15" , "categoria_nombre" : "Categoría 1" , "cargaiva" : "1" , "categoria_timespan" : "1" , "carga_servicio" : "1", "activo" : "1","tieneimpuestos":"true"},{"formulado_id":10,"formulado_tipo":"-15","formulado_nombre":"Productos Varios 5US$","formulado_codigo":"9","formulado_precio":"4.46428571428571","color":"rgb(21, 204, 64)","formulado_impuestos":"","formulado_tax_id":"","formulado_matprima":"0" , "formulado_productofinal":"1" , "formulado_timespan" : "9" , "categoria_id" : "-15" , "categoria_nombre" : "Categoría 1" , "cargaiva" : "1" , "categoria_timespan" : "1" , "carga_servicio" : "1", "activo" : "1","tieneimpuestos":"true"},{"formulado_id":11,"formulado_tipo":"-15","formulado_nombre":"Productos Varios 10US$","formulado_codigo":"10","formulado_precio":"8.92857142857143","color":"rgb(21, 204, 64)","formulado_impuestos":"","formulado_tax_id":"","formulado_matprima":"0" , "formulado_productofinal":"1" , "formulado_timespan" : "10" , "categoria_id" : "-15" , "categoria_nombre" : "Categoría 1" , "cargaiva" : "1" , "categoria_timespan" : "1" , "carga_servicio" : "1", "activo" : "1","tieneimpuestos":"true"},{"formulado_id":12,"formulado_tipo":"-15","formulado_nombre":"Productos Varios 25US$","formulado_codigo":"11","formulado_precio":"22.3214285714286","color":"rgb(21, 204, 64)","formulado_impuestos":"","formulado_tax_id":"","formulado_matprima":"0" , "formulado_productofinal":"1" , "formulado_timespan" : "11" , "categoria_id" : "-15" , "categoria_nombre" : "Categoría 1" , "cargaiva" : "1" , "categoria_timespan" : "1" , "carga_servicio" : "1", "activo" : "1","tieneimpuestos":"true"},{"formulado_id":14,"formulado_tipo":"1001","formulado_nombre":"Personalizado","formulado_codigo":"1414","formulado_precio":"0","color":"","formulado_impuestos":"","formulado_tax_id":"","formulado_matprima":"0" , "formulado_productofinal":"1" , "formulado_timespan" : "-14" , "categoria_id" : "1001" , "categoria_nombre" : "Personalizada" , "cargaiva" : "0" , "categoria_timespan" : "-14" , "carga_servicio" : "0", "activo" : "1","tieneimpuestos":"true"}]}';
	JSONcategoriasNube='{"Categorias":[ {"categoria_id":"1","categoria_nombre":"PRODUCTOS" , "categoria_timespan" : "0"},{"categoria_id":"2","categoria_nombre":"CATEGORíA 1" , "categoria_timespan" : "1"},{"categoria_id":"3","categoria_nombre":"CATEGORíA 2" , "categoria_timespan" : "2"},{"categoria_id":"4","categoria_nombre":"CATEGORíA 3" , "categoria_timespan" : "3"}]}';
	JSONclientesNube='{"Clientes":[{"id":"1","nombre":" Consumidor Final","cedula":"9999999999999","telefono":"","direccion":"","email":"","timespan" : "0"}]}';
	JSONpresupuestoNube='{"presupuesto":[]}';
	JSONcategoriasMenuNube='{"menucategorias":[{"orden":"999","nombre":"Categorías Principal","timespan":"1","id":"1","activo":"true"}]}';
	JSONmenuNube='{"menu":[]}';
	JSONpermisosNube='{"permisos":[]}';
	
	var quemados=localStorage.getItem("datosquemados");
	var squem=quemados.split("|");
	
	JSONextraNube='{ "extras" : [ {"num_factura":"000000001","contrasenia":"false","dias":"1826","msj":"","disenomenu":"1","pais":"'+squem['2']+'","idioma":"'+squem[3]+'","documento":"false","orden":"false","propina":"false","tarjeta":"false","shop":"false","notas":"true","comanderas":"true","localhost":"false","ipservidor":"0.0.0.0","mesas":"false","logo":"","imprlogo":"false","id_version_nube":"4","pide_telefono":"true","telefono_inte":"222222","mensajefinal":"****POWERED BY AVAPOS.COM****","plan":"44","terminos":"true","id_locales":"2","id_pais":"'+squem[1]+'","email_fact":"","key":"","numero_contribuyente":"0","obligado_contabilidad":"false","prueba_produccion":"true","tiene_factura_electronica":"false","msj_factura_electronica":"****POWERED BY AVAPOS.COM****","respaldar":"false","con_profesionales":"true"}]}';
	if(squem[1]==1){
		JSONimpuestosNube='{"impuestos":[{"id":"1","nombre":"IVA","porcentaje":"12","activo":"true","timespan":"0"}]}';
	}else if(squem[1]==18||squem[1]==36){
		JSONimpuestosNube='{"impuestos":[{"id":"1","nombre":"IVA","porcentaje":"12","activo":"true","timespan":"0"}]}';
	}else if(squem[1]==35){
		JSONimpuestosNube='{"impuestos":[{"id":"1","nombre":"IVA","porcentaje":"22","activo":"true","timespan":"0"}]}';
	}else if(squem[1]==4){
		JSONimpuestosNube='{"impuestos":[{"id":"1","nombre":"IVA","porcentaje":"21","activo":"true","timespan":"0"}]}';
	}else if(squem[1]==11){
		JSONimpuestosNube='{"impuestos":[{"id":"1","nombre":"IVA","porcentaje":"19","activo":"true","timespan":"0"}]}';
	}else if(squem[1]==27){
		JSONimpuestosNube='{"impuestos":[{"id":"1","nombre":"IGV","porcentaje":"18","activo":"true","timespan":"0"}]}';
	}else if(squem[1]==29){
		JSONimpuestosNube='{"impuestos":[{"id":"1","nombre":"ITBIS","porcentaje":"18","activo":"true","timespan":"0"}]}';
	}else if(squem[1]==9){
		JSONimpuestosNube='{"impuestos":[{"id":"1","nombre":"IPI","porcentaje":"17","activo":"true","timespan":"0"}]}';
	}else if(squem[1]==23||squem[1]==12){
		JSONimpuestosNube='{"impuestos":[{"id":"1","nombre":"IVA","porcentaje":"16","activo":"true","timespan":"0"}]}';
	}else if(squem[1]==21){
		JSONimpuestosNube='{"impuestos":[{"id":"1","nombre":"ISV","porcentaje":"15","activo":"true","timespan":"0"}]}';
	}else if(squem[1]==24){
		JSONimpuestosNube='{"impuestos":[{"id":"1","nombre":"IVA","porcentaje":"15","activo":"true","timespan":"0"}]}';
	}else if(squem[1]==13){
		JSONimpuestosNube='{"impuestos":[{"id":"1","nombre":"IV","porcentaje":"13","activo":"true","timespan":"0"}]}';
	}else if(squem[1]==8||squem[1]==16){
		JSONimpuestosNube='{"impuestos":[{"id":"1","nombre":"IVA","porcentaje":"13","activo":"true","timespan":"0"}]}';
	}else if(squem[1]==28){
		JSONimpuestosNube='{"impuestos":[{"id":"1","nombre":"IVA","porcentaje":"11.50","activo":"true","timespan":"0"}]}';
	}else if(squem[1]==26){
		JSONimpuestosNube='{"impuestos":[{"id":"1","nombre":"IVA","porcentaje":"10","activo":"true","timespan":"0"}]}';
	}else if(squem[1]==25){
		JSONimpuestosNube='{"impuestos":[{"id":"1","nombre":"ITBMS","porcentaje":"7","activo":"true","timespan":"0"}]}';
	}else if(squem[1]==2){
		JSONimpuestosNube='{"impuestos":[{"id":"1","nombre":"TAX","porcentaje":"7","activo":"true","timespan":"0"}]}';
	}
   	
	//JSONimpuestosNube='{"impuestos":[{"id":"1","nombre":"IVA","porcentaje":"14","activo":"true","timespan":"0"}]}';
	JSONmodificadoresNube='{"modificadores":[]}';
	JSONpropinasNube='{"propinas":[]}';
	if(squem[1]==2){
		JSONpropinasNube='{"propinas":[{"valor":"0","porcentaje":"false","activo":"true","id":"1"},{"valor":"5","porcentaje":"false","activo":"false","id":"2"},{"valor":"10","porcentaje":"false","activo":"true","id":"3"},{"valor":"8","porcentaje":"false","activo":"false","id":"4"},{"valor":"-1","porcentaje":"false","activo":"false","id":"5"}]}';
	}
	
	JSONTipoMesasNube='{"tipomesas":[{"id":"1","imagen_activa":"mesagrandeanchaa.png","imagen_inactiva":"mesagrandeanchai.png","es_mesa":"true"},{"id":"2","imagen_activa":"mesagrandealtaa.png","imagen_inactiva":"mesagrandealtai.png","es_mesa":"true"},{"id":"3","imagen_activa":"mesapequenaanchaa.png","imagen_inactiva":"mesapequenaanchai.png","es_mesa":"true"},{"id":"4","imagen_activa":"mesapequenaaltaa.png","imagen_inactiva":"mesapequenaaltai.png","es_mesa":"true"},{"id":"5","imagen_activa":"mesaredondaa.png","imagen_inactiva":"mesaredondai.png","es_mesa":"true"},{"id":"6","imagen_activa":"planta.png","imagen_inactiva":"planta.png","es_mesa":"false"},{"id":"7","imagen_activa":"dobleplanta.png","imagen_inactiva":"dobleplanta","es_mesa":"false"},{"id":"8","imagen_activa":"tripleplanta.png","imagen_inactiva":"tripleplanta.png","es_mesa":"false"},{"id":"9","imagen_activa":"caja.png","imagen_inactiva":"caja.png","es_mesa":"false"},{"id":"10","imagen_activa":"salida.png","imagen_inactiva":"salida.png","es_mesa":"false"},{"id":"11","imagen_activa":"delivera.png","imagen_inactiva":"deliverd.png","es_mesa":"true"}]}';
	JSONMesasNube='{"mesas":[{"id":"1","left":"89","top":"232","tipo_mesa":"2","nombre":"Mesa 1","activo":"true","tab":"1"},{"id":"2","left":"428","top":"235","tipo_mesa":"2","nombre":"Mesa 2","activo":"true","tab":"1"},{"id":"3","left":"361","top":"338","tipo_mesa":"3","nombre":"Mesa 3","activo":"true","tab":"1"},{"id":"4","left":"314","top":"254","tipo_mesa":"5","nombre":"Mesa 4","activo":"true","tab":"1"},{"id":"5","left":"204","top":"250","tipo_mesa":"5","nombre":"Mesa 5","activo":"true","tab":"1"},{"id":"6","left":"351","top":"420","tipo_mesa":"6","nombre":"Objeto 6","activo":"true","tab":"1"},{"id":"7","left":"220","top":"127","tipo_mesa":"8","nombre":"Objeto 7","activo":"true","tab":"1"},{"id":"8","left":"38","top":"362","tipo_mesa":"9","nombre":"Objeto 8","activo":"true","tab":"1"},{"id":"9","left":"226","top":"404","tipo_mesa":"10","nombre":"Objeto 9","activo":"true","tab":"1"},{"id":"10","left":"146","top":"421","tipo_mesa":"6","nombre":"Objeto 10","activo":"true","tab":"1"},{"id":"11","left":"144","top":"337","tipo_mesa":"3","nombre":"Mesa 11","activo":"true","tab":"1"}]}';
	
	
	JSONLocales='{"locales":[{"local":"'+squem[0]+'","timespan":"2","activo":"true"}]}';
		
	$("#JSONclientesNube").html(JSONclientesNube);
	$("#JSONCategoriasNube").html(JSONcategoriasNube);
	$("#JSONproductosNube").html(JSONproductosNube);
	$("#JSONpresupuestoNube").html(JSONpresupuestoNube);
	$('#JSONCatMenuNube').html(JSONcategoriasMenuNube);
	$('#JSONMenuNube').html(JSONmenuNube);
	$('#JSONPermisosNube').html(JSONpermisosNube);
	$('#JSONExtraNube').html(JSONextraNube);
	$('#JSONImpuestosNube').html(JSONimpuestosNube);
	$('#JSONModifNube').html(JSONmodificadoresNube);
	$('#JSONPropinasNube').html(JSONpropinasNube);
	$('#JSONTipoMesasNube').html(JSONTipoMesasNube);
	$('#JSONMesasNube').html(JSONMesasNube);
	$('#JSONLocales').html(JSONLocales);
	localStorage.setItem('terminos','true');
	localStorage.setItem('telefono_inte','222222');
	localStorage.setItem('pide_telefono','true');
	ExtraeDatosApi(1);
}

//-----------------------------------Fin nuevo---------------