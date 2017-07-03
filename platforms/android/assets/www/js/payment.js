var pagonormal=true;
function receiveJson(){
	if($('#json').html() != ''){
		//alert($('#json').html());
		var fetchJsonStrng = $('#json').html();
		var jsonObject = eval("(" + fetchJsonStrng + ")");
		$('#payClientName').html(jsonObject.Pagar[0].cliente.nombre);
		$('#payClientIDCard').html(jsonObject.Pagar[0].cliente.cedula);
		//$('#invoiceTotal').html(parseFloat(jsonObject.Pagar[0].factura.total).toFixed(2));
		$('#invoiceTotal').html(parseFloat(jsonObject.Pagar[0].factura.total).toFixed(2));
		$('#cardValue').val(jsonObject.Pagar[0].factura.total);
		$('#chequeValue').val(jsonObject.Pagar[0].factura.total);
		$('#valueCxX').val(jsonObject.Pagar[0].factura.total);
		$('#printTotal').html(jsonObject.Pagar[0].factura.total);
	}
}

//changePaymentCategory(0);

function changePaymentCategory(index,nombre){

    //$('#valortarjeta').prop("readonly",false);
    //$('#payButton').fadeIn("fast");
    $('#order_id').val('');
	$('.fa-caret-down').attr('class','fa fa-caret-right');
	$('.touchpago').css('display','none');
	
	$('.columna1 div').each(function(){
			$(this).attr('class','paymentCategories');
			$(this).css('backgroundColor','');
	});
	
	$('#paymentCategory-'+index).attr('class','categoryChosen');
	if(nombre=="Efectivo") $('#touchefectivo').fadeIn();
	if(nombre=="Tarjetas") $('#touchtarjetas').fadeIn();
	if(nombre=="Cheques") $('#touchcheques').fadeIn();
	if(nombre=="CxC") $('#touchcxc').fadeIn();
	if(nombre=="ConsumoI") $('#touchConsumoI').fadeIn();
	
	//alert($('#touchcheques').html()+'/'+$('#touchcheques').css('display'));
	
	if(pagonormal==true){
		$('.paymentMethods').each(function(){
			if($(this).attr('idpaymentmethod')!=index){
				 $(this).val('0.00');
				 if(index==3)$('#valorcxc').val('0.00');
				 if(index==4)$('#valorcheque1').val('0.00');
				 if(index==5)$('#valorConsumoI').val('0.00');
				//$('#simple_'+index).html('0.00');
			}
		});
	}
		
	
	/*$('.paymentMethods').each(function(){
		if($(this).attr('idPaymentMethod')==index){
			$(this).click();
		}
	});*/
	
	if(pagonormal==true&&nombre!='Tarjetas'){
		$('.cardv').html('');
		$('#valortarjeta').val('0.00');
		$('.card').attr('data-value','0');
		//$('#simple_2').html('0.00');
	}
	
	//alert(pagonormal+"/"+cual);
	
	if(nombre=='Efectivo'){
		$('#caretEfectivo').attr('class','fa fa-caret-down');
		if(pagonormal==true){
			$('#valorcxc,#paymentCxC,#valorcheque1,#paymentCheques').val("0.00");
		}else{
			$('#paymentEfectivo').select();
		}
		
	}
	if(nombre=='Tarjetas'){
		$('#caretTarjetas').attr('class','fa fa-caret-down');
		if(pagonormal==true){
			$('#valorcxc,#paymentCxC,#valorcheque1,#paymentCheques').val("0.00");
		}else{
			
		}
	}
	
	//alert(nombre);
	
	if(nombre=='Cheques'){
		$('#caretCheques').attr('class','fa fa-caret-down');
		if(pagonormal==true){
			$('#valorcxc,#paymentCxC').val("0.00");
			$('#valorcheque1,#paymentCheques').val(parseFloat($('#total').html().substring(1)).toFixed(2));
			$('#paymentChequesa').html('$ '+parseFloat($('#total').html().substring(1)).toFixed(2));
		}else{
				if(parseFloat($('#valorcheque1').val())==0||$('#valorcheque1').val()==""){
					if((parseFloat($('#invoicePaid').html())-parseFloat($('#invoiceTotal').html()))<0){
						$('#valorcheque1,#paymentCheques').val(parseFloat($('#changeFromPurchase').html()).toFixed(2));
						$('#paymentChequesa').html('$ '+parseFloat($('#changeFromPurchase').html()).toFixed(2));
					}
				}
		}
		
	}
	if(nombre=='CxC'){
		$('#caretCxC').attr('class','fa fa-caret-down');
		$('#touchcxc').fadeIn();
		if(pagonormal==true){
			$('#valorcheque1,#paymentCheques').val("0.00");
			$('#valorcxc,#paymentCxC').val(parseFloat($('#total').html().substring(1)).toFixed(2));
			$('#paymentCxCa').html('$ '+parseFloat($('#total').html().substring(1)).toFixed(2));
		}else{
				if(parseFloat($('#valorcxc').val())==0){
				if((parseFloat($('#invoicePaid').html())-parseFloat($('#invoiceTotal').html()))<0){
					$('#valorcxc,#paymentCxC').val(parseFloat($('#changeFromPurchase').html()).toFixed(2));
					$('#paymentCxCa').html('$ '+parseFloat($('#changeFromPurchase').html()).toFixed(2));
				}
			}
		}
	}
	
	if(nombre=='ConsumoI'){
		$('#caretConsumoI').attr('class','fa fa-caret-down');
		$('#touchConsumoI').fadeIn();
		if(pagonormal==true){
			$('#valorcheque1,#paymentCheques').val("0.00");
			$('#valorcxc,#paymentCxC').val("0.00");
			$('#valorConsumoI,#paymentConsumoI').val(parseFloat($('#total').html().substring(1)).toFixed(2));
			$('#paymentConsumoIa').html('$ '+parseFloat($('#total').html().substring(1)).toFixed(2));
		}else{
				//alert($('#valorConsumoI').val());
				if(parseFloat($('#valorConsumoI').val())==0){
				if((parseFloat($('#invoicePaid').html())-parseFloat($('#invoiceTotal').html()))<0){
					$('#valorConsumoI,#paymentConsumoI').val(parseFloat($('#changeFromPurchase').html()).toFixed(2));
					$('#paymentConsumoIa').html('$ '+parseFloat($('#changeFromPurchase').html()).toFixed(2));
				}
			}
		}
	}

	
	var value = 0;
	$('.paymentMethods').each(function(){
		if($(this).val() != 0 && $(this).val() != '' && $(this).val() != null){
			var miid=$('#'+$(this).attr('id')+'a');
			miid.html('$ '+$(this).val());
			value += parseFloat($(this).val());
		}else{
			var miid=$('#'+$(this).attr('id')+'a').html('$ 0.00');
		}
	});
	
	updateForm(value);
}

$('.resetPayment').click(function(){
	sumOfButtonClicked = 0;
	var newValue = 0;
	$('#paymentEfectivo').val('');
	$('.paymentMethods').change();
});
	
	
$('.intPayment').click(function(){
	var calculateCeil = Math.ceil(parseFloat($('#invoiceTotal').html()));
	$('#paymentEfectivo').val(calculateCeil);
	$('.paymentMethods').change();
	});
	
$('.exactPayment').click(function(){
	var calculate = (parseFloat($('#invoiceTotal').html()));
	$('#paymentEfectivo').val(calculate);
	$('.paymentMethods').change();

});

$('.paymentMethods').change(function(){
	var value = 0;
	$('.paymentMethods').each(function(){
		if($(this).val() != 0 && $(this).val() != '' && $(this).val() != null){
			//$('#'+$(this).attr('id')+'a').html("$ "+$(this).val());
			value += parseFloat($(this).val());
			}
		});
	updateForm(value);
});
	
var sumOfButtonClicked = 0;
$('.buttonsPayment').click(function(){
	var dataValue = $(this).attr('data-value');
	var valueFromButtonClicked = $.trim(parseFloat(dataValue));
	sumOfButtonClicked += parseFloat(valueFromButtonClicked);
	//$('#paymentEfectivo').val(parseFloat(sumOfButtonClicked).toFixed(2));
	
	var value = 0;
	$('.paymentMethods').each(function(){
		if($(this).val() != 0 && $(this).val() != '' && $(this).val() != null){
			value += parseFloat($(this).val());
			}
		});
	updateForm(value);
});
	
