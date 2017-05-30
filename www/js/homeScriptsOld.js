var editarProductoID;
function alerta(text){
	$("#message").html(text);
	$( "body" ).animate( { scrollTop : 0});
	$("#contentMessages").animate({ height : "40px" },function(){
		setTimeout(function(){
			$("#contentMessages").animate({ height : "0px" });
		},3000);
	});
	
}
function loginPractisis(){
		
		$('#btnvalida2').html="<img src='images/loader.gif' width='20px'/>";
		var quien=$("#user2").val();
		var pass=$("#pass2").val();	
		//var pass=document.getElementById("pass2").value;
		$.get("https://www.practisis.net/loginNubeposExistente.php?id="+quien+"&pass="+pass).done(function(data){
			if(data != 'error'){
				$("#divdatoslogin").html(data);
			}
		});
	}

function envia(donde){
	
		$("#simple-menu").click();

					var lugar='';
				
					if(donde=='dashboard')
					lugar="views/dashboard/dashboard.html";
					if(donde=='puntodeventa')
					lugar="views/nubepos/nubepos.html";
					
					if(donde=='listaproductos')
					lugar="views/productos/listaproductos.html";
					if(donde=='nuevoproducto')
					lugar="views/productos/nuevoproducto.html";
                    if(donde=='inventario')
					lugar="views/productos/inventarioproductos.html";
					if(donde=='listadeclientes'){				lugar="views/clientes/listaclientes.html"; }
					if(donde=='nuevocliente')
					lugar="views/clientes/nuevocliente.html";
					if(donde=='historial')
					lugar="views/facturacion/historial.html";
					if(donde=='cloud')
					lugar="views/cloud/indexCloud.html";
					//alert(lugar);
					if(!lugar) lugar="404.html";
					
					$('#main').load(lugar,function(){
					//$(".modal-backdrop").fadeOut();
						//$("#fade").fadeOut("fast");
						//alert("here");
						
						
						DOMOnTap();
					});
					
					//$("#menuClickeable").click();
					//$('#myModal').delay(1500).modal('hide');
					/*$('#content').load(lugar,function(){
						$('#myModal').fadeOut('fast');
						DOMOnTap();
					})*/;
				}
				
				
				
				
				$( document ).ready(function() {
			console.log( "listos espartanos!" );
			
			var smallerMenu = false;	
			$('.modal').each(centerModal);
			//$('#myModal').modal('show');
			//envia('dashboard');
			envia('cloud');
			onDeviceReady();
			
			
			
			
			function saberNuevos(){
				var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
				var excluir = 0;
				tx.executeSql('SELECT * from logActualizar where final <> ? ',[excluir],function(tx,results){
					var actualizar='';
					for (var i=0; i < results.rows.length; i++){
						var row = results.rows.item(i);
						var tabla = row.tabla;
						var actual = row.final;
						console.log('tabla : '+tabla+'  cantidad : ' + actual);
						actualizar+='<tr><td align="left">'+tabla+'</td><td align="center">Actualizaciones : '+actual+'</td></tr>';
						muestraActualiziones(actualizar);
					}
					
				});
			
				},errorCB,successCB);
			}
		
		
			function muestraActualiziones(datos){
					$('#recibeAlertasActualizaciones').html("<table style='width:100%;' border='0' cellpadding='10px' class='table table-striped' ><tr><th>Accion</th><th>Cantidad</th></tr>"+datos+"</table>");
					$('#alertaNuevos').fadeIn('slow');
					setTimeout(function() {
						$('#alertaNuevos').fadeOut('slow');
					},1500);
					
				}
			
	



		function centerModal(){ 
			$(this).css('display', 'block');
			var $dialog = $(this).find(".modal-dialog");
			var offset = ($(window).height() - $dialog.height()) / 2;
			// Center modal vertically in window
			$dialog.css("margin-top", offset);
		}

		$(window).on('resize',function(){
				$('.modal:visible').each(centerModal);
				if($(this).width() >= 768){
					$('#nav-container').data('isshown','false');
					}
			
				if($('#nav-container').data('isshown') == 'false'){
					if($(this).width() >= 768){
						$('#nav-container').css('left','0px');
						$('#content').css('left','220px');
						$('.menuItem').css('left','0px');
						smallerMenu = false;
						}
					else{
						$('#nav-container').css('left','-220px');
						$('#content').css('left','0px');
						$('.menuItem').css('left','0px');
						}
					}
		});
				
		$('.menu-button').on('click',function(){
				if($('#nav-container').css('left') == '0px'){
					$('#nav-container').css('left','-220px').data('isshown','false');
					$('#content').css('left','0px');
					}
				else{
					$('#nav-container').css('left','0px').data('isshown','true');
					$('#content').css('left','220px');
					}
		});
		
		$('.toggle-min').on('click',function(){
			if ($('#nav-container, .menuItem, #content').is(':animated')){
				return false;
			}
			$('li').find('ul').slideUp();
		
			if(smallerMenu === false){
				$('#content').animate({
					left : '50px'
					});
				
				$('#nav-container').animate({
					left : '-220px',
					},function(){
						$('.menuItem').each(function(index,object){
							$(this).delay(index * 100);
							
							$(object).animate({
								left : '220px'},{
									duration: 800,
									easing: 'swing'
									});
							});
						});
				
				setTimeout(function(){
					$('.menuItem').animate({
						left : '170px'
						});
						
					$('#nav-container').animate({
						left : '-170px'
						});
					},1500)
				
				smallerMenu = true;
				}
			else{
				$('li.open').find('ul').slideDown();
			
				$('#content').animate({
					left : '220px'
					});
					
				$('#nav-container').animate({
					left : '0'
					});
				
				$('.menuItem').animate({
					left : '0px'
					});
					
				smallerMenu = false;
				}
			});
		
		$('#nav > li').on('mouseenter',function(){
			if(smallerMenu === true){
				if($(this).closest('li').children('ul').length > 0){
					var menu = '';
					$(this).closest('li').children('ul').children('li').each(function(){
						
						var getHTML = $(this).html();
						var newHTML = $(getHTML);
						var url = newHTML.attr('href');
						newHTML.find('i').css({'padding' : '0px', 'padding-left' : '10px', 'padding-right' : '10px', 'text-align' : 'left'});
						menu += '<li style="text-align: left;"><a style="padding: 0px;" href="'+ url +'">'+ newHTML.html() +'</a></li>';
						});
						
					$(this).find('i:first').append('<div class="dynMenu" style="background-color: #f1f1f1; color: #333333; left: 50px; width: 200px; font-family: Roboto,Arial,Helvetica,sans-serif; box-shadow: 1px 0px 6px 0px rgba(50, 50, 50, 0.64); top: 0; position: absolute; z-index: 999999;"><ul style="display: block;">'+ menu +'</div>');
					}
				}
		});
			
			$('#nav > li').on('mouseleave',function(){
				$('.dynMenu').remove();
			});

			$('#nav li').on('click',function(event){
				if(smallerMenu === false){
					event.stopPropagation();
					if($('#nav > li > a').attr('href') == '#'){
						if($(this).find('ul').length > 0){
							if($(this).find('ul').css('display') == 'block'){
								$('#nav-wrapper ul#nav li ul').removeClass('open');
								$('#nav-wrapper ul#nav li ul').slideUp();
								}
							else{
								$('#nav-wrapper ul#nav li').removeClass('open');
								$('#nav-wrapper ul#nav li ul').slideUp();
								$(this).addClass('open');
								$(this).find('ul').slideDown();
								}
							}
						}
				}else{
					if($(this).closest('li').children('ul').length > 0){
						$('.dynMenu').remove();
						var menu = '';
						$(this).closest('li').children('ul').children('li').each(function(){
							var getHTML = $(this).html();
							var newHTML = $(getHTML);
							newHTML.find('i').css({'padding' : '0px', 'padding-left' : '10px', 'padding-right' : '10px', 'text-align' : 'left'});
							
							menu += '<li style="text-align: left;">'+ newHTML.html() +'</li>';
							});
							
						$(this).find('i:first').append('<div class="dynMenu" style="background-color: #f1f1f1; color: #333333; left: 50px; width: 200px; font-family: Roboto,Arial,Helvetica,sans-serif; box-shadow: 1px 0px 6px 0px rgba(50, 50, 50, 0.64); top: 0; position: absolute; z-index: 999999;"><ul style="display: block;">'+ menu +'</div>');
						}
					}
				});
	
			
				
				
	
			
		});
	
	DOMOnTap();
	function DOMOnTap(){
			
				$("*[ontap]").each(function(){
					var element=$(this);
					var hammertime = Hammer(element).on("tap", function(event) {
						ev=element.attr("ontap");
						eval(ev);
					});
				});
			
			}
			
		
	
	/*Ajax Load Html out document.ready scripts */
	function recibeConsultaApi(id_emp){
			$("#fadeRow").fadeOut();
			 $("#contentStepSincro").fadeIn();
				localStorage.setItem("empresa", id_emp);
				
				 var empresa = localStorage.getItem('empresa');
				 $('#id_emp').html('Emp'+empresa);
				 
				var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
					tx.executeSql('SELECT COUNT(id) as cuantos FROM empresa',[],function(tx,res){
						var existen=res.rows.item(0).cuantos;
						if(existen==0){
							
							db.transaction(
								function (tx){
									tx.executeSql('INSERT INTO empresa (nombre) VALUES (?);',[id_emp],
									function(tx,res){
										
										console.log("Insert ID Empresa Sql:"+res.insertId);
										console.log(res);
										//envia('cloud');
										
									});				
								},errorCB,successCB
							);
						}
						sincronizarProcess();
					});
				
				},errorCB,successCB);
		/*
				setTimeout(function(){
					cerrarLogin2()
				}, 2000);*/
				/*
				setTimeout(function(){
					$('#cuentasSinc').css('display','none');
					$('#mainDivSinc').fadeIn('slow');
				}, 3000);
		*/
			}
	function getTimeSpan(){
		var rn=Math.floor((Math.random() * 10000) + 1);
		var d = new Date();
		var n = d.getTime();
		return n+''+rn;
	}
	
		function enviaConsultaApi(id){
			$.post('https://www.practisis.net/nubeposboot/www/ajax/dataservice.php',{
				id : id 
			}).done(function(response){
				var arraydatos=JSON.parse(response);
				//alert(response);
				$('#empresaName').html(arraydatos.empresa.nombre);
				$('#nemp').html("Emp. "+arraydatos.empresa.num);
				$('#jsonProductos').html(arraydatos.productos);
				$('#jsonCategorias').html(arraydatos.categorias);
				$('#jsonformaspago').html(arraydatos.formaspago);
				$('#jsonmisclientes').html(arraydatos.clientes);
				$('#jsoncaja').html(arraydatos.cajas);
				$('#loginPractisis').fadeOut('fast');
				Ingresaproductos();
				
			});
		}
	
	
	function abrirLogin(){
	$('#loginPractisis').fadeIn(function(){
			$('#popupLogin').animate({
				marginTop : 0
				},1000,function(){
						$('#addDiscount').select();
						$('#addDiscount').focus();
						$('#addDiscount').val('');
				});
		});
	
	}
	
	function abrirLogin2(){
		$('#loginPractisisNuevo').fadeIn(function(){
			$('#popupLoginNuevo').animate({
				marginTop : 0
				},1000,function(){
						$('#addDiscount').select();
						$('#addDiscount').focus();
						$('#addDiscount').val('');
				});
		});
	
	}

	function abrirVentanaCuentas(){
		$('#ventanaCuentas').fadeIn(function(){
				$('#popupLogin2').animate({
					marginTop : 0
					},1000,function(){
							$('#addDiscount').select();
							$('#addDiscount').focus();
							$('#addDiscount').val('');
					});
			});
		
	}
	function cerrarVentanaCuentas(){
		$('#popupLogin2').animate({
			marginTop : '1000px'
			},1000,function(){
			$('#ventanaCuentas').fadeOut('slow');
		});
	}
	function cerrarLogin(){
		$('#popupLogin').animate({
			marginTop : '1000px'
			},1000,function(){
			$('#loginPractisis').fadeOut('slow');
		});
	}
	function nuevaCuenta(){
		//alert('hola');
		$('#popupLoginNuevo').css('display','none');
		$('#cuentasSinc').css('display','none');
		$('#contenedorNuevaCuenta').fadeIn('slow');
		
	}
	
	function cerrarLogin3(){
		//alert('hola');
		$('#contenedorNuevaCuenta').css('display','none');
		$('#popupLoginNuevo').css('display','none');
		$('#cuentasSinc').fadeIn('slow');
		
	}
	function cerrarLogin2(){
		$('#popupLoginNuevo').animate({
			marginTop : '1000px'
			},1000,function(){
			$('#loginPractisisNuevo').fadeOut('slow');
		});
	}
	
	
	function usarLogin(){
        $('#cuentasSinc').fadeOut('slow');
        setTimeout(function() {
            $('#popupLoginNuevo').fadeIn('slow');
        }, 1000);

    }
	
	
	
	
	
	
	
	function valida(){
		document.getElementById('btnvalida').innerHTML="<img src='images/loader.gif' width='20px'/>";
		var quien=document.getElementById("user").value;
		var pass=document.getElementById("pass").value;
		var xmlhttp=false;
		if (!xmlhttp && typeof XMLHttpRequest!='undefined') { try {xmlhttp = new XMLHttpRequest(); } catch (e) { xmlhttp=false;}}
		if (!xmlhttp && window.createRequest) {	try { xmlhttp = window.createRequest();} catch (e) { xmlhttp=false;}}
		xmlhttp.open("GET","https://www.practisis.net/loginNubepos.php?id="+quien+"&pass="+pass,true);
		xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4){
			if(xmlhttp.status==200){
					var respuesta=xmlhttp.responseText;
					console.log($.trim(respuesta));
					if (respuesta.trim()!='error'){
						$('#contieneEmpresas').html(respuesta);
						
					}else{
						document.getElementById("mensaje").innerHTML="Credenciales no autorizadas.";
						document.getElementById("user").value="";
						document.getElementById("pass").value="";
					}

		}}} 
		xmlhttp.send(null);
	}  

	
	function valida2(){
		document.getElementById('btnvalida2').innerHTML="<img src='images/loader.gif' width='20px'/>";
		var quien=document.getElementById("user2").value;
		var pass=document.getElementById("pass2").value;
		var xmlhttp=false;
		if (!xmlhttp && typeof XMLHttpRequest!='undefined') { try {xmlhttp = new XMLHttpRequest(); } catch (e) { xmlhttp=false;}}
		if (!xmlhttp && window.createRequest) {	try { xmlhttp = window.createRequest();} catch (e) { xmlhttp=false;}}
		xmlhttp.open("GET","https://www.practisis.net/loginNubeposExistente.php?id="+quien+"&pass="+pass,true);
		xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4){
			if(xmlhttp.status==200){
					var respuesta=xmlhttp.responseText;
					alert(respuesta);
					console.log($.trim(respuesta));
					if (respuesta.trim()!='error'){
						$('#contieneEmpresasNuevo').html(respuesta);
						
					}else{
						document.getElementById('btnvalida2').innerHTML="Login";
						document.getElementById("mensaje2").innerHTML="Credenciales no autorizadas.";
						document.getElementById("user").value="";
						document.getElementById("pass").value="";
					}

		}}} 
		xmlhttp.send(null);
	}  


	
