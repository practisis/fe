var editarProductoID;
var editarClientesID;
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

	
	function updateOnlineStatus(condition) {
					var status = document.getElementById("status");
					//var condition = navigator.onLine ? "ONLINE" : "OFFLINE";
					var state = document.getElementById("state");
					var log = document.getElementById("log");
					$('#conexion').val(condition);
					
					var conexionInternet = $('#conexion').val();
					console.log(conexionInternet)
					if(conexionInternet == 'ONLINE' ){
						$('#cloudIndex').css('display','block');
						$('#cloudIndexOff').css('display','none');
					}else if(conexionInternet == 'OFFLINE' ){
						$('#cloudIndex').css('display','none');
						$('#cloudIndexOff').css('display','block');
					}
	}
	
	function loaded() {
		updateOnlineStatus();
		//setInterval(updateOnlineStatus, 3000);
		//document.body.addEventListener("offline", function () { updateOnlineStatus("offline") }, false);
		//document.body.addEventListener("online", function () { updateOnlineStatus("online") }, false);
	}
				

				
	$( document ).ready(function(){});
	
	/*Ajax Load Html out document.ready scripts */
	function recibeConsultaApi(id_emp,nombreempresa){
			$("#fadeRow").fadeOut();
			 $("#contentStepSincro").fadeIn();
				localStorage.setItem("empresa", id_emp);
				$.post
				localStorage.setItem("nombreempresa",nombreempresa );
				
				 var empresa = localStorage.getItem('empresa');

				 $('#id_emp').html('Emp'+empresa);
				 
				var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
				db.transaction(function(tx){
					tx.executeSql('SELECT COUNT(id) as cuantos FROM empresa',[],function(tx,res){
						var existen=res.rows.item(0).cuantos;
						if(existen==0){
							
							db.transaction(
								function (tx){
									tx.executeSql('INSERT INTO empresa (nombre,nombreempresa) VALUES (?,?);',[id_emp,nombreempresa],
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


	