function updateForm(value){
	value = parseFloat(value);
	var total = parseFloat($('#total').html().substring(1));
	var change = (value - total);
	//alert(value+'/'+total+'/'+change);
	if(value < total){
		$('#invoiceDebt').html('FALTANTE');
		if(localStorage.getItem("idioma")==2)
			$('#invoiceDebt').html("TO PAY");
		change = Math.abs(change);
		$('#invoicePaid').html(value.toFixed(2));
		$('#cardValue').val(change.toFixed(2));
		$('#chequeValue').val(change.toFixed(2));
		$('#valueCxX').val(change.toFixed(2));
	}
	else if(value > total){
		$('#invoiceDebt').html('VUELTO');
		if(localStorage.getItem("idioma")==2)
			$('#invoiceDebt').html("CHANGE");
		change = Math.abs(change);
		$('#invoicePaid').html(value.toFixed(2));
		$('#cardValue').val(0);
		$('#chequeValue').val(0);
	}
	else if(value == total){
			$('#invoiceDebt').html('VUELTO');
			if(localStorage.getItem("idioma")==2)
				$('#invoiceDebt').html("CHANGE");
			change = Math.abs(change);
			$('#invoicePaid').html(value.toFixed(2));
			$('#cardValue').val(0);
			$('#chequeValue').val(0);
	}
	    
	$('#changeFromPurchase').html(Math.abs(change).toFixed(2));
	
	if(pagonormal==true){
		if(parseFloat($('#invoicePaid').html())>0){
			VerificarComandas();
		}
	}
}

function antesperformPurchase(restaurant){
	
	/*localStorage.setItem("dongle","no"); //este es un tema temporal, esto tiene que conectarse con Ruben.
	var tieneDongle=localStorage.getItem("dongle");
	if (localStorage.getItem("dongle")=='yes'){
		llamaDongle();
	}
	else{*/
		performPurchase(restaurant);
	/*}*/

}


function performPurchase(restaurant){
	
	//$('#cargandoTabs').modal("show");
	//$('#printFactura').show();
	$('#btn_descuento').html('DESC');
	pagar();
	if($('#idCliente').val()!=''&&$('#idCliente').val()>0){
		if(parseFloat($('#invoicePaid').html())>0){
		var table;
		var aux=$('#invoiceNr').val();
		var acc = 0;
		//var echo = document.getElementById('echo').value;
		var echo = Math.abs(parseFloat($('#changeFromPurchase').html()));
		var invoicePaid = parseFloat($('#invoicePaid').html());
		var invoiceTotal = parseFloat($('#invoiceTotal').html());
		
		if(invoicePaid < invoiceTotal){
			if(localStorage.getItem("idioma")==1)
				showalertred('El valor pagado es menor del total');
			else if(localStorage.getItem("idioma")==2)
				showalertred('The amount paid is less than the total');
			
            //$('#printFactura').hide();
			return false;
		}
			
		//$('#payButton').hide();
		//$('#payButtonActivated').show();
		
		//figure out what payments types were used and store them into an array
		var paymentsUsed = new Array();
		$('.paymentMethods').each(function(){
			if($(this).val() != '' && $(this).val() != 0 && $(this).val() != null){
				var paymentMethod = $(this).attr('paymentMethod');
				var idPaymentMethod = $(this).attr('idPaymentMethod')
				var combineToString = paymentMethod +'|'+ idPaymentMethod;
				paymentsUsed.push(idPaymentMethod);
				}
			});
		
		var fetchJson = $('#json').html();
		var figureOutLength = paymentsUsed.length;
		var cash = 0;
		var valueCxC = 0;
		var credit = 0;
		var newCredit = 0;
		var justificationCxC = '';
		var creditJustification = '';
		var giftValue = 0;
		var	giftJustification = '';
		var paymentConsumoInterno = 0;
		var internalJustification = '';
		var cards = new Array();
		var cheques = new Array();
		
		$.each(paymentsUsed, function(index,value){
			if(value == 1){
				cash = parseFloat($('#paymentEfectivo').val());
				}
		
			if(value == 2){
				//$('.cardRow').each(function(){
					var fetchCardID = parseInt($('#card-'+ $(this).attr('id')).attr('cardID'));
					var cardLote = parseFloat($('#lote-'+ $(this).attr('id')).html());
					//var cardValue = parseFloat($('#cardvalue-'+ $(this).attr('id')).html());
					var cardValue = parseFloat($('#paymentTarjetas').val());
					//var combineCardInfo = fetchCardID +'|'+ cardLote +'|'+ cardValue +'@';
					var combineCardInfo = '0|0|'+cardValue+'@';
					cards.push(combineCardInfo);
					//});
			}
				
			if(value == 3){
				//$('.chequeRow').each(function(){
					var fetchBankID = parseInt($('#bank-'+ $(this).attr('id')).attr('bankID'));
					var chequeNumber = parseFloat($('#number-'+ $(this).attr('id')).html());
					//var chequeValue = parseFloat($('#chequevalue-'+ $(this).attr('id')).html());
					var chequeValue = parseFloat($('#paymentCheques').val());
					//var combineChequeInfo = fetchBankID +'|'+ chequeNumber +'|'+ chequeValue +'@';
					var combineChequeInfo = '0|0|'+ chequeValue +'@';
					cheques.push(combineChequeInfo);
					//});
				}
				
			if(value == 4){
				valueCxC = $('#paymentCxC').val();
				justificationCxC = $('#justcxc').val();
			}
			
			if(value == 5){
				paymentConsumoInterno = $('#paymentConsumoI').val();
			}
				
			if(value == 6){
				credit = $('#paymentPrepago').val();
			}
				
			if(value == 7){
				newCredit = $('#paymentNotadeCredito').val();
				creditJustification = $('#creditJustification').val();
				}
				
			if(value == 9){
				giftValue = $('#paymentCortesia').val();
				giftJustification = $('#giftJustification').val();
				}
				
			/*if(value == 12){
				paymentConsumoInterno = $('#paymentConsumoInterno').val();
				internalJustification = $('#internalJustification').val();
				}*/
			
			});

			//var clientName = $.trim($('#payClientName').html());
            var clientName = $.trim($('#clientefind').html());
			var RUC = $.trim($('#cedulaP').val());
			var address = $('#direccionP').val();
			var tele = $('#telefonoP').val();
			
			//console.log(clientName+'/'+RUC);
			//console.log(clientName+'/'+RUC);
			/*funcion para insertar datos de las facturas*/
			var hoy=new Date().getTime();
			//console.log(hoy);
			
			var mitimespan=$('#timespanFactura').val();
			
			echo=parseFloat(invoicePaid-invoiceTotal);

			/*VALORES PARA LA FACTURA*/
			var mitotal=$('#total').html().substring(1);
			var subconiva=$('#subtotalIva').val();
			var subsiniva=$('#subtotalSinIva').val();
			var eliva=0;
			if($('#impuestoFactura-1').val()!=''&&$('#impuestoFactura-1').length) eliva=$('#impuestoFactura-1').val();
			var factc=$('#invoiceNrComplete').val();
			//alert(eliva);
			var servicio=0;
			if($('#impuestoFactura-2').length&&$('#impuestoFactura-2').val()!='') servicio=$('#impuestoFactura-2').val();
			
			var descuento=$('#descuentoFactura').val();
			
			/*cadenaimpuestos*/
			var c=0;
			var dataimpuestos='';
			$('.esImpuesto').each(function(){
				var getName = $(this).data('nombre');
				var getId = $(this).data('id');
				var getValue = $(this).data('valor');

				if(c>0){
					dataimpuestos+="@";
				}
                //if(dataimpuestos.indexOf(getName) == -1){
  				  dataimpuestos+=getId+"|"+getName+"|"+getValue+"|"+$(this).val();
                  c++;
                //}

			});
			
			var propina=0;
			if($('#propinaFactura').val()!='')
				propina=$('#propinaFactura').val();

            var order_id = '';
            if($('#order_id').val()!=''){
              var order_id = $('#order_id').val();
            }

           /*alert($('#order_id').val());
           return false;*/

        /*console.log(fetchJson);
        return false;*/
		
		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
       if(localStorage.getItem("con_localhost") == 'true'){
         console.log(fetchJson);
       var apiURL='http://'+localStorage.getItem("ip_servidor")+'/connectnubepos/api2.php';
       $.post(apiURL,{
  		id_emp : localStorage.getItem("empresa"),
  		action : 'Facturas',
  		id_barra : localStorage.getItem("idbarra"),
  		deviceid:$("#deviceid").html(),
        con_mesas : localStorage.getItem("con_mesas"),
        id_mesa : sessionStorage.getItem("mesa_activa"),
        order_id : $('#order_id').val(),
        con_menu : localStorage.getItem("diseno"),
        json : fetchJson
  		}).done(function(response){
  			if(response!='block' && response!='Desactivado'){
  				console.log(response);
                console.log("Nueva Factura Ingresada LocalHost");
                sessionStorage.setItem("mesa_activa","");
  			}else if(response=='Desactivado'){
  			    envia('cloud');
  				setTimeout(function(){
  					$('.navbar').slideUp();
  					$("#demoGratis,#fadeRow,#finalizado,#contentStepSincro,#cuentaactiva").css("display","none");
  					$('#desactivo').fadeIn();
  				},100);
  			}else{
  				envia('cloud');
  				setTimeout(function(){
  					$('#linklogin,#linkloginb').attr("href","https://www.practisis.net/index3.php?rvpas="+localStorage.getItem("userPasswod")+"&rvus="+localStorage.getItem("userRegister"));
  					$('.navbar').slideUp();
  					$("#demoGratis,#fadeRow,#finalizado,#contentStepSincro,#cuentaactiva").css("display","none");
  					$('#bloqueo').fadeIn();
  				},100);

  			}

  		}).fail(function(){
  			updateOnlineStatus("OFFLINE");
  			setTimeout(function(){SincronizadorNormal()},180000);
  		});
      }else{
		//**********************comienza aqui guarda local***********************************
			/*FIN VALORES PARA LA FACTURA*/
			db.transaction(Ingresafacturas, errorCB, successCB);
			function Ingresafacturas(tx){
				var now=new Date().getTime();
				tx.executeSql("INSERT INTO logactions (time,descripcion,datos) values (?,?,?)",[now,"Inserta Factura",fetchJson]);
				
				tx.executeSql("INSERT INTO FACTURAS(clientName,RUC,address,tele,fetchJson,paymentsUsed,cash,cards,cheques,vauleCxC,paymentConsumoInterno,tablita,aux,acc,echo,fecha,timespan,sincronizar,total,subconiva,subsiniva,iva,servicio,descuento,nofact,dataimpuestos,propina,order_id)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[clientName,RUC,address,tele,fetchJson,paymentsUsed,cash,cards,cheques,valueCxC,paymentConsumoInterno,table,aux,acc,echo,hoy,mitimespan,'true',mitotal,subconiva,subsiniva,eliva,servicio,descuento,factc,dataimpuestos,propina,order_id],function(){
					console.log("Nueva Factura Ingresada");
					var numingresada=parseInt(aux)+1;
					var ceros='';
					var coun=numingresada.toString().length;
					var ceroscount=0;
					while(ceroscount<(9-coun)){
						ceros+='0';
						ceroscount++;
					}
					localStorage.setItem("ultimafact",ceros+numingresada);
					var mijsonprod=JSON.parse(fetchJson);
					var misprod = mijsonprod.Pagar[0].producto;
						
						if(localStorage.getItem("con_mesas")=="true"){
							var mesaactiva=sessionStorage.getItem("mesa_activa");
							//var idfact=results.insertId;
							var idcli=RUC;
							var nombrecli=clientName;
							
							tx.executeSql("UPDATE MESAS_DATOS SET cliente=?,id_cliente=?,id_factura=?,hora_desactivacion=?,activo=? ,sincronizar=? WHERE id_mesa=? and activo=?",[nombrecli,idcli,mitimespan,now,"false","true",mesaactiva,"true"]);
							tx.executeSql("UPDATE MESAS SET enuso=? WHERE timespan=?",["false",mesaactiva]);
							tx.executeSql("DELETE FROM MESAS_CONSUMOS WHERE id_mesa=?",[mesaactiva]);

							sessionStorage.setItem("mesa_activa","");
						}
						
						var concredito=localStorage.getItem("pagarconcredito");
						if(concredito==null){
							concredito='false';
						}
						
						if(concredito.toString()=='true'){
							//alert(mitotal+"/"+idcli);
							tx.executeSql("UPDATE CLIENTES SET cupo=cupo-"+parseFloat(mitotal)+",sincronizar=? WHERE cedula=?",['true',RUC]);
						}

						for(var j in misprod){
							var item = misprod[j];
							IngresaDetalles(item,mitimespan);
						}
						
						$('#nombre_mesa').html('');

					//$('#pay').fadeOut('fast');
					// envia('nubepos/nubepos/');
				});
			}
			
		function IngresaDetalles(item,mifactura){
			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
            db.transaction(function (tx2){
				var string_impuestos=item.impuesto_prod;
				var miprecio=parseFloat(item.precio_orig);
				var preciomas=0;
				/*var listaimpuestos=string_impuestos.split('@');
				if(listaimpuestos.indexOf('1')>=0)
					preciomas+=miprecio*(0.12);
				if(listaimpuestos.indexOf('2')>=0)
					preciomas+=miprecio*(0.10);*/
				miprecio=miprecio+preciomas;
				
				var now=new Date().getTime();
				tx2.executeSql("INSERT INTO logactions (time,descripcion,datos) values (?,?,?)",[now,"Inserta Detalles Factura",JSON.stringify(item)+" ,Factura:"+mifactura],function(tx,results){});
				
				tx2.executeSql("INSERT INTO FACTURAS_FORMULADOS(timespan_factura,timespan_formulado,cantidad,precio_unitario)VALUES(?,?,?,?)",[mifactura,item.id_producto,item.cant_prod,miprecio],function(){
					console.log("Nuevo Detalle Factura Ingresado");
				});
			},errorCB,successCB);
		}
        //**********************hasta aqui guarda local***********************************
      }

			// $('#subtotalSinIva,#subtotalIva,#descuentoFactura,#totalmiFactura').val('0');
			
			
			$('#pay').hide();
			if(clientName == ''){
				clientName = 'Consumidor Final';
			}
			var nextnumFac = $('#nextnumber').val();
			$('#numFac').val(nextnumFac);
			$('#nomCli').val(clientName);
			$('#docCli').val(RUC);
			$('.paymentMethods').each(function(){
				if($(this).val() != '' && $(this).val() != 0 && $(this).val() != null){
					var formPayment = $(this).attr('paymentMethod');
					$('#printFormsPayments').append('<tr><td style="text-align:center;" id="pagoForm">\
														'+formPayment+'\
													</td></tr>');
				}
			});
			var datosProductos = JSON.parse(fetchJson.toString());
			var productos = datosProductos.Pagar[0].producto;
			for(var i in productos){
				var precioUnit = productos[i].precio_prod;
				precioUnit = parseFloat(precioUnit).toFixed(2)
				var precioTot = productos[i].precio_total;
				precioTot = parseFloat(precioTot).toFixed(2);
				$('#printProducts').append('<tr class="productosComprados"><td class="canti">'+productos[i].cant_prod+'</td><td class="descrip">'+productos[i].nombre_producto+'</td><td class="valUnit">'+precioUnit+'</td><td class="valTot">'+precioTot+'</td></tr>');
			}
			
			var datosFactura = JSON.parse(fetchJson);
			var subsinIVA = datosFactura.Pagar[0].factura.subtotal_sin_iva;
			subsinIVA = parseFloat(subsinIVA).toFixed(2);
			$('#subsiniva').html(subsinIVA);
			var subIVA = datosFactura.Pagar[0].factura.subtotal_iva;
			subIVA = parseFloat(subIVA).toFixed(2);
			$('#subconiva').html(subIVA);
			var impuestos = datosFactura.Pagar[0].factura.impuestos;
			var ivaImp = impuestos.split("/");
			var iva = parseFloat(ivaImp[1]).toFixed(2);
			$('#impuestos').html(iva);
			var descuentoFac = datosFactura.Pagar[0].factura.descuento;
			descuentoFac = parseFloat(descuentoFac).toFixed(2);
			$('#descFac').html(descuentoFac);
			var totalFac = datosFactura.Pagar[0].factura.total;
			totalFac = parseFloat(totalFac).toFixed(2);
			$('#totalPagado').html(totalFac);
			console.log(datosFactura.Pagar[0]);
			
			//popupsavefactura
			$('#popupprecios').modal('hide');
			$('#totalalert').html('$ '+totalFac);
			$('#pagadoalert').html('$ '+$('#invoicePaid').html());
			$('#vueltoalert').html('$ '+$('#changeFromPurchase').html());
			//
            impresionMovil(fetchJson.toString());
            //setTimeout(function(){localStorage.setItem("nameorder","");},2000);
		}else{
			if(localStorage.getItem("idioma")==1)
				showalertred('El valor pagado es menor del total');
			else if(localStorage.getItem("idioma")==2)
				showalertred('The amount paid is less than the total');
		}
	}else{
		alert("Por favor, elija un cliente.");
	}
}


function impresionMovil(mijson){
	$('#cargandoTabs').modal("show");
	//alert("entra a imprimir");
	$('.productosComprados').remove();
	$('#subsiniva').html('');
	$('#subconiva').html('');
	$('#impuestos').html('');
	$('#descFac').html('');
	$('#totalPagado').html('');
	$('#tablaCompra').html('');
	$('#printFactura').hide();
	envia('puntodeventa');
	var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
	db.transaction(function (tx){
		var now=new Date().getTime();
		tx.executeSql("INSERT INTO logactions (time,descripcion,datos) values (?,?,?)",[now,"Envia a Imprimir Factura",mijson]);
	},errorCB,successCB);
	
				if(localStorage.getItem("print")!=null&&localStorage.getItem("print")!=""){
					//alert(localStorage.getItem("print"));
					//alert(miprint.printer);
					var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
					if ( app ) {
						if(localStorage.getItem("printtrade")==2){
							
							StarIOAdapter.rawprint(mijson,localStorage.getItem("print"), function() {
								var now=new Date().getTime();
								//tx.executeSql("INSERT INTO logactions (time,descripcion,datos) values (?,?,?)",[now,"Se imprimió la Factura",""]);
								if(localStorage.getItem("idioma")==1)
									showalert("Imprimiendo Factura.");
								else if(localStorage.getItem("idioma")==2)
									showalert("Printing Invoice.");
								
								ImprimeComanderas(mijson);
							});
						}else if(localStorage.getItem("printtrade")==1){
							StarIOAdapter.printepson(mijson,localStorage.getItem("printmodel"),localStorage.getItem("printaddress"), localStorage.getItem("printtype"),function() {
								var now=new Date().getTime();
								//tx.executeSql("INSERT INTO logactions (time,descripcion,datos) values (?,?,?)",[now,"Se imprimió la Factura",""]);
								if(localStorage.getItem("idioma")==1)
									showalert("Imprimiendo Factura.");
								else if(localStorage.getItem("idioma")==2)
									showalert("Printing Invoice.");
								ImprimeComanderas(mijson);
							},function(){showalertred("Ocurrió un error al imprimir: Revise su Impresora");});
						}
					}
				}else{
					if(localStorage.getItem("idioma")==1)
						showalert("No se ha configurado una impresora.");
					else if(localStorage.getItem("idioma")==2)
						showalert("There is no configured printer.");
				}
				
				//comanderas
				
				//fin comanderas
		//});
		
	localStorage.setItem("nameorder","");
	$('#popupsavefactura').modal('show');
	$('#popupsavefactura').on('hidden.bs.modal', function () {
		$('#menuSubNew2').html("Total");
		  if($(window).width()<=900){
			  $('#barraalternamovil').slideDown();
			  $('#divmesas').css('min-height',$('body').height()-$('#barraalternamovil').height());
			  $("#lapartedepagos").css("display","none");
			  $('.navbar').css('display','none');
		  }else{
			  $('.navbar').slideDown();
			  $("#lapartedepagos").css("display","block");
			  $('#divmesas').css('min-height',$('body').height()-$('.navbar').height());
			  $('#barraalternamovil').css('display','none');
		  }
	});
}

function ImprimeComanderas(mijson){
	//alert("comanderas");
	if(localStorage.getItem("con_comandas")=="true"&&localStorage.getItem("con_mesas")=="false"){
					if(localStorage.getItem("printc")!=null&&localStorage.getItem("printc")!=""){
					//alert(miprint.printer);
						mijson=mijson.replace("Pagar","Comandar");
						var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
						if ( app ) {
							if(localStorage.getItem("printtradec")==2){
								StarIOAdapter.rawprint(mijson,localStorage.getItem("printc"), function() {});
							}else if(localStorage.getItem("printtradec")==1){
								StarIOAdapter.printepson(mijson,localStorage.getItem("commodel"),localStorage.getItem("comaddress"), localStorage.getItem("comtype"),function() {});
							}
						}
					}else{
							if(localStorage.getItem("idioma")==1)
								showalert("No se ha configurado una impresora para comandas.");
							else if(localStorage.getItem("idioma")==2)
								showalert("There is no configured a command printer.");
					}
	}
}

function cancelPayment(){
	//$('#payButton').show();
	$('.paymentMethods').val('');
	$('#justification').val('');
	$('.payOverview').html(0);
	$('#invoicePaid').html('0.00');
	$('#changeFromPurchase').html('0.00');
	//$('#paymentModule').modal('hide');
	$('#paymentModule').fadeOut();
	$('#row1').fadeIn();
	var propina=parseFloat($('#invoiceprop').html());
	$('#total').html("$"+(parseFloat($('#total').html().substring(1))-propina).toFixed(2));
	
	if($('#total').html().toString().length==9)
		$('#divtotal').css('font-size','26px');
	else if($('#total').html().toString().length>9)
		$('#divtotal').css('font-size','24px');
	else
		$('#divtotal').css('font-size','30px');
	
	if($('#total').html().toString().length>9){
		$('.den').css('width',5*parseFloat($('.producto').css('height')));
	}else{
		$('.den').css('width',3*parseFloat($('.producto').css('height')));
	}
	
	//$('#totalmiFactura').val(parseFloat(totales));
	$('#payButton').html('PAGAR');
	$('#invoiceTotal').html($('#total').html());
	$('#propinaFactura').val("0");
	$('#valorpropina').val("0");
	$('#invoiceprop').html("0.00");
	$('#busquedacliente').html($('#cedulaP').val());
	pagonormal=true;
	ResetPagos(1);
	ResetPagos(2);
	ResetPagos(3);
	ResetPagos(4);
}


function BuscarCliente(e){
	
	/*cambiar letrero de ID*/
	var mipais=localStorage.getItem("pais");
	if(mipais=="Ecuador")
		$('.trans_cedula').html("ID Number: CI/RUC");
	else if(mipais=="Colombia")
		$('.trans_cedula').html("ID Number: NIT");
	else if(mipais=="Chile")
		$('.trans_cedula').html("ID Number: RUT");
	else if(mipais=="Argentina")
		$('.trans_cedula').html("ID Number: CUIT");
	else if(mipais=="Peru")
		$('.trans_cedula').html("ID Number: SUNAT");
	else if(mipais=="Mexico")
		$('.trans_cedula').html("ID Number: RFC");
	/*fin*/
	
	
	var valor=$('#cedulaP').val();
	$('#descripcionD input').each(function(){
		if($(this).attr('id')!='cedulaP'&&$(this).attr('id')!='invoiceNr'&&$(this).attr('id')!='invoiceNrComplete')
			$(this).val('');
	});

	if(e==13){
	//comentado para fe
    //mostrarClientes();

    if(localStorage.getItem("con_localhost") == 'true'){
         var apiURL='http://'+localStorage.getItem("ip_servidor")+'/connectnubepos/api2.php';
         if(valor){
         $.post(apiURL,{
    		id_emp : localStorage.getItem("empresa"),
    		action : 'BuscarCliente',
    		id_barra : localStorage.getItem("idbarra"),
    		deviceid:$("#deviceid").html(),
            ruc : valor
    		}).done(function(response){
    			if(response!='block' && response!='Desactivado'){
    				console.log(response);
                    var res = response.split("||");
                    if(res[5] == 'si'){
                      $('#cedulaP').val(res[1]);
                    }
                    $('#idCliente').val(res[0]);
					$('#clientID').val(res[0]);
					$('#nombreP').val(res[2]);
					$('#clientefind').html(res[2]);
					$('#telefonoP').val(res[3]);
					$('#direccionP').val(res[4]);
					$('#emailP').val(res[5]);
					$('#payClientName').html(res[2]);
					$('.tipoClienteP').val(1);
                    $("#busquedacliente").html(res[1]);
					if($('#insideShop').length > 0){
						continueShopping(res[0]);
					}


    			}else if(response=='Desactivado'){
    			    envia('cloud');
    				setTimeout(function(){
    					$('.navbar').slideUp();
    					$("#demoGratis,#fadeRow,#finalizado,#contentStepSincro,#cuentaactiva").css("display","none");
    					$('#desactivo').fadeIn();
    				},100);
    			}else{
    				envia('cloud');
    				setTimeout(function(){
    					$('#linklogin,#linkloginb').attr("href","https://www.practisis.net/index3.php?rvpas="+localStorage.getItem("userPasswod")+"&rvus="+localStorage.getItem("userRegister"));
    					$('.navbar').slideUp();
    					$("#demoGratis,#fadeRow,#finalizado,#contentStepSincro,#cuentaactiva").css("display","none");
    					$('#bloqueo').fadeIn();
    				},100);

    			}

    		}).fail(function(){
    			updateOnlineStatus("OFFLINE");
    			setTimeout(function(){SincronizadorNormal()},180000);
    		});
         }
        }else{
		//********************************inicio normal***********************************
		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
		db.transaction(
		function (tx){
			tx.executeSql('SELECT * FROM CLIENTES WHERE cedula=?;',[valor],
			function(tx,res){
				if(res.rows.length>0){
					console.log(res);
					var row=res.rows.item(0);
					entro=true;
					$('#idCliente').val(row.id);
					$('#clientID').val(row.id);
					$('#nombreP').val(row.nombre);
					$('#clientefind').html(row.nombre);
					$('#cedulaP').val(row.cedula);
                    $('#busquedacliente').val(row.cedula);
					$('#telefonoP').val(row.telefono);
					$('#direccionP').val(row.direccion);
					$('#emailP').val(row.email);
					$('#payClientName').html(row.nombre);
					$('#cupoP').val(row.cupo);
					$('.tipoClienteP').val(1);
					if($('#insideShop').length > 0){
						continueShopping(row.id);
					}
				}else{
					$('#nombreP').val('');
				}
				});	
		},errorCB,successCB);
        //*********************************fin normal*************************************
        }
		
		$('#descripcionD input').each(function(){
			if(valor=='9999999999999'||valor=='9999999999'||valor==''){
				if($(this).attr('id')!='cedulaP'&&$(this).attr('id')!='invoiceNr'&&$(this).attr('id')!='invoiceNrComplete')
					$(this).prop('readonly','true');
			}else{
					$(this).removeProp('readonly');
			}
		});
	
	}
}
	
function jsonNuevoCliente(){
	var apellidoP=$('#apellidoP').val();
	
	var nacionalidad=1;//$('#nacionalidad').val();
	var cedulatemp=$('#cedulaP').val();
	var cedula;
	
	//console.log("voy a grabar:"+$('#cedulaP').val());
	if(localStorage.getItem("sin_documento")=='true' && cedulatemp=='9999999999'){
		var minombre=$('#nombreP').val();
		minombre=minombre.replace(/ /g,'');
		cedula='p00'+minombre;
		//console.log("cambiando cedula:"+cedula);
	}else{
		cedula=$('#cedulaP').val();
		//console.log("cedula igual:"+cedula);
	}

	var nombreP=$('#nombreP').val();
	var tipoP=$('#tipoP').val();
	var direccionP=$('#direccionP').val();
	var telefonoP=$('#telefonoP').val();
	var email=$('#descripcionD #emailP').val();
	var sexoP=$('#sexoP').val();
	var fecha=$('#fecha').val();
	var notasP=$('#notasP').val();
	$("#cedula").val( cedula );
	$("#cedulaP").val( cedula );
	$("#nombre").val( nombreP + " " + apellidoP );
	$("#telefono").val( telefonoP );
	$(".direccion").html( direccionP );
	$("#tipoCliente").html( tipoP );



	// alert("Ana"+nombreP+'-'+cedula);

	//aqui cambio para fe
	//if(!nombreP) return; if( !cedula) return;
	if(!(nombreP&&cedula)){
		noCliente();
		return;
	}
	//console.log(email);

    if(localStorage.getItem("con_localhost") == 'true'){
       var apiURL='http://'+localStorage.getItem("ip_servidor")+'/connectnubepos/api2.php';
       $.post(apiURL,{
  		id_emp : localStorage.getItem("empresa"),
  		action : 'NuevoCliente',
  		id_barra : localStorage.getItem("idbarra"),
  		deviceid:$("#deviceid").html(),
        cedulaCliente : cedula,
        nombreCliente : nombreP,
        telefonoCliente : telefonoP,
        direccion : direccionP,
        email : $("#emailP").val()
  		}).done(function(response){
  			if(response!='block' && response!='Desactivado'){
  				console.log(response);
                  var res = response.split("||");
                  if(res[0] == 'ok'){
                    $('#idCliente').val(res[1]);
					$("#clientefind").html(nombreP);
					$("#busquedacliente").html(cedula);
					$("#newCliente,#opaco").fadeOut();
                  }else{
                    $('#idCliente').val(1);
					$("#clientefind").html('Consumidor Final');
					$("#busquedacliente").html('9999999999999');
					$("#newCliente,#opaco").fadeOut();
                  }

  			}else if(response=='Desactivado'){
  			    envia('cloud');
  				setTimeout(function(){
  					$('.navbar').slideUp();
  					$("#demoGratis,#fadeRow,#finalizado,#contentStepSincro,#cuentaactiva").css("display","none");
  					$('#desactivo').fadeIn();
  				},100);
  			}else{
  				envia('cloud');
  				setTimeout(function(){
  					$('#linklogin,#linkloginb').attr("href","https://www.practisis.net/index3.php?rvpas="+localStorage.getItem("userPasswod")+"&rvus="+localStorage.getItem("userRegister"));
  					$('.navbar').slideUp();
  					$("#demoGratis,#fadeRow,#finalizado,#contentStepSincro,#cuentaactiva").css("display","none");
  					$('#bloqueo').fadeIn();
  				},100);

  			}

  		}).fail(function(){
  			updateOnlineStatus("OFFLINE");
  			setTimeout(function(){SincronizadorNormal()},180000);
  		});
      }else{
    //************************************inicio normal***********************************
	var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
	db.transaction(
	function (tx){
		tx.executeSql('SELECT id FROM CLIENTES WHERE cedula=?;',[cedula],
		function(tx,res){
			if(res.rows.length>0){
				tx.executeSql('UPDATE CLIENTES SET nombre=?,direccion=?, telefono=?, email=?, sincronizar=? WHERE cedula=?;',[nombreP,direccionP,telefonoP,email,'true',cedula],
				function(tx,res2){
					console.log("Cliente Actualizado!");
					$('#idCliente').val(res.rows.item(0).id);
					$("#clientefind").html(nombreP);
					$("#busquedacliente").html(cedula);
					//$("#newCliente,#opaco").fadeOut();
					$("#popupclientefe").fadeOut("fast",function(){
						if(localStorage.getItem('con_profesionales')=='true'){
							$('#menuSubNew1,#menuSubNew2').fadeIn();
						}
					});
					$('#easypay').fadeIn();
				});	
			}else{
				tx.executeSql('INSERT INTO CLIENTES (nombre,direccion,cedula,telefono,email,existe,sincronizar) VALUES (?,?,?,?,?,?,?)',[nombreP,direccionP,cedula,telefonoP,email,0,'true'],
				function(tx,res3){
					console.log(res3.insertId);
					$('#idCliente').val(res3.insertId);
					$("#clientefind").html(nombreP);
					$("#busquedacliente").html(cedula);
					//$("#newCliente,#opaco").fadeOut();
					$("#popupclientefe").fadeOut("fast",function(){
						if(localStorage.getItem('con_profesionales')=='true'){
							$('#menuSubNew1,#menuSubNew2').fadeIn();
						}
					});
					$('#easypay').fadeIn();
				});	
			}
			
		});
	},errorCB,successCB);
    //*******************************fin normal*******************************************
    }
}

function noCliente(){
	if($('#cedulaP').val()==''){
		$('#busquedacliente').html('9999999999999');
		$('#cedulaP').val('9999999999999');
		BuscarCliente(13);
	}else{
		var concredito=localStorage.getItem('pagarconcredito');
		if(concredito==null)
			concredito='false';
		
		if(concredito.toString()=='true'){
			if($('#nombreP').val()==''){
				$('#busquedacliente').html('9999999999999');
				$('#cedulaP').val('9999999999999');
				$('#clientefind').html('Consumidor Final');
				//BuscarCliente(13);
			}	
		}else{
			$('#busquedacliente').html($('#cedulaP').val());
		}
	}
	
    if($('#idCliente').val()==''){
		$('#busquedacliente').html('9999999999999');
		$('#cedulaP').val('9999999999999');
		BuscarCliente(13);
	}
	//$("#popupclientefe").fadeOut("fast",function(){});
	$('#easypay').fadeIn();
}

 
  function mostrarClientes(){
	  
	  //console.log("tiene documento:"+localStorage.getItem("sin_documento"));
		//alert($("#newCliente").html());
		if($("#newCliente").html()!=''){
			$("#clientever").fadeIn();
			$("#easypay").css('display','none');
		}else{
			if(localStorage.getItem("sin_documento")=='true'){
				//codigo sin documento
				$("#newCliente ").html('\
			<div style="position:relative; left:0%; width:100%; height:100%" id="borrable">\
				<div id="cuadroClientes" class="cuadroClientes" style="height:100%;"> \
					<h3 class="trans_cliente" style="font-size:40px;">Cliente</h3><div style="width:100%; text-align:right; padding-right:5px;  padding-right:5px; cursor:pointer;color:#1495C0; position:absolute; top:3px; right:12px; cursor:pointer;"><i onclick="noCliente();" class="fa fa-chevron-circle-left fa-3x" title="Volver..."></i></div>\
					<table id="descripcionD" class="table table-striped">\
						<tr> \
							<td colspan=2>\
								<br><br>\
								<input type="hidden" tabIndex="1" id="cedulaP" value="9999999999999" onkeypress="isalphanumeric(event);" class="form-control input-lg"/><input type="hidden" style="display:none;" id="cupoP" value="0"/>  \
									<table tabIndex="99"  cellpadding="0"  cellspacing="0" width="70%" style="position: relative;margin: 0px auto;">\
										<tr>\
												<td>\<div class="input-group" style="width:100%;margin-bottom:10px;">														<span class="input-group-addon trans_mail"  style="width:30%">&nbsp;Email</span>\
													\
													<input tabIndex="4" id="emailP" class="form-control input-lg"/></div>\
												</td>\
										</tr>\
										\
										<tr>\
											<td>\
												<div class="input-group" style="width:100%;margin-bottom:10px;"><span class="input-group-addon" style="width:30%" id="trans_label_11">&nbsp;Nombre*</span>\
													<input  tabIndex="2" onkeyup="validacliente()" id="nombreP" class="form-control input-lg" onkeypress="isalphanumeric(event);"  value="Consumidor Final"/></div>\
											</td>\
										</tr>\
										\
										<tr>\
												<td>\
											     <div class="input-group" style="width:100%;margin-bottom:10px;"><span class="input-group-addon trans_tel"  style="width:30%">&nbsp;Teléfono</span>\<input tabindex="3" onkeypress="isalphanumeric(event);" id="telefonoP"class="form-control input-lg" type="number"/></div></td>\
										</tr>\
										<tr>\
												<td>\
												 <div class="input-group" style="width:100%;margin-bottom:10px;">									<span class="input-group-addon trans_dir"  style="width:30%">&nbsp;Dirección</span>\
													<input tabIndex="3" onkeypress="isalphanumeric(event);" id="direccionP" class="form-control input-lg"/></div> \
												</td>\
										</tr>\
									</table>\
									\
									<br>\
							</td>\
						</tr>\
						<tr>\
							<td colspan=2>\
								<br>\
								<div>\
									<table style="cursor:pointer;position: relative; margin: 0px auto;" cellspacing="5px">\
										<tr>\
											<td style="vertical-align:top;">\
												<button onclick="noCliente();" tabindex="8" class="btn btn-lg btn-default trans_cancel">Cancelar</button> \
											</td>\
											<td style="vertical-align: top;">\
												<button tabindex="7" class="btn btn-lg btn-success trans_save" onclick="ParaConsumoInterno();">Guardar</button> \
											</td>\
										</tr>\
									</table>\
								</div>\
							</td>\
						</tr>\
					</table>\
				</div>\
			<input type="hidden" id="idCliente" value="1"/></div>\
			<style>\
				#descripcionD tr td table tr td{\
					text-align:left;font-size:13px;height:25px;\
				}\
			</style>');
			}else{
				//codigo con documento
			$("#newCliente ").html('\
			<div style="" id="borrable">\
				<div id="cuadroClientes" class="cuadroClientes" style="height:100%;"> \
					<h3 class="trans_cliente" style="font-size:40px;">Cliente</h3><div style="width:100%; text-align:right; padding-right:5px;  padding-right:5px; cursor:pointer;color:#1495C0; position:absolute; top:3px; right:12px; cursor:pointer;"><i onclick="noCliente();" class="fa fa-chevron-circle-left fa-3x" title="Volver..."></i></div>\
					<table id="descripcionD" class="table table-striped">\
						<tr> \
							<td colspan=2>\
								<br><br>\
									\<form>\
									<table tabIndex="99" cellpadding="0" cellspacing="0" width="70%" style="position: relative;margin: 0px auto;">\
										<tr>\
											<td>\
										<div class="input-groupt" style="width:100%; margin-bottom:10px;"><span class="input-group-addon trans_cedula labellarge" style="width:30%; display:none;">\
													&nbsp;Cédula* \
											</span><input tabIndex="1" id="cedulaP" value="9999999999999" onkeypress="isalphanumeric(event);" class="form-control input-lg extralarge" placeholder="CI/RUC"/><input id="cupoP" value="0" style="display:none;"/> </div>\
												</td>\
										</tr>\
										<tr>\
												<td>\<div class="input-groupt" style="width:100%;margin-bottom:10px;">														<span class="input-group-addon trans_mail"  style="width:30%; display:none;">&nbsp;Email</span>\
													\
													<input tabIndex="2" id="emailP" class="form-control input-lg extralarge" placeholder="e-mail"/></div>\
												</td>\
										</tr>\
										<tr>\
											<td>\
												<div class="input-groupt" style="width:100%;margin-bottom:10px;"><span class="input-group-addon" style="width:30%; display:none;" id="trans_label_11">&nbsp;Nombre*</span>\
													<input  tabIndex="3" id="nombreP" class="form-control input-lg extralarge" onkeypress="isalphanumeric(event);" value="Consumidor Final" placeholder="nombre"/></div>\
											</td>\
										</tr>\
										\
										<tr>\
												<td>\
											     <div class="input-groupt" style="width:100%;margin-bottom:10px;"><span class="input-group-addon trans_tel"  style="width:30%; display:none;">&nbsp;Teléfono</span>\<input tabindex="4" onkeypress="isalphanumeric(event);" id="telefonoP"class="form-control input-lg extralarge" type="number" placeholder="telefono"/></div></td>\
										</tr>\
										<tr>\
												<td>\
												 <div class="input-groupt" style="width:100%;margin-bottom:10px;">									<span class="input-group-addon trans_dir"  style="width:30%; display:none;">&nbsp;Dirección</span>\
													<input tabIndex="5" onkeypress="isalphanumeric(event);" id="direccionP" class="form-control input-lg extralarge" placeholder="direccion"/></div> \
												</td>\
										</tr>\
										\
									</table>\
									\
									\</form>\
									<br>\
							</td>\
						</tr>\
						<tr>\
							<td colspan=2>\
								<br>\
								<div>\
									<table style="cursor:pointer;position: relative; margin: 0px auto;" cellspacing="5px">\
										<tr>\
											<td style="vertical-align:top;">\
												<button onclick="noCliente();" tabindex="8" class="btn-lg btn btn-default  trans_cancel">Cancelar</button> \
											</td>\
											<td style="vertical-align: top;">\
												<button tabindex="7" class="btn btn-success btn-lg trans_save" onclick="ParaConsumoInterno();">Guardar</button> \
											</td>\
										</tr>\
									</table>\
								</div>\
							</td>\
						</tr>\
					</table>\
				</div>\
			<input type="hidden" id="idCliente" value="1"/></div>\
			<style>\
				#descripcionD tr td table tr td{\
					text-align:left;font-size:13px;height:25px;\
				}\
			</style>');
			$('.direccion').html( " " );
			$('.tipoCliente').html( "Tipo de cliente:  "  );
				$('#cedulaP').val('9999999999999');
				$('#idCliente').val('1');
			$('#clientID').val('1');
			$('#cedulaP').attr({ maxLength : 13 });
			$('#nombre').val('Consumidor Final');
			$('#cedulaP').click(function(){
				$(this).select();
			});
			
		
		$('#cedulaP').change(function(){
		if(cedula()){
				if($('#nombreP').length==0){
					$('#busquedacliente').val('9999999999999');
					$('#clientefind').html("Consumidor Final");
					BuscarCliente(13);
				}
		}else{
			if(localStorage.getItem("idioma")==1){
				showalert("La identificación ingresada no es correcta.");
			}
			else if(localStorage.getItem("idioma")==2){
				showalert("The id number is not correct.");
			}
			
			//console.log("Ana");
			
			$('#cedulaP').val('');
			$('#cedulaP').focus();
			//alert("Ana");
			//BuscarCliente(13);
		}
		});	
		
	$('#cedulaP').keyup(function(event){
		$('#clientefind').html('');
		$('#idCliente').val('0');
		var idcli=$(this).val();
		if(idcli.length<10){
			var concredito=localStorage.getItem('pagarconcredito');
			if(concredito==null)
				concredito='false';
			
			if(concredito.toString()=='true'){
				$('#busquedacliente').val(idcli);
				$('#clientefind').html('');
				BuscarCliente(13);
			}
		}
		else if(idcli.length==10){
		  //alert(idcli);
			$('#busquedacliente').val(idcli);
			$('#clientefind').html('');
			$('#cedulaP').css('background-color', 'white');
			$('#cedulaP').effect("highlight");
			BuscarCliente(13);
		}else if(idcli.length==13){
			$('#busquedacliente').val(idcli);
			$('#cedulaP').css('background-color', 'white');
			$('#cedulaP').effect("highlight");
			$('#clientefind').html('');
			BuscarCliente(13);
		}else if(idcli.length==0){
			$('#busquedacliente').val('9999999999999');
			$('#clientefind').val('Consumidor Final');
			BuscarCliente(13);
		}
	});
	}
	
	//idioma
	var linklang="es";
		if(localStorage.getItem("idioma")==2)
			linklang="en";
			var xmlidioma=$.get("lang/"+linklang+".html",function(datos){
			d=JSON.parse(datos);
			var itemestructura=d.estructura;
			//console.log(itemestructura);
			var itemmen=itemestructura.menu;
			var itemplaceholder=itemestructura.placeholder;
			var itemtitles=itemestructura.titles;
			var itembuttons=itemestructura.botones;
			var itemlabels=itemestructura.labels;
			var todostitles=itemtitles.item;
			var todosbuttons=itembuttons.item;
			var todoslabels=itemlabels.item;
			var todositems=itemmen.item;	
			var todosplaceholder=itemplaceholder.item;
			
			for(var k=0;k<todosplaceholder.length;k++){
				var miitemname=todosplaceholder[k].name;
				//alert(miitemname);
				$('.'+miitemname).attr("placeholder",todosplaceholder[k].text);
			}
			
			for(var k=0;k<todositems.length;k++){
					var miitem=todositems[k];
					$('#lab_menu_'+(k+1)).html(miitem);
			}
					
				for(var k=0;k<todostitles.length;k++){
					var miitemname=todostitles[k].name;
					//alert(miitemname);
					$('.'+miitemname).html(todostitles[k].text);
				}
				
				for(var k=0;k<todosbuttons.length;k++){
					var miitemname=todosbuttons[k].name;
					//alert(miitemname);
					$('.'+miitemname).html(todosbuttons[k].text);
				}
				
				for(var k=0;k<todoslabels.length;k++){
					//console.log(todoslabels[k].name+"/"+todoslabels[k].name);
					var miitemname=todoslabels[k].name;
					$('#'+miitemname).html(todoslabels[k].text);
				}
				
		});
		
		/*idioma*/	
	//}
}
}

function cedula() {
	numero = document.getElementById("cedulaP").value;
	var concredito=localStorage.getItem("pagarconcredito").toString;
	if(concredito==null)
		concredito='false';
	
	if(!(concredito.toString()=='true')){
		if(numero.indexOf("p")>=0||numero.indexOf("P")>=0)
			return true;
		else if(numero=='9999999999999')
			return true;
		else{
			var elpais=localStorage.getItem("pais");
			if(elpais=="Colombia"){
				return VerificarColombiaNit(numero);
			}else if(elpais=="Chile"){
				return VerificarChileRut(numero);
			}else if(elpais=="Argentina"){
				return VerificarArgentinaCuit(numero);
			}else if(elpais=="Peru"){
				return VerificarPeruSunat(numero);
			}else if(elpais=="Mexico"){
				return VerificarMexicoRfc(numero);
			}else{
				var suma = 0;
				var residuo = 0;
				var pri = false;
				var pub = false;
				var nat = false;
				var numeroProvincias = 24;
				var modulo = 11;

				/* Verifico que el campo no contenga letras */
				var ok=1;
				/* Aqui almacenamos los digitos de la cedula en variables. */
				d1 = numero.substr(0,1);
				d2 = numero.substr(1,1);
				d3 = numero.substr(2,1);
				d4 = numero.substr(3,1);
				d5 = numero.substr(4,1);
				d6 = numero.substr(5,1);
				d7 = numero.substr(6,1);
				d8 = numero.substr(7,1);
				d9 = numero.substr(8,1);
				d10 = numero.substr(9,1);

				/* El tercer digito es: */
				/* 9 para sociedades privadas y extranjeros */
				/* 6 para sociedades publicas */
				/* menor que 6 (0,1,2,3,4,5) para personas naturales */

				if (d3==7 || d3==8){
				console.log('El tercer d?gito ingresado es inv?lido');
				return false;
				}

				/* Solo para personas naturales (modulo 10) */
				if (d3 < 6){
				nat = true;
				p1 = d1 * 2; if (p1 >= 10) p1 -= 9;
				p2 = d2 * 1; if (p2 >= 10) p2 -= 9;
				p3 = d3 * 2; if (p3 >= 10) p3 -= 9;
				p4 = d4 * 1; if (p4 >= 10) p4 -= 9;
				p5 = d5 * 2; if (p5 >= 10) p5 -= 9;
				p6 = d6 * 1; if (p6 >= 10) p6 -= 9;
				p7 = d7 * 2; if (p7 >= 10) p7 -= 9;
				p8 = d8 * 1; if (p8 >= 10) p8 -= 9;
				p9 = d9 * 2; if (p9 >= 10) p9 -= 9;
				modulo = 10;
				}

				/* Solo para sociedades publicas (modulo 11) */
				/* Aqui el digito verficador esta en la posicion 9, en las otras 2 en la pos. 10 */
				else if(d3 == 6){
				pub = true;
				p1 = d1 * 3;
				p2 = d2 * 2;
				p3 = d3 * 7;
				p4 = d4 * 6;
				p5 = d5 * 5;
				p6 = d6 * 4;
				p7 = d7 * 3;
				p8 = d8 * 2;
				p9 = 0;
				}

				/* Solo para entidades privadas (modulo 11) */
				else if(d3 == 9) {
				pri = true;
				p1 = d1 * 4;
				p2 = d2 * 3;
				p3 = d3 * 2;
				p4 = d4 * 7;
				p5 = d5 * 6;
				p6 = d6 * 5;
				p7 = d7 * 4;
				p8 = d8 * 3;
				p9 = d9 * 2;
				}

				suma = p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;
				residuo = suma % modulo;

				/* Si residuo=0, dig.ver.=0, caso contrario 10 - residuo*/
				digitoVerificador = residuo==0 ? 0: modulo - residuo;

				/* ahora comparamos el elemento de la posicion 10 con el dig. ver.*/
				if (pub==true){
				if (digitoVerificador != d9){
				console.log('El ruc de la empresa del sector público es incorrecto.');
				return false;
				}
				/* El ruc de las empresas del sector publico terminan con 0001*/
				if ( numero.substr(9,4) != '0001' ){
				console.log('El ruc de la empresa del sector público debe terminar con 0001');
				return false;
				}
				}
				else if(pri == true){
				if (digitoVerificador != d10){
				console.log('El ruc de la empresa del sector privado es incorrecto.');
				return false;
				}
				if ( numero.substr(10,3) != '001' ){
				console.log('El ruc de la empresa del sector privado debe terminar con 001');
				return false;
				}
				}

				else if(nat == true){
				if (digitoVerificador != d10){
				console.log('El n?mero de cédula de la persona natural es incorrecto.');
				return false;
				}
				if (numero.length >10 && numero.substr(10,3) != '001' ){
				console.log('El ruc de la persona natural debe terminar con 001');
				return false;
				}
				}
				return true;
			}
		}
	}else{
		return true;
	}
}


function validacliente(){
	var minombre=$('#nombreP').val();
	var tags=[];
	if (minombre.length>2){
	var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
		db.transaction(
		function (tx){
			tx.executeSql("SELECT nombre, cedula, direccion, telefono, email, id FROM CLIENTES WHERE nombre like '%"+minombre+"%';",[],
			function(tx,res){
				if(res.rows.length>0){
					//construye elselect - objeto res
					for (i = 0; i < res.rows.length; i++) { 
						itemp= {label:res.rows.item(i).nombre, value2:res.rows.item(i).id+"|"+res.rows.item(i).telefono+"|"+res.rows.item(i).direccion+"|"+res.rows.item(i).email+"|"+res.rows.item(i).cedula+"|"+res.rows.item(i).nombre};
						tags.push(itemp);
						//console.log("item:"+i+":"+res.rows.item(i).nombre);
					}				
					//me falta::::  Romper la respuesta y asignarle a cada textbox. Ver que al grabar no se repita.  Ver 
					//que si es nuevo se cree con el numero de cedula igual al nombre hecho pequeno, sin espacios y con la P adelante.
					//tags=[{label:"Jose Villena", value2:"1|telefono|direccion|email"}, {label:"Jose Villarreal", value2:"2|telefono|direccion|email"}, {label:"Jose Vizcaino", value2:"3|telefono|direccion|email"}];
					finalizadeunavez(tags);
			}
			});	
		},errorCB,successCB);
		}
}
function finalizadeunavez(tags){
  
    var availableTags = tags;
    $( "#nombreP" ).autocomplete({
      source: availableTags,
	  select: function( event, ui ) {
		  //$('#direccionP').val(ui.item.label);
		  var xtemp=ui.item.value2.split("|");
		  $('#telefonoP').val(xtemp[1]);
		  $('#emailP').val(xtemp[3]);
		  $('#direccionP').val(xtemp[2]);
		  $('#cedulaP').val(xtemp[4]);
		  $('#idCliente').val(xtemp[0]);
		  $('#clientID').val(xtemp[0]);
		  $('#clientefind').html(xtemp[5]);
		  $('#payClientName').html(xtemp[5]);
		  $('.tipoClienteP').val(1);
		  if($('#insideShop').length > 0){
						continueShopping(xtemp[0]);
					}
	  }
    });
  
  }
  
 function llamaDongle(){
	 
	 console.log("dongle");

	 var account_token1="946BBABDCE61560D388DEBFA8351A662CDC12B9E41B7C1F7EFA74B2487DC5FEA9852B95DE547A0A79D";
	 var transaction_type1="CREDIT_CARD";
	 var charge_total1="10.00";
	 var charge_type1="SALE";
	 var entry_mode1="SWIPED";
	 var order_id1="898198919871";
	 
var form = document.createElement("form");
form.setAttribute("method", "post");
form.setAttribute("action", "https://ws.test.paygateway.com/HostPayService/v1/hostpay/paypage/");
form.setAttribute("target", "view");
var hiddenField = document.createElement("input"); 
hiddenField.setAttribute("type", "hidden");
hiddenField.setAttribute("name", "account_token");
hiddenField.setAttribute("value", account_token1);
form.appendChild(hiddenField);
var hiddenField2 = document.createElement("input"); 
hiddenField2.setAttribute("type", "hidden");
hiddenField2.setAttribute("name", "transaction_type");
hiddenField2.setAttribute("value", transaction_type1);
form.appendChild(hiddenField2);
var hiddenField3 = document.createElement("input"); 
hiddenField3.setAttribute("type", "hidden");
hiddenField3.setAttribute("name", "charge_total");
hiddenField3.setAttribute("value", charge_total1);
form.appendChild(hiddenField3);
var hiddenField4 = document.createElement("input"); 
hiddenField4.setAttribute("type", "hidden");
hiddenField4.setAttribute("name", "charge_type");
hiddenField4.setAttribute("value", charge_type1);
form.appendChild(hiddenField4);
var hiddenField5 = document.createElement("input"); 
hiddenField5.setAttribute("type", "hidden");
hiddenField5.setAttribute("name", "entry_mode");
hiddenField5.setAttribute("value", entry_mode1);
form.appendChild(hiddenField4);
var hiddenField6 = document.createElement("input"); 
hiddenField6.setAttribute("type", "hidden");
hiddenField6.setAttribute("name", "order_id");
hiddenField6.setAttribute("value", order_id1);
form.appendChild(hiddenField6);

document.body.appendChild(form);
var win=window.open('', 'view', 'location=yes');
form.submit();
}

var iabRef = null;
function iabLoadStart(event){
  //alert(event);
}
function iabLoadStop(event){
  //alert(event.type + ' - ' + event.url);
  var link = event.url;
  var res = link.split("?");
  if(res[0]=='https://www.practisis.net/pagos_tarjetas_back.php'){
    var datos = res[1].split("&");
    var order_idaux = datos[0].split("order_id=");
    var order_id = order_idaux[1]
    var response_codeaux = datos[1].split("response_code=");
    var response_code = response_codeaux[1];
    var response_code_textaux = datos[3].split("response_code_text=");
    var response_code_text = response_code_textaux[1].replace(/%20/gi, " ");
    document.getElementById('respuestatarjeta').value=order_id+'||'+response_code+'||'+response_code_text;
    iabRef.close();
    //alert(event.type);
  }
}
function iabClose(event) {
  validarpago();
    //alert(event.type + ' - ' + event.code);
    iabRef.removeEventListener('loadstart', iabLoadStart);
    iabRef.removeEventListener('loadstop', iabLoadStop);
    iabRef.removeEventListener('exit', iabClose);
}

function pagotarjeta(){
  $('#respuestatarjeta').val('');
  $('#order_id').val('');
  var charge_total = window.btoa($('#valortarjeta').val());
  var d = new Date();
  var emp = localStorage.getItem("empresa");
  var order_id_real = d.getTime()+'E'+emp;
  var order_id =  window.btoa(order_id_real);
  $('#order_id').val(order_id_real);
  var myURL=encodeURI('https://www.practisis.net/pagos_tarjetas.php?charge_total='+charge_total+'&order_id='+order_id);
          iabRef = window.open(myURL,'_blank', 'location=yes');
          iabRef.addEventListener('loadstart', iabLoadStart);
          iabRef.addEventListener('loadstop', iabLoadStop);
          iabRef.addEventListener('exit', iabClose);
}

function validarpago(){
  var respuesta = $('#respuestatarjeta').val();
  if(respuesta!=''){
    var resp = respuesta.split("||");
    if(resp[0] != 'null' && resp[0] != '' && resp[1] == '1'){
      antesperformPurchase('table');
    }else{
      if(resp[2] != ''){
        alert('The transaction could not be executed successfully.\nError: '+resp[2]+'.\nPlease choose another card or change your payment method.');
        $('#respuestatarjeta').val('');
      }
    }
  }else{
    alert('The transaction was canceled, please choose another card or change your payment method.');
    $('#respuestatarjeta').val('');
  }
}

function VerificarComandas(){
	//$('#cargandoTabs').modal('show');
	if(localStorage.getItem("con_mesas")=="true"){
		 /*imprimir comandas*/
		var json = '{"ComandasMesas": [{';
			json += '"producto": [';
		var cuan=0;
		$('.productDetails').each(function(){
			if(!$(this).parent().parent().hasClass("printed")){
				var splitDetails = $(this).val().split('|');
				var detalleagregados="";
				var detallenotas="";
				if($(this).attr("data-detagregados")!=''&&$(this).attr("data-detagregados")!=null&&$(this).attr("data-detagregados")!='undefined')
				   detalleagregados=$(this).attr("data-detagregados");
			   
			   if($(this).attr("data-notes")!=''&&$(this).attr("data-notes")!=null&&$(this).attr("data-notes")!='undefined')
				   detallenotas=$(this).attr("data-notes");
			   
			   if(cuan>0){
				   json+=",";
			   }
			   
				json += '{';
					json += '"id_producto" : "'+ splitDetails[0] +'",';
					json += '"timespanproducto" : "'+ splitDetails[0] +'",';
					json += '"timespanconsumo" : "'+getTimeSpan()+'",';
					json += '"nombre_producto" : "'+ splitDetails[1] +'",';
					json += '"cant_prod" : "'+ splitDetails[2] +'",';
					json += '"precio_orig" : "'+ splitDetails[3] +'",';
					json += '"precio_prod" : "'+ splitDetails[4] +'",';
					json += '"impuesto_prod" : "'+ splitDetails[7] +'",';
					json += '"precio_total" : "'+ splitDetails[6] +'",';
					json += '"precio_descuento_justificacion" : "",';
					json += '"agregados" : "'+splitDetails[8]+'",';
					json += '"detalle_agregados" : "'+detalleagregados+'",';
					json += '"detalle_notas" : "'+detallenotas+'"';
				json += '}';
				
				cuan++;
			}
		});
				
		//json = json.substring(0,json.length -1);	
		json += '],"mesa":"'+sessionStorage.getItem("mesa_name")+'",';
		json += '"lang":"'+localStorage.getItem("idioma")+'"';
		json += '}]}';
			
		
		console.log(json);

		/*if(localStorage.getItem("lang")==1)
			showalert("Pedido Guardado con éxito");
		else
			showalert("Order Saved Successfully");*/
		
		if(cuan>0){
			//comanderas
			if(localStorage.getItem("printc")!=null&&localStorage.getItem("printc")!=""){
				if(localStorage.getItem("printtradec")==2){
					StarIOAdapter.rawprint(json,localStorage.getItem("printc"), function(){});
				}else if(localStorage.getItem("printtradec")==1){
					$('#cargandoTabs').modal("show");
					StarIOAdapter.printepson(json,localStorage.getItem("commodel"),localStorage.getItem("comaddress"),localStorage.getItem("comtype"), function() {$('#cargandoTabs').modal("hide");});
				}
			}else{
				/*if(localStorage.getItem("idioma")==1)
					showalert("No se ha configurado una impresora para comandas.");
				else if(localStorage.getItem("idioma")==2)
					showalert("There is no configured a command printer.");*/
			}
			//fin comanderas
		}
		antesperformPurchase('table');
		
	}else{
		antesperformPurchase('table');
	}
	/*imprimir comandas no comandadas*/
}

function AbrirDrawer(){
	if(localStorage.getItem("printtrade")==2){
		if(localStorage.getItem("print")!=null&&localStorage.getItem("print")!=""){
			//alert(localStorage.getItem("print"));
			StarIOAdapter.opendrawer(localStorage.getItem("print"), function(){showalert("Abriendo caja");});
		}
	}else if(localStorage.getItem("printtrade")==1){
		StarIOAdapter.printepson('{"opendrawer":[]}',localStorage.getItem("printmodel"),localStorage.getItem("printaddress"), localStorage.getItem("printtype"),function() {
		},function(){});
	}
}

function PagoSimple(){
	pagonormal=true;
	//$('.simple').css('display','none');
	//$('.columna2').fadeIn();
	$('#pagoavan').fadeIn();
	$('#lisimple,.touchpago,#payButton').css('display','none');
	$('#licheques,#licxc,#liConsumoI,.basurero,.badge,.cuadrototal').css('display','none');
	$('.paymentMethods').val('0.00');
	$('#valortarjeta,#valorcheque1,#valorcxc').val('0.00');
	$('.card').attr("data-value","0");
	$('.cardv').html("");
	//$('.categoryChosen').click();
	
	$('.columna1 div').each(function(){
		$(this).attr('class','paymentCategories');
		//$(this).css('backgroundColor','');
	});
	
	var pagado=0;
	$('.paymentMethods').each(function(){
		if($(this).val()!='')
			pagado+=parseFloat($(this).val());
	});

	var mitot=parseFloat($('#invoiceTotal').html());
	$('#invoicePaid').html(pagado.toFixed(2));

	if((mitot-pagado)>0){
		$('#invoiceDebt').html("FALTANTE");
		if(localStorage.getItem("idioma")==2)
			$('#invoiceDebt').html("TO PAY");
		$('#changeFromPurchase').html(Math.abs(mitot).toFixed(2));
	}else if((mitot-pagado)==0){
		$('#invoiceDebt').html("VUELTO");
		if(localStorage.getItem("idioma")==2)
			$('#invoiceDebt').html("CHANGE");
		$('#changeFromPurchase').html("0.00");
	}else{
		$('#invoiceDebt').html("VUELTO");
		if(localStorage.getItem("idioma")==2)
			$('#invoiceDebt').html("CHANGE");
		$('#changeFromPurchase').html(Math.abs(mitot).toFixed(2));
	}
}

function FacturarFe(){
	var tot=$('#total').html();
	if(parseFloat(tot.substr(1))>0){
		$('#paymentCxC').val($('#total').html());
		$('#paymentCxC').change();
		performPurchase('table');
	}
}