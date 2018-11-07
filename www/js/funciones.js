var currentCantidad=0;
var currentAction='';
var altolistaprod=0;
var pantAlto=$('#content').height();
var pantAncho=$('#content').width();
var vertical=false;
var misdenominaciones=[0.01,0.05,0.10,0.25,0.50,1,5,10,20,100];
var cobronormal=true;


function ActivarCategoria(cual,categoria){
	console.log(categoria);
	$('#category').val(categoria);
	$('#controller').val(1);
	$('.directionProducts').css('display','none');
	$('#listaProductos').html('');
	$('#pager').val('1');
	var fila=cual.parentNode.parentNode;
	var miscateg=fila.getElementsByTagName('li');
	//var tam='btn-lg';
	for(k=0;k<miscateg.length;k++){
		/*tam='btn-lg';
		if($(miscateg[k].hasClass( "btn-xs" )))
			tam='btn-xs';*/
		if(miscateg[k].id!='listaCategorias' && miscateg[k].id!='contenidoCategorias')
			miscateg[k].className="categoria esCategoria ";
	}
	cual.className="categoriaActiva esCategoria active";
	var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
	db.transaction(
	function (tx){
		//console.log('SELECT * FROM PRODUCTOS WHERE categoriaid='+categoria+' and productofinal=1 and estado=1 ORDER BY formulado asc');
		$('#taxes').html('');
		var sqlimp="SELECT * FROM IMPUESTOS WHERE activo=? group by nombre order by id";
		var sinserv=localStorage.getItem('impuestos_personalizados');
		console.log(sinserv+"/"+localStorage.getItem('noservicio'));
		if(sinserv=='true'&&localStorage.getItem('noservicio')=='true'){
			sqlimp="SELECT * FROM IMPUESTOS WHERE activo=? and nombre not like 'servicio' group by nombre order by id";
		}
		
		tx.executeSql(sqlimp,["true"],function(tx,results3){
							console.log(results3);
							var impuestos='';
							var impuestosid='';
							if(results3.rows.length>0){
								console.log("encuentra impuestos");
								var cuan=0;
								for(var r=0;r<results3.rows.length;r++){
									var imp=results3.rows.item(r);
									if(cuan>0){
										impuestos+="@";
										impuestosid+="@";
									}
									impuestos+=parseFloat(imp.porcentaje)/100;
									impuestosid+=imp.timespan;
									$('#taxes').append('<input id="impuesto-'+imp.timespan+'" type="text" value="'+imp.id+"|"+imp.nombre+"|"+parseFloat((imp.porcentaje)/100)+'">');

									cuan++;
								}
								console.log(impuestos+'/'+impuestosid);
								$('#impuestosactivos').html(impuestos);
								$('#impuestosactivosid').html(impuestosid);

				}
		});

		tx.executeSql('SELECT * FROM PRODUCTOS WHERE categoriaid='+categoria+' and productofinal=1 and estado=1 ORDER BY formulado asc',[],function(tx,res){
			//console.log(res);
			if(res.rows.length>0){
				//alert('prods');
				for(m=0;m<res.rows.length;m++){
					var impuestos='';
					var impuestosid='';
					var row=res.rows.item(m);
					if(isNaN(row.precio)){row.precio = 0;}
					if(row.tieneimpuestos=="true"){
						impuestos=$('#impuestosactivos').html();
						impuestosid=$('#impuestosactivosid').html();
					}
						var lineHeight='';
						if(row.formulado.length>12)
							lineHeight='line-height:18px;';

						$('#listaProductos').append('<div style="background-color:'+row.color+'; border:1px solid '+row.color+'; '+lineHeight+' text-transform:capitalize; " id="'+ row.timespan+'" data-precio="'+ row.precio +'" data-impuestos="'+impuestos +'" data-impuestosindexes="'+impuestosid +'" data-id_local = "'+row.id_local+'" data-formulado="'+ row.formulado +'" onclick="VerificarAgregados(this); return false;" ontap="VerificarAgregados(this); return false;" class="producto btn btn-lg btn-primary categoria_producto_'+row.categoriaid +'">'+ row.formulado +'</div>');

					/*if(row.cargaiva==1){
						impuestos+='0.12';
						impuestosid+='1';
					}
					if(row.servicio==1){
						if(row.cargaiva==1){
							impuestos+='@';
							impuestosid+='@';
						}
						impuestos+='0.10';
						impuestosid+='2';
					}*/
				}
				if($(window).width()>900){
						Init31();
					}
					else{
						Init3();
					}
				$('#listaProductos').css("display","");
				showProducts(categoria);
			}
		});
	},errorCB,successCB);


	$('.producto').hide();
	if($(window).width()>900){
			Init31();
	}
	else{
			Init3();
	}

	var maxw=0;
	$('#listacat li').each(function(){
		//alert(parseFloat($(this).css("height")));
		if(parseFloat($(this).css("height"))>maxw)
			maxw=parseFloat($(this).css("height"));
	});
	$('#listacat li').css("height",maxw);
	$('#listacat li a').css("height",maxw);

	showProducts(categoria);
}

function ActivarCategoriasp(cual,categoria){
	console.log(categoria);
	$('#category').val(categoria);
	$('#controller').val(1);
	$('.directionProducts').css('display','none');
	$('#listaProductos').html('');
	$('#pager').val('1');
	var fila=cual.parentNode.parentNode;
	var miscateg=fila.getElementsByTagName('li');
	//var tam='btn-lg';
	for(k=0;k<miscateg.length;k++){
		/*tam='btn-lg';
		if($(miscateg[k].hasClass( "btn-xs" )))
			tam='btn-xs';*/
		if(miscateg[k].id!='listaCategorias' && miscateg[k].id!='contenidoCategorias')
			miscateg[k].className="categoria esCategoria ";
	}
	cual.className="categoriaActiva esCategoria active";
	var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
	db.transaction(
	function (tx){
		$('#taxes').html('');
		tx.executeSql("SELECT * FROM IMPUESTOS WHERE activo=? group by nombre order by id",["true"],function(tx,results3){
							console.log(results3);
							var impuestos='';
							var impuestosid='';
							if(results3.rows.length>0){
								console.log("encuentra impuestos");
								var cuan=0;
								for(var r=0;r<results3.rows.length;r++){
									var imp=results3.rows.item(r);
									if(cuan>0){
										impuestos+="@";
										impuestosid+="@";
									}
									impuestos+=parseFloat(imp.porcentaje)/100;
									impuestosid+=imp.timespan;
									$('#taxes').append('<input id="impuesto-'+imp.timespan+'" type="text" value="'+imp.id+"|"+imp.nombre+"|"+parseFloat((imp.porcentaje)/100)+'">');

									cuan++;
								}
								console.log(impuestos+'/'+impuestosid);
								$('#impuestosactivos').html(impuestos);
								$('#impuestosactivosid').html(impuestosid);

				}
		});

	},errorCB,successCB);


	$('.producto').hide();
	if($(window).width()>900){
			Init31();
	}
	else{
			Init3();
	}

	var maxw=0;
	$('#listacat li').each(function(){
		if(parseFloat($(this).css("height"))>maxw)
			maxw=parseFloat($(this).css("height"));
	});
	$('#listacat li').css("height",maxw);
	$('#listacat li a').css("height",maxw);

	if(categoria == 1){
      $('.jumbotron').show();
      $('#prodprofesionales').hide();
      $('#listaProductos').hide();
      $('#listaCategorias').hide();
	}else{
      $('.jumbotron').hide();
      $('#listaProductos').hide();
      $('#listaCategorias').hide();
      $('#prodprofesionales').show();
	}
}


function showProducts(categoria,direction){

  if(categoria == -14){
    $('#listaProductos').hide();
    $('#prodprofesionales').show();
  }else{

	$('#loader').hide();
	$('.producto').hide();
	$('#listaProductos').hide();
    $('#prodprofesionales').hide();
	var listaProductosWidth = $('#listaProductos').width();
	var listaProductosHeight = $('#listaProductos').height();
	var productosWidth = 0;
	var fixedProdtuctosHeight = 0;
	var fixedProdtuctosWidth = 0;

	$('.categoria_producto_'+ categoria).each(function(){
		productosWidth += parseInt($(this).outerWidth());
		fixedProdtuctosHeight = parseInt($(this).outerHeight());
		fixedProdtuctosWidth = parseInt($(this).outerWidth());
		});

	var maxProductsPerRow = Math.floor(listaProductosWidth/fixedProdtuctosWidth);
	var maxProductsPerColumn = Math.floor(listaProductosHeight/fixedProdtuctosHeight);
	var maxProductsPerSection = parseInt(maxProductsPerRow) * parseInt(maxProductsPerColumn);
	var counter = 0;
	var pager = $('#pager').val();
	$('.categoria_producto_'+ categoria).each(function(index,value){
				$('#listaProductos').show();
				$(this).show();
	});
	$('#maxPage').val(counter);

  }

}

function agregarCompra(item,origen){

	var i = 1;
	$('#descuentoFactura').val(0);
  $('#descuentoFacturatrue').val(0);
	$('#resultBuscador').fadeOut('slow');
	//variables facturacion
	var subtotalSinIva = $('#subtotalSinIva').val();
	var subtotalIva = $('#subtotalIva').val();

	//variables compra
	var total = 0;
	var sumTotal = 0;
	var taxTotal = 0;
	var productoCantidad = 1;
	if(currentCantidad != 0 && currentAction=='+') {
		productoCantidad = currentCantidad;
		currentAction='';
		currentCantidad=0;

	}

	var productoID = $(item).attr('id');
	if(origen==2){
		var idpartes= $(item).attr('id').split('_');
		productoID = idpartes[1];
	}
	var productoNombre = $(item).data('formulado');
	var id_local = $(item).data('id_local');
	var productoImpuestos = $(item).attr('data-impuestos');
	var productoImpuestosIndexes = $(item).attr('data-impuestosindexes');
	var productoPrecio = $(item).data('precio');
	var productoAgregados = $(item).attr('data-modificadores');
	//alert(productoAgregados);
	var subtotalSinIvaCompra = 0;
	var subtotalIvaCompra = 0;
	var idimpservicio=0;
	if(localStorage.getItem('impuestos_personalizados')=='true'){
		if($('#sinservicio').is(':checked')){
			if($('#idservicio').html()!='')
				idimpservicio=$('#idservicio').html();
		}
	}
	var idservicio=$('#idservicio').html();

	//agregados producto

	var vectoragregados=0;
	var tablaagregados="";
	var sumaagregados=0;
	if(productoAgregados!=''&&productoAgregados!=null&&productoAgregados!='undefined'){
		vectoragregados=productoAgregados.split('@');
		tablaagregados+="<table style='width:100%; font-size:10px; color:#808081;'>";
		for(var k in vectoragregados){
			var dataagregados=vectoragregados[k].split('|');
			var precioagr=parseFloat(dataagregados[1])*parseFloat(dataagregados[3]);
			var micant="1 ";
			if(parseFloat(dataagregados[3])<1){
				micant="1/2 ";
            }else{
                micant=dataagregados[3]+" ";
            }
			tablaagregados+="<tr><td style='text-align:right;'>"+micant+"</td><td>"+dataagregados[0]+"</td><td style='text-align:right;'>$"+precioagr.toFixed(2)+"</td></tr>";
			sumaagregados+=precioagr;
		}
		tablaagregados+="</table>";
	}


	//verificar cantidades
	if(parseInt($.trim($('.cantidad').html())) != 0){
		productoCantidad = $.trim($('.cantidad').html());
	}

	//impuestos start
	if($.trim(productoImpuestosIndexes) != '' && $.trim(productoImpuestosIndexes) != 0){
		if($.trim(productoImpuestosIndexes).indexOf('@') !== -1){
			$.each(productoImpuestosIndexes.split('@'), function(index,value){
				if(value!=idimpservicio){
					if(productoImpuestosIndexes.indexOf(parseInt($('#idiva').html())) !== -1){
						subtotalIvaCompra = (parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados));
						}
					else{
						subtotalSinIvaCompra = (parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados));
						}

					if($('#impuestoFactura-'+ value).length == 0){

						var impuestoDetalles = $('#impuesto-'+ value).val().split('|');
						var currentimp=(parseFloat(productoCantidad) *( parseFloat(productoPrecio)+sumaagregados) * parseFloat(impuestoDetalles[2]));
						taxTotal+= currentimp;

						$('#factura').append('<input type="hidden" id="impuestoFactura-'+ value +'" class="esImpuesto" data-id="'+ impuestoDetalles[0] +'" data-nombre="'+ impuestoDetalles[1] +'" data-valor="'+ impuestoDetalles[2] +'" value="'+ currentimp +'"/>');
						}
					else{
						var impuestoDetalles = $('#impuesto-'+ value).val().split('|');
						var currentTax = $('#impuestoFactura-'+ value).val();
						var calcimp=((parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados)) * parseFloat(impuestoDetalles[2]));
						taxTotal += calcimp;

						$('#impuestoFactura-'+ value).val(parseFloat(currentTax) + parseFloat(calcimp));
						}
					}
				});
			}
		else{
			productoImpuestosIndexes == parseInt($('#idiva').html()) ? subtotalIvaCompra = (parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados)) : subtotalSinIvaCompra = (parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados));
              //alert($('#impuestoFactura-'+productoImpuestosIndexes)+'**'+productoImpuestosIndexes);
			if($('#impuestoFactura-'+productoImpuestosIndexes).length == 0){
				var impuestoDetalles = $('#impuesto-'+ productoImpuestosIndexes).val().split('|');
				taxTotal+= ((parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados)) * parseFloat(impuestoDetalles[2]));
				$('#factura').append('<input type="hidden" id="impuestoFactura-'+ productoImpuestosIndexes +'" class="esImpuesto" data-id="'+ impuestoDetalles[0] +'" data-nombre="'+ impuestoDetalles[1] +'" data-valor="'+ impuestoDetalles[2] +'" value="'+ taxTotal +'"/>');
				}
			else{
				var impuestoDetalles = $('#impuesto-'+ productoImpuestosIndexes).val().split('|');
				var currentTax = $('#impuestoFactura-'+ productoImpuestosIndexes).val();
				taxTotal+= ((parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados)) * parseFloat(impuestoDetalles[2]));
				//$('#impuestoFactura-'+ productoImpuestosIndexes).val(parseFloat(currentTax) + parseFloat(taxTotal));
				$('#impuestoFactura-'+ productoImpuestosIndexes).val(parseFloat(currentTax) + parseFloat(taxTotal));
				}
			}
		}else{
			subtotalSinIvaCompra=(parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados));
		}
	//impuestos end
	var max=0;
	$('#tablaCompra tr').each(function(){
		var idtr=$(this).attr("id");
		//alert(idtr);
		if(idtr!=null){
			var dataid=idtr.split('_');
			if(parseInt(dataid[1])>=max)
				max=parseInt(dataid[1])+1;
		}

	});

	var innerlinea="";
	if(localStorage.getItem("con_notas")=="true"){
		innerlinea=' onclick="MostrarNota(this)"; ';
	}

//	alert(productoCantidad+"/"+productoPrecio+"/"+taxTotal+"/"+sumaagregados);

	var total = productoCantidad * (productoPrecio + sumaagregados) + taxTotal;//YAESTA

	//alert(total);


	$('#tablaCompra').append('<tr id="cant_'+max+'"><td class="lineadetalle" data-borrarcantidad="'+ productoCantidad +'" data-borrarimpuesto="'+ productoImpuestos +'" data-borrarimpuestoindexes="'+ productoImpuestosIndexes +'" data-borrarprecio="'+ productoPrecio +'" data-agregados="'+sumaagregados+'" onclick="borrarCompra(this); return false;" style="width: 5%;"><button type="button" class="btn btn-danger btn-xs product_del"><span class="glyphicon glyphicon-remove" ></span></button><input type="hidden" class="totales" value="'+ total +'"/></td><td onclick="modificarCantidad('+max+' , '+id_local+')" style="border-right:1px solid #909192; text-align: center; width:20%;" class="lineadetalle" "><input type="hidden" class="productDetails" value="'+ productoID +'|'+ productoNombre +'|'+ productoCantidad +'|'+ productoPrecio +'|'+ productoPrecio +'|'+ productoImpuestos +'|'+ (productoCantidad * (productoPrecio+sumaagregados) + taxTotal) +'|'+productoImpuestosIndexes+'|'+sumaagregados+'" data-detagregados="'+productoAgregados+'"  data-id_real="'+id_local+'"  /><input type="hidden" class="cantidadproductoscomandados" value="'+productoCantidad+'"/>'+productoCantidad +'</td><td style="border-right:1px solid #909192; padding:5px;text-align: left; width:50%; text-transform:capitalize;" class="lineadetalle"><span class="lineanota" data-id="'+max+'" '+innerlinea+'>'+productoNombre+'</span>'+tablaagregados+'</td><td style="padding-right:20px; text-align: right;" class="lineadetalle">'+ (total).toFixed(4) +'</td></tr>');

	/*$('[data-toggle="popover"]').popover({content:"<textarea class='form-control' id='textonota' type='text' ></textarea><div style='text-align:right; margin-top:5px;'><button class='btn btn-success' onclick='AgregarNota();'>Agregar</button></div>",html:true,placement:"top"});*/

	/*$("[data-toggle='popover']").on('shown.bs.popover', function(){
       $('.popover').attr("data-id",$(this).attr('data-id'));
    });*/

	$('.totales').each(function(){
		sumTotal += parseFloat($.trim($(this).val()));
		i++;
	});


	console.log (i+'cantidad');
	$('#'+productoID).attr("data-modificadores","");
	var sumcantidadComandada = 0;
	//alert($('.cantidadproductoscomandados').length)
	$('.cantidadproductoscomandados').each(function(){
		sumcantidadComandada += parseFloat($.trim($(this).val()));
		//alert($.trim($(this).val()));
	});
	console.log('los items facturados son'+sumcantidadComandada);
	$('#itemsVendidos').html(sumcantidadComandada);
	
	if(sumcantidadComandada==0)
		$('#sinservicio').prop('disabled',false);
	else
		$('#sinservicio').prop('disabled',true);
	
	//$('#espacioavisador').html("Tienes "+sumcantidadComandada+" pedidos. <a onclick='window.scrollTo(0,document.body.scrollHeight);'>Ver Cuenta al final.</a>");
	$('#menuSubNew2').html("Total - Ver "+sumcantidadComandada+" pedidos");


	//alert(sumTotal+'/');
	$('#totalmiFactura').val(sumTotal);
	$('#total').html('$'+ parseFloat(sumTotal).toFixed(2));

	if($('#total').html().toString().length==9)
		$('#divtotal').css('font-size','26px');
	else if($('#total').html().toString().length>9)
		$('#divtotal').css('font-size','26px');
	else
		$('#divtotal').css('font-size','30px');

	if($('#total').html().toString().length>7){
		$('.den').css('width',4.5*parseFloat($('.producto').css('height')));
	}else{
		$('.den').css('width',3*parseFloat($('.producto').css('height')));
	}

	$('#payButton').html('PAGAR');
	$('#invoiceTotal').html(parseFloat(sumTotal).toFixed(2));
	$('#justo').html('$ '+sumTotal.toFixed(2));
	$('#justo').attr('data-value',-1*sumTotal.toFixed(2));
	$('#redondeado').html('$ '+Math.ceil(sumTotal).toFixed(2));
	$('#redondeado').attr('data-value',-1*Math.ceil(sumTotal).toFixed(2));
	var alta=0;
	for( var t in misdenominaciones){
		if(misdenominaciones[t]>sumTotal)
		{
			alta=misdenominaciones[t];
			break;
		}
	}
	$('#altaden').html('$ '+alta.toFixed(2));
	$('#altaden').attr('data-value',-1*alta.toFixed(2));
	if(alta!=sumTotal&&alta!=Math.ceil(sumTotal)&&alta!=0)
		$('#altaden').parent().css('display','inline');
	else
		$('#altaden').parent().css('display','none');

	var prox10=0;
	var iter=1;
	var p10=iter*10;
	while(p10<sumTotal){
		iter++;
		p10=iter*10;
	}
	$('#prox10').html('$ '+p10.toFixed(2));
	$('#prox10').attr('data-value',-1*p10.toFixed(2));
	//console.log(p10+'/'+alta);
	if(p10>0&&p10!=alta)
		$('#prox10').parent().css('display','inline');
	else
		$('#prox10').parent().css('display','none');

	var prox20=0;
	var iter=1;
	var p20=iter*20;
	while(p20<sumTotal){
		iter++;
		p20=iter*20;
	}
	$('#prox20').html('$ '+p20.toFixed(2));
	$('#prox20').attr('data-value',-1*p20.toFixed(2));
	if(p20>0&&p20!=p10)
		$('#prox20').parent().css('display','inline');
	else
		$('#prox20').parent().css('display','none');



	$('#subtotalSinIva').val(parseFloat(subtotalSinIva) + parseFloat(subtotalSinIvaCompra));
	$('#subtotalIva').val(parseFloat(subtotalIva) + parseFloat(subtotalIvaCompra));
	$('.cantidad').html('0');
	$('#tableresults').html('');
	$('#inputbusc').val('');
    $('.cantidadnew').html('0');
	$('#tableresultsnew').html('');
	$('#inputbuscnew').val('');
	$('#contentdetalle').animate({
		scrollTop: $('#contentdetalle')[0].scrollHeight
		}, 1000).clearQueue();
	$('#tablaCompra tr:last-child').effect('highlight',{},'normal');
	celdaenfocada=-1;
	PlaySound(0);
	/*$('.lineadetalle').css('font-size',$('.lineadetalle').css('font-size'));
	if(vertical==true)
		$('.product_del').css('width',(pantAlto*2.7/100)+'px');
	else
		$('.product_del').css('width',(pantAlto*3/100)+'px');*/
	$('.product_del').on('click',function(){
			PlaySound(4);
	});

	$('#btn_pagar').attr('class','btn btn-success btn-block btn-lg');

	if(localStorage.getItem("con_mesas")=="true"){
		if(localStorage.getItem("idioma")==1)
			$('#btn_gpedidos').html('guardar');
		else if(localStorage.getItem("idioma")==2)
			$('#btn_gpedidos').html('save');
		$('#btn_gpedidos').show();
		$('#btn_pagar').hide();
	}

	//init2();
}

function agregarCompraLocal(item,idmenudiseno){

	var i = 1;
	$('#descuentoFactura').val(0);
  $('#descuentoFacturatrue').val(0);
	$('#resultBuscador').fadeOut('slow');
	//variables facturacion
	var subtotalSinIva = $('#subtotalSinIva').val();
	var subtotalIva = $('#subtotalIva').val();

	//variables compra
	var total = 0;
	var sumTotal = 0;
	var taxTotal = 0;
	var productoCantidad = 1;
	if(currentCantidad != 0 && currentAction=='+') {
		productoCantidad = currentCantidad;
		currentAction='';
		currentCantidad=0;

	}

	var productoID = $(item).attr('id');

    var apiURL='http://'+localStorage.getItem("ip_servidor")+'/connectnubepos/api2.php';
       $.post(apiURL,{
  		id_emp : localStorage.getItem("empresa"),
  		action : 'PrecioDelFormulado',
  		id_barra : localStorage.getItem("idbarra"),
  		deviceid:$("#deviceid").html(),
        timespanmenu : idmenudiseno
  		}).done(function(response){
  			if(response!='block' && response!='Desactivado'){
  				//console.log(response);
                  //var res = response.split("||");
                  var y = JSON.parse(response);
            		var mods= new Array();
            		if(y.length>0){
                        for(var m=0;m<y.length;m++){
            				var miobj=y[m];
            				var preciodelformulado=miobj.precio_del_formulado;
            			}
            		}else{
                           var preciodelformulado=0;
            		}

                    //alert(preciodelformulado+'**'+idmenudiseno);

                    var productoNombre = $(item).data('formulado');
                	var id_local = $(item).data('id_local');
                	var productoImpuestos = $(item).attr('data-impuestos');
                	var productoImpuestosIndexes = $(item).attr('data-impuestosindexes');
                    if(preciodelformulado == 2){
                	  var productoPrecio = 0;
                    }else{
                      var productoPrecio = $(item).data('precio');
                    }
                	var productoAgregados = $(item).attr('data-modificadores');
                	//alert(productoAgregados);
                	var subtotalSinIvaCompra = 0;
                	var subtotalIvaCompra = 0;

                	//agregados producto

                	var vectoragregados=0;
                	var tablaagregados="";
                	var sumaagregados=0;
                	if(productoAgregados!=''&&productoAgregados!=null&&productoAgregados!='undefined'){
                		vectoragregados=productoAgregados.split('@');
                		tablaagregados+="<table style='width:100%; font-size:10px; color:#808081;'>";
                		for(var k in vectoragregados){
                			var dataagregados=vectoragregados[k].split('|');
                			var precioagr=parseFloat(dataagregados[1])*parseFloat(dataagregados[3]);
                			var micant="1 ";
                			if(parseFloat(dataagregados[3])<1){
                				micant="1/2 ";
                            }else{
                                micant=dataagregados[3]+" ";
                            }
                			tablaagregados+="<tr><td style='text-align:right;'>"+micant+"</td><td>"+dataagregados[0]+"</td><td style='text-align:right;'>$"+precioagr.toFixed(2)+"</td></tr>";
                			sumaagregados+=precioagr;
                		}
                		tablaagregados+="</table>";
                	}


                	//verificar cantidades
                	if(parseInt($.trim($('.cantidad').html())) != 0){
                		productoCantidad = $.trim($('.cantidad').html());
                	}

                	//impuestos start
                	if($.trim(productoImpuestosIndexes) != '' && $.trim(productoImpuestosIndexes) != 0){
                		if($.trim(productoImpuestosIndexes).indexOf('@') !== -1){
                			$.each(productoImpuestosIndexes.split('@'), function(index,value){
                				if(productoImpuestosIndexes.indexOf(parseInt($('#idiva').html())) !== -1){
                					subtotalIvaCompra = (parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados));
                					}
                				else{
                					subtotalSinIvaCompra = (parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados));
                					}

                				if($('#impuestoFactura-'+ value).length == 0){

                					var impuestoDetalles = $('#impuesto-'+ value).val().split('|');
                					var currentimp=(parseFloat(productoCantidad) *( parseFloat(productoPrecio)+sumaagregados) * parseFloat(impuestoDetalles[2]));
                					taxTotal+= currentimp;

                					$('#factura').append('<input type="hidden" id="impuestoFactura-'+ value +'" class="esImpuesto" data-id="'+ impuestoDetalles[0] +'" data-nombre="'+ impuestoDetalles[1] +'" data-valor="'+ impuestoDetalles[2] +'" value="'+ currentimp +'"/>');
                					}
                				else{
                					var impuestoDetalles = $('#impuesto-'+ value).val().split('|');
                					var currentTax = $('#impuestoFactura-'+ value).val();
                					var calcimp=((parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados)) * parseFloat(impuestoDetalles[2]));
                					taxTotal += calcimp;

                					$('#impuestoFactura-'+ value).val(parseFloat(currentTax) + parseFloat(calcimp));
                					}
                				});
                			}
                		else{
                			productoImpuestosIndexes == parseInt($('#idiva').html()) ? subtotalIvaCompra = (parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados)) : subtotalSinIvaCompra = (parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados));
                              //alert($('#impuestoFactura-'+productoImpuestosIndexes)+'**'+productoImpuestosIndexes);
                			if($('#impuestoFactura-'+productoImpuestosIndexes).length == 0){
                				var impuestoDetalles = $('#impuesto-'+ productoImpuestosIndexes).val().split('|');
                				taxTotal+= ((parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados)) * parseFloat(impuestoDetalles[2]));
                				$('#factura').append('<input type="hidden" id="impuestoFactura-'+ productoImpuestosIndexes +'" class="esImpuesto" data-id="'+ impuestoDetalles[0] +'" data-nombre="'+ impuestoDetalles[1] +'" data-valor="'+ impuestoDetalles[2] +'" value="'+ taxTotal +'"/>');
                				}
                			else{
                				var impuestoDetalles = $('#impuesto-'+ productoImpuestosIndexes).val().split('|');
                				var currentTax = $('#impuestoFactura-'+ productoImpuestosIndexes).val();
                				taxTotal+= ((parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados)) * parseFloat(impuestoDetalles[2]));
                				$('#impuestoFactura-'+ productoImpuestosIndexes).val(parseFloat(currentTax) + parseFloat(taxTotal));
                				}
                			}
                		}else{
                			subtotalSinIvaCompra=(parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados));
                		}
                	//impuestos end
                	var max=0;
                	$('#tablaCompra tr').each(function(){
                		var idtr=$(this).attr("id");
                		//alert(idtr);
                		if(idtr!=null){
                			var dataid=idtr.split('_');
                			if(parseInt(dataid[1])>=max)
                				max=parseInt(dataid[1])+1;
                		}

                	});

                	var innerlinea="";
                	if(localStorage.getItem("con_notas")=="true"){
                		innerlinea=' onclick="MostrarNota(this)"; ';
                	}

                	var total = productoCantidad * (productoPrecio + sumaagregados) + taxTotal;//YAESTA

                	$('#tablaCompra').append('<tr id="cant_'+max+'"><td class="lineadetalle" data-borrarcantidad="'+ productoCantidad +'" data-borrarimpuesto="'+ productoImpuestos +'" data-borrarimpuestoindexes="'+ productoImpuestosIndexes +'" data-borrarprecio="'+ productoPrecio +'" data-agregados="'+sumaagregados+'" onclick="borrarCompra(this); return false;" style="width: 5%;"><button type="button" class="btn btn-danger btn-xs product_del"><span class="glyphicon glyphicon-remove" ></span></button><input type="hidden" class="totales" value="'+ total +'"/></td><td onclick="modificarCantidad('+max+' , '+id_local+')" style="border-right:1px solid #909192; text-align: center; width:20%;" class="lineadetalle" "><input type="hidden" class="productDetails" value="'+ productoID +'|'+ productoNombre +'|'+ productoCantidad +'|'+ productoPrecio +'|'+ productoPrecio +'|'+ productoImpuestos +'|'+ (productoCantidad * (productoPrecio+sumaagregados) + taxTotal) +'|'+productoImpuestosIndexes+'|'+sumaagregados+'" data-detagregados="'+productoAgregados+'"  data-id_real="'+id_local+'"  /><input type="hidden" class="cantidadproductoscomandados" value="'+productoCantidad+'"/>'+productoCantidad +'</td><td style="border-right:1px solid #909192; padding:5px;text-align: left; width:50%; text-transform:capitalize;" class="lineadetalle"><span class="lineanota" data-id="'+max+'" '+innerlinea+'>'+productoNombre+'</span>'+tablaagregados+'</td><td style="padding-right:20px; text-align: right;" class="lineadetalle">'+ (total).toFixed(4) +'</td></tr>');

                	$('.totales').each(function(){
                		sumTotal += parseFloat($.trim($(this).val()));
                		i++;
                	});


                	console.log (i+'cantidad');
                	$('#'+productoID).attr("data-modificadores","");
                	var sumcantidadComandada = 0;
                	//alert($('.cantidadproductoscomandados').length)
                	$('.cantidadproductoscomandados').each(function(){
                		sumcantidadComandada += parseFloat($.trim($(this).val()));
                		//alert($.trim($(this).val()));
                	});
                	console.log('los items facturados son'+sumcantidadComandada);
                	$('#itemsVendidos').html(sumcantidadComandada);
					
					if(sumcantidadComandada==0)
						$('#sinservicio').prop('disabled',false);
					else
						$('#sinservicio').prop('disabled',true);
					
                	//$('#espacioavisador').html("Tienes "+sumcantidadComandada+" pedidos. <a onclick='window.scrollTo(0,document.body.scrollHeight);'>Ver Cuenta al final.</a>");
                	$('#menuSubNew2').html("Total - Ver "+sumcantidadComandada+" pedidos");


                	//alert(sumTotal+'/');
                	$('#totalmiFactura').val(sumTotal);
                	$('#total').html('$'+ parseFloat(sumTotal).toFixed(2));

                	if($('#total').html().toString().length==9)
                		$('#divtotal').css('font-size','26px');
                	else if($('#total').html().toString().length>9)
                		$('#divtotal').css('font-size','26px');
                	else
                		$('#divtotal').css('font-size','30px');

                	if($('#total').html().toString().length>7){
                		$('.den').css('width',4.5*parseFloat($('.producto').css('height')));
                	}else{
                		$('.den').css('width',3*parseFloat($('.producto').css('height')));
                	}

                	$('#payButton').html('PAGAR');
                	$('#invoiceTotal').html(parseFloat(sumTotal).toFixed(2));
                	$('#justo').html('$ '+sumTotal.toFixed(2));
                	$('#justo').attr('data-value',-1*sumTotal.toFixed(2));
                	$('#redondeado').html('$ '+Math.ceil(sumTotal).toFixed(2));
                	$('#redondeado').attr('data-value',-1*Math.ceil(sumTotal).toFixed(2));
                	var alta=0;
                	for( var t in misdenominaciones){
                		if(misdenominaciones[t]>sumTotal)
                		{
                			alta=misdenominaciones[t];
                			break;
                		}
                	}
                	$('#altaden').html('$ '+alta.toFixed(2));
                	$('#altaden').attr('data-value',-1*alta.toFixed(2));
                	if(alta!=sumTotal&&alta!=Math.ceil(sumTotal)&&alta!=0)
                		$('#altaden').parent().css('display','inline');
                	else
                		$('#altaden').parent().css('display','none');

                	var prox10=0;
                	var iter=1;
                	var p10=iter*10;
                	while(p10<sumTotal){
                		iter++;
                		p10=iter*10;
                	}
                	$('#prox10').html('$ '+p10.toFixed(2));
                	$('#prox10').attr('data-value',-1*p10.toFixed(2));
                	//console.log(p10+'/'+alta);
                	if(p10>0&&p10!=alta)
                		$('#prox10').parent().css('display','inline');
                	else
                		$('#prox10').parent().css('display','none');

                	var prox20=0;
                	var iter=1;
                	var p20=iter*20;
                	while(p20<sumTotal){
                		iter++;
                		p20=iter*20;
                	}
                	$('#prox20').html('$ '+p20.toFixed(2));
                	$('#prox20').attr('data-value',-1*p20.toFixed(2));
                	if(p20>0&&p20!=p10)
                		$('#prox20').parent().css('display','inline');
                	else
                		$('#prox20').parent().css('display','none');



                	$('#subtotalSinIva').val(parseFloat(subtotalSinIva) + parseFloat(subtotalSinIvaCompra));
                	$('#subtotalIva').val(parseFloat(subtotalIva) + parseFloat(subtotalIvaCompra));
                	$('.cantidad').html('0');
                	$('#tableresults').html('');
                	$('#inputbusc').val('');
                    $('.cantidadnew').html('0');
                	$('#tableresultsnew').html('');
                	$('#inputbuscnew').val('');
                	$('#contentdetalle').animate({
                		scrollTop: $('#contentdetalle')[0].scrollHeight
                		}, 1000).clearQueue();
                	$('#tablaCompra tr:last-child').effect('highlight',{},'normal');
                	celdaenfocada=-1;
                	PlaySound(0);

                	$('.product_del').on('click',function(){
                			PlaySound(4);
                	});

                	$('#btn_pagar').attr('class','btn btn-success btn-block btn-lg');

                	if(localStorage.getItem("con_mesas")=="true"){
                		if(localStorage.getItem("idioma")==1)
                			$('#btn_gpedidos').html('guardar');
                		else if(localStorage.getItem("idioma")==2)
                			$('#btn_gpedidos').html('save');
                		$('#btn_gpedidos').show();
                		$('#btn_pagar').hide();
                	}

  			}else if(response=='Desactivado'){
  			    envia('config');
  				setTimeout(function(){
  					$('.navbar,#barraalternamovil').slideUp();
  					$("#demoGratis,#fadeRow,#finalizado,#contentStepSincro,#cuentaactiva").css("display","none");
  					$('#desactivo').fadeIn();
  				},100);
  			}else{
  				envia('config');
  				setTimeout(function(){
  					$('#linklogin,#linkloginb').attr("href","https://www.practisis.net/index3.php?rvpas="+localStorage.getItem("userPasswod")+"&rvus="+localStorage.getItem("userRegister"));
  					$('.navbar,#barraalternamovil').slideUp();
  					$("#demoGratis,#fadeRow,#finalizado,#contentStepSincro,#cuentaactiva").css("display","none");
  					$('#bloqueo').fadeIn();
  				},100);

  			}

  		}).fail(function(){
  			updateOnlineStatus("OFFLINE");
  			setTimeout(function(){SincronizadorNormal()},180000);
  		});

	/*if(origen==2){
		var idpartes= $(item).attr('id').split('_');
		productoID = idpartes[1];
	}*/

}

function agregarCompranew(item,origen){

	var i = 1;
	$('#descuentoFactura').val(0);
  $('#descuentoFacturatrue').val(0);
	$('#resultBuscador').fadeOut('slow');
	//variables facturacion
	var subtotalSinIva = $('#subtotalSinIva').val();
	var subtotalIva = $('#subtotalIva').val();

	//variables compra
	var total = 0;
	var sumTotal = 0;
	var taxTotal = 0;
	var productoCantidad = 1;
	if(currentCantidad != 0 && currentAction=='+') {
		productoCantidad = currentCantidad;
		currentAction='';
		currentCantidad=0;

	}

	var productoID = $(item).attr('id');
	if(origen==2){
		var idpartes= $(item).attr('id').split('_');
		productoID = idpartes[1];
	}

	var productoNombre = $(item).data('formulado');
	var id_local = $(item).data('id_local');
	var productoImpuestos = $(item).attr('data-impuestos');
	var productoImpuestosIndexes = $(item).attr('data-impuestosindexes');
	var productoPrecio = $(item).data('precio');
	var productoAgregados = $(item).attr('data-modificadores');
	//alert(productoAgregados);
	var subtotalSinIvaCompra = 0;
	var subtotalIvaCompra = 0;

	//agregados producto

	var vectoragregados=0;
	var tablaagregados="";
	var sumaagregados=0;
	if(productoAgregados!=''&&productoAgregados!=null&&productoAgregados!='undefined'){
		vectoragregados=productoAgregados.split('@');
		tablaagregados+="<table style='width:100%; font-size:10px; color:#808081;'>";
		for(var k in vectoragregados){
			var dataagregados=vectoragregados[k].split('|');
			tablaagregados+="<tr><td>"+dataagregados[0]+"</td><td style='text-align:right;'>$"+parseFloat(dataagregados[1]).toFixed(2)+"</td></tr>";
			sumaagregados+=parseFloat(dataagregados[1]);
		}
		tablaagregados+="</table>";
	}


	//verificar cantidades
	if(parseInt($.trim($('.cantidadnew').html())) != 0){
		productoCantidad = $.trim($('.cantidadnew').html());
	}
	//impuestos start
	if($.trim(productoImpuestosIndexes) != '' && $.trim(productoImpuestosIndexes) != 0){
		if($.trim(productoImpuestosIndexes).indexOf('@') !== -1){
			$.each(productoImpuestosIndexes.split('@'), function(index,value){
				if(productoImpuestosIndexes.indexOf(parseInt($('#idiva').html())) !== -1){
					subtotalIvaCompra = (parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados));
					}
				else{
					subtotalSinIvaCompra = (parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados));
					}

				if($('#impuestoFactura-'+ value).length == 0){

					var impuestoDetalles = $('#impuesto-'+ value).val().split('|');
					var currentimp=(parseFloat(productoCantidad) *( parseFloat(productoPrecio)+sumaagregados) * parseFloat(impuestoDetalles[2]));
					taxTotal+= currentimp;

					$('#factura').append('<input type="hidden" id="impuestoFactura-'+ value +'" class="esImpuesto" data-id="'+ impuestoDetalles[0] +'" data-nombre="'+ impuestoDetalles[1] +'" data-valor="'+ impuestoDetalles[2] +'" value="'+ currentimp +'"/>');
					}
				else{
					var impuestoDetalles = $('#impuesto-'+ value).val().split('|');
					var currentTax = $('#impuestoFactura-'+ value).val();
					var calcimp=((parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados)) * parseFloat(impuestoDetalles[2]));
					taxTotal += calcimp;

					$('#impuestoFactura-'+ value).val(parseFloat(currentTax) + parseFloat(calcimp));
					}
				});
			}
		else{
			productoImpuestosIndexes == parseInt($('#idiva').html()) ? subtotalIvaCompra = (parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados)) : subtotalSinIvaCompra = (parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados));

			if($('#impuestoFactura-'+productoImpuestosIndexes).length == 0){
				var impuestoDetalles = $('#impuesto-'+ productoImpuestosIndexes).val().split('|');
				taxTotal+= ((parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados)) * parseFloat(impuestoDetalles[2]));
				$('#factura').append('<input type="hidden" id="impuestoFactura-'+ productoImpuestosIndexes +'" class="esImpuesto" data-id="'+ impuestoDetalles[0] +'" data-nombre="'+ impuestoDetalles[1] +'" data-valor="'+ impuestoDetalles[2] +'" value="'+ taxTotal +'"/>');
				}
			else{
				var impuestoDetalles = $('#impuesto-'+ productoImpuestosIndexes).val().split('|');
				var currentTax = $('#impuestoFactura-'+ productoImpuestosIndexes).val();
				taxTotal+= ((parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados)) * parseFloat(impuestoDetalles[2]));
				$('#impuestoFactura-'+ productoImpuestosIndexes).val(parseFloat(currentTax) + parseFloat(taxTotal));
				}
			}
		}else{
			subtotalSinIvaCompra=(parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados));
		}
	//impuestos end
	var max=0;
	$('#tablaCompra tr').each(function(){
		var idtr=$(this).attr("id");
		//alert(idtr);
		if(idtr!=null){
			var dataid=idtr.split('_');
			if(parseInt(dataid[1])>=max)
				max=parseInt(dataid[1])+1;
		}

	});

	var total = productoCantidad * (productoPrecio+sumaagregados) + taxTotal;//YAESTA

	$('#tablaCompra').append('<tr id="cant_'+max+'"><td class="lineadetalle" data-borrarcantidad="'+ productoCantidad +'" data-borrarimpuesto="'+ productoImpuestos +'" data-borrarimpuestoindexes="'+ productoImpuestosIndexes +'" data-borrarprecio="'+ productoPrecio +'" data-agregados="'+sumaagregados+'" onclick="borrarCompra(this); return false;" style="width: 5%;"><button type="button" class="btn btn-danger btn-xs product_del"><span class="glyphicon glyphicon-remove" ></span></button><input type="hidden" class="totales" value="'+ total +'"/></td><td onclick="modificarCantidad('+max+' , '+id_local+')" style="border-right:1px solid #909192; text-align: center; width:20%;" class="lineadetalle" "><input type="hidden" class="productDetails" value="'+ productoID +'|'+ productoNombre +'|'+ productoCantidad +'|'+ productoPrecio +'|'+ productoPrecio +'|'+ productoImpuestos +'|'+ ((parseFloat(productoCantidad) * parseFloat(productoPrecio)) + parseFloat(taxTotal)+parseFloat(sumaagregados)) +'|'+productoImpuestosIndexes+'|'+sumaagregados+'" data-detagregados="'+productoAgregados+'" data-id_local="'+id_local+'" /><input type="hidden" class="cantidadproductoscomandados" value="'+productoCantidad+'"/>'+productoCantidad +'</td><td style="border-right:1px solid #909192; padding-left:20px;text-align: left; width:50%; text-transform:capitalize;" class="lineadetalle">'+productoNombre+tablaagregados+'</td><td style="padding-right:20px; text-align: right;" class="lineadetalle">'+ parseFloat(total).toFixed(4) +'</td></tr>');
	$('.totales').each(function(){
		sumTotal += parseFloat($.trim($(this).val()));
		i++;
	});
	console.log (i+'cantidad');
	$('#'+productoID).attr("data-modificadores","");
	var sumcantidadComandada = 0;
	//alert($('.cantidadproductoscomandados').length)
	$('.cantidadproductoscomandados').each(function(){
		sumcantidadComandada += parseFloat($.trim($(this).val()));
		//alert($.trim($(this).val()));
	});
	console.log('los items facturados son'+sumcantidadComandada);
	$('#itemsVendidos').html(sumcantidadComandada);
	
	if(sumcantidadComandada==0)
		$('#sinservicio').prop('disabled',false);
	else
		$('#sinservicio').prop('disabled',true);
	
	$('#espacioavisador').html("Tienes "+sumcantidadComandada+" pedidos. <a onclick='window.scrollTo(0,document.body.scrollHeight);'>Ver Cuenta al final.</a>");


	//alert(subtotalSinIva+'/'+subtotalSinIvaCompra);
	$('#totalmiFactura').val(sumTotal);
	$('#total').html('$'+ parseFloat(sumTotal).toFixed(2));
	if($('#total').html().toString().length==9)
		$('#divtotal').css('font-size','26px');
	else if($('#total').html().toString().length>9)
		$('#divtotal').css('font-size','26px');
	else
		$('#divtotal').css('font-size','30px');

	if($('#total').html().toString().length>7){
		$('.den').css('width',4.5*parseFloat($('.producto').css('height')));
	}else{
		$('.den').css('width',3*parseFloat($('.producto').css('height')));
	}

	$('#payButton').html('PAGAR');
	$('#invoiceTotal').html(parseFloat(sumTotal).toFixed(2));
	$('#justo').html(sumTotal.toFixed(2));
	$('#justo').attr('data-value',-1*sumTotal.toFixed(2));
	$('#redondeado').html(Math.ceil(sumTotal).toFixed(2));
	$('#redondeado').attr('data-value',-1*Math.ceil(sumTotal).toFixed(2));
	var alta=0;
	for( var t in misdenominaciones){
		if(misdenominaciones[t]>sumTotal)
		{
			alta=misdenominaciones[t];
			break;
		}
	}
	$('#altaden').html(alta.toFixed(2));
	$('#altaden').attr('data-value',-1*alta.toFixed(2));
	if(alta!=sumTotal&&alta!=Math.ceil(sumTotal)&&alta!=0)
		$('#altaden').parent().css('display','inline');
	else
		$('#altaden').parent().css('display','none');

	var prox10=0;
	var iter=1;
	var p10=iter*10;
	while(p10<sumTotal){
		iter++;
		p10=iter*10;
	}
	$('#prox10').html(p10.toFixed(2));
	$('#prox10').attr('data-value',-1*p10.toFixed(2));
	//console.log(p10+'/'+alta);
	if(p10>0&&p10!=alta)
		$('#prox10').parent().css('display','inline');
	else
		$('#prox10').parent().css('display','none');

	var prox20=0;
	var iter=1;
	var p20=iter*20;
	while(p20<sumTotal){
		iter++;
		p20=iter*20;
	}
	$('#prox20').html(p20.toFixed(2));
	$('#prox20').attr('data-value',-1*p20.toFixed(2));
	if(p20>0&&p20!=p10)
		$('#prox20').parent().css('display','inline');
	else
		$('#prox20').parent().css('display','none');



	$('#subtotalSinIva').val(parseFloat(subtotalSinIva) + parseFloat(subtotalSinIvaCompra));
	$('#subtotalIva').val(parseFloat(subtotalIva) + parseFloat(subtotalIvaCompra));
	$('.cantidadnew').html('0');
	$('#tableresultsnew').html('');
	$('#inputbuscnew').val('');
	$('#contentdetalle').animate({
		scrollTop: $('#contentdetalle')[0].scrollHeight
		}, 1000).clearQueue();
	$('#tablaCompra tr:last-child').effect('highlight',{},'normal');
	celdaenfocada=-1;
	PlaySound(0);
	/*$('.lineadetalle').css('font-size',$('.lineadetalle').css('font-size'));
	if(vertical==true)
		$('.product_del').css('width',(pantAlto*2.7/100)+'px');
	else
		$('.product_del').css('width',(pantAlto*3/100)+'px');*/
	$('.product_del').on('click',function(){
			PlaySound(4);
	});

	if(localStorage.getItem("con_mesas")=="true"){
		if(localStorage.getItem("idioma")==1)
			$('#btn_gpedidos').html('guardar');
		else
			$('#btn_gpedidos').html('save');
		$('#btn_gpedidos').show();
		$('#btn_pagar').hide();
	}

	//init2();
}

function agregarCompra2(item,origen){
	var i = 1;
	$('#descuentoFactura').val(0);
  $('#descuentoFacturatrue').val(0);
	$('#resultBuscador').fadeOut('slow');
	//variables facturacion
	var subtotalSinIva = $('#subtotalSinIva').val();
	var subtotalIva = $('#subtotalIva').val();

	//variables compra
	var total = 0;
	var sumTotal = 0;
	var taxTotal = 0;
	var productoCantidad = 1;
	var productoID = $(item).attr('id');
	if(origen==2){
		var idpartes= $(item).attr('id').split('_');
		productoID = idpartes[1];
	}
	var productoNombre = $(item).data('formulado');
	var id_local = $(item).data('id_local');
	var productoImpuestos = $(item).data('impuestos');
	var productoImpuestosIndexes = $(item).data('impuestosindexes');
	var productoPrecio = $(item).data('precio');
	var subtotalSinIvaCompra = 0;
	var subtotalIvaCompra = 0;

	//verificar cantidades
	if(parseInt($.trim($('.cantidad').html())) != 0){
		productoCantidad = $.trim($('.cantidad').html());
	}

	// else{
		// productoCantidad = $('#modificaCantidadActual').val();
	// }
	//impuestos start
	if($.trim(productoImpuestosIndexes) != '' && $.trim(productoImpuestosIndexes) != 0){
		if($.trim(productoImpuestosIndexes).indexOf('@') !== -1){
			$.each(productoImpuestosIndexes.split('@'), function(index,value){

				if(productoImpuestosIndexes.indexOf('1') !== -1){
					subtotalIvaCompra = (parseFloat(productoCantidad) * parseFloat(productoPrecio));
					}
				else{
					subtotalSinIvaCompra = (parseFloat(productoCantidad) * parseFloat(productoPrecio));
					}

				if($('#impuestoFactura-'+ value).length == 0){
					var impuestoDetalles = $('#impuesto-'+ value).val().split('|');
					taxTotal += ((parseFloat(productoCantidad) * parseFloat(productoPrecio)) * parseFloat(impuestoDetalles[2]));
					$('#factura').append('<input type="hidden" id="impuestoFactura-'+ value +'" class="esImpuesto" data-id="'+ impuestoDetalles[0] +'" data-nombre="'+ impuestoDetalles[1] +'" data-valor="'+ impuestoDetalles[2] +'" value="'+ taxTotal +'"/>');
					}
				else{
					var impuestoDetalles = $('#impuesto-'+ value).val().split('|');
					var currentTax = $('#impuestoFactura-'+ value).val();
					taxTotal += ((parseFloat(productoCantidad) * parseFloat(productoPrecio)) * parseFloat(impuestoDetalles[2]));
					$('#impuestoFactura-'+ value).val(parseFloat(currentTax) + parseFloat(taxTotal));
					}
				});
			}
		else{
			productoImpuestosIndexes == 1 ? subtotalIvaCompra = (parseFloat(productoCantidad) * parseFloat(productoPrecio)) : subtotalSinIvaCompra = (parseFloat(productoCantidad) * parseFloat(productoPrecio));

			if($('#impuestoFactura-'+productoImpuestosIndexes).length == 0){
				var impuestoDetalles = $('#impuesto-'+ productoImpuestosIndexes).val().split('|');
				taxTotal = ((parseFloat(productoCantidad) * parseFloat(productoPrecio)) * parseFloat(impuestoDetalles[2]));
				$('#factura').append('<input type="hidden" id="impuestoFactura-'+ productoImpuestosIndexes +'" class="esImpuesto" data-id="'+ impuestoDetalles[0] +'" data-nombre="'+ impuestoDetalles[1] +'" data-valor="'+ impuestoDetalles[2] +'" value="'+ taxTotal +'"/>');
				}
			else{
				var impuestoDetalles = $('#impuesto-'+ productoImpuestosIndexes).val().split('|');
				var currentTax = $('#impuestoFactura-'+ productoImpuestosIndexes).val();
				taxTotal = ((parseFloat(productoCantidad) * parseFloat(productoPrecio)) * parseFloat(impuestoDetalles[2]));
				$('#impuestoFactura-'+ productoImpuestosIndexes).val(parseFloat(currentTax) + parseFloat(taxTotal));
				}
			}
		}
	//impuestos end
	$('.totales').each(function(){
		i++;
	});

	var total = ((parseFloat(productoCantidad) * parseFloat(productoPrecio)) + parseFloat(taxTotal)).toFixed(2);//YAESTA
	$('#tablaCompra').append('<tr id="cant_'+i+'"><td class="lineadetalle" data-borrarcantidad="'+ productoCantidad +'" data-borrarimpuesto="'+ productoImpuestos +'" data-borrarimpuestoindexes="'+ productoImpuestosIndexes +'" data-borrarprecio="'+ productoPrecio +'" onclick="borrarCompra(this); return false;" style="width: 5%;"><button type="button" class="btn btn-danger btn-xs product_del"><span class="glyphicon glyphicon-remove" ></span></button><input type="hidden" class="totales" value="'+ total +'"/></td><td style="border-right:1px solid #909192; text-align: center; width:20%;" class="lineadetalle" "><input type="hidden" class="productDetails" value="'+ productoID +'|'+ productoNombre +'|'+ productoCantidad +'|'+ productoPrecio +'|'+ productoPrecio +'|'+ productoImpuestos +'|'+ ((parseFloat(productoCantidad) * parseFloat(productoPrecio)) + parseFloat(taxTotal)) +'" /><input type="hidden" class="cantidadproductoscomandados" value="'+productoCantidad+'"/>'+ productoCantidad +'</td><td style="border-right:1px solid #909192; padding-left:20px;text-align: left; width:50%; text-transform:capitalize;" class="lineadetalle">'+ productoNombre+'</td><td style="padding-right:20px; text-align: right;" class="lineadetalle">'+ parseFloat(total).toFixed(2) +'</td></tr>');
	$('.totales').each(function(){
		sumTotal += parseFloat($.trim($(this).val()));
		i++;
	});
	//console.log (i+'cantidad');

	var sumcantidadComandada = 0;
	$('.cantidadproductoscomandados').each(function(){
		sumcantidadComandada += parseFloat($.trim($(this).val()));
	});

	console.log('los items facturados son'+sumcantidadComandada);
	$('#itemsVendidos').html(sumcantidadComandada);
	
	if(sumcantidadComandada==0)
		$('#sinservicio').prop('disabled',false);
	else
		$('#sinservicio').prop('disabled',true);
	
	
	/*$('#itemsVendidos').css('display','block');
	$('#itemsVendidos').css('background-color','red');*/
	//alert('los items facturados son'+sumcantidadComandada);


	//alert(subtotalSinIva+'/'+subtotalSinIvaCompra);
	$('#totalmiFactura').val(sumTotal);
	$('#total').html('$'+ parseFloat(sumTotal).toFixed(2));

	if($('#total').html().toString().length==9)
		$('#divtotal').css('font-size','26px');
	else if($('#total').html().toString().length>9)
		$('#divtotal').css('font-size','26px');
	else
		$('#divtotal').css('font-size','30px');

	if($('#total').html().toString().length>7){
		$('.den').css('width',4.5*parseFloat($('.producto').css('height')));
	}else{
		$('.den').css('width',3*parseFloat($('.producto').css('height')));
	}

	$('#justo').html(sumTotal.toFixed(2));
	$('#justo').attr('data-value',-1*sumTotal.toFixed(2));
	$('#redondeado').html(Math.ceil(sumTotal).toFixed(2));
	$('#redondeado').attr('data-value',-1*Math.ceil(sumTotal).toFixed(2));
	var alta=0;
	for( var t in misdenominaciones){
		if(misdenominaciones[t]>sumTotal)
		{
			alta=misdenominaciones[t];
			break;
		}
	}
	$('#altaden').html(alta.toFixed(2));
	$('#altaden').attr('data-value',-1*alta.toFixed(2));
	if(alta!=sumTotal&&alta!=Math.ceil(sumTotal)&&alta!=0)
		$('#altaden').parent().css('display','inline');
	else
		$('#altaden').parent().css('display','none');

	var prox10=0;
	var iter=1;
	var p10=iter*10;
	while(p10<sumTotal){
		iter++;
		p10=iter*10;
	}
	$('#prox10').html(p10.toFixed(2));
	$('#prox10').attr('data-value',-1*p10.toFixed(2));
	//console.log(p10+'/'+alta);
	if(p10>0&&p10!=alta)
		$('#prox10').parent().css('display','inline');
	else
		$('#prox10').parent().css('display','none');

	var prox20=0;
	var iter=1;
	var p20=iter*20;
	while(p20<sumTotal){
		iter++;
		p20=iter*20;
	}
	$('#prox20').html(p20.toFixed(2));
	$('#prox20').attr('data-value',-1*p20.toFixed(2));
	if(p20>0&&p20!=p10)
		$('#prox20').parent().css('display','inline');
	else
		$('#prox20').parent().css('display','none');



	$('#subtotalSinIva').val(parseFloat(subtotalSinIva) + parseFloat(subtotalSinIvaCompra));
	$('#subtotalIva').val(parseFloat(subtotalIva) + parseFloat(subtotalIvaCompra));
	$('.cantidad').html('0');
	$('#tableresults').html('');
	$('#inputbusc').val('');
	$('#contentdetalle').animate({
		scrollTop: $('#contentdetalle')[0].scrollHeight
		}, 1000).clearQueue();
	$('#tablaCompra tr:last-child').effect('highlight',{},'normal')
	celdaenfocada=-1;
	/*$('.lineadetalle').css('font-size',$('.lineadetalle').css('font-size'));
	if(vertical==true)
		$('.product_del').css('width',(pantAlto*2.7/100)+'px');
	else
		$('.product_del').css('width',(pantAlto*3/100)+'px');*/
	$('.product_del').on('click',function(){
			PlaySound(4);
	});

	//init2();
}
function modificarCantidad(i,id_local){
	//alert(i);
	$('#popupCantidad').modal("show");
	$('#modificaCantidadActual').html('1');
	$('#recibeIdentificadorTr').val(i);
	$('#productoIDAcambiar').val(id_local);
}

function cambiarCantidad(){
	var i = 0;
	var identificadorTr = $('#recibeIdentificadorTr').val();
	var cantidadActual = $('#modificaCantidadActual').html();
	var productoIDAcambiar = $('#productoIDAcambiar').val();
    var idmenucategory = $('#category').val();
    //alert(idmenucategory);
	
	var idimpservicio=0;
	if(localStorage.getItem('impuestos_personalizados')=='true'){
		if($('#sinservicio').is(':checked')){
			if($('#idservicio').html()!='')
				idimpservicio=$('#idservicio').html();
		}
	}
	
	console.log("idserv"+idimpservicio);
	

    if(productoIDAcambiar == -14){
      var tddetalles0 = $('#cant_'+identificadorTr+' td')[0];
      var tddetalles=$('#cant_'+identificadorTr+' td')[1];
      var tdtotal=$('#cant_'+identificadorTr+' td')[3];
	  var inpdetalleagregados=$(tddetalles).find('.productDetails');
      var detalleaux = $(inpdetalleagregados).val().split("|");
      var productoImpuestos = $(tddetalles0).data('borrarimpuesto');
      var productoImpuestosIndexes = $(tddetalles0).data('borrarimpuestoindexes');
      var cambiototal = $(tddetalles0).find('.totales');
      var sumaagregados = 0;
      var taxTotalaux = 0;
      var taxTotal = 0;
      if($.trim(productoImpuestos).indexOf('@') !== -1){
        var impuestoaux = productoImpuestos.split("@");
        if(impuestoaux != ''){
          for(var i = 0;i < impuestoaux.length;i++){
             taxTotalaux += parseFloat(impuestoaux[i]);
          }
        }
      }else{
        if(productoImpuestos != ''){
            taxTotalaux += parseFloat(productoImpuestos);
        }
      }
	  
      taxTotal = parseFloat(taxTotalaux.toFixed(2)) + 1;
      var nuevodetalle = detalleaux[0] +'|'+ detalleaux[1] +'|'+ cantidadActual +'|'+ detalleaux[3] +'|'+ detalleaux[4] +'|'+ productoImpuestos +'|'+ (cantidadActual * (detalleaux[3]*taxTotal)) +'|'+productoImpuestosIndexes+'|'+sumaagregados;
      var nuevotd = '<input type="hidden" class="productDetails" value="'+nuevodetalle+'" data-detagregados="" data-id_real="-14"><input type="hidden" class="cantidadproductoscomandados" value="'+cantidadActual+'">'+cantidadActual;
      $(tddetalles).html(nuevotd);
      $(cambiototal).val((cantidadActual * (detalleaux[3]*taxTotal)).toFixed(4));
      //alert(taxTotalaux+'**'+detalleaux[3]+'**'+taxTotal);
      $(tdtotal).html((cantidadActual * (detalleaux[3]*taxTotal)).toFixed(4));
      var sumTotal = 0;
      $('.totales').each(function(){
      	sumTotal += parseFloat($.trim($(this).val()));
      });
      console.log('tu factura es de : ' + sumTotal);
      var sumcantidadComandada = 0;
      $('.cantidadproductoscomandados').each(function(){
      	sumcantidadComandada += parseFloat($.trim($(this).val()));
      });
      console.log('los items facturados son'+sumcantidadComandada);
      $('#itemsVendidos').html(sumcantidadComandada);
	  
		if(sumcantidadComandada==0)
			$('#sinservicio').prop('disabled',false);
		else
			$('#sinservicio').prop('disabled',true);
	  
	  
      $('#menuSubNew2').html("Total - Ver "+sumcantidadComandada+" pedidos");

      /*$('#itemsVendidos').css('display','block');
      $('#itemsVendidos').css('background-color','red');*/

      $('#justo').html('$ '+sumTotal.toFixed(2));
      $('#payButton').html('PAGAR');
      $('#invoiceTotal').html(sumTotal.toFixed(2));
      $('#changeFromPurchase').html(Math.abs(sumTotal).toFixed(2));
      $('#totalmiFactura').val(sumTotal);
      $('#total').html('$'+ parseFloat(sumTotal).toFixed(2));
      $('#total').html('$'+sumTotal.toFixed(2));

      if($('#total').html().toString().length==9)
      	$('#divtotal').css('font-size','26px');
      else if($('#total').html().toString().length>9)
      	$('#divtotal').css('font-size','26px');
      else
      	$('#divtotal').css('font-size','30px');

      if($('#total').html().toString().length>7){
      	$('.den').css('width',4.5*parseFloat($('.producto').css('height')));
      }else{
      	$('.den').css('width',3*parseFloat($('.producto').css('height')));
      }

      if(localStorage.getItem("idioma")==1)
      	//$('#btn_gpedidos').html('GUARDAR $'+ parseFloat(sumTotal).toFixed(2));
      	$('#btn_gpedidos').html('GUARDAR');
      else if(localStorage.getItem("idioma")==2)
      	//$('#btn_gpedidos').html('SAVE $'+ parseFloat(sumTotal).toFixed(2));
      	$('#btn_gpedidos').html('SAVE');

      $('#justo').html('$ '+sumTotal.toFixed(2));
      $('#justo').attr('data-value',-1*sumTotal.toFixed(2));
      $('#redondeado').html('$ '+Math.ceil(sumTotal).toFixed(2));
      $('#redondeado').attr('data-value',-1*Math.ceil(sumTotal).toFixed(2));
      var alta=0;
      for( var t in misdenominaciones){
      	if(misdenominaciones[t]>sumTotal)
      	{
      		alta=misdenominaciones[t];
      		break;
      	}
      }
      $('#altaden').html('$ '+alta.toFixed(2));
      $('#altaden').attr('data-value',-1*alta.toFixed(2));
      if(alta!=sumTotal&&alta!=Math.ceil(sumTotal)&&alta!=0)
      	$('#altaden').parent().css('display','inline');
      else
      	$('#altaden').parent().css('display','none');

      var prox10=0;
      var iter=1;
      var p10=iter*10;
      while(p10<sumTotal){
      	iter++;
      	p10=iter*10;
      }
      $('#prox10').html('$ '+p10.toFixed(2));
      $('#prox10').attr('data-value',-1*p10.toFixed(2));
      //console.log(p10+'/'+alta);
      if(p10>0&&p10!=alta)
      	$('#prox10').parent().css('display','inline');
      else
      	$('#prox10').parent().css('display','none');

      var prox20=0;
      var iter=1;
      var p20=iter*20;
      while(p20<sumTotal){
      	iter++;
      	p20=iter*20;
      }
      $('#prox20').html('$ '+p20.toFixed(2));
      $('#prox20').attr('data-value',-1*p20.toFixed(2));
      if(p20>0&&p20!=p10)
      	$('#prox20').parent().css('display','inline');
      else
      	$('#prox20').parent().css('display','none');

      var subsinivanew=0;
      var subconivanew=0;
      var ivanew=0;
      var servnew=0;
      var impgenerales=new Array();
      $('.productDetails').each(function(){
      	var datosimp=$(this).val().split('|');
      	var newsumaagregados=parseFloat(datosimp[8]);
      	var vectorimp=datosimp[7].split('@');

      	//alert(datosimp[7]);
      	for(var x=0;x<vectorimp.length;x++){
      		var taxnow=vectorimp[x];
			console.log(taxnow+"/"+idimpservicio);
      		if(taxnow!=''&&taxnow!='undefined'&&taxnow!=null){
				console.log(taxnow+"/"+idimpservicio);
				if(taxnow!=idimpservicio){
					if('"'+taxnow+'"' in impgenerales){
					var antes=impgenerales['"'+taxnow+'"'];
					var datosp=$('#impuesto-'+taxnow).val().split('|');
					var porcent=parseFloat(datosp[2]);
					impgenerales['"'+taxnow+'"']=antes+((parseFloat(datosimp[3])+newsumaagregados)*parseFloat(datosimp[2])*porcent);
					}else{
						//alert(taxnow);
						var datosp=$('#impuesto-'+taxnow).val().split('|');
						var porcent=parseFloat(datosp[2]);
						impgenerales['"'+taxnow+'"']=((parseFloat(datosimp[3])+newsumaagregados)*parseFloat(datosimp[2])*porcent);
					}
				}
      		}
      	}


      	if(datosimp[7].indexOf($('#idiva').html())>=0&&$('#idiva').html()!=''){
      		subconivanew+=(parseFloat(datosimp[3])+newsumaagregados)*parseFloat(datosimp[2]);
      		var datosp=$('#impuesto-'+$('#idiva').html()).val().split('|');
      		var porcentiva=parseFloat(datosp[2]);
      		ivanew+=(parseFloat(datosimp[3])+newsumaagregados)*parseFloat(datosimp[2])*porcentiva;
      	}
      	else{
      		subsinivanew+=(parseFloat(datosimp[3])+newsumaagregados)*parseFloat(datosimp[2]);
      	}

      	//para servicio
      	//if(datosimp[7].indexOf('2')>=0){
      		servnew+=(parseFloat(datosimp[3])+newsumaagregados)*0.10*parseFloat(datosimp[2]);
      	//}
      });

      console.log(impgenerales);
      for(var j in impgenerales){
      	$('#impuestoFactura-'+(j.replace(/"/g,''))).val(impgenerales[j]);
      }


      $('#subtotalSinIva').val(subsinivanew);
      $('#subtotalIva').val(subconivanew);


      $('.cantidad').html('0');
      $('#tableresults').html('');
      $('#inputbusc').val('');
      $('#contentdetalle').animate({
      	scrollTop: $('#contentdetalle')[0].scrollHeight
      	}, 1000).clearQueue();
      $('#tablaCompra tr:last-child').effect('highlight',{},'normal')
      celdaenfocada=-1;

    }else{
	//var sumaagregados=0;
	var tdagregados=$('#cant_'+identificadorTr+' td')[0];
	//alert(tdagregados);
	var sumaagregados=0;
	//alert($(tdagregados).attr("data-agregados"));
	if($(tdagregados).attr("data-agregados")!=null&&$(tdagregados).attr("data-agregados")!=""&&$(tdagregados).attr("data-agregados")!="undefined")
		sumaagregados=parseFloat($(tdagregados).attr("data-agregados"));
	var tddetalles=$('#cant_'+identificadorTr+' td')[1];
	var inpdetalleagregados=$(tddetalles).find('.productDetails');
	var detalleagregados=inpdetalleagregados.attr("data-detagregados");
	var detallenotas=inpdetalleagregados.attr("data-notes");
	if(detallenotas==null||detallenotas=='undefined'||detallenotas=='')
		detallenotas='';

	var tdhtml=$('#cant_'+identificadorTr+' td')[2];
	var htmlprod=$(tdhtml).html();
    //alert(htmlprod)

	$('#cant_'+identificadorTr).remove();

	var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
	db.transaction(function(tx){
		tx.executeSql('SELECT COUNT(id_local) as cuantos FROM PRODUCTOS WHERE id_local='+productoIDAcambiar+';',[],function(tx,res){
			var existen=res.rows.item(0).cuantos;
			if(existen==0){
				alert('no existe ese producto');
				$('.cantidad').html('0.00');
			}else{
				$('.cantidad').html('0.00');

                if(localStorage.getItem("diseno")==1){
                  //var queryaux = 'SELECT p.*,m.timespan as timemenu FROM PRODUCTOS p,MENU m WHERE p.timespan=m.idproducto and m.activo="true" and p.id_local='+productoIDAcambiar+';';
                  var queryaux = 'SELECT p.*,m.timespan as timemenu FROM PRODUCTOS p,MENU m WHERE p.timespan=m.idproducto and m.activo="true" and m.idcatmenu='+idmenucategory+' and p.id_local='+productoIDAcambiar+' limit 1;';
                }else{
                  var queryaux = 'SELECT * FROM PRODUCTOS WHERE id_local='+productoIDAcambiar+';';
                }

                //alert(queryaux);

                tx.executeSql(queryaux,[],function(tx,result){
					//alert(result);
					for (var i=0; i <= result.rows.length-1; i++){
						var row = result.rows.item(i);
						var productoNombre = row.formulado;
						var productoCantidad = cantidadActual;
						var cargaiva = row.cargaiva;
						var servicio = row.servicio;
						var productoImpuestosIndexes ='';
						var productoImpuestos='';
						var productomas=1;
						if(row.tieneimpuestos=="true"){
							productoImpuestos=$('#impuestosactivos').html();
							productoImpuestosIndexes=$('#impuestosactivosid').html();
							var porcentajes=productoImpuestos.split('@');
							var ides=productoImpuestosIndexes.split('@');
							var conti=0;
							for(var l in porcentajes){
								//aqui cambio porcentajes para no tomar en cuenta el servicio
								if(idimpservicio!=ides[conti]){
									if(porcentajes[l]!=null&&porcentajes[l]!=""&&porcentajes[l]!='undefined')
									productomas+=parseFloat(porcentajes[l]);
								}
								conti++;
							}
						}

                        if(localStorage.getItem("diseno")==1){
                          //var productoID = row.timemenu;
                          var productoID = row.timespan;
                        }else{
						  var productoID = row.timespan;
                        }

       if(localStorage.getItem("con_localhost") == 'true'){

       var apiURL='http://'+localStorage.getItem("ip_servidor")+'/connectnubepos/api2.php';
       $.post(apiURL,{
  		id_emp : localStorage.getItem("empresa"),
  		action : 'PrecioDelFormulado',
  		id_barra : localStorage.getItem("idbarra"),
  		deviceid:$("#deviceid").html(),
        timespanmenu : productoID
  		}).done(function(response){
  			if(response!='block' && response!='Desactivado'){
  				//console.log(response);
                  //var res = response.split("||");
                  var y = JSON.parse(response);
            		var mods= new Array();
            		if(y.length>0){
                        for(var m=0;m<y.length;m++){
            				var miobj=y[m];
            				var preciodelformulado=miobj.precio_del_formulado;
            			}
            		}else{
                           var preciodelformulado=0;
            		}

                    //alert(preciodelformulado+'**'+productoID);

                    if(preciodelformulado == 2){
                	  var productoPrecio = 0;
                    }else{
                      var productoPrecio = row.precio;
                    }

                        //alert(row.precio+'**'+sumaagregados+'**'+productoCantidad+'**'+productomas)
						var total = (((parseFloat(productoPrecio)+sumaagregados) * parseFloat(productoCantidad))*parseFloat(productomas));
						console.log(productoPrecio);

						//alert(identificadorTr);

						var sumTotal = 0;
						//YAESTA
						$('#tablaCompra').append('<tr id="cant_'+identificadorTr+'"><td class="lineadetalle" data-borrarcantidad="'+ productoCantidad +'" data-borrarimpuesto="'+ productoImpuestos +'" data-borrarimpuestoindexes="'+ productoImpuestosIndexes +'" data-agregados="'+sumaagregados+'" data-borrarprecio="'+ productoPrecio +'" onclick="borrarCompra(this); return false;" style="width: 5%;"><button type="button" class="btn btn-danger btn-xs product_del"><span class="glyphicon glyphicon-remove" ></span></button><input type="hidden" class="totales" value="'+ total +'"/></td><td onclick="modificarCantidad('+identificadorTr+' , '+productoIDAcambiar+')" style="border-right:1px solid #909192; text-align: center; width:20%;" class="lineadetalle" "><input type="hidden" class="productDetails" value="'+ productoID +'|'+ productoNombre +'|'+ productoCantidad +'|'+ productoPrecio +'|'+ productoPrecio +'|'+ productoImpuestos +'|'+ total +'|'+productoImpuestosIndexes+'|'+sumaagregados+'" data-detagregados="'+detalleagregados+'" data-notes="'+detallenotas+'" data-id_real="'+productoIDAcambiar+'" /><input type="hidden" class="cantidadproductoscomandados" value="'+productoCantidad+'"/>'+ productoCantidad +'</td><td style="border-right:1px solid #909192; padding:5px;text-align: left; width:50%; text-transform:capitalize;" class="lineadetalle">'+htmlprod+'</td><td style="padding-right:20px; text-align: right;" class="lineadetalle">'+ parseFloat(total).toFixed(4) +'</td></tr>');

						$('#cant_'+identificadorTr+' .lineanota').attr('data-id',identificadorTr);

						$('.totales').each(function(){
							sumTotal += parseFloat($.trim($(this).val()));
						});
						console.log('tu factura es de : ' + sumTotal);
						var sumcantidadComandada = 0;
						$('.cantidadproductoscomandados').each(function(){
							sumcantidadComandada += parseFloat($.trim($(this).val()));
						});
						console.log('los items facturados son'+sumcantidadComandada);
						$('#itemsVendidos').html(sumcantidadComandada);
						
						if(sumcantidadComandada==0)
							$('#sinservicio').prop('disabled',false);
						else
							$('#sinservicio').prop('disabled',true);
						
						$('#menuSubNew2').html("Total - Ver "+sumcantidadComandada+" pedidos");

						/*$('#itemsVendidos').css('display','block');
						$('#itemsVendidos').css('background-color','red');*/

						$('#justo').html('$ '+sumTotal.toFixed(2));
						$('#payButton').html('PAGAR');
						$('#invoiceTotal').html(sumTotal.toFixed(2));
						$('#changeFromPurchase').html(Math.abs(sumTotal).toFixed(2));
						$('#totalmiFactura').val(sumTotal);
						$('#total').html('$'+ parseFloat(sumTotal).toFixed(2));
						$('#total').html('$'+sumTotal.toFixed(2));

						if($('#total').html().toString().length==9)
							$('#divtotal').css('font-size','26px');
						else if($('#total').html().toString().length>9)
							$('#divtotal').css('font-size','26px');
						else
							$('#divtotal').css('font-size','30px');

						if($('#total').html().toString().length>7){
							$('.den').css('width',4.5*parseFloat($('.producto').css('height')));
						}else{
							$('.den').css('width',3*parseFloat($('.producto').css('height')));
						}

						if(localStorage.getItem("idioma")==1)
							//$('#btn_gpedidos').html('GUARDAR $'+ parseFloat(sumTotal).toFixed(2));
							$('#btn_gpedidos').html('GUARDAR');
						else if(localStorage.getItem("idioma")==2)
							//$('#btn_gpedidos').html('SAVE $'+ parseFloat(sumTotal).toFixed(2));
							$('#btn_gpedidos').html('SAVE');

						$('#justo').html('$ '+sumTotal.toFixed(2));
						$('#justo').attr('data-value',-1*sumTotal.toFixed(2));
						$('#redondeado').html('$ '+Math.ceil(sumTotal).toFixed(2));
						$('#redondeado').attr('data-value',-1*Math.ceil(sumTotal).toFixed(2));
						var alta=0;
						for( var t in misdenominaciones){
							if(misdenominaciones[t]>sumTotal)
							{
								alta=misdenominaciones[t];
								break;
							}
						}
						$('#altaden').html('$ '+alta.toFixed(2));
						$('#altaden').attr('data-value',-1*alta.toFixed(2));
						if(alta!=sumTotal&&alta!=Math.ceil(sumTotal)&&alta!=0)
							$('#altaden').parent().css('display','inline');
						else
							$('#altaden').parent().css('display','none');

						var prox10=0;
						var iter=1;
						var p10=iter*10;
						while(p10<sumTotal){
							iter++;
							p10=iter*10;
						}
						$('#prox10').html('$ '+p10.toFixed(2));
						$('#prox10').attr('data-value',-1*p10.toFixed(2));
						//console.log(p10+'/'+alta);
						if(p10>0&&p10!=alta)
							$('#prox10').parent().css('display','inline');
						else
							$('#prox10').parent().css('display','none');

						var prox20=0;
						var iter=1;
						var p20=iter*20;
						while(p20<sumTotal){
							iter++;
							p20=iter*20;
						}
						$('#prox20').html('$ '+p20.toFixed(2));
						$('#prox20').attr('data-value',-1*p20.toFixed(2));
						if(p20>0&&p20!=p10)
							$('#prox20').parent().css('display','inline');
						else
							$('#prox20').parent().css('display','none');

						var subsinivanew=0;
						var subconivanew=0;
						var ivanew=0;
						var servnew=0;
						var impgenerales=new Array();
						$('.productDetails').each(function(){
							var datosimp=$(this).val().split('|');
							var newsumaagregados=parseFloat(datosimp[8]);
							var vectorimp=datosimp[7].split('@');

							//alert(datosimp[7]);
							for(var x=0;x<vectorimp.length;x++){
								var taxnow=vectorimp[x];
								if(taxnow!=''&&taxnow!='undefined'&&taxnow!=null){
									if('"'+taxnow+'"' in impgenerales){
									var antes=impgenerales['"'+taxnow+'"'];
									var datosp=$('#impuesto-'+taxnow).val().split('|');
									var porcent=parseFloat(datosp[2]);
									impgenerales['"'+taxnow+'"']=antes+((parseFloat(datosimp[3])+newsumaagregados)*parseFloat(datosimp[2])*porcent);
									}else{
										//alert(taxnow);
										var datosp=$('#impuesto-'+taxnow).val().split('|');
										var porcent=parseFloat(datosp[2]);
										impgenerales['"'+taxnow+'"']=((parseFloat(datosimp[3])+newsumaagregados)*parseFloat(datosimp[2])*porcent);
									}
								}
							}


							if(datosimp[7].indexOf($('#idiva').html())>=0&&$('#idiva').html()!=''){
								subconivanew+=(parseFloat(datosimp[3])+newsumaagregados)*parseFloat(datosimp[2]);
								var datosp=$('#impuesto-'+$('#idiva').html()).val().split('|');
								var porcentiva=parseFloat(datosp[2]);
								ivanew+=(parseFloat(datosimp[3])+newsumaagregados)*parseFloat(datosimp[2])*porcentiva;
							}
							else{
								subsinivanew+=(parseFloat(datosimp[3])+newsumaagregados)*parseFloat(datosimp[2]);
							}

							//para servicio
							//if(datosimp[7].indexOf('2')>=0){
								servnew+=(parseFloat(datosimp[3])+newsumaagregados)*0.10*parseFloat(datosimp[2]);
							//}
						});

						console.log(impgenerales);
						for(var j in impgenerales){
							$('#impuestoFactura-'+(j.replace(/"/g,''))).val(impgenerales[j]);
						}


						$('#subtotalSinIva').val(subsinivanew);
						$('#subtotalIva').val(subconivanew);


						$('.cantidad').html('0');
						$('#tableresults').html('');
						$('#inputbusc').val('');
						$('#contentdetalle').animate({
							scrollTop: $('#contentdetalle')[0].scrollHeight
							}, 1000).clearQueue();
						$('#tablaCompra tr:last-child').effect('highlight',{},'normal')
						celdaenfocada=-1;

            }else if(response=='Desactivado'){
  			    envia('config');
  				setTimeout(function(){
  					$('.navbar,#barraalternamovil').slideUp();
  					$("#demoGratis,#fadeRow,#finalizado,#contentStepSincro,#cuentaactiva").css("display","none");
  					$('#desactivo').fadeIn();
  				},100);
  			}else{
  				envia('config');
  				setTimeout(function(){
  					$('#linklogin,#linkloginb').attr("href","https://www.practisis.net/index3.php?rvpas="+localStorage.getItem("userPasswod")+"&rvus="+localStorage.getItem("userRegister"));
  					$('.navbar,#barraalternamovil').slideUp();
  					$("#demoGratis,#fadeRow,#finalizado,#contentStepSincro,#cuentaactiva").css("display","none");
  					$('#bloqueo').fadeIn();
  				},100);

  			}

  		}).fail(function(){
  			updateOnlineStatus("OFFLINE");
  			setTimeout(function(){SincronizadorNormal()},180000);
  		});

        }else{
                        var productoPrecio = row.precio;
                        //alert(row.precio+'**'+sumaagregados+'**'+productoCantidad+'**'+productomas)
						var total = (((parseFloat(productoPrecio)+sumaagregados) * parseFloat(productoCantidad))*parseFloat(productomas));
						console.log(productoPrecio);

						var sumTotal = 0;
						//YAESTA
						$('#tablaCompra').append('<tr id="cant_'+identificadorTr+'"><td class="lineadetalle" data-borrarcantidad="'+ productoCantidad +'" data-borrarimpuesto="'+ productoImpuestos +'" data-borrarimpuestoindexes="'+ productoImpuestosIndexes +'" data-agregados="'+sumaagregados+'" data-borrarprecio="'+ productoPrecio +'" onclick="borrarCompra(this); return false;" style="width: 5%;"><button type="button" class="btn btn-danger btn-xs product_del"><span class="glyphicon glyphicon-remove" ></span></button><input type="hidden" class="totales" value="'+ total +'"/></td><td onclick="modificarCantidad('+identificadorTr+' , '+productoIDAcambiar+')" style="border-right:1px solid #909192; text-align: center; width:20%;" class="lineadetalle" "><input type="hidden" class="productDetails" value="'+ productoID +'|'+ productoNombre +'|'+ productoCantidad +'|'+ productoPrecio +'|'+ productoPrecio +'|'+ productoImpuestos +'|'+ total +'|'+productoImpuestosIndexes+'|'+sumaagregados+'" data-detagregados="'+detalleagregados+'" data-notes="'+detallenotas+'" data-id_real="'+productoIDAcambiar+'" /><input type="hidden" class="cantidadproductoscomandados" value="'+productoCantidad+'"/>'+ productoCantidad +'</td><td style="border-right:1px solid #909192; padding:5px;text-align: left; width:50%; text-transform:capitalize;" class="lineadetalle">'+htmlprod+'</td><td style="padding-right:20px; text-align: right;" class="lineadetalle">'+ parseFloat(total).toFixed(4) +'</td></tr>');

						$('#cant_'+identificadorTr+' .lineanota').attr('data-id',identificadorTr);

						$('.totales').each(function(){
							sumTotal += parseFloat($.trim($(this).val()));
						});
						console.log('tu factura es de : ' + sumTotal);
						var sumcantidadComandada = 0;
						$('.cantidadproductoscomandados').each(function(){
							sumcantidadComandada += parseFloat($.trim($(this).val()));
						});
						console.log('los items facturados son'+sumcantidadComandada);
						$('#itemsVendidos').html(sumcantidadComandada);
						
						if(sumcantidadComandada==0)
							$('#sinservicio').prop('disabled',false);
						else
							$('#sinservicio').prop('disabled',true);
						
						$('#menuSubNew2').html("Total - Ver "+sumcantidadComandada+" pedidos");

						/*$('#itemsVendidos').css('display','block');
						$('#itemsVendidos').css('background-color','red');*/

						$('#justo').html('$ '+sumTotal.toFixed(2));
						$('#payButton').html('PAGAR');
						$('#invoiceTotal').html(sumTotal.toFixed(2));
						$('#changeFromPurchase').html(Math.abs(sumTotal).toFixed(2));
						$('#totalmiFactura').val(sumTotal);
						$('#total').html('$'+ parseFloat(sumTotal).toFixed(2));
						$('#total').html('$'+sumTotal.toFixed(2));

						if($('#total').html().toString().length==9)
							$('#divtotal').css('font-size','26px');
						else if($('#total').html().toString().length>9)
							$('#divtotal').css('font-size','26px');
						else
							$('#divtotal').css('font-size','30px');

						if($('#total').html().toString().length>7){
							$('.den').css('width',4.5*parseFloat($('.producto').css('height')));
						}else{
							$('.den').css('width',3*parseFloat($('.producto').css('height')));
						}

						if(localStorage.getItem("idioma")==1)
							//$('#btn_gpedidos').html('GUARDAR $'+ parseFloat(sumTotal).toFixed(2));
							$('#btn_gpedidos').html('GUARDAR');
						else if(localStorage.getItem("idioma")==2)
							//$('#btn_gpedidos').html('SAVE $'+ parseFloat(sumTotal).toFixed(2));
							$('#btn_gpedidos').html('SAVE');

						$('#justo').html('$ '+sumTotal.toFixed(2));
						$('#justo').attr('data-value',-1*sumTotal.toFixed(2));
						$('#redondeado').html('$ '+Math.ceil(sumTotal).toFixed(2));
						$('#redondeado').attr('data-value',-1*Math.ceil(sumTotal).toFixed(2));
						var alta=0;
						for( var t in misdenominaciones){
							if(misdenominaciones[t]>sumTotal)
							{
								alta=misdenominaciones[t];
								break;
							}
						}
						$('#altaden').html('$ '+alta.toFixed(2));
						$('#altaden').attr('data-value',-1*alta.toFixed(2));
						if(alta!=sumTotal&&alta!=Math.ceil(sumTotal)&&alta!=0)
							$('#altaden').parent().css('display','inline');
						else
							$('#altaden').parent().css('display','none');

						var prox10=0;
						var iter=1;
						var p10=iter*10;
						while(p10<sumTotal){
							iter++;
							p10=iter*10;
						}
						$('#prox10').html('$ '+p10.toFixed(2));
						$('#prox10').attr('data-value',-1*p10.toFixed(2));
						//console.log(p10+'/'+alta);
						if(p10>0&&p10!=alta)
							$('#prox10').parent().css('display','inline');
						else
							$('#prox10').parent().css('display','none');

						var prox20=0;
						var iter=1;
						var p20=iter*20;
						while(p20<sumTotal){
							iter++;
							p20=iter*20;
						}
						$('#prox20').html('$ '+p20.toFixed(2));
						$('#prox20').attr('data-value',-1*p20.toFixed(2));
						if(p20>0&&p20!=p10)
							$('#prox20').parent().css('display','inline');
						else
							$('#prox20').parent().css('display','none');

						var subsinivanew=0;
						var subconivanew=0;
						var ivanew=0;
						var servnew=0;
						var impgenerales=new Array();
						$('.productDetails').each(function(){
							var datosimp=$(this).val().split('|');
							var newsumaagregados=parseFloat(datosimp[8]);
							var vectorimp=datosimp[7].split('@');

							//alert(datosimp[7]);
							for(var x=0;x<vectorimp.length;x++){
								var taxnow=vectorimp[x];
								if(taxnow!=''&&taxnow!='undefined'&&taxnow!=null){
									if('"'+taxnow+'"' in impgenerales){
									var antes=impgenerales['"'+taxnow+'"'];
									var datosp=$('#impuesto-'+taxnow).val().split('|');
									var porcent=parseFloat(datosp[2]);
									impgenerales['"'+taxnow+'"']=antes+((parseFloat(datosimp[3])+newsumaagregados)*parseFloat(datosimp[2])*porcent);
									}else{
										//alert(taxnow);
										var datosp=$('#impuesto-'+taxnow).val().split('|');
										var porcent=parseFloat(datosp[2]);
										impgenerales['"'+taxnow+'"']=((parseFloat(datosimp[3])+newsumaagregados)*parseFloat(datosimp[2])*porcent);
									}
								}
							}


							if(datosimp[7].indexOf($('#idiva').html())>=0&&$('#idiva').html()!=''){
								subconivanew+=(parseFloat(datosimp[3])+newsumaagregados)*parseFloat(datosimp[2]);
								var datosp=$('#impuesto-'+$('#idiva').html()).val().split('|');
								var porcentiva=parseFloat(datosp[2]);
								ivanew+=(parseFloat(datosimp[3])+newsumaagregados)*parseFloat(datosimp[2])*porcentiva;
							}
							else{
								subsinivanew+=(parseFloat(datosimp[3])+newsumaagregados)*parseFloat(datosimp[2]);
							}

							//para servicio
							//if(datosimp[7].indexOf('2')>=0){
								servnew+=(parseFloat(datosimp[3])+newsumaagregados)*0.10*parseFloat(datosimp[2]);
							//}
						});

						console.log(impgenerales);
						for(var j in impgenerales){
							$('#impuestoFactura-'+(j.replace(/"/g,''))).val(impgenerales[j]);
						}


						$('#subtotalSinIva').val(subsinivanew);
						$('#subtotalIva').val(subconivanew);


						$('.cantidad').html('0');
						$('#tableresults').html('');
						$('#inputbusc').val('');
						$('#contentdetalle').animate({
							scrollTop: $('#contentdetalle')[0].scrollHeight
							}, 1000).clearQueue();
						$('#tablaCompra tr:last-child').effect('highlight',{},'normal')
						celdaenfocada=-1;
        }

					}
				},errorCB,successCB);

			}
		},errorCB,successCB);
			});

    }

	closePopup2();
}

function formarCategorias(){
	var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
	var selected = '';
	var categoriaSelected = 0;
	var objcategoria='';
	db.transaction(
	function (tx){
		tx.executeSql('SELECT c.* FROM CATEGORIAS c, PRODUCTOS p where c.timespan in (p.categoriaid) and p.productofinal=1 and p.estado=1 and p.timespan != "-14" group by categoria ORDER BY categoria asc',[],function(tx,res){
        if(res.rows.length>0){
				if(localStorage.getItem("con_mesas")=='false')
					$('#menuSubNew1,#menuSubNew2').fadeIn();

				for(m=0;m<res.rows.length;m++){
					selected = 'categoria';
					var row=res.rows.item(m);
					/*if(m==0){
						selected = 'categoriaActiva';
						categoriaSelected = row.timespan;
					}
					console.log("idc:"+row.timespan);*/

                    if(row.timespan != -14){
					    $('#listacat').append('<li id="categoria_'+ row.timespan +'" class="esCategoria '+ selected +'" onclick="ActivarCategoria(this,'+"'"+ row.timespan +"'"+');" ontap="ActivarCategoria(this,'+"'"+ row.timespan +"'"+');" ><a>'+ (row.categoria).substring(0,20) +'</a></li>');
                    }
				}

                    if(localStorage.getItem("con_profesionales")=='true'){
						//alert(localStorage.getItem("con_profesionales"));
                      if(localStorage.getItem("idioma")==2){
                        $('#listacat').prepend('<li id="profes" class="categoriaActiva esCategoria" onclick="ActivarCategoria(this,-14);" ontap="ActivarCategoria(this,-14);" style="width: 248.364px; height: 44px;"><a style="height: 44px;">Custom</a></li>');
                      }else{
                        $('#listacat').prepend('<li id="profes" class="categoriaActiva esCategoria" onclick="ActivarCategoria(this,-14);" ontap="ActivarCategoria(this,-14);" style="width: 248.364px; height: 44px;"><a style="height: 44px;">Varios</a></li>');
                      }
                    }

				/*objcategoria=$('#');
				console.log(objcategoria);
				ActivarCategoria(objcategoria,categoriaSelected);*/
				$('#profes').click();
			}else{
				$('#menuSubNew1,#menuSubNew2').css('display','none');
                $('#listaProductos').hide();
                $('#listaCategorias').hide();
				if(localStorage.getItem("idioma")==1){
				  if(localStorage.getItem("con_profesionales")=='true'){
				    $('#menuSubNew1,#menuSubNew2').fadeIn();
					$("#menuproductosaux").html('<br><ul role="tablist" id="listacat" class="nav nav-tabs" style="width: 350px;"><li id="categoria_1" class="categoriaActiva esCategoria active" onclick="ActivarCategoriasp(this,1);" ontap="ActivarCategoriasp(this,1);" style="width: 150px; height: 44px;"><a style="height: 44px;">Categoría 1</a></li><li id="profes" class="categoriaActiva esCategoria" onclick="ActivarCategoriasp(this,-14);" ontap="ActivarCategoriasp(this,-14);" style="width: 150px; height: 44px;"><a style="height: 44px;">Varios</a></li></ul><div class="jumbotron"><h1>No hay productos</h1><p>Por favor, ingresa todos tus productos para empezar a facturar.</p><p><button class="btn btn-primary btn-lg" type="button" onclick="editarProductoID=0; envia('+"'nuevoproducto'"+')">Ingresar Productos</button></p></div>');
                  }else{
                    $("#menuproductosaux").html('<div class="jumbotron"><h1>No hay productos</h1><p>Por favor, ingresa todos tus productos para empezar a facturar.</p><p><button class="btn btn-primary btn-lg" type="button" onclick="editarProductoID=0; envia('+"'nuevoproducto'"+')">Ingresar Productos</button></p></div>');
                  }
                }else if(localStorage.getItem("idioma")==2){
                    if(localStorage.getItem("con_profesionales")=='true'){
                      $('#menuSubNew1,#menuSubNew2').fadeIn();
  					  $("#menuproductosaux").html('<br><ul role="tablist" id="listacat" class="nav nav-tabs" style="width: 350px;"><li id="categoria_1" class="categoriaActiva esCategoria" onclick="ActivarCategoriasp(this,1);" ontap="ActivarCategoriasp(this,1);" style="width: 150px; height: 44px;"><a style="height: 44px;">Category 1</a></li><li id="profes" class="categoriaActiva esCategoria" onclick="ActivarCategoriasp(this,-14);" ontap="ActivarCategoriasp(this,-14);" style="width: 150px; height: 44px;"><a style="height: 44px;">Custom</a></li></ul><div class="jumbotron"><h1>No Products yet</h1><p>Please, enter all your products to begin.</p><p><button class="btn btn-primary btn-lg" type="button" onclick="editarProductoID=0; envia('+"'nuevoproducto'"+')">Enter Products</button></p></div>');
                    }else{
                      $("#menuproductosaux").html('<div class="jumbotron"><h1>No Products yet</h1><p>Please, enter all your products to begin.</p><p><button class="btn btn-primary btn-lg" type="button" onclick="editarProductoID=0; envia('+"'nuevoproducto'"+')">Enter Products</button></p></div>');
                    }
                }
			}

		});
	},errorCB,successCB);
}


var margin = 0;
var lastDiv = 0;
function slider(direccion){
	var slide = margin;
	var maxSlide = -Math.abs($('#contenidoCategorias').width());
	if(direccion == 'derecha'){
		$('.esCategoria ').each(function(){
			if(slide <= parseInt($('#listaCategorias').width())){
				lastDiv = $(this).outerWidth();
				slide += $(this).outerWidth();
				}
			});
		margin -= (slide - lastDiv);
		}
	else{
		$('.esCategoria').each(function(){
			if(slide - lastDiv <= parseInt($('#listaCategorias').width())){
				slide += $(this).outerWidth();
				}
			});
		margin += (slide);
		}

	console.log(margin);

	if(parseInt(margin) > 0){
		margin = 0;
		}
	else if(margin <= maxSlide){
		margin = maxSlide;
		return false;
		}
	$('#contenidoCategorias').animate({
		marginLeft: margin
		});
	}

function pagar(){
	//alert('viene a pagar');
	//$("#cuadroClientes,#opaco").fadeOut("fast");
	var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
	var serie='001';
	var establecimiento='001';
	var encabezado=0;
	var largo=0;
		db.transaction(function (tx){
			tx.executeSql('SELECT establecimiento,serie,largo,encabezado,tiene_factura_electronica from config where id=1',[],function(tx,res2){
				serie=res2.rows.item(0).serie;
				establecimiento=res2.rows.item(0).establecimiento;
				//alert(serie+'/'+establecimiento);
				$('#seriesfact').html(establecimiento+'-'+serie+'-');
				localStorage.setItem("encabezado",res2.rows.item(0).encabezado);
				localStorage.setItem("largo",res2.rows.item(0).largo);
				localStorage.setItem("factelectronica",res2.rows.item(0).tiene_factura_electronica);
			});

            if(localStorage.getItem("con_localhost") == 'true'){
             var apiURL='http://'+localStorage.getItem("ip_servidor")+'/connectnubepos/api2.php';
             $.post(apiURL,{
        		id_emp : localStorage.getItem("empresa"),
        		action : 'VerNumeroFactura',
        		id_barra : localStorage.getItem("idbarra"),
        		deviceid:$("#deviceid").html()
        		}).done(function(response){
        			if(response!='block' && response!='Desactivado'){
        				console.log(response);
                        var res = response.split("||");
                        $('#invoiceNr').val(res[0]);
				        $('#invoiceNrComplete').val(establecimiento+'-'+serie+'-'+res[0]);


        			}else if(response=='Desactivado'){
        			    envia('cloud');
        				setTimeout(function(){
        					$('.navbar,#barraalternamovil').slideUp();
        					$("#demoGratis,#fadeRow,#finalizado,#contentStepSincro,#cuentaactiva").css("display","none");
        					$('#desactivo').fadeIn();
        				},100);
        			}else{
        				envia('cloud');
        				setTimeout(function(){
        					$('#linklogin,#linkloginb').attr("href","https://www.practisis.net/index3.php?rvpas="+localStorage.getItem("userPasswod")+"&rvus="+localStorage.getItem("userRegister"));
        					$('.navbar,#barraalternamovil').slideUp();
        					$("#demoGratis,#fadeRow,#finalizado,#contentStepSincro,#cuentaactiva").css("display","none");
        					$('#bloqueo').fadeIn();
        				},100);

        			}

        		}).fail(function(){
        			updateOnlineStatus("OFFLINE");
        			setTimeout(function(){SincronizadorNormal()},180000);
        		});
            }else{
            //*******************************inicia normal********************************
			tx.executeSql('SELECT MAX(aux)+1 as max FROM FACTURAS',[],
			function(tx,res){
				console.log(res);
				var ceros='';
				var coun=0;
				var nfact='1';
				if(res.rows.length>0){
					var max=1;
					if(res.rows.item(0).max!=null)
						max=res.rows.item(0).max;
					else{
						if(localStorage.getItem("ultimafact")!=null&&localStorage.getItem("ultimafact")!="")
							max=parseInt(localStorage.getItem("ultimafact"));
					}

					coun=max.toString().length;
					nfact=max.toString();
				}

				var ceroscount=0;
				while(ceroscount<(9-coun)){
					ceros+='0';
					ceroscount++;
				}
				$('#invoiceNr').val(ceros+nfact);
				$('#invoiceNrComplete').val(establecimiento+'-'+serie+'-'+ceros+nfact);
			});
            //******************************fin normal************************************
            }
		},errorCB,successCB);

	var subtotalSinIva = $('#subtotalSinIva').val();
	var subtotalIva = $('#subtotalIva').val();
	var descuento = $('#descuentoFactura').val();
    var total = $('#totalmiFactura').val();
	var propina=parseFloat($('#invoiceprop').html());
    var nofactura = $('#invoiceNrComplete').val();
	var logo="";
	if(localStorage.getItem("logo")!=''&&localStorage.getItem("logo")!=null){
		if(localStorage.getItem("imprimelogo")=="true")
		   logo=localStorage.getItem("logo");
	}

	var mensajepie="";
	if(localStorage.getItem("mensajefinal")!=''&&localStorage.getItem("mensajefinal")!=null){
		if(!localStorage.getItem("paquete")=="1")
		   mensajepie=localStorage.getItem("mensajefinal");
	}


	if($('#timespanFactura').val()==''||$('#timespanFactura').val()==0||$('#timespanFactura').val()==null)
		$('#timespanFactura').val(getTimeSpan());
    var timefactura = $('#timespanFactura').val();
	total=parseFloat(total);

	var pagado=0;
	$('.paymentMethods').each(function(){
		if($(this).val()!=''&&$(this).val()!=null)
			pagado+=parseFloat($(this).val());
	})

	/*$('#justo').html(total.toFixed(2));
	$('#justo').attr('data-value',-1*total.toFixed(2));
	$('#redondeado').html(Math.round(total).toFixed(2));
	$('#redondeado').attr('data-value',-1*Math.round(total).toFixed(2));*/
	var discount = parseFloat($('#descuentoFactura').val());
	console.log(discount);
	if(discount == 0){
		$('#changeFromPurchase').html(Math.abs((total-pagado+propina)).toFixed(2));
	}else{
		$('#changeFromPurchase').html(Math.abs((total-discount-pagado+propina)).toFixed(2));
	}
	//$('#changeFromPurchase').html((total-discount).toFixed(2));
	if((total-pagado)<=0){
		$('#invoiceDebt').html('VUELTO');
		if(localStorage.getItem("idioma")==2)
			$('#invoiceDebt').html("CHANGE");
	}
	else{
		$('#invoiceDebt').html('FALTANTE');
		if(localStorage.getItem("idioma")==2)
			$('#invoiceDebt').html("TO PAY");
	}

	var idimpuestos = '';
	var ivavalor=0;
	var servalor=0;
	var dataimpuestos="";
	var c=0;

	$('.esImpuesto').each(function(){
		var getName = $(this).data('nombre');
		var getId = $(this).data('id');
		var getValue = $(this).data('valor');
		//idimpuestos += getName +'/'+ $(this).val() +'/'+ getId +'/'+ getValue +'@';
		idimpuestos += getId+'@';
		if(getId==parseInt($('#idiva').html()))
			ivavalor=$(this).val();

        if(dataimpuestos.indexOf(getName) == -1){
          if(c>0){
			dataimpuestos+="@";
		  }
          //alert('si');
          dataimpuestos+=getId+"|"+getName+"|"+getValue+"|"+$(this).val();
          c++;
        }
	});

	idimpuestos = idimpuestos.substring(0,idimpuestos.length -1);
	var linkelectronica='';
	if(localStorage.getItem("factelectronica")=='true'){
		var mipass=GenerarClaveElectronica($('#cedulaP').val());
		linkelectronica='http://www.practifactura.com/clientes # user '+$('#cedulaP').val()+' # password '+mipass;
		//alert(linkelectronica);
	}

	var preimpresas=0;
	if(localStorage.getItem('preimpresas')!=null){
		if(localStorage.getItem('preimpresas')=='true'){
			preimpresas=1;
		}
	}
    //alert(subtotalSinIva+'**'+subtotalIva+'**'+descuento+'**'+impuestos);
	//var total = parseFloat(subtotalSinIva) + parseFloat(subtotalIva) + parseFloat(impuestos) - parseFloat(descuento);
	//linkelectronica='';
	
	var json = '{"Pagar": [{';
		json += ' "cliente": {';
			json +=	'"id_cliente": "'+$('#idCliente').val()+'",';
			json +=	'"cedula": "'+$('#cedulaP').val()+'",';
			json +=	'"nombre": "'+$('#nombreP').val()+'",';
			json +=	'"listaDePrecio":"1",';
			json +=	'"telefono": "'+$('#telefonoP').val()+'",';
			json +=	'"email": "'+$('#emailP').val()+'",';
			json +=	'"direccion": "'+$('#direccionP').val()+'",';
			json +=	'"logo": "'+logo+'",';
			json +=	'"mensajefinal": "'+mensajepie+'",';
			json +=	'"linkelectronica": "'+linkelectronica+'",';
			json +=	'"cupo": "'+$('#cupoP').val()+'"';
			json +=	'},';
			json += '"producto": [';
		$('.productDetails').each(function(){
			var splitDetails = $(this).val().split('|');
			var detalleagregados="";
			var detallenotas="";
			if($(this).attr("data-detagregados")!=''&&$(this).attr("data-detagregados")!=null&&$(this).attr("data-detagregados")!='undefined')
				detalleagregados=$(this).attr("data-detagregados");

			if($(this).attr("data-notes")!=''&&$(this).attr("data-notes")!=null&&$(this).attr("data-notes")!='undefined')
			detallenotas=$(this).attr("data-notes");

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
		json += '},';
		});

	var midevice='';
	if($('#deviceid').html()!=''){
		midevice=$('#deviceid').html();
	}

	var propina=0;
	if($('#propinaFactura').val()!='')
		propina=parseFloat($('#propinaFactura').val());
	var mesa="";
	var mesa_name="";
	var pax=0;
	if(sessionStorage.getItem("mesa_activa")!=""&&localStorage.getItem("con_mesas")=="true"){
		mesa=sessionStorage.getItem("mesa_activa");
		mesa_name=sessionStorage.getItem("mesa_name");
		pax=sessionStorage.getItem("mesa_pax");
	}


	//alert(device+'/'+device.model + '/' +'Device Cordova: '  + device.cordova  + '/' +'Device Platform: ' + device.platform + '/' +'Device UUID: '     + device.uuid     + '/' +'Device Version: '  + device.version);
	//alert(preimpresas);
	json = json.substring(0,json.length -1);
	json += '],'
	json += '"factura" : {';
		json += '"factimpresas" : "'+preimpresas+'",';
		json += '"subtotal_sin_iva" : "'+ subtotalSinIva +'",';
		json += '"timespanfactura" : "'+ timefactura +'",';
		json += '"idbarrascajas" : "'+midevice+'",';
		json += '"fecha" : "'+ new Date().getTime() +'",';
		json += '"anulada" : "false",';
		json += '"subtotal_iva" : "'+ subtotalIva +'",';
		json += '"impuestos" : "'+ idimpuestos +'",';
		json += '"iva" : "'+ ivavalor +'",';
		json += '"servicio" : "'+ servalor +'",';
		json += '"descuento" : "'+ $('#descuentoFacturatrue').val() +'",';
		json += '"total" : "'+ (total-descuento+propina) +'",';
		json += '"numerofact" : "'+ nofactura +'",';
		json += '"encabezado" : "'+ localStorage.getItem("encabezado") +'",';
		json += '"largo" : "'+ localStorage.getItem("largo") +'",';
		json += '"impuestosdata" : "'+ dataimpuestos +'",';
		json += '"ordername" : "'+ localStorage.getItem("nameorder") +'",';
		json += '"lang" : "'+ localStorage.getItem("idioma") +'",';
		json += '"propina" : "'+propina+'",';
		json += '"id_mesa" : "'+mesa+'",';
		json += '"mesa" : "'+mesa_name+'",';
		json += '"pax" : "'+pax+'"';
		json += '},';
		json +=$('#JSONempresaLocal').html()+'"pagos":[';

		var nformas=0;
		var cadefectivo='';
		var cadtarjetas='';
		var cadcheques='';
		var cadcxc='';
		var cadconsumoInterno='';

		if($('#paymentEfectivo').val()!=''&&parseFloat($('#paymentEfectivo').val())>0)
		{
			cadefectivo+='{"forma":"efectivo","valor":"'+$('#paymentEfectivo').val()+'","tipotarjeta":"","lote":"","numerocheque":"","banco":""}';
			nformas++;
		}

		var count=0;
		var mivuelto=parseFloat($('#invoicePaid').html())-parseFloat($('#total').html().substr(1));
		//alert(mivuelto);
		if(mivuelto>0)
		{
			if(nformas>0&&count==0)
					cadefectivo+=',';
			if(count>0)
					cadefectivo+=',';

			cadefectivo+='{"forma":"efectivo","valor":"-'+mivuelto+'","tipotarjeta":"","lote":"","numerocheque":"","banco":""}';
			nformas++;
			count++;
		}



		$('.cardv').each(function(){
			if($(this).html()!=''&&parseFloat($(this).parent().attr("data-value"))>0){

				if(nformas>0&&count==0)
					cadtarjetas+=',';

				if(count>0)
					cadtarjetas+=',';

				cadtarjetas+='{"forma":"tarjetas","valor":"'+parseFloat($(this).parent().attr("data-value"))+'","tipotarjeta":"'+parseFloat($(this).parent().attr("data-id"))+'","lote":"'+$('#order_id').val()+'","numerocheque":"","banco":""}';
				count++;
				nformas++;
			}

		});


		var count=0;
			if($('#valorcheque1').val()!=''&&parseFloat($('#valorcheque1').val())>0){
				if(nformas>0&&count==0)
					cadcheques+=',';

				if(count>0)
					cadcheques+=',';
				cadcheques+='{"forma":"cheques","valor":"'+$('#valorcheque1').val()+'","tipotarjeta":"","lote":"","numerocheque":"'+$('#chequeno1').val()+'","banco":""}';
				count++;
				nformas++;
			}

		//alert(cadtarjetas);
		var count=0;
		if($('#valorcxc').val()!=''&&parseFloat($('#valorcxc').val())>0){
			if(nformas>0&&count==0)
				cadcxc+=',';
			cadcxc+='{"forma":"cxc","valor":"'+$('#valorcxc').val()+'","tipotarjeta":"","lote":"","numerocheque":"","banco":"'+$('#justcxc').val()+'"}';
			nformas++;
		}
		
		if(cadefectivo!='') json+=cadefectivo;
		if(cadtarjetas!='') json+=cadtarjetas;
		if(cadcheques!='') json+=cadcheques;
		if(cadcxc!='') json+=cadcxc;
		
		if($('#valorConsumoI').val()!=''&&parseFloat($('#valorConsumoI').val())>0){
			if(nformas>0)
				json+=',';
			json+='{"forma":"consumointerno","valor":"'+$('#valorConsumoI').val()+'","tipotarjeta":"","lote":"","numerocheque":"","banco":""}';
		}
		json+=']}]}';

		$('#json').html(json);
		//alert("Ana");
		receiveJson();
	//$('#pay').show();
}

function addDiscount(){
	var discount = parseFloat($('#addDiscount').html());
	var totalmiFactura = parseFloat($('#totalmiFactura').val());
	var propina=$('#invoiceprop').html();
	if($('.productDetails').length > 0){
		if(discount <= totalmiFactura){
			var getTotal = $('#total').val();
			if(parseFloat(discount) > parseFloat(getTotal)){
				discount = parseFloat($('#total').val());
				$('#addDiscount').html(parseFloat(getTotal).toFixed(2));
				}

			if(discount == ''){
				discount = 0;
				$('#addDiscount').html('0');
				}

			if(parseFloat(discount) < 0){
				discount = 0;
				$('#addDiscount').html('0');
				}

			var totales = 0;
			$('.totales').each(function(){
				totales += parseFloat($(this).val());
			});

			$('#discountAdded').fadeIn();
			//$('#totalmiFactura').val(parseFloat(totales) + parseFloat(discount));
			$('#totalmiFactura').val(parseFloat(totales));
			$('#total').html('$'+ (parseFloat(totales) - parseFloat(discount)+parseFloat(propina)).toFixed(2));
			if($('#total').html().length>8)
				$('#divtotal').css('font-size','26px');
			else
				$('#divtotal').css('font-size','30px');

			$('#payButton').html('PAGAR');
			$('#invoiceTotal').html( (parseFloat(totales) - parseFloat(discount)+parseFloat(propina)).toFixed(2));
			$('#descuentoFactura').val(discount);
      $('#descuentoFacturatrue').val(discount);

			//alert(discount);

			$('#popupDiscount').modal("hide");
			var sumTotal = 0;
			$('.totales').each(function(){
				sumTotal += parseFloat($.trim($(this).val()));
			});
			console.log((parseFloat(totales) - parseFloat(discount)).toFixed(2));
			$('#justo').html((parseFloat(totales) - parseFloat(discount) + parseFloat(propina)).toFixed(2));
			$('#justo').attr('data-value',-1*(parseFloat(totales) - parseFloat(discount) + parseFloat(propina)).toFixed(2));
			$('#redondeado').html(Math.ceil((parseFloat(totales) - parseFloat(discount) + parseFloat(propina))).toFixed(2));
			$('#changeFromPurchase').html(Math.abs((parseFloat(totales) - parseFloat(discount) + parseFloat(propina)).toFixed(2)));
			$('#redondeado').attr('data-value',-1*Math.ceil((parseFloat(totales) - parseFloat(discount)+parseFloat(propina))).toFixed(2));
			if(discount.toFixed(2)>0)
				$('#btn_descuento').html('<span class="fa fa-minus"></span>&nbsp;<span class="fa fa-dollar"></span>');
			else
				$('#btn_descuento').html('<span class="fa fa-minus"></span>&nbsp;<span class="fa fa-dollar"></span>');

			$('#msjDescuentoError').html('');
			$('#btn_descuento').effect('highlight',{},'normal');
      SubtotalesDescuento();
		}else{
			$('#msjDescuentoError').html('El descuento no puede ser mayor a '+ totalmiFactura.toFixed(2));
			$('#addDiscount').html('0');
		}
	}
}

function showPopup(){
	$('#popupDiscount').modal("show");
	if($('#descuentoFactura').val()!=''&&parseFloat($('#descuentoFactura').val())>0)
		$('.cantidadd').html(parseFloat($('#descuentoFactura').val()).toFixed(2));
	else
		$('.cantidadd').html('0');
}

function closePopup(){
	$('#popupDiscount').modal("hide");
	$('#msjDescuentoError').html('');
}

function closePopup2(){
  $('#recibeIdentificadorTr').val('');
	$('#modificaCantidadActual').html('');
	$('#productoIDAcambiar').val('');
	$('.cantidad').html('1');
	$('#popupCantidad').modal("hide");
}

function borrarCompra(item){
	//variables facturacion
	var subtotalSinIva = $('#subtotalSinIva').val();
	var subtotalIva = $('#subtotalIva').val();

	//variables compra
	var total = 0;
	var sumTotal = 0;
	var taxTotal = 0;
	var sumTotal = 0;
	var subtotalSinIvaCompra = 0;
	var subtotalIvaCompra = 0;
	var productoCantidad = $(item).data('borrarcantidad');
	var productoImpuestos = $(item).data('borrarimpuesto');
	var productoImpuestosIndexes = $(item).data('borrarimpuestoindexes');
	var productoPrecio = $(item).data('borrarprecio');
	var productoAgregados = $(item).attr('data-agregados');
	var idiva=$('#idiva').html();

	$(item).closest('tr').remove();

	//impuestos start
	if($.trim(productoImpuestosIndexes) != '' && $.trim(productoImpuestosIndexes) != 0){
		if($.trim(productoImpuestosIndexes).indexOf('@') !== -1){
			$.each(productoImpuestosIndexes.split('@'), function(index,value){

				if(productoImpuestosIndexes.indexOf(idiva) !== -1){
					subtotalIvaCompra = (parseFloat(productoCantidad) *(parseFloat(productoPrecio)+parseFloat(productoAgregados)));
					}
				else{
					subtotalSinIvaCompra = (parseFloat(productoCantidad) * (parseFloat(productoPrecio)+parseFloat(productoAgregados)));
					}

				var impuestoDetalles = $('#impuesto-'+ value).val().split('|');
				var currentTax = $('#impuestoFactura-'+ value).val();
				//alert("arriba:"+productoCantidad+"/"+productoPrecio+"/"+productoAgregados+"/"+impuestoDetalles[2]);
				taxTotal = (parseFloat(productoCantidad) * (parseFloat(productoPrecio)+parseFloat(productoAgregados)) * parseFloat(impuestoDetalles[2]));

				$('#impuestoFactura-'+ value).val(parseFloat(currentTax) - parseFloat(taxTotal));
				});
			}
		else{
			productoImpuestosIndexes == parseInt(idiva) ? subtotalIvaCompra = (parseFloat(productoCantidad) * (parseFloat(productoPrecio)+parseFloat(productoAgregados))) : subtotalSinIvaCompra = (parseFloat(productoCantidad) * (parseFloat(productoPrecio)+parseFloat(productoAgregados)));

			var impuestoDetalles = $('#impuesto-'+ productoImpuestosIndexes).val().split('|');
			var currentTax = $('#impuestoFactura-'+ productoImpuestosIndexes).val();
			taxTotal = (parseFloat(productoCantidad) * (parseFloat(productoPrecio)+parseFloat(productoAgregados)) * parseFloat(impuestoDetalles[2]));
            //alert(productoPrecio+'**'+productoAgregados+'**'+impuestoDetalles[2])
			//alert("abajo"+currentTax+"/"+taxTotal);
			$('#impuestoFactura-'+ productoImpuestosIndexes).val(parseFloat(currentTax) - parseFloat(taxTotal));
			}
		}else{
			subtotalSinIvaCompra = (parseFloat(productoCantidad) * (parseFloat(productoPrecio)+parseFloat(productoAgregados)));
		}
	//impuestos end

	$('.totales').each(function(){
		sumTotal += parseFloat($.trim($(this).val()));
		});

	var sumcantidadComandada = 0;
	//alert($('.cantidadproductoscomandados').length)
	$('.cantidadproductoscomandados').each(function(){
		sumcantidadComandada += parseFloat($.trim($(this).val()));
	});
	console.log('los items facturados son'+sumcantidadComandada);
	$('#itemsVendidos').html(sumcantidadComandada);
	
	//cambio check de sin servicio
	if(sumcantidadComandada==0)
		$('#sinservicio').prop('disabled',false);
	else
		$('#sinservicio').prop('disabled',true);
	

	$('#menuSubNew2').html("Ver Total - "+sumcantidadComandada+" pedidos");

	/*$('#itemsVendidos').css('display','block');
	$('#itemsVendidos').css('background-color','red');*/

	$('#totalmiFactura').val(sumTotal);
	$('#total').html('$'+ parseFloat(sumTotal).toFixed(2));
	if($('#total').html().toString().length==9)
		$('#divtotal').css('font-size','26px');
	else if($('#total').html().toString().length>9)
		$('#divtotal').css('font-size','26px');
	else
		$('#divtotal').css('font-size','30px');

	if($('#total').html().toString().length>7){
		$('.den').css('width',4.5*parseFloat($('.producto').css('height')));
	}else{
		$('.den').css('width',3*parseFloat($('.producto').css('height')));
	}

  	if(localStorage.getItem("idioma")==1)
  		//$('#btn_gpedidos').html('GUARDAR $'+ parseFloat(sumTotal).toFixed(2));
  		$('#btn_gpedidos').html('GUARDAR');
  	else if(localStorage.getItem("idioma")==2)
  		//$('#btn_gpedidos').html('SAVE $'+ parseFloat(sumTotal).toFixed(2));
  		$('#btn_gpedidos').html('SAVE');

	//$('#payButton').html('PAGAR $'+ parseFloat(sumTotal).toFixed(2));
	$('#subtotalSinIva').val(parseFloat(subtotalSinIva) - parseFloat(subtotalSinIvaCompra));
	$('#subtotalIva').val(parseFloat(subtotalIva) - parseFloat(subtotalIvaCompra));
	$('#justo').html(sumTotal.toFixed(2));
	$('#justo').attr('data-value',-1*sumTotal.toFixed(2));
	$('#redondeado').html(Math.ceil(sumTotal).toFixed(2));
	$('#redondeado').attr('data-value',-1*Math.ceil(sumTotal).toFixed(2));
	$('#payButton').html('PAGAR');
	$('#invoiceTotal').html(sumTotal.toFixed(2));
	$('.product_del').on('click',function(){
			PlaySound(4);
	});
}

function intOrFloat(e,value){
    if(value.indexOf('.') !== -1 && (e.keyCode == 190 || e.keyCode == 110)){
        e.preventDefault();
        }

    if((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode == 8 || e.keyCode == 9 || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 46 || e.keyCode == 190 || e.keyCode == 110){
        return;
        }
    else{
        e.preventDefault();
        }
}

var celdaenfocada=-1;
function BuscarSugerencias(filtro,e){
	//alert(e.keyCode);
	if(e.keyCode==13){
		var misugerencias=document.getElementsByClassName('sugerencia');
		for(j=0;j<misugerencias.length;j++){
			if(misugerencias[j].getAttribute('enfocada')==1){
				misugerencias[j].firstChild.click();
			}
		}

	}else if(e.keyCode==38){
		if(document.getElementById('tableresults')){
			$('.sugerencia').each(function(){
				AclararSugerencia($(this)[0],false);
			});

			if((celdaenfocada-1)>-1)
				celdaenfocada-=1;
			else
				celdaenfocada=0;
			console.log(celdaenfocada);
			AclararSugerencia(document.getElementById('tableresults').rows[celdaenfocada].cells[0],true);
		}
	}else if(e.keyCode==40){
		$('.sugerencia').each(function(){
				AclararSugerencia($(this)[0],false);
			});
		console.log(e.keyCode);
		if((celdaenfocada+1)<document.getElementById('tableresults').rows.length)
				celdaenfocada+=1;
			console.log(celdaenfocada);
			AclararSugerencia(document.getElementById('tableresults').rows[celdaenfocada].cells[0],true);
	}else{
		if(filtro!=''){
			$('#resultBuscador').fadeIn('slow');
			$('#tableresults').html('');
			var json = $('#jsonProductos').html();
			var mijson = eval(''+json+'');

			for(var j in mijson){
				for(var k in mijson[j]){
					for(i = 0; i < mijson[j][k].length; i++){

							var item = mijson[j][k][i];
							var suger='';
							if(item.formulado_nombre.toLowerCase().indexOf(filtro.toLowerCase())>-1)
								suger=item.formulado_nombre;
							else if(item.formulado_codigo.toLowerCase().indexOf(filtro.toLowerCase())>-1)
								suger=item.formulado_codigo;

							if(suger!='')
							{
								if(document.getElementById('tableresults').rows.length<4){
									$('#tableresults').append("<tr><td class='sugerencia' onmousenter='AclararSugerencia(this,true);' onmouseout='AclararSugerencia(this,false);' enfocada='0'><div id='busc_"+ item.formulado_id +"' data-precio='"+ item.formulado_precio +"' data-impuestos='"+ item.formulado_impuestos +"' data-impuestosindexes='"+ item.formulado_tax_id +"' data-formulado='"+ item.formulado_nombre.toUpperCase()+"' ontap='VerificarAgregados(this,2); return false;'>"+suger.toUpperCase()+"</div></td></tr>");
								}

							}
					}
				}
			}
			if(mijson.length>0){
				AclararSugerencia(document.getElementById('tableresults').rows[0].cells[0],true);
			}
		}
	}
}


function AclararSugerencia(celda,focus){
	if(focus){
		celda.style.backgroundColor='rgba(88,88,91,0.9)';
		celda.style.color='#FFF';
		celda.setAttribute('enfocada','1');
	}else{
		celda.style.backgroundColor='transparent';
		celda.style.color='#404041';
		celda.setAttribute('enfocada','0');
	}
}

function PlaySound(id) {
  var thissound=document.getElementById("beep1");
  thissound.play();
}

function DetalleArriba(){
	var actual=parseInt($('#tablaCompra').css('top'));
	var alto=parseInt($('#tablaCompra').css('height'));
	if((actual-5)>=(-alto+25))
	    $('#tablaCompra').css('top',actual-5);
	else
		$('#tablaCompra').css('top',-alto+25);
}

function DetalleAbajo(){
	var actual=parseInt($('#tablaCompra').css('top'));
	if((actual+5)<=0)
	    $('#tablaCompra').css('top',actual+5);
	else
		$('#tablaCompra').css('top',0);

	//setTimeout(function(){DetalleAbajo()},200);
}

function AntesDePagar(){
	//$('#paymentModule').modal('show');
	if(parseFloat($('#total').html().substring(1))>0){
		var concredito=localStorage.getItem('pagarconcredito');
		if(concredito==null)
			concredito='false';
		//alert(concredito);
		if(!(concredito.toString()=='true')){
			//alert(concredito);
			pagonormal=true;
			PagoSimple();
			$('.basurero,.badge').css('display','none');
		}else{
			//alert('directo');
			pagonormal=false;
			PagoAvanzado();
		}

		document.body.scrollTop = document.documentElement.scrollTop = 0;
		if(localStorage.getItem("con_nombre_orden")=='true'){
          $('#nombre_orden').css('display','block');
		}else{
          $('#nombre_orden').css('display','none');
		}

		if(!(concredito=='true')){
			$('#paymentModule,#touchefectivo').fadeIn();
		}
		else{
			$('#paymentModule').fadeIn();
			changePaymentCategory('5','ConsumoI');
		}
		$('#row1').css('display','none');
		//$('#paymentEfectivo').val(parseFloat($('#justo').attr('data-value'))*-1);
		//$('#paymentCategory-1').click();

		//$('#cedulaP').val('9999999999999');
		BuscarCliente(13);
		//$("#cuadroClientes").css('display','none');
		//$("#clientever").css("display","none");
		$("#easypay").fadeIn();
		pagar();
		if(!$('#idCliente').val!=''){
			alert("Por favor elija primero un cliente.");
		}
	}
}

function soloNumerost(e){
	//console.log(e.keyCode);
	key = e.keyCode || e.which;
	tecla = String.fromCharCode(key).toLowerCase();
	letras = "0123456789.";
	especiales = [8,9,37,39,52];
	tecla_especial = false
	for(var i in especiales){
	    if(key == especiales[i]){
		tecla_especial = true;
		break;
            }
	}
        if(letras.indexOf(tecla)==-1 && !tecla_especial){
	    return false;
	}
}

var digitado=false;
function ColocarFormasPago(){
	var formaspago=$('#jsonformaspago').html();
	var evalJson=JSON.parse(formaspago);
	//console.log(evalJson);
	for(var k in evalJson){
		var x = 1;
		var mihtml='';
		for(var j in evalJson[k]){
			//alert(evalJson[k][j]+id);
				mihtml+= '<tr>';
				mihtml+= '<td class="columna1">';
				mihtml+= '<div id="paymentCategory-'+evalJson[k][j].id+'" class="paymentCategories" onclick="changePaymentCategory(\''+evalJson[k][j].id+'\',\''+evalJson[k][j].nombre+'\');" style="height:100%; background-color: #D2D2D2; border-radius:5px; border: 1px solid #cccccc;">';
				mihtml+= '<table style="width: 100%; height: 100%;" cellspacing="0px" cellpadding="0px">';
			    mihtml+= '<tr style="cursor:pointer;">';
				mihtml+= '<td style="width:10%; height:100% text-align: right; font-size: 12px; font-weight:400; padding-left:10px;"><span class="glyphicon glyphicon-ok-circle"></span></td>';
				mihtml+= '<td class="textoformapago trans_'+evalJson[k][j].nombre+'" id="forma_'+evalJson[k][j].id+'">';
				mihtml+=evalJson[k][j].nombre;
				mihtml+= '</td><td class="simple" id="simple_'+evalJson[k][j].id+'" style="text-align:right; padding-right:10px; display:none;">0.00</td>';
				mihtml+= '</tr>';
				mihtml+= '</table>';
				mihtml+= '</div>';
				mihtml+= '</td>';
				mihtml+= '<td class="columna2" style="display:none;">';
				var fondo='transparent';
				var inputfondo='#F7F7F7';
				var clase='pop';
				if(evalJson[k][j].id!=1){
					fondo='#DDD';
					inputfondo='#DDD;'
					clase='';
				}

				mihtml+= '<div style="height:100%; background-color:'+inputfondo+'; border:1px solid #CCCCCC; text-align:center; padding-right:10px;">';
				mihtml+= '<input class="paymentMethods '+clase+'" paymentMethod="'+evalJson[k][j].nombre+'" idPaymentMethod="'+evalJson[k][j].id+'" id="payment'+evalJson[k][j].nombre.replace(" ","")+'" style="height:100%; width:100%; background:'+fondo+'; border:0px; text-align:right;" placeholder="0.00" value="" onfocus="this.select();" onchange="changePaymentCategory(\''+evalJson[k][j].id+'\',\''+evalJson[k][j].nombre+'\');" onkeypress="isalphanumeric(event);" readonly />';
				mihtml+= '</div>';
				mihtml+= '</td><td width="5%" class="basurero" style="display:none; "><button class="btn" type="button" onclick="ResetPagos('+evalJson[k][j].id+');"><span class="glyphicon glyphicon-trash"></span></button></td>';
				mihtml+= '</tr>';
				x++;
		}
	}
	$('#tablaformaspago').html(mihtml);
	/*$('.pop').popover({html:true,content:"<div style='padding:5px;' id='tecladoc'><div class='row'><button onclick='ClickNumeroP(this);' class='numeron btn btn-default btn-lg' cual='1'>1</button> <button onclick='ClickNumeroP(this);' class='numeron btn btn-default btn-lg' cual='2'>2</button> <button onclick='ClickNumeroP(this);' class='numeron btn btn-default btn-lg' cual='3'>3</button></div><div class='row'> <button onclick='ClickNumeroP(this);' class='numeron btn btn-default btn-lg' cual='4'>4</button> <button onclick='ClickNumeroP(this);' class='numeron btn btn-default btn-lg' cual='5'>5</button> <button onclick='ClickNumeroP(this);' class='numeron btn btn-default btn-lg' cual='6'>6</button></div><div class='row'> <button onclick='ClickNumeroP(this);' class='numeron btn btn-default btn-lg' cual='7'>7</button> <button onclick='ClickNumeroP(this);' class='numeron btn btn-default btn-lg' cual='8'>8</button> <button onclick='ClickNumeroP(this);' class='numeron btn btn-default btn-lg' cual='9'>9</button></div><div class='row'> <button onclick='ClickNumeroP(this);' class='numeron btn btn-default btn-lg' cual='0'>0</button> <button onclick='ClickNumeroP(this);' class='numeron btn btn-default btn-lg' cual='p'>.</button> <button onclick='ClickNumeroP(this);' class='numeron btn btn-default btn-lg' cual='d'><span class='fa fa-long-arrow-left'></span></button></div><div style='margin-top:3px; text-align:center;'><button class='btn btn-success' type='button' onclick='ocultarTeclado(this);'>OK</button></div></div>",delay: { "show": 100, "hide": 10 },trigger:"click",placement:"bottom"});*/
	/*$('.pop').on('shown.bs.popover', function () {
			digitado=false;
			$('.numeron').css('width','80px');
			//$('#precioConImpuestos').popover('hide');
		    setTimeout(function(){ocultarTeclado();},60000);
	});*/

	$('#paymentEfectivo,#valortarjeta,#valorcheque1,#valorcxc,#valorConsumoI').on('click',function(){
		digitado=false;
		if($(this).val()!='')
			$('.cantidadn').val($(this).val());
		else
			$('.cantidadn').val('0.00');

		$('#inputtarget').val($(this).attr('id'));

		if($(this).attr('id')=='paymentEfectivo'){
			if(localStorage.getItem("idioma")==1)
				$('#titlenumeric').html("Pago en Efectivo");
			else if(localStorage.getItem("idioma")==2)
				$('#titlenumeric').html("Cash Payment");
		}
		else if($(this).attr('id')=='valortarjeta'){
			if(localStorage.getItem("idioma")==1)
				$('#titlenumeric').html("Pago con Tarjeta");
			else if(localStorage.getItem("idioma")==2)
				$('#titlenumeric').html("Card Payment");
		}
		if($(this).attr('id')=='valorcheque1'){
			if(localStorage.getItem("idioma")==1)
				$('#titlenumeric').html("Pago con Cheque");
			else if(localStorage.getItem("idioma")==2)
				$('#titlenumeric').html("Check Payment");
		}
		else if($(this).attr('id')=='valorcxc'){
			if(localStorage.getItem("idioma")==1)
				$('#titlenumeric').html("Pago CxC");
			else if(localStorage.getItem("idioma")==2)
				$('#titlenumeric').html("CxC Payment");
		}
		else if($(this).attr('id')=='valorConsumoI'){
			if(localStorage.getItem("idioma")==1)
				$('#titlenumeric').html("Pago Consumo Interno");
			else if(localStorage.getItem("idioma")==2)
				$('#titlenumeric').html("Internal Purchase Payment");
		}
		$('#popupprecios').modal('show');
	});
}

/*function ClickNumeroP(numc){
	var div=$(numc).parent().parent().parent().parent();
	var miinp;
	$('#pay input').each(function(){
		if($(this).attr('aria-describedby')==div.attr('id')){
			miinp=$(this);
		}
	});
	//alert(div.attr('id'));
	var accion = $.trim($(numc).attr('cual'));
		//console.log(accion);
		if(accion == 'p'){
			if(miinp.val().indexOf('.') == -1){
				/*if(miinp.val()==0){
					miinp.val(miinp.val()+".");
					digitado=true;
				}
				else{*/
					/*if(digitado==false){
						miinp.val('0.');
						digitado=true;
					}
					else{
						miinp.val(miinp.val()+'.');
						digitado=true;
					}*/
				//}
			/*}else{
				if(digitado==false){
						miinp.val('0.');
						digitado=true;
				}
			}
			return false;
		}
		else if($.isNumeric(accion) === true){
			if(miinp.val()=='0'){
				miinp.val(accion);
				digitado=true;
			}
			else {
				if(digitado==true)
					miinp.val(miinp.val()+accion);
				else{
					miinp.val(accion);
					digitado=true;
				}
			}

			return false;
		}

		var fetchHTML = $.trim(miinp.val());
		miinp.val(fetchHTML.substring(0,(fetchHTML.length-1)));
		if(miinp.val()=='')
			miinp.val('0');
}*/

/*function ocultarTeclado(numc){
	if(numc!=null){
		var div=$(numc).parent().parent().parent().parent();
		var inp;
		$('#pay input').each(function(){
			if($(this).attr('aria-describedby')==div.attr('id')){
				inp=$(this);
			}
		});
		$(inp).change();
		if(inp!=null)
			$(inp).popover('hide');
		else
			$('.pop').popover('hide');
	}else{
		$('.pop').popover('hide');
	}
}*/

function BuscarCliente(e){
	var valor=$('#cedulaP').val();
	if(e==13){
		mostrarClientes();
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
					$('#telefonoP').val(row.telefono);
					$('#direccionP').val(row.direccion);
					$('#emailP').val(row.email);
					$('#payClientName').html(row.nombre);
					$('.tipoClienteP').val(1);
					if($('#insideShop').length > 0){
						continueShopping(row.id);
					}
				}else{
					$('#nombreP').val('');
				}
			});
		},errorCB,successCB);
	}
}

function Init3(){
	//console.log("celular pequeno");
	mialtoboton=0;
		var w=$(window).width();
		$('.producto,.categoriaActiva,.categoria').each(function(){
		//console.log($(this));
		$(this).css('width',(w/3.9)+'px');
		if ($(this).height()>mialtoboton){
			mialtoboton=$(this).height();
		}
	});

	//pongo alto uniforme al mas grande.
	$('.producto').each(function(){
		$(this).css('height',mialtoboton+'px');
		$(this).css('line-height','14px');
		$(this).css('font-size','13px');
	});


	var anchoCategorias=0;
	var cuantas=0;
	$('.esCategoria').each(function(){
		anchoCategorias+=parseFloat($(this).css('width'));
		cuantas++;
	});
	var anchodireccionales=parseInt($('.direccionales').css('width'));
	$('#nav_izq,#nav_der').css('width',anchodireccionales);
		var wp=parseInt($('.productos').css('width'))-40;

		if(anchoCategorias<wp)
			$('#contenidoCategorias').css('width','100%');
		else
			$('#contenidoCategorias').css('width',(anchoCategorias+cuantas));

		if(anchoCategorias<wp){
			$('.direccionales').css('display','none');
			$('#listaCategorias').css('width','100%');
		}else{
			$('.direccionales').css('display','block');
			if(wp>0)
				$('#listaCategorias').css('width',((wp)-(2*anchodireccionales)-10)+'px');
		}
		$('.direccionales').css('height',(parseInt($('#listaCategorias').css('height')))+'px');
		$('.direccionales').css('width','100%');
	
	
	$('#divdatosclientefiferente').css('height',$('#popupclientefe').height());
	$('#divdatosclientefiferente').css('width',$('#popupclientefe').width());

	$('#avisadorpeque').show();
	
	if($('#barraalternamovil').css('display')!='none'){
		if($('#popupclientefe').css('display')=='none'){
			$('#menuSubNew1,#menuSubNew2').fadeIn();
		}else{
			$('#menuSubNew1,#menuSubNew2').css('display','none');
		}
	}
}

function Init31(){
	var h=$(window).height();
	var w=$(window).width();
	var hd=$(document).height();
	if(h/w>=0.725) vertical=true;
	else vertical=false;
	console.log(vertical);
	$('#main').height(h-parseFloat($('.navbar').css('height')));
	//$('#main').width(w*98/100);

	var suma=parseFloat($('.navbar').css('height'))+195;
	$('.sumarow').each(function(){
		suma+=parseFloat($(this).css('height'));
	});
	//console.log(suma);

	$('#contentdetalle').css("height",parseFloat($(window).height())-suma);

	var navh=parseInt($('.navbar').css("height"));
	$('#pay').css("height",(hd-navh));
	if(w<=900){
		$('.btn-lg').each(function(){
			var actual=$(this).attr('class');
			var nueva=actual.replace("btn-lg","btn-sm");
			$(this).attr("class",nueva);
		});
	}else{
		$('.btn-sm').each(function(){
			var actual=$(this).attr('class');
			var nueva=actual.replace("btn-sm","btn-lg");
			$(this).attr("class",nueva);
		});
	}

	//$('.producto').css('font-size',(h*2.8/100)+'px');
	$('.producto,.categoriaActiva,.categoria').each(function(){
		//console.log($(this));
		$(this).css('width',w/5.5);
	});
	if(vertical){
		$('.producto').css('height',((h*4.5/100)+15)+'px');
		//$('.producto,.categoriaActiva,.categoria').css('height',((h*4.5/100)+15)+'px');
		//$('#listaProductos').css('height',"100%");
	}else{
		//$('.producto,.categoriaActiva,.categoria').css('height',((h*6.5/100)+15)+'px');
		$('.producto').css('height',((h*6/100)+15)+'px');
		//$('#listaProductos').css('height',"100%");
	}
	$('.den,.card').css('height',1.8*parseFloat($('.producto').css('height')));
	$('.den,.card').css('width',3*parseFloat($('.producto').css('height')));
	$('.den,.card').css('font-size','24px');

	$('.nombrecard').each(function(){
		if($(this).html().length>8){
			$(this).css('font-size','18px');
		}
	});

	$('#productos').css('height',h-parseFloat($('.navbar').css('height'))-parseFloat($('#listaCategorias').css('height'))-15);

	/*if(h<600)
		$('#listaProductos').css("min-height","480px");*/

	//$('#listaCategorias').css('height',(parseInt($('.categoria').css('height')))+'px');
	$('#listaProductos').css('height',(parseInt($('.productos').css('height'))-parseInt($('#listaCategorias').css('height'))+'px'));
    $('#prodprofesionales').css('height',(parseInt($('.productos').css('height'))-parseInt($('#listaCategorias').css('height'))+'px'));
	$('.direccionales').css('height',(parseInt($('#listaCategorias').css('height')))+'px');
	//$('.direccionales').css('width',(parseInt($('.direccionales').css('width')))+'px');
	$('.direccionales').css('width','100%');
	var anchoCategorias=0;
	var cuantas=0;
	$('.esCategoria').each(function(){
		anchoCategorias+=parseFloat($(this).css('width'));
		cuantas++;
	});
	var anchodireccionales=parseInt($('.direccionales').css('width'));
	$('#nav_izq,#nav_der').css('width',anchodireccionales);
	//$('#listaCategorias').css('width',(w-(2*anchodireccionales)-30)+'px');
	//$('#listaCategorias').css('height',$('.producto').css('height'));
	//$('#contenidoCategorias').css('width',anchoCategorias+20);
		var wp=parseInt($('.productos').css('width'))-40;
		//alert(anchoCategorias+'/'+wp);

		if(anchoCategorias<wp)
			$('#contenidoCategorias').css('width','100%');
		else
			$('#contenidoCategorias').css('width',(anchoCategorias+cuantas));

		if(anchoCategorias<wp){
			$('.direccionales').css('display','none');
			//$('#listaCategorias').css('width',wp);
			$('#listaCategorias').css('width','100%');
			}
		else{
			$('.direccionales').css('display','block');
			if(wp>0)
				$('#listaCategorias').css('width',((wp)-(2*anchodireccionales)-10)+'px');
			}
	
	$('#divdatosclientefiferente').css('height',$('#popupclientefe').height());
	$('#divdatosclientefiferente').css('width',$('#popupclientefe').width());
	
	//alert('init');
}



$(document).ready(function(){
	Ready();
});

$(window).resize(function(){
	$('#main').css('height',$(window).height);
	if(parseFloat($(window).width())<=900){
		$('#barraalternamovil').fadeIn('',function(){
			if(localStorage.getItem('con_profesionales')=='true'){
				if($('#popupclientefe').css('display')!='none')
					$('#menuSubNew1,#menuSubNew2').css('display','none');
			}
		});
		$('.navbar').css('display','none');
		$('#lapartedepagos').fadeOut();
		Init3();
	}else{
		$('.navbar').fadeIn();
		$('#barraalternamovil').css('display','none');
		$('#lapartedepagos,#productos').fadeIn();
		Init31();
	}
    botonesCalculadora();
});

function botonesCalculadora(){
    height=($(window).height() * 0.70) / 4 ;
    heightc=($(window).height() * 0.45) / 4 ;
    $(".numero").css("height", height +"px");
    //$(".numeroc").css("height", heightc +"px");
}

function ClickNumero(num){
	var accion = $.trim($(num).attr('cual'));
    cantidad=$.trim($('.cantidad').html());


        if(accion=='.')        return;

        if(cantidad=='0'){
            $('.cantidad').html('0.00');
            cantidad='0.00';
        }
        console.log(accion);
        expAction=cantidad.split(".");

       if(accion=='+'){
            // $("#inputbusc").focus();
            currentAction='+';
			vecesEnCantidad=0;
			var codigoBusqueda = $('.cantidad').html();
			var entero = codigoBusqueda.replace(".","");
			var primerDigito = entero.substring(0,1);
			var segundoDigito = entero.substring(1,2);
			var tercerDigito = entero.substring(2,3);
			var esConfirm = false;
			if(entero.length == 3){
				if(primerDigito == 0 && segundoDigito == 0){
					sumaDigitos = tercerDigito;
					if(confirm('su codigo es : ' + sumaDigitos+'?')){
						codigoBusqueda = tercerDigito;
						esConfirm = true;
						saberProducto(codigoBusqueda,currentCantidad);
						//agregarCompra(codigoBusqueda);
						$('.cantidad').html('');

					}
				}

				if(primerDigito == 0 && segundoDigito != 0){
					sumaDigitos = (segundoDigito+''+tercerDigito);
					if(confirm('su codigo es : ' + sumaDigitos+'?')){
						codigoBusqueda = sumaDigitos;
						esConfirm = true;
						saberProducto(codigoBusqueda,currentCantidad);
						//agregarCompra(codigoBusqueda);
						$('.cantidad').html('');
					}
				}
				if(primerDigito != 0){
					sumaDigitos = entero;
					if(confirm('su codigo es : ' + sumaDigitos+'?')){
						codigoBusqueda = sumaDigitos;
						esConfirm = true;
						saberProducto(codigoBusqueda,currentCantidad);

						//agregarCompra(codigoBusqueda);
						$('.cantidad').html('');
					}
				}
				//alert(sumaDigitos);

			}

			$('.cantidad').html('0.00');
			if(esConfirm == false){
				sumaDigitos = entero;
				saberProducto(sumaDigitos , currentCantidad);
				$('.cantidad').html('');
				//alert(sumaDigitos);
				//agregarCompra(sumaDigitos);

			}
			$('.cantidad').html('0.00');
        }

        if(accion=='-'){
	//alert(vecesEnCantidad);
            vecesEnCantidad++;

            if(vecesEnCantidad==2){
                accion='go';

            }else{

                currentCantidad=$('.cantidad').html();
                $('.cantidad').html('0.00');
                return;
            }

        }


        if(accion=='go'){
            if(vecesEnCantidad==0){

                cantidadMultiplicar=$('.cantidad').html();
                currentCantidad=1;
                AgregarProductoCustom(1,cantidadMultiplicar);
                //alert("here");
            }else{
                cantidadMultiplicar=$('.cantidad').html();
                valorProducto=cantidadMultiplicar * currentCantidad;
                AgregarProductoCustom(valorProducto , valorProducto);

                vecesEnCantidad=0;
            }

            return;
        }



        if(accion=='d'){

            if(expAction[0].length > 1 && expAction[1]=='00' ){
                leftPart=expAction[0].substring(0,expAction[0].length-1);
                leftPart2=expAction[0].substring(expAction[0].length-1,expAction[0].length);
                $('.cantidad').html(leftPart+'.'+leftPart2+'0');
                return;
            }else{
                if(expAction[0].length == 1 && expAction[1]=='00' ){
                    leftPart=expAction[0].substring(0,expAction[0].length-1);
                    leftPart2=expAction[0].substring(expAction[0].length-1,expAction[0].length);
                    $('.cantidad').html('0.'+leftPart2+''+0);
                    return;
                }

                if(expAction[0] == '0' && expAction[1]!='00' ){
                        rightPart=expAction[1].substring(0,1);
                        $('.cantidad').html('0.0'+rightPart);
                }

                if(expAction[0] != '0' && expAction[1]!='00' ){
                        leftPart=expAction[0].substring(0,expAction[0].length-1);
                        leftPart2=expAction[0].substring(expAction[0].length-1,expAction[0].length);
                        rightPart=expAction[1].substring(0,1);
                        $('.cantidad').html(leftPart + '.'+  leftPart2 +'' + rightPart);
                }


            }

            if(cantidad=='0.00'){
                /*no borrar nada*/
            }else{
                if(expAction[1].substring(1,2)!='0' && expAction[1].substring(0,1)=='0' && expAction[0]=='0' ){
                    /*0.0N*/
                    goRight=expAction[1].substring(0,1);
                    $('.cantidad').html('0.00');
                }else{
                    /* 0.NE*/
                    if(expAction[1].substring(1,2)!='0' && expAction[1].substring(0,1)!='0' && expAction[0]=='0' ){
                        lastNumber=expAction[1].substring(0,1);
                        newRight='0'+lastNumber;
                        $('.cantidad').html('0.'+newRight);
                    }else{
                        if(expAction[1].substring(1,2)!='0'  && expAction[0]!='0' ){
                            lenLeft=expAction[0].length;
                            if(lenLeft==1){
                                lastNumberLeft=expAction[0].substring(0,1);
                                lastNumberRight=expAction[1].substring(0,1);
                                newRight=lastNumberLeft+''+lastNumberRight;
                                newLeft='0';
                                newCantidad=newLeft+'.'+newRight;
                                $('.cantidad').html(newCantidad);
                            }else{
                                lastNumberLeft=expAction[0].substring(lenLeft-1,lenLeft);
                                lastNumberRight=expAction[1].substring(0,1);
                                newRight=lastNumberLeft+''+lastNumberRight;
                                newLeft=expAction[0].substring(0,expAction[0].length-1);
                                $('.cantidad').html(newLeft + "."+newRight);

                            }
                        }else{

                        }
                    }
                }
            }
            return;
        }

        if(cantidad=='0.00'){ /*0.00*/
            if(accion=='00'){
                $('.cantidad').html('0.'+accion);
            }else{
                $('.cantidad').html('0.0'+accion);
            }

        }else{
            if(expAction[1].substring(0,1)=='0' && expAction[0]=='0'){  /*0.0N*/
                lastNumber=expAction[1].substring(1,2);
                if(accion=='00'){
                    $('.cantidad').html(lastNumber+'.'+accion);
                }else{
                    $('.cantidad').html('0.'+lastNumber+''+accion);
                }

            }else{
                if(expAction[0].substring(0,1)=='0' && expAction[1]!='00' ){ /*0.NE*/
                    lastNumber=expAction[1].substring(0,1);
                    lastNumber2=expAction[1].substring(1,2);
                    newNumber=lastNumber+'.'+lastNumber2 + '' +accion;
                    if(accion=='00'){
                        newNumber=lastNumber+''+lastNumber2 + '.' +accion;
                        $('.cantidad').html(newNumber);
                    }else{
                        $('.cantidad').html(newNumber);
                    }

                }else{
                    exp1=expAction[0];
                    exp2=expAction[1];
                    lastNumber=expAction[1].substring(0,1);
                    rightNew=exp2.substring(1,exp2.length) + '' +accion;
                    newLeft=exp1 + "" + lastNumber;

                    if(accion=='00' && expAction[1]=='00'){
                        $('.cantidad').html(expAction[0] + '00.00');
                    }else{
                        $('.cantidad').html(newLeft + '.'+rightNew);
                    }

                }
            }
        }
}

function ClickNumeroC(numc){
	var accion = $.trim($(numc).attr('cual'));
		console.log(accion);
		if(accion == 'p'){
			if($('.cantidad').html().indexOf('.') == -1){
				if($('.cantidad').html() == '0'){
					$('.cantidad').append('.');
					}
				else{
					$('.cantidad').append('.');
					}
				}
			return false;
			}
		else if($.isNumeric(accion) === true){
			if($('.cantidad').html()=='0')
					$('.cantidad').html(accion);
			else
					$('.cantidad').append(accion);
			return false;
			}

		var fetchHTML = $.trim($('.cantidad').html());
		$('.cantidad').html(fetchHTML.substring(0,(fetchHTML.length-1)));
		if($('.cantidad').html()=='')
			$('.cantidad').html('0');
}

function ClickNumeroCnew(numc){
	var accion = $.trim($(numc).attr('cual'));
		console.log(accion);
     $( "#inputbuscnew" ).focus();
		if(accion == 'p'){
			if($('.cantidadnew').html().indexOf('.') == -1){
				if($('.cantidadnew').html() == '0'){
					$('.cantidadnew').append('.');
					}
				else{
					$('.cantidadnew').append('.');
					}
				}
			return false;
			}
		else if($.isNumeric(accion) === true){
			if($('.cantidadnew').html()=='0')
					$('.cantidadnew').html(accion);
			else
					$('.cantidadnew').append(accion);
			return false;
			}

		var fetchHTML = $.trim($('.cantidadnew').html());
		$('.cantidadnew').html(fetchHTML.substring(0,(fetchHTML.length-1)));
		if($('.cantidadnew').html()=='')
			$('.cantidadnew').html('0');
}

function ClickNumeroD(numd){
	var accion = $.trim($(numd).attr('cual'));
		console.log(accion);
		if(accion == 'p'){
			if($('.cantidadd').html().indexOf('.') == -1){
				if($('.cantidadd').html() == '0'){
					$('.cantidadd').append('.');
					}
				else{
					$('.cantidadd').append('.');
					}
				}
			return false;
			}
		else if($.isNumeric(accion) === true){
			if($('.cantidadd').html()=='0')
					$('.cantidadd').html(accion);
			else
					$('.cantidadd').append(accion);
			return false;
			}

		var fetchHTML = $.trim($('.cantidadd').html());
		$('.cantidadd').html(fetchHTML.substring(0,(fetchHTML.length-1)));
		if($('.cantidadd').html()=='')
			$('.cantidadd').html('0');
}

function ClickNumeroM(numd){
		var accion = $.trim($(numd).attr('cual'));
		console.log(accion);
		if(accion == 'p'){
			if($('.cantidadm').html().indexOf('.') == -1){
				if($('.cantidadm').html() == '0'){
					$('.cantidadm').append('.');
					}
				else{
					$('.cantidadm').append('.');
					}
				}
			return false;
			}
		else if($.isNumeric(accion) === true){
			if($('.cantidadm').html()=='0'||$('#addPax').attr("cambio")=="false"){
					$('.cantidadm').html(accion);
					$('#addPax').attr("cambio","true");
			}
			else
					$('.cantidadm').append(accion);
			return false;
			}

		var fetchHTML = $.trim($('.cantidadm').html());
		$('.cantidadm').html(fetchHTML.substring(0,(fetchHTML.length-1)));
		if($('.cantidadm').html()=='')
			$('.cantidadm').html('0');
}

function Ready(){

  /*$('#paymentModule').on("click",function(e){
	  if ($(e.target).data('toggle') !== 'popover'&& $(e.target).parents('.popover.in').length === 0) {
			if($('.popover.in').length>0){
				//alert('se oculta');
				//$('[data-toggle="popover"]').popover('hide');
				var mipop=$('.popover.in')[0];
				var id=$(mipop).attr('id');
				var inp;
				$('#pay input').each(function(){
					if($(this).attr('aria-describedby')==id){
						inp=$(this);
					}
				});

				if(inp!=null){
					$(inp).change();
					$(inp).popover('hide');
				}
				//ocultarTeclado();
			}
		}
  });*/
   $('body').css('min-height',$(window).height());
   if(localStorage.getItem('con_mesas')=='true'){
		if(localStorage.getItem("noservicio")=='true'){
			$('#sinservicio').prop('checked',true);
		}else{
			$('#sinservicio').prop('checked',false);
		}
	}else{
		localStorage.setItem("noservicio",'false');
	}

  $('#menuSubNew2').html(" Ver Total");
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

  //alert("hola");


  $('#popupprecios').modal('hide');

  $('.modal').on('shown.bs.modal',function(){
		$('body').css('padding-right','0px');
		$('body,html').css('overflow-y','hidden');
  });

  $('.modal').on('hidden.bs.modal',function(){
		$('body').css('padding-right','0px');
		$('body,html').css('overflow-y','auto');
  });

  if(localStorage.getItem("con_shop")=='true'){
    /*$('#productos').fadeOut();
    $('#productosnew').fadeIn();*/
    document.getElementById('productos').style.display='none';
    document.getElementById('productosnew').style.display='block';
    document.getElementById('prodprofesionales').style.display='none';
	$('#btn_descuento').attr("class","btn btn-default btn-lg");
	$('#btn_pagar').attr("class","btn btn-default btn-block btn-lg");
	$('#btn_pagar').show();
	$('#spanaction').attr('class','trans_continue');
	$('#btn_gpedidos').hide();
  }else if(localStorage.getItem("con_mesas")=='true'){
			/*if(sessionStorage.getItem("mesa_activa")==""){
			$('#divmesas').show();
  		}*/
		$('#menuSubNew1,#menuSubNew1').css('display','none');
		$('#btn_descuento').attr("class","btn btn-default btn-lg");
		$('#btn_pagar').attr("class","btn btn-success btn-lg btn-block");
		$('#btn_gpedidos').attr("class","btn btn-success btn-lg trans_save btn-block");
		if($('#listaProductos').html()!=''){
			$('#divmesas').show();
			$("#menuSubNew1,#menuSubNew2").css("display","none");
		}
  		$('#btn_mesas').show();
  		$('#btn_pagar').hide();
		$('#spanaction').attr('class','trans_pay');
		CargarMesas();

		/**/
		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
		db.transaction(function(tx1){
			tx1.executeSql("SELECT count(*) as cuantos from PRODUCTOS where estado=1 and id_local!=-1",[],function(tx1,results1){
				console.log(results1);
				if(results1.rows.length>0){
					if(results1.rows.item(0)!=null){
						if(results1.rows.item(0).cuantos>0)
							$('#divmesas').show();
							$('#menuSubNew1,#menuSubNew2').css('display','none');

						}
					}
			});
		},errorCB,successCB);

  }else{
    /*$('#productosnew').fadeOut();
    $('#productos').fadeIn();*/
    document.getElementById('productosnew').style.display='none';
    document.getElementById('prodprofesionales').style.display='none';
    document.getElementById('productos').style.display='block';
	$('#btn_descuento').attr("class","btn btn-default btn-lg");
	$('#btn_pagar').attr("class","btn btn-default btn-block btn-lg");
	$('#btn_gpedidos').attr("class","btn btn-success trans_save btn-block");
	$('#btn_pagar').show();
	$('#btn_gpedidos').hide();
	$('#spanaction').attr('class','trans_continue');

  }

	if(localStorage.getItem("propina")=='false'){
		$('#invoiceprop').css("display","none");
		$('#labelprop').css("display","none");
	}


	var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
	db.transaction(function(tx){
		tx.executeSql('SELECT * FROM IMPUESTOS',[],function(tx,results){
			for(var r=0;r<results.rows.length;r++){
				var itemi=results.rows.item(r);
				if($.trim(itemi.nombre.toLowerCase())=='iva')
					$('#idiva').html(itemi.timespan);
				if($.trim(itemi.nombre.toLowerCase())=='servicio')
					$('#idservicio').html(itemi.timespan);
				
				if($('#impuesto-'+itemi.timespan).length==0){
				    //alert('<input id="impuesto-'+itemi.timespan+'" type="text" value="'+itemi.timespan+"|"+itemi.nombre+"|"+parseFloat((itemi.porcentaje)/100)+'">');
					$('#taxes').append('<input id="impuesto-'+itemi.timespan+'" type="text" value="'+itemi.timespan+"|"+itemi.nombre+"|"+parseFloat((itemi.porcentaje)/100)+'">');
				}else{
					$("impuesto-"+itemi.timespan).val(itemi.timespan+"|"+itemi.nombre+"|"+parseFloat((itemi.porcentaje)/100))
				}
			}
		});


		tx.executeSql('SELECT printercom,printer FROM CONFIG where id=1',[],
			function(tx,res){
				if(res.rows.length>0){
					var miprint=res.rows.item(0);
					localStorage.setItem("print",miprint.printer);
					localStorage.setItem("printc",miprint.printercom);

				}
		});
	},errorCB,successCB);

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

	//idioma

	if($(window).width()>900){
			Init31();
		}
		else{
			Init3();
		}
    botonesCalculadora();
	ColocarFormasPago();
	if(localStorage.getItem("diseno")==0||localStorage.getItem("diseno")==null||localStorage.getItem("diseno")==""){
		formarCategorias();
	}else{
		formarCategoriasMenu();
	}

    $('.numero').on('click',function(){ClickNumero($(this));});
	$('.numeroc').on('click',function(){ClickNumeroC($(this));});
	$('.numerod').on('click',function(){ClickNumeroD($(this));});
	$('.numerom').on('click',function(){ClickNumeroM($(this));});
    $('.numerocnew').on('click',function(){ClickNumeroCnew($(this));});
	vertarjetas();
}

	function saberProducto(id , currentCantidad){

			var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
			db.transaction(function(tx){
				tx.executeSql('SELECT COUNT(codigo) as cuantos FROM PRODUCTOS WHERE codigo='+id+';',[],function(tx,res){
					var existen=res.rows.item(0).cuantos;
					if(existen==0){
						alert('no existe ese producto');
						$('.cantidad').html('0.00');
					}else{
						$('.cantidad').html('0.00');
						//alert('hola')
						tx.executeSql('SELECT * FROM PRODUCTOS WHERE codigo='+id+';',[],function(tx,result){
							//alert(result);
							for (var i=0; i <= result.rows.length-1; i++){
								var row = result.rows.item(i);
								var productoNombre = row.formulado;
								var productoCantidad = 1;
								var cargaiva = row.cargaiva;
								var productoImpuestosIndexes = cargaiva;
								if(cargaiva == 1){
									var productoImpuestos = 0.12;
								}
								else{
									var productoImpuestos = 0;
								}
								var productoPrecio = row.precio;
								var total = ((parseFloat(productoPrecio) * parseFloat(productoImpuestos))+parseFloat(productoPrecio));
								console.log(productoPrecio);
								var productoID = row.id_local;
								//console.log(formulado);
								var taxTotal = 1;
								var sumTotal;
								 $('.cantidad').html('0.00')
									$("#createHereCustomProduct").html('\
										<div id="elProductoCustom" style="display:none;background-color:null; border:1px solid null" id="-1" data-precio="'+total+'" data-impuestos="" data-impuestosindexes="" data-id_local="'+row.id_local+'"  data-formulado="'+productoNombre+'" onclick="agregarCompra(this); return false;" class="producto btn btn-lg btn-primary categoria_producto_-1">'+productoNombre+'</div>\
										<script>$("#elProductoCustom").click();</script>\
									');
									//currentCantidad = 0;
							}
						},errorCB,successCB);

					}
				},errorCB,successCB);
			});
	}

	function BuscarSugerencias2(filtro,e){

		var buscar = $('#inputbusc').val();
		//alert(buscar);

		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
		db.transaction(function(tx){
			tx.executeSql("SELECT * FROM PRODUCTOS WHERE formulado like '%"+buscar+"%' and productofinal=1 and estado=1",[],function(tx,results){
				//console.log(results);
				if(results.rows.length>0){
					var res1=new Object();
					for(var n=0;n<results.rows.length;n++){
						var itemr=results.rows.item(n);
						//console.log(itemr);
						var productodata=new Object();
						productodata.id_local=itemr.id_local;
						productodata.formulado=itemr.formulado;
						productodata.codigo=itemr.codigo;
						productodata.precio=itemr.precio;
						productodata.id=itemr.timespan;
						productodata.categoria=itemr.categoriaid;
                        var impuestos='';
    					var impuestosid='';
    					if(itemr.tieneimpuestos=="true"){
    						impuestos=$('#impuestosactivos').html();
    						impuestosid=$('#impuestosactivosid').html();
    					}

                        productodata.formulado_impuestos=impuestos;
  						productodata.formulado_tax_id=impuestosid;
                  		res1[n]=productodata;

					}
					/*var productodata=new Array();
					productodata.formulado = results.rows.item(0);
					var id = row.id*/
                    $('#jsonproductos').html(JSON.stringify(res1));
					//console.log(res1);

				}
			},errorCB,successCB);
		});
			if(filtro!=''){
				$('#resultBuscador').fadeIn('slow');
				$('#tableresults').html('');
				var jsonf = $('#jsonproductos').html().toString();
				//console.log(jsonf);
				var mijson = JSON.parse(jsonf);
				//console.log(mijson);
				for(var j in mijson){
					var item = mijson[j];
					var suger='';
					var lineaextra='';
					if(item.formulado.toLowerCase().indexOf(filtro.toLowerCase())>-1){
						suger=item.formulado;
						lineaextra=item.codigo;
					}
					else if(item.codigo.toLowerCase().indexOf(filtro.toLowerCase())>-1){
						 suger=item.codigo;
						 lineaextra=item.formulado;
					}

					if(suger!='')
					{
						if(document.getElementById('tableresults').rows.length<4){
						$('#tableresults').append("<tr id='busc_"+ item.id +"' data-id_local = '"+item.id_local+"' data-precio='"+ item.precio +"' data-impuestos='"+ item.formulado_impuestos +"' data-impuestosindexes='"+ item.formulado_tax_id +"' data-formulado='"+ item.formulado+"'><td class='sugerencia' enfocada='0'><div id='busc_"+ item.id +"' data-precio='"+ item.precio +"' data-impuestos='"+ item.formulado_impuestos +"' data-impuestosindexes='"+ item.formulado_tax_id +"' data-formulado='"+ item.formulado+"' data-id_local = '"+item.id_local+"' onclick='VerificarAgregados(this,2)'>"+(suger+"-"+lineaextra).toUpperCase()+"</div></td></tr>");
						}
					}

				}
				/*if(document.getElementById('tableresults').rows[0]!=null){
					AclararSugerencia(document.getElementById('tableresults').rows[0].cells[0],true);
				}*/
			}
		/*}*/
	}

function BuscarSugerencias2new(filtro,e){

		var buscar = $('#inputbuscnew').val();
		//alert(buscar);

		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
		db.transaction(function(tx){
			tx.executeSql("SELECT * FROM PRODUCTOS WHERE (formulado like '%"+buscar+"%' or codigo like '%"+buscar+"%') and productofinal=1 and estado=1",[],function(tx,results){
				//alert(results.rows.length);
				if(results.rows.length>0){
					var res1=new Object();
					for(var n=0;n<results.rows.length;n++){
						var itemr=results.rows.item(n);
						//console.log(itemr);
						var productodata=new Object();
						productodata.id_local=itemr.id_local;
						productodata.formulado=itemr.formulado;
						productodata.codigo=itemr.codigo;
						productodata.precio=itemr.precio;
						productodata.id=itemr.timespan;
						productodata.categoria=itemr.categoriaid;
						var impuestos='';
    					var impuestosid='';
    					if(itemr.tieneimpuestos=="true"){
    						impuestos=$('#impuestosactivos').html();
    						impuestosid=$('#impuestosactivosid').html();
    					}

                        productodata.formulado_impuestos=impuestos;
  						productodata.formulado_tax_id=impuestosid;
						res1[n]=productodata;
					}
					/*var productodata=new Array();
					productodata.formulado = results.rows.item(0);
					var id = row.id*/
					$('#jsonproductos').html(JSON.stringify(res1));
					//console.log(res1);

				}
			},errorCB,successCB);
		});
			if(filtro!=''){
				$('#resultBuscadornew').fadeIn('slow');
				$('#tableresultsnew').html('');
				var jsonf = $('#jsonproductos').html().toString();
				console.log(jsonf);
                if(jsonf != ''){
    				var mijson = JSON.parse(jsonf);
    				console.log(mijson);
                    var contaaux = 0;
    				for(var j in mijson){
    					var item = mijson[j];
    					var suger='';
    					if(item.formulado.toLowerCase().indexOf(filtro.toLowerCase())>-1)
    						suger=item.formulado;
    					else if(item.codigo.toLowerCase().indexOf(filtro.toLowerCase())>-1)
    						suger=item.codigo;

    					if(suger!=''){
    					  contaaux++;
    					  if(contaaux > 1){
    						if(document.getElementById('tableresultsnew').rows.length<4){
    						    $('#tableresultsnew').append("<tr id='busc_"+ item.id +"' data-id_local = '"+item.id_local+"' data-precio='"+ item.precio +"' data-impuestos='"+ item.formulado_impuestos +"' data-impuestosindexes='"+ item.formulado_tax_id +"' data-formulado='"+ item.formulado+"'><td class='sugerencia' enfocada='0'><div id='busc_"+ item.id +"' data-precio='"+ item.precio +"' data-impuestos='"+ item.formulado_impuestos +"' data-impuestosindexes='"+ item.formulado_tax_id +"' data-formulado='"+ item.formulado+"' data-id_local = '"+item.id_local+"' onclick='VerificarAgregadosnew(this,2)'>"+suger.toUpperCase()+"</div></td></tr>");
    						}
                          }else{
                            if(buscar == suger){
                              //alert(buscar+'**'+suger);
                                if(document.getElementById('tableresultsnew').rows.length<4){
        						    $('#tableresultsnew').append("<tr id='busc_"+ item.id +"' data-id_local = '"+item.id_local+"' data-precio='"+ item.precio +"' data-impuestos='"+ item.formulado_impuestos +"' data-impuestosindexes='"+ item.formulado_tax_id +"' data-formulado='"+ item.formulado+"'><td class='sugerencia' enfocada='0'><div id='busc_"+ item.id +"' data-precio='"+ item.precio +"' data-impuestos='"+ item.formulado_impuestos +"' data-impuestosindexes='"+ item.formulado_tax_id +"' data-formulado='"+ item.formulado+"' data-id_local = '"+item.id_local+"'>"+suger.toUpperCase()+"</div></td></tr>");
        						}
                            }else{
                                if(document.getElementById('tableresultsnew').rows.length<4){
        						    $('#tableresultsnew').append("<tr id='busc_"+ item.id +"' data-id_local = '"+item.id_local+"' data-precio='"+ item.precio +"' data-impuestos='"+ item.formulado_impuestos +"' data-impuestosindexes='"+ item.formulado_tax_id +"' data-formulado='"+ item.formulado+"'><td class='sugerencia' enfocada='0'><div id='busc_"+ item.id +"' data-precio='"+ item.precio +"' data-impuestos='"+ item.formulado_impuestos +"' data-impuestosindexes='"+ item.formulado_tax_id +"' data-formulado='"+ item.formulado+"' data-id_local = '"+item.id_local+"' onclick='VerificarAgregadosnew(this,2)'>"+suger.toUpperCase()+"</div></td></tr>");
        						}
                            }
                          }

    					}

    				}
                }
			}
	}


function subirefectivo(boton){

	$('#paymentEfectivo').val('0.00');
	var valor=$(boton).attr('data-value');
	//console.log(valor);
	valor=parseFloat(valor);
	var cuantohay=0;
	if($('#paymentEfectivo').val()=='')
		cuantohay=0;
	else
		cuantohay=parseFloat($('#paymentEfectivo').val());

	var newvalor=0;
	if(valor>0)
		newvalor=valor+cuantohay;
	else{
		if(valor==-0)
			newvalor=0;
		else
			newvalor=-1*valor;
	}
	console.log(newvalor);
	$('#paymentEfectivo').val(newvalor.toFixed(2));
	$('#paymentEfectivo').change();
}

function vertarjetas(){
	var tarjetas=$('#jsontarjetas').html();
	var evalJson=JSON.parse(tarjetas);
	//console.log(evalJson);
	for(var k in evalJson){
		var x = 1;
		var mihtml='';
		for(var j in evalJson[k]){
			var dat=evalJson[k][j];
			var iconcard='fa-credit-card';
			if(dat.nombre=='Visa')
				iconcard='fa-cc-visa';
			else if(dat.nombre=='Mastercard')
				iconcard='fa-cc-mastercard';
			else if(dat.nombre=='Discover')
				iconcard='fa-cc-discover';
			else if(dat.nombre=='Diners')
				iconcard='fa-cc-diners-club';
			else if(dat.nombre=='Amex')
				iconcard='fa-cc-amex';
			//var div='<div class="col-xs-3"><button data-value="0.00" type="button" class="btn btn-primary btn-lg card" id="card_'+dat.id+'" data-id="'+dat.id+'" onclick="elegirTarjeta('+dat.id+');"><span>'+dat.nombre+'</span><span style="position:absolute; right:5px; top:3px; font-size:10px;" class="cardv" id="cardv_'+dat.id+'"></span></button></div>';
			var div='<button style="float:left; margin:5px; position:relative;" data-value="0.00" type="button" class="btn btn-primary btn-lg card" id="card_'+dat.id+'" data-id="'+dat.id+'" onclick="elegirTarjeta('+dat.id+');"><span class="fa '+iconcard+' fa-3x"></span><span style="position:absolute; right:5px; top:3px; font-size:10px;" class="cardv" id="cardv_'+dat.id+'"></span></button>';
			$('#lastarjetas').append(div);
			x++;
		}
		
	}
	//opcion para bwise
		/*var celdatar=$('#caretTarjetas').parent().parent();
		var div=$('#caretTarjetas').parent();
		//alert("entrabwise");
		//console.log($(celdatar));
		div.css("width","80%");
		celdatar.append("<button class='btn btn-success' type='button'>PAGAR CON BWISE</button>");*/
}

function elegirTarjeta(id){

	if(pagonormal){
		$('.cardv').html('');
		$('.card').attr("data-value","0");
		$('#paymentTarjetas').val("0");
	}

	var clase=$('.card').attr('class');
	clase=clase.replace('btn-success','btn-primary');
	$('.card').attr('class',clase);
	clase=clase.replace('btn-primary','btn-success');
	$('#card_'+id).attr('class',clase);

	if($('#cardv_'+id).html()!=''){
		$('#cardv_'+id).html('');
		$('#card_'+id).attr('data-value','0');
		var clase=$('#card_'+id).attr('class');
		clase=clase.replace('btn-success','btn-primary');
		$('#card_'+id).attr('class',clase);
		$('#cardgroup').css("display","none");
	}


	var suma=0;
	$('.card').each(function(){
		if($(this).attr('id')!='card_'+id)
			suma+=parseFloat($(this).attr('data-value'));
	});

	console.log('antes'+suma);
	var valorfalta=0;
	//var pagado=parseFloat($('#invoicePaid').html());
	var pagado=0;
	$('.paymentMethods').each(function(){
		if($(this).val()!='')
			pagado+=parseFloat($(this).val());
	});

	var mitot=parseFloat($('#invoiceTotal').html());
	console.log("falta:"+(mitot-pagado));
	if((mitot-pagado)<0)
		valorfalta=0;
	else
		valorfalta=mitot-pagado;

	console.log("falta:"+mitot+'/'+pagado+'/'+valorfalta);
	if(valorfalta>0){
		$('#valortarjeta').val(valorfalta.toFixed(2));
		$('#card_'+id).attr('data-value',valorfalta.toFixed(2));
	}else{
		$('#valortarjeta').val("0.00");
		$('#card_'+id).attr('data-value',"0");
	}

	//alert("hola");
	/*$('#valortarjeta').val(parseFloat($('#card_'+id).attr('data-value')).toFixed(2));*/

	if($('#cardv_'+id).html()==''){
		if(parseFloat($('#valortarjeta').val())>0){
			$('#cardv_'+id).html(' ('+$('#valortarjeta').val()+')');
			$('#cardgroup').fadeIn();
		}
		else
			$('#cardv_'+id).html('');
	}


	var suma=0;
	$('.card').each(function(){
		suma+=parseFloat($(this).attr('data-value'));
	});

	$('#paymentTarjetas').val((suma).toFixed(2));
	$('#simple_2').html((suma).toFixed(2));
	changePaymentCategory('2','Tarjetas');

    if(localStorage.getItem("con_tarjeta")=='true'){
     // $('#valortarjeta').prop("readonly",true);
      $('#payButton').fadeOut("fast");
      pagotarjeta();
    }else{
		
      //$('#valortarjeta').prop("readonly",false);
      //$('#payButton').fadeIn("fast");
      $('#order_id').val('');
    }

}

function valorcardchange(){
	$('.card').each(function(){
		if($(this).hasClass('btn-success')){
			var elid=$(this).attr('data-id');
			if(parseFloat($('#valortarjeta').val())>0){
				$('#card_'+elid).attr('data-value',$('#valortarjeta').val());
				$('#cardv_'+elid).html(' ('+$('#valortarjeta').val()+')');
			}
			else{
				$('#cardv_'+elid).html('');
				$('#card_'+elid).attr('data-value','0');
			}
		}
	});
	var suma=0;
	$('.card').each(function(){
		suma+=parseFloat($(this).attr('data-value'));
	});
	$('#paymentTarjetas').val(suma.toFixed(2));
	changePaymentCategory('2','Tarjetas');
}

function valorchequechange(){
	//console.log('Anachwque');
	var suma=0;
	$('.cheque').each(function(){
		//console.log("Ana"+$(this).val());
		if($(this).val()!=null)
			suma+=parseFloat($(this).val());
	});
	console.log(suma);
	$('#paymentCheques').val(suma.toFixed(2));
	changePaymentCategory('3','Cheques');
}

function valorcxcchange(){
	var valorcxc=parseFloat($('#valorcxc').val());
	if(valorcxc>0){
		$('#paymentCxC').val(valorcxc.toFixed(2));
	}else
		$('#paymentCxC').val(0);

	changePaymentCategory('4','CxC');
}

function valorConsumoIchange(){
	var valorconsumoi=parseFloat($('#valorConsumoI').val());
	if(valorconsumoi>0){
		$('#paymentConsumoI').val(valorconsumoi.toFixed(2));
	}else
		$('#paymentConsumoI').val(0);
	changePaymentCategory('5','ConsumoI');
}

function toogleCalc(){
	$('#pad,#grid').toggle();
	$('#menuproductos,#numpad').toggle('fast');
}

function ResetPagos(cual){
	if(cual==1){
		$('#paymentEfectivo').val('0.00');
		//$('#paymentEfectivo').change();
		//CambiarMetodo('Efectivo');
	}else if(cual==2){
		//console.log('anacard');
		$('.cardv').html('');
		$('.card').attr('data-value','0');
		$('#valortarjeta,#paymentTarjetas').val('0.00');
		//valorcardchange();
	}else if(cual==3){
		$('#valorcheque1,#paymentCheques').val('0.00');
		//valorchequechange();
	}else if(cual==4){
		$('#valorcxc,#paymentCxC').val('0.00');
		//valorcxcchange();
	}else if(cual==5){
		$('#valorConsumoI,#paymentConsumoI').val('0.00');
		//valorcxcchange();
	}

	var pagado=0;
	$('.paymentMethods').each(function(){
		if($(this).val()!=''){
			pagado+=parseFloat($(this).val());
		}
		$('#'+$(this).attr('id')+'a').html('$ '+$(this).val());
	});

	console.log(pagado);

	var mitot=parseFloat($('#invoiceTotal').html());
	$('#invoicePaid').html(pagado.toFixed(2));

	var falta=mitot-pagado;

	if((mitot-pagado)>0){
		$('#invoiceDebt').html("FALTANTE");
		if(localStorage.getItem("idioma")==2)
			$('#invoiceDebt').html("TO PAY");
		$('#changeFromPurchase').html(Math.abs(falta).toFixed(2));
	}else if((mitot-pagado)==0){
		$('#invoiceDebt').html("VUELTO");
		if(localStorage.getItem("idioma")==2)
			$('#invoiceDebt').html("CHANGE");
		$('#changeFromPurchase').html("0.00");
	}else{
		$('#invoiceDebt').html("VUELTO");
		if(localStorage.getItem("idioma")==2)
			$('#invoiceDebt').html("CHANGE");
		$('#changeFromPurchase').html(Math.abs(falta).toFixed(2));
	}
}


function VerificarNumero(valor){
	//alert(valor);

    if(localStorage.getItem("con_localhost") == 'true'){
    var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
    db.transaction(function (tx){
     var apiURL='http://'+localStorage.getItem("ip_servidor")+'/connectnubepos/api2.php';
     var numfact = $('#invoiceNr').val();
     $.post(apiURL,{
		id_emp : localStorage.getItem("empresa"),
		action : 'VerificarNumeroFactura',
		id_barra : localStorage.getItem("idbarra"),
		deviceid:$("#deviceid").html(),
        numfact : numfact
		}).done(function(response){
			if(response!='block' && response!='Desactivado'){
				console.log(response);
                var res = response.split("||");
                if(res[0]=='si'){
                  showalert("Ya existe una factura con ese número.");
                  $('#invoiceNr').val(res[1]);
                  $('#invoiceNr').effect('highlight',{},'normal');
                    db.transaction(function (tx2){
					tx2.executeSql('SELECT serie,establecimiento from config where id=1',[],function(tx2,results){
							var miserie=results.rows.item(0).serie;
							var miestablecimiento=results.rows.item(0).establecimiento;
							var invoicenr=$('#invoiceNr').val();
							$('#invoiceNrComplete').val(miestablecimiento+'-'+miserie+'-'+invoicenr);
						});
					});
                }else{
                  //$('#invoiceNr').val(res[1]);
                  $('#invoiceNr').effect('highlight',{},'normal');
					db.transaction(function (tx2){
					tx2.executeSql('SELECT serie,establecimiento from config where id=1',[],function(tx2,results){
							var miserie=results.rows.item(0).serie;
							var miestablecimiento=results.rows.item(0).establecimiento;
							var invoicenr=$('#invoiceNr').val();
							$('#invoiceNrComplete').val(miestablecimiento+'-'+miserie+'-'+invoicenr);
						});
					});
                }

			}else if(response=='Desactivado'){
			    envia('config');
				setTimeout(function(){
					$('.navbar,#barraalternamovil').slideUp();
					$("#demoGratis,#fadeRow,#finalizado,#contentStepSincro,#cuentaactiva").css("display","none");
					$('#desactivo').fadeIn();
				},100);
			}else{
				envia('config');
				setTimeout(function(){
					$('#linklogin,#linkloginb').attr("href","https://www.practisis.net/index3.php?rvpas="+localStorage.getItem("userPasswod")+"&rvus="+localStorage.getItem("userRegister"));
					$('.navbar,#barraalternamovil').slideUp();
					$("#demoGratis,#fadeRow,#finalizado,#contentStepSincro,#cuentaactiva").css("display","none");
					$('#bloqueo').fadeIn();
				},100);

			}

		}).fail(function(){
			updateOnlineStatus("OFFLINE");
			setTimeout(function(){SincronizadorNormal()},180000);
		});
     });
    }else{
    //********************************inicio normal***************************************
	var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
	var existe=false;
	var serie='001';
	var establecimiento='001';
	db.transaction(function (tx){
			tx.executeSql('SELECT id from FACTURAS where CAST(aux as integer) = CAST(? as integer)',[valor],
			function(tx,res){
				if(res.rows.length>0){
					console.log(res);
					showalert("Ya existe una factura con ese número.");
					db.transaction(function (tx2){
						tx2.executeSql('SELECT MAX(CAST(aux as integer))+1 as max FROM FACTURAS',[],
						function(tx2,res2){
							var ceros='';
							var coun=0;
							var nfact='1';
							if(res2.rows.length>0){
								coun=res2.rows.item(0).max.toString().length;
								nfact=res2.rows.item(0).max.toString();
							}

							var ceroscount=0;
							while(ceroscount<(9-coun)){
								ceros+='0';
								ceroscount++;
							}
							console.log(ceros);
							$('#invoiceNr').val(ceros+nfact);
							$('#invoiceNr').effect('highlight',{},'normal');
						});

						tx2.executeSql('SELECT serie,establecimiento from config where id=1',[],function(tx2,results){
							var miserie=results.rows.item(0).serie;
							var miestablecimiento=results.rows.item(0).establecimiento;
							var invoicenr=$('#invoiceNr').val();
							$('#invoiceNrComplete').val(miestablecimiento+'-'+miserie+'-'+invoicenr);
						});
					});
				}else{
//console.log('admitido');
					
					var invoicenr=$('#invoiceNr').val();
					localStorage.setItem('ultimafact',invoicenr);
					if(parseInt(localStorage.getItem('ultimafact'))>valor){
						invoicenr=parseInt(parseInt(localStorage.getItem('ultimafact')))+1;
					}
					$('#invoiceNr').effect('highlight',{},'normal');
					db.transaction(function (tx2){
					tx2.executeSql('SELECT serie,establecimiento from config where id=1',[],function(tx2,results){
							var miserie=results.rows.item(0).serie;
							var miestablecimiento=results.rows.item(0).establecimiento;

							var ceros='';
							var coun=invoicenr.toString().length;
							var ceroscount=0;
							while(ceroscount<(9-coun)){
								ceros+='0';
								ceroscount++;
							}
							console.log(ceros);
							invoicenr=ceros.toString()+invoicenr.toString();
							$('#invoiceNr').val(invoicenr);
							localStorage.setItem('ultimafact',invoicenr);
							$('#invoiceNrComplete').val(miestablecimiento+'-'+miserie+'-'+invoicenr);
						});
					});
				}
			});
	},errorCB,successCB);
    //************************************fin normal**************************************
    }
}

function formarCategoriasMenu(){
	var selected = '';
	var categoriaSelected = 0;
	var objcategoria='';
	var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
	db.transaction(function (tx){
		tx.executeSql('SELECT * from MENU_CATEGORIAS where activo="true" order by orden',[],
		function(tx,res){
			if(res.rows.length>0){
				for(m=0;m<res.rows.length;m++){
					selected = 'categoria';
					var row=res.rows.item(m);
					if(m==0){
						selected = 'categoriaActiva';
						categoriaSelected = row.timespan;
					}
					console.log("idcmenu:"+row.timespan);
					$('#listacat').append('<li id="categoria_'+ row.timespan +'" class="esCategoria '+ selected +'" onclick="ActivarCategoriaMenu(this,'+"'"+ row.timespan +"'"+'); PlaySound(5);"><a>'+ (row.nombre).substring(0,20) +'</a></li>');
				}
				objcategoria=$('#categoria_'+categoriaSelected)[0];
				console.log(objcategoria);
				ActivarCategoriaMenu(objcategoria,categoriaSelected);
			}else{
				$("#menuproductos").html("<b>No se ha diseñado el menú todavía.</b>");
			}
		});
	},errorCB,successCB);
}

function ActivarCategoriaMenu(cual,categoria){
	//alert(categoria);
	$('#category').val(categoria);
	$('#controller').val(1);
	$('.directionProducts').css('display','none');
	$('#listaProductos').html('');
	$('#pager').val('1');
	var fila=cual.parentNode.parentNode;
	var miscateg=fila.getElementsByTagName('li');
	//var tam='btn-lg';
	for(k=0;k<miscateg.length;k++){
		/*tam='btn-lg';
		if($(miscateg[k].hasClass( "btn-xs" )))
			tam='btn-xs';*/
		if(miscateg[k].id!='listaCategorias' && miscateg[k].id!='contenidoCategorias')
			miscateg[k].className="categoria esCategoria ";
	}
	cual.className="categoriaActiva esCategoria active";
	var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
	db.transaction(
	function (tx){

		/*impuestos activos */
		tx.executeSql("SELECT * FROM IMPUESTOS WHERE activo=? group by upper(nombre) order by id",["true"],function(tx,results3){
							console.log(results3);
							var impuestos='';
							var impuestosid='';
							if(results3.rows.length>0){
								console.log("encuentra impuestos");
								var cuan=0;
								for(var r=0;r<results3.rows.length;r++){
									var imp=results3.rows.item(r);
										if(cuan>0){
											impuestos+="@";
											impuestosid+="@";
										}
									impuestos+=parseFloat(imp.porcentaje)/100;
									impuestosid+=imp.timespan;
									cuan++;
								}
								console.log(impuestos+'/'+impuestosid);
								$('#impuestosactivos').html(impuestos);
								$('#impuestosactivosid').html(impuestosid);
								}
		});
		/**/

		tx.executeSql("SELECT MAX(fila) as max from menu where activo='true'",[],function(tx,res1){
			var maxfilas=0;
			if(res1.rows.length>0){
				if(res1.rows.item(0).max!=null&&res1.rows.item(0).max>0){
					maxfilas=res1.rows.item(0).max;
					for(var r=1;r<=maxfilas;r++){

                        tx.executeSql('SELECT p.*, m.idcatmenu as idc,m.timespan as mtimespan,m.columna as col,m.fila as fila,m.cant_max FROM PRODUCTOS p, MENU m WHERE m.idproducto=p.timespan and m.idcatmenu="'+categoria+'" and activo="true" and fila='+r+' ORDER BY m.columna asc',[],function(tx,res){
							console.log(res);
							if(res.rows.length>0){
								//alert('prods');
								var t=1;
                            var vectorpos=['<div style="background-color:white; border:1px solid white; border-radius:0px;" class="producto btn btn-lg btn-primary categoria_producto_'+categoria+'"></div>','<div style="background-color:white; border:1px solid white; border-radius:0px;" class="producto btn btn-lg btn-primary categoria_producto_'+categoria+'"></div>','<div style="background-color:white; border:1px solid white; border-radius:0px;" class="producto btn btn-lg btn-primary categoria_producto_'+categoria+'"></div>'];
							var todos=res.rows.length;
								for(m=0;m<res.rows.length;m++){
									var row=res.rows.item(m);
									if(isNaN(row.precio)){row.precio = 0;}
									var impuestos='';
									var impuestosid='';
									if(row.tieneimpuestos=="true"){
										impuestos=$('#impuestosactivos').html();
										impuestosid=$('#impuestosactivosid').html();
									}
									var lineHeight='';
									if(row.formulado.length>12)
										lineHeight='line-height:18px;';

                                    if(localStorage.getItem("con_localhost") == 'true'){
                                      vectorpos[row.col-1]='<div style="background-color:'+row.color+'; border:1px solid '+row.color+'; '+lineHeight+' text-transform:capitalize; " id="'+ row.mtimespan+'" data-precio="'+ row.precio +'" data-impuestos="'+impuestos +'" data-impuestosindexes="'+impuestosid +'" data-id_local = "'+row.id_local+'" data-formulado="'+ row.formulado +'" data-cant_max="'+ row.cant_max +'" onclick="VerificarAgregados(this); return false;" ontap="VerificarAgregados(this); return false;" class="producto btn btn-lg btn-primary categoria_producto_'+row.idc +'">'+ row.formulado +'</div>';
                                    }else{
                                      vectorpos[row.col-1]='<div style="background-color:'+row.color+'; border:1px solid '+row.color+'; '+lineHeight+' text-transform:capitalize; " id="'+ row.timespan+'" data-precio="'+ row.precio +'" data-impuestos="'+impuestos +'" data-impuestosindexes="'+impuestosid +'" data-id_local = "'+row.id_local+'" data-formulado="'+ row.formulado +'" onclick="VerificarAgregados(this); return false;" ontap="VerificarAgregados(this); return false;" class="producto btn btn-lg btn-primary categoria_producto_'+row.idc +'">'+ row.formulado +'</div>';
                                    }

								}
								for(var s=0;s<=vectorpos.length;s++){
									$('#listaProductos').append(vectorpos[s]);
								}
								//$('.producto').hide();
								//init2(categoria);
							}else{
								var agregar='<div style="background-color:white; border:1px solid white; border-radius:0px;" class="producto btn btn-lg btn-primary categoria_producto_'+categoria+'"></div><div style="background-color:white; border:1px solid white; border-radius:0px;" class="producto btn btn-lg btn-primary categoria_producto_'+categoria+'"></div><div style="background-color:white; border:1px solid white; border-radius:0px;" class="producto btn btn-lg btn-primary categoria_producto_'+categoria+'"></div>';
								$('#listaProductos').append(agregar);
							}
							if($(window).width()>900){
									Init31();
								}
								else{
									Init3();
								}

							//$('#listaProductos').fadeIn();
							$('#listaProductos').css("display","");
							//para mostrar productos por pagina
							showProducts(categoria);
						});
					}
				}
			}
		});
	},errorCB,successCB);
	$('.producto').hide();

	var maxw=0;
	$('#listacat li').each(function(){
		//alert(parseFloat($(this).css("height")));
		if(parseFloat($(this).css("height"))>maxw)
			maxw=parseFloat($(this).css("height"));
	});
	$('#listacat li').css("height",maxw);
	$('#listacat li a').css("height",maxw);

	//$('.categoria_producto_'+ categoria).show();
	if($(window).width()>900){
			Init31();
		}
		else{
			Init3();
		}
	showProducts(categoria);
}

function PagoAvanzado(){
	pagonormal=false;
	//$('.simple').css('display','none');
	//$('.columna2').fadeIn();
	$('#licheques,#licxc,#lisimple,#liConsumoI').css('display','block');
	$('#pagoavan').css('display','none');
	$('.basurero,.badge,.cuadrototal,#payButton,.touchpago').fadeIn();
	//$('.basurero,.badge,.cuadrototal,#payButton,.touchpago').css('display','');
	$('.paymentMethods').val('0.00');
	$('#valortarjeta,#valorcheque1,#valorcxc,#valorConsumoI').val('0.00');
	$('.card').attr("data-value","0");
	$('.cardv').html("");
	$('.categoryChosen').click();

	$('.columna1 div').each(function(){
		$(this).attr('class','paymentCategories');
		$(this).css('backgroundColor','');
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

var mitades=false;
var contadormitades=0;
function VerificarAgregados(btnprod,origen){
  mitades=false;
  var mitimespan=$(btnprod).attr("id");
	if(mitimespan.indexOf('busc_')>=0)
		mitimespan=mitimespan.substring(5);
  //alert(mitimespan+'**'+origen);

  if(localStorage.getItem("con_localhost") == 'true'){
       var apiURL='http://'+localStorage.getItem("ip_servidor")+'/connectnubepos/api2.php';
       $.post(apiURL,{
  		id_emp : localStorage.getItem("empresa"),
  		action : 'MenuPeticion',
  		id_barra : localStorage.getItem("idbarra"),
  		deviceid:$("#deviceid").html(),
        timespanmenu : mitimespan
  		}).done(function(response){
  			if(response!='block' && response!='Desactivado'){
  				console.log(response);
                  //var res = response.split("||");

                    var y = JSON.parse(response);
            		var mods= new Array();
            		if (y.length>0){
            		  var cant_max = $(btnprod).attr("data-cant_max");
                      var cant_max_aux = parseInt($(btnprod).attr("data-cant_max"));

            			if(localStorage.getItem("idioma")==1)
            				$('#titlemodificador').html("Modificadores de "+$(btnprod).attr("data-formulado"));
            			else
            				$('#titlemodificador').html("Aggregates of "+$(btnprod).attr("data-formulado"));
            			$('#id_formulado_modificadores').val(mitimespan);
            			for(var m=0;m<y.length;m++){
            				var miobj=y[m];
            				var objmod=miobj.num_modificador;
            				if(!('"'+objmod+'"' in mods))
            					mods['"'+objmod+'"']= new Array();
            				mods['"'+objmod+'"'].push("<button style='margin:3px;' class='btn btn-primary btn-lg' id='btnmodif_"+miobj.id+"' data-valor='"+miobj.valor+"' data-time='"+miobj.id+"'  onclick='SiguienteModificador("+objmod+","+miobj.id+","+origen+");' type='button'>"+miobj.nombre+"</button>");
            			}
            			console.log(mods);
            			var c=1;
            			$('#divmodificadores').html('');
            			for(var s in mods){
            				var display='';
            				if(c>1)
            					display='display:none';

                            if(cant_max_aux > 1){
                              var vercant = 'block';
                            }else{
                              var vercant = 'none';
                            }

                            var inhtml="<div class='grupobotones' id='mod_"+s.replace(/"/g,'')+"' data-orden="+c+" style='margin:5px;"+display+"'>";

                            inhtml+="<div id='version_cantidad' style='display:"+vercant+";'>";
                            inhtml+="<div><div class='row'><div class='col-xs-1'></div><div class='col-xs-4'>Cantidad Faltante: <span id='auxcantreal'>"+cant_max+"</span></div><div class='col-xs-2'></div><div class='col-xs-4'>Cantidad: <span id='auxcant'></span></div><div class='col-xs-1'></div></div></div>";

                            inhtml+="<div'><button type='button' style='margin:3px;' class='btn btn-default btn-sm' onclick='ActivarCant(1);'>1</button>";
                            inhtml+="<button type='button' style='margin:3px;' class='btn btn-default btn-sm' onclick='ActivarCant(2);'>2</button>";
                            inhtml+="<button type='button' style='margin:3px;' class='btn btn-default btn-sm' onclick='ActivarCant(3);'>3</button>";
                            inhtml+="<button type='button' style='margin:3px;' class='btn btn-default btn-sm' onclick='ActivarCant(4);'>4</button>";
                            inhtml+="<button type='button' style='margin:3px;' class='btn btn-default btn-sm' onclick='ActivarCant(5);'>5</button>";
                            inhtml+="<button type='button' style='margin:3px;' class='btn btn-default btn-sm' onclick='ActivarCant(6);'>6</button>";
                            inhtml+="<button type='button' style='margin:3px;' class='btn btn-default btn-sm' onclick='ActivarCant(7);'>7</button>";
                            inhtml+="<button type='button' style='margin:3px;' class='btn btn-default btn-sm' onclick='ActivarCant(8);'>8</button>";
                            inhtml+="<button type='button' style='margin:3px;' class='btn btn-default btn-sm' onclick='ActivarCant(9);'>9</button>";
                            inhtml+="<button type='button' style='margin:3px;' class='btn btn-default btn-sm' onclick='ActivarCant(0);'>0</button>";
                            inhtml+="<button type='button' style='margin:3px;' class='btn btn-danger btn-sm' onclick='BorrarCant();'>X</button></div>";

                            inhtml+="</div>";

        					if(localStorage.getItem("idioma")==1)
        						inhtml+="<div><button id='mid_"+s.replace(/"/g,'')+"' type='button' style='margin:3px;' class='btn btn-default btn-lg' onclick='ActivarMitades("+s.replace(/"/g,'')+");'>Mitad</button>";
        					else if(localStorage.getItem("idioma")==2)
        						inhtml+="<div><button id='mid_"+s.replace(/"/g,'')+"' type='button' style='margin:3px;' class='btn btn-default btn-lg' onclick='ActivarMitades("+s.replace(/"/g,'')+");'>Half</button>";

        					if(localStorage.getItem("idioma")==1)
        						inhtml+="<button id='ninguno' style='margin:3px;' class='btn btn-default btn-lg' type='button' onclick='SiguienteModificador("+s.replace(/"/g,'')+",0,"+origen+");'>Ninguno</button></div>";
        					else if(localStorage.getItem("idioma")==2)
        						inhtml+="<button id='ninguno' style='margin:3px;' class='btn btn-default btn-lg' type='button' onclick='SiguienteModificador("+s.replace(/"/g,'')+",0,"+origen+");'>NONE</button></div>";
        					inhtml+="<hr></hr>";

        					for(var t in mods[s]){
        						inhtml+=mods[s][t];
        					}

        					inhtml+="</div>";

            				$('#divmodificadores').append(inhtml);
            				//$('#btnabajo').html(miboton);
            				c++;
            			}
            			$('#popupModificadores').modal("show");

            			}else{
            				agregarCompraLocal($(btnprod),mitimespan);
            			}

  			}else if(response=='Desactivado'){
  			    envia('config');
  				setTimeout(function(){
  					$('.navbar,#barraalternamovil').slideUp();
  					$("#demoGratis,#fadeRow,#finalizado,#contentStepSincro,#cuentaactiva").css("display","none");
  					$('#desactivo').fadeIn();
  				},100);
  			}else{
  				envia('config');
  				setTimeout(function(){
  					$('#linklogin,#linkloginb').attr("href","https://www.practisis.net/index3.php?rvpas="+localStorage.getItem("userPasswod")+"&rvus="+localStorage.getItem("userRegister"));
  					$('.navbar,#barraalternamovil').slideUp();
  					$("#demoGratis,#fadeRow,#finalizado,#contentStepSincro,#cuentaactiva").css("display","none");
  					$('#bloqueo').fadeIn();
  				},100);

  			}

  		}).fail(function(){
  			updateOnlineStatus("OFFLINE");
  			setTimeout(function(){SincronizadorNormal()},180000);
  		});
      }else{
  //***************************************inicio normal**********************************
	var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
	db.transaction(
	function (tx){
		tx.executeSql('SELECT * from MODIFICADORES WHERE id_formulado LIKE ? and activo=? order by no_modificador asc',[mitimespan,"true"],function(tx,res1){
			var mods= new Array();
			if(res1.rows.length>0){

				if(localStorage.getItem("idioma")==1)
					$('#titlemodificador').html("Modificadores de "+$(btnprod).attr("data-formulado"));
				else
					$('#titlemodificador').html("Aggregates of "+$(btnprod).attr("data-formulado"));

				$('#id_formulado_modificadores').val(mitimespan);
				for(var m=0;m<res1.rows.length;m++){
					var miobj=res1.rows.item(m);
					var objmod=res1.rows.item(m).no_modificador;
					if(!('"'+objmod+'"' in mods))
						mods['"'+objmod+'"']= new Array();

					mods['"'+objmod+'"'].push("<button style='margin:3px;' class='btn btn-primary btn-lg' id='btnmodif_"+miobj.id+"' data-valor='"+miobj.valor+"' data-time='"+miobj.timespan+"'  onclick='SiguienteModificador("+objmod+","+miobj.id+","+origen+");' type='button'>"+miobj.nombre+"</button>");

				}

				console.log(mods);
				var c=1;
				$('#divmodificadores').html('');
				for(var s in mods){
					var display='';
					if(c>1)
						display='display:none';

					var inhtml="<div class='grupobotones' id='mod_"+s.replace(/"/g,'')+"' data-orden="+c+" style='margin:5px;"+display+"'>";

					if(localStorage.getItem("idioma")==1)
						inhtml+="<div><button id='mid_"+s.replace(/"/g,'')+"' type='button' style='margin:3px;' class='btn btn-default btn-lg' onclick='ActivarMitades("+s.replace(/"/g,'')+");'>Mitad</button>";
					else if(localStorage.getItem("idioma")==2)
						inhtml+="<div><button id='mid_"+s.replace(/"/g,'')+"' type='button' style='margin:3px;' class='btn btn-default btn-lg' onclick='ActivarMitades("+s.replace(/"/g,'')+");'>Half</button>";

					if(localStorage.getItem("idioma")==1)
						inhtml+="<button style='margin:3px;' class='btn btn-default btn-lg' type='button' onclick='SiguienteModificador("+s.replace(/"/g,'')+",0,"+origen+");'>Ninguno</button></div>";
					else if(localStorage.getItem("idioma")==2)
						inhtml+="<button style='margin:3px;' class='btn btn-default btn-lg' type='button' onclick='SiguienteModificador("+s.replace(/"/g,'')+",0,"+origen+");'>NONE</button></div>";
					inhtml+="<hr></hr>";

					for(var t in mods[s]){
						inhtml+=mods[s][t];
					}

					inhtml+="</div>";

					$('#divmodificadores').append(inhtml);
					c++;
				}

				$('#popupModificadores').modal("show");

			}else{
				agregarCompra($(btnprod),origen);
			}
		});
	},errorCB,successCB);
    //*************************************fin normal*************************************
    }
}

function VerificarAgregadosnew(btnprod,origen){
	var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
	var mitimespan=$(btnprod).attr("id");
	if(mitimespan.indexOf('busc_')>=0)
		mitimespan=mitimespan.substring(5);
	db.transaction(
	function (tx){
		tx.executeSql('SELECT * from MODIFICADORES WHERE id_formulado LIKE ? and activo=? order by no_modificador asc',[mitimespan,"true"],function(tx,res1){
			var mods= new Array();
			if(res1.rows.length>0){
				$('#titlemodificador').html("Modificadores de "+$(btnprod).attr("data-formulado"));
				$('#id_formulado_modificadores').val(mitimespan);
				for(var m=0;m<res1.rows.length;m++){
					var miobj=res1.rows.item(m);
					var objmod=res1.rows.item(m).no_modificador;
					if(!('"'+objmod+'"' in mods))
						mods['"'+objmod+'"']= new Array();

					mods['"'+objmod+'"'].push("<button style='margin:3px;' class='btn btn-primary btn-lg' id='btnmodif_"+miobj.id+"' data-valor='"+miobj.valor+"' data-time='"+miobj.timespan+"'  onclick='SiguienteModificador("+objmod+","+miobj.id+","+origen+");' type='button'>"+miobj.nombre+"</button>");

				}

				console.log(mods);
				var c=1;
				$('#divmodificadores').html('');

				for(var s in mods){
					var display='';
					if(c>1)
						display='display:none';

					var inhtml="<div class='grupobotones' id='mod_"+s.replace(/"/g,'')+"' data-orden="+c+" style='margin:5px;"+display+"'>";

					if(localStorage.getItem("idioma")==1)
						inhtml+="<div><button id='mid_"+s.replace(/"/g,'')+"' type='button' style='margin:3px;' class='btn btn-default btn-lg' onclick='ActivarMitades("+s.replace(/"/g,'')+");'>Mitad</button>";
					else if(localStorage.getItem("idioma")==1)
						inhtml+="<div><button id='mid_"+s.replace(/"/g,'')+"' type='button' style='margin:3px;' class='btn btn-default btn-lg' onclick='ActivarMitades("+s.replace(/"/g,'')+");'>Half</button>";

					if(localStorage.getItem("idioma")==1)
						inhtml+="<button style='margin:3px;' class='btn btn-default btn-lg' type='button' onclick='SiguienteModificador("+s.replace(/"/g,'')+",0,"+origen+");'>Ninguno</button></div>";
					else
						inhtml+="<button style='margin:3px;' class='btn btn-default btn-lg' type='button' onclick='SiguienteModificador("+s.replace(/"/g,'')+",0,"+origen+");'>NONE</button></div>";
					inhtml+="<hr></hr>";

					for(var t in mods[s]){
						inhtml+=mods[s][t];
					}

					inhtml+="</div>";

					$('#divmodificadores').append(inhtml);
					c++;
				}

				$('#popupModificadores').modal("show");

			}else{
				agregarCompranew($(btnprod),origen);
			}
		});
	},errorCB,successCB);
}


function SiguienteModificador(divid,idmod,origen){
  var idmenudiseno = $('#id_formulado_modificadores').val();
  //alert(divid+'**'+idmod+'**'+idmenudiseno)
	var div=$('#mod_'+divid);
	var orden=div.attr("data-orden");
	var cantidad=1;
	if(mitades==true){
		$('#btnmodif_'+idmod).attr("class","btn btn-success btn-lg");
		if(contadormitades==0){
			orden=parseInt(orden)-1;
		}else{
			mitades=false;
		}
		cantidad=0.5;
		contadormitades++;
	}

    var cantreal = parseInt($('#auxcantreal').html());
    var canttiene = 0;
    if($('#auxcant').html() == ''){
      var cant = cantreal;
    }else{
      var cant = parseInt($('#auxcant').html());
    }

    if(cant > cantreal){
      cant = cantreal;
    }

    canttiene = cantreal-cant;
    //alert(cantreal+'**'+cant+'**'+canttiene);

    if(cantreal > 0){
      cantidad = cant;
      $('#auxcantreal').html(canttiene);
      $('#auxcant').html('');
    }

    //alert(cantidad);

	$('.grupobotones').css('display','none');
	var ya=false;

	$('.grupobotones').each(function(){
		if($(this).attr('data-orden')>orden){
			if(ya==false){
				$(this).fadeIn();
				//if(mitades==false)
				ya=true;
			}

		}
	});

    if(canttiene > 0){
      $('.grupobotones').css('display','block');
      ya=true;
    }

	if(idmod > 0){
		var elbotonm=$('#btnmodif_'+idmod);
		var valormas=elbotonm.attr("data-valor");
		var valortime=elbotonm.attr("data-time");
		var nombrem=elbotonm.html();
		var dataagreg=$('#'+$('#id_formulado_modificadores').val()).attr("data-modificadores");
		if(origen==2)
			dataagreg=$('#busc_'+$('#id_formulado_modificadores').val()).attr("data-modificadores");
		var agregadoschain="";
		if(dataagreg!=null&&dataagreg!=''&&dataagreg!='undefined')
			agregadoschain=dataagreg+"@"+nombrem+"|"+valormas+"|"+valortime+"|"+cantidad;
		else
			agregadoschain=nombrem+"|"+valormas+"|"+valortime+"|"+cantidad;

		//alert(agregadoschain);

		if(origen==2)
			$('#busc_'+$('#id_formulado_modificadores').val()).attr("data-modificadores",agregadoschain);
		else
			$('#'+$('#id_formulado_modificadores').val()).attr("data-modificadores",agregadoschain);
	}

	if(ya==false){
		$('#popupModificadores').modal("hide");
		mitades=false;
		contadormitades=0;

		$( "#inputbuscnew" ).focus();
		if(origen==2){
		  if(localStorage.getItem("con_localhost") == 'true'){
		    agregarCompraLocal($('#busc_'+$('#id_formulado_modificadores').val()),idmenudiseno);
          }else{
            agregarCompra($('#busc_'+$('#id_formulado_modificadores').val()),origen);
          }
        }else{
          if(localStorage.getItem("con_localhost") == 'true'){
		    agregarCompraLocal($('#'+$('#id_formulado_modificadores').val()),idmenudiseno);
          }else{
            agregarCompra($('#'+$('#id_formulado_modificadores').val()),origen);
          }
        }
	}
}

function AsignarNombre(){
	var n=$('#ordername').val();
	if(n!=''&&n!=null){
		localStorage.setItem("nameorder",n);
	}
	$('#popupNameorder').modal("hide");
}

function VerPropinas(){
	var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
	var mitot=parseFloat($('#total').html().replace('$',''));
	if(localStorage.getItem("con_mesas")=="true"&&mitot==0){

    if(localStorage.getItem("con_localhost") == 'true'){
       var mesaactiva=sessionStorage.getItem("mesa_activa");
       var apiURL='http://'+localStorage.getItem("ip_servidor")+'/connectnubepos/api2.php';
       $.post(apiURL,{
  		id_emp : localStorage.getItem("empresa"),
  		action : 'DesactivarMesa',
  		id_barra : localStorage.getItem("idbarra"),
  		deviceid:$("#deviceid").html(),
        idcli : '9999999999999',
        nombrecli : '',
        mitimespan : '0',
        idmesa : mesaactiva
  		}).done(function(response){
  			if(response!='block' && response!='Desactivado'){

    			console.log(response);
                var res = response.split("||");
                if(res[0] == 'ok'){
        			sessionStorage.setItem("mesa_activa","");
        			sessionStorage.setItem("mesa_name","");
        			sessionStorage.setItem("mesa_pax",0);
        			$('#nombre_mesa').html('');
        			envia("puntodeventa");
                }

  			}else if(response=='Desactivado'){
  			    envia('cloud');
  				setTimeout(function(){
  					$('.navbar,#barraalternamovil').slideUp();
  					$("#demoGratis,#fadeRow,#finalizado,#contentStepSincro,#cuentaactiva").css("display","none");
  					$('#desactivo').fadeIn();
  				},100);
  			}else{
  				envia('cloud');
  				setTimeout(function(){
  					$('#linklogin,#linkloginb').attr("href","https://www.practisis.net/index3.php?rvpas="+localStorage.getItem("userPasswod")+"&rvus="+localStorage.getItem("userRegister"));
  					$('.navbar,#barraalternamovil').slideUp();
  					$("#demoGratis,#fadeRow,#finalizado,#contentStepSincro,#cuentaactiva").css("display","none");
  					$('#bloqueo').fadeIn();
  				},100);

  			}

  		}).fail(function(){
  			updateOnlineStatus("OFFLINE");
  			setTimeout(function(){SincronizadorNormal()},180000);
  		});
      }else{
    //*******************************inicio normal****************************************
			db.transaction(function (tx){
			var mesaactiva=sessionStorage.getItem("mesa_activa");
			//var idfact=results.insertId;
			var idcli=$('#cedulaP').val();
			var nombrecli=$('#nombreP').val();
			var mitimespan=0;
			var now=new Date().getTime();

			tx.executeSql("UPDATE MESAS_DATOS SET cliente=?,id_cliente=?,id_factura=?,hora_desactivacion=?,activo=? WHERE id_mesa=? and activo=?",[nombrecli,idcli,mitimespan,now,"false",mesaactiva,"true"]);
			tx.executeSql("UPDATE MESAS SET enuso=? WHERE timespan=?",["false",mesaactiva]);
			tx.executeSql("DELETE FROM MESAS_CONSUMOS WHERE id_mesa=?",[mesaactiva]);
			sessionStorage.setItem("mesa_activa","");
			sessionStorage.setItem("mesa_name","");
			sessionStorage.setItem("mesa_pax","0");
			$('#nombre_mesa').html('');
			envia("puntodeventa");
			});
    //*********************************fin normal*****************************************
    }

	}
	else{
		if(localStorage.getItem("propina")=="true"){

		db.transaction(
		function (tx){
			tx.executeSql('SELECT * from PROPINAS WHERE activo=? order by es_porcentaje,valor asc',["true"],function(tx,res1){
				$('#divpropinas').html('');
				var readonly="readonly";
				if(res1.rows.length>0){
					if(res1.rows.item(0)!=null){
					var primervalor=0;
					for(var t=0;t<res1.rows.length;t++){
						var item=res1.rows.item(t);
						var htmlbut="";
						if(item.es_porcentaje=="true"){
							htmlbut="<button type='button' style='margin:10px; max-width:120px; min-width:150px;' onclick='PropinaValor("+item.valor+",1)' class='btn btn-success btn-lg'>"+parseFloat(item.valor).toFixed(2)+"%</button>";
							if(t==0)
								primervalor=parseFloat(item.valor)*(parseFloat($('#subtotalIva').val())+parseFloat($('#subtotalSinIva').val()))/100;
						}else{
							if(item.valor>0){
								htmlbut="<button type='button' style='margin:10px; max-width:120px; min-width:150px;' onclick='PropinaValor("+item.valor+",2)' class='btn btn-primary btn-lg'>$"+parseFloat(item.valor).toFixed(2)+"</button>";
								if(t==0)
									primervalor=parseFloat(item.valor);
							}else{
								if(item.valor==0){
									htmlbut="<button type='button' style='margin:10px; max-width:120px; min-width:150px;' onclick='PropinaValor(0,2)' class='btn btn-default btn-lg'>NO</button>";
									if(t==0)
										primervalor=parseFloat(item.valor);
								}else if(item.valor==-1){
									//alert(item.valor);
									readonly="";
									if(t==0)
										primervalor=0;
								}
							}
						}
						$('#divpropinas').append(htmlbut);
					}
					$('#divpropinas').append('<div style="margin-top:10px;"><div class="input-group"><span class="input-group-addon" id="basic-addon1">USD</span><input onclick="this.select()" '+readonly+' id="valorpropina" type="text" class="form-control input-lg" value="'+primervalor.toFixed(2)+'" aria-describedby="basic-addon1"></div></div>');
					$('#popupPropina').modal('show');
					}
				}
			});
		},errorCB,successCB);

		}else{
			AntesDePagar();
		}
	}
}

function PropinaValor(valor,caso){
	var calculo=0;
	if(caso==1){
		calculo=(parseFloat($('#subtotalSinIva').val())+parseFloat($('#subtotalIva').val()))*parseFloat(valor)/100;
	}else if(caso==2){
		calculo=valor;
	}
	$('#valorpropina').val(parseFloat(calculo).toFixed(2));
}

function GuardarPropina(){

	$('#propinaFactura').val($('#valorpropina').val());
	$('#invoiceprop').html($('#valorpropina').val());
	$('#total').html("$"+(parseFloat($('#total').html().substring(1))+parseFloat($('#valorpropina').val())).toFixed(2));

	if($('#total').html().toString().length==9)
		$('#divtotal').css('font-size','26px');
	else if($('#total').html().toString().length>9)
		$('#divtotal').css('font-size','26px');
	else
		$('#divtotal').css('font-size','30px');

	if($('#total').html().toString().length>7){
		$('.den').css('width',4.5*parseFloat($('.producto').css('height')));
	}else{
		$('.den').css('width',3*parseFloat($('.producto').css('height')));
	}

	//$('#totalmiFactura').val(parseFloat(totales));
	$('#payButton').html('PAGAR');
	$('#invoiceTotal').html($('#total').html());
	/*botones efectivo*/
	var sumTotal=parseFloat($('#total').html().substring(1));
	$('#justo').html('$ '+sumTotal.toFixed(2));
	$('#justo').attr('data-value',-1*sumTotal.toFixed(2));
	$('#redondeado').html('$ '+Math.ceil(sumTotal).toFixed(2));
	$('#redondeado').attr('data-value',-1*Math.ceil(sumTotal).toFixed(2));

	var alta=0;
	for( var t in misdenominaciones){
		if(misdenominaciones[t]>sumTotal)
		{
			alta=misdenominaciones[t];
			break;
		}
	}
	$('#altaden').html('$ '+alta.toFixed(2));
	$('#altaden').attr('data-value',-1*alta.toFixed(2));
	if(alta!=sumTotal&&alta!=Math.ceil(sumTotal)&&alta!=0)
		$('#altaden').parent().css('display','inline');
	else
		$('#altaden').parent().css('display','none');

	var prox10=0;
	var iter=1;
	var p10=iter*10;
	while(p10<sumTotal){
		iter++;
		p10=iter*10;
	}
	$('#prox10').html('$ '+p10.toFixed(2));
	$('#prox10').attr('data-value',-1*p10.toFixed(2));
	//console.log(p10+'/'+alta);
	if(p10>0&&p10!=alta)
		$('#prox10').parent().css('display','inline');
	else
		$('#prox10').parent().css('display','none');

	var prox20=0;
	var iter=1;
	var p20=iter*20;
	while(p20<sumTotal){
		iter++;
		p20=iter*20;
	}

	$('#prox20').html('$ '+p20.toFixed(2));
	$('#prox20').attr('data-value',-1*p20.toFixed(2));
	if(p20>0&&p20!=p10)
		$('#prox20').parent().css('display','inline');
	else
		$('#prox20').parent().css('display','none');
	/**/
	$('#popupPropina').modal('hide');
	AntesDePagar();
}

function AgregarNota(){
	var linea=$('#notaid').val();
	var note=$('#textonota').val();
	var tr=document.getElementById('cant_'+linea);
	var td=tr.cells[2];
	var detail=$(tr).find('.productDetails');
	var noteprod=$(td).find('.noteprod');
	console.log(noteprod);
	if(note!=''){
		if(noteprod.length>0){
			$(noteprod).html(note+'*');
		}
		else{
			console.log($(td));
			$(td).append('<div class="noteprod" style="font-size:11px;">'+note+'*</div>');
		}
	}else{
		if(noteprod.length>0){
			$(noteprod).remove();
		}
	}

	detail.attr("data-notes",note);
	$('#popupNota').modal("hide");
	$('#textonota').val("");
}

function MostrarNota(span){
	var padre=$(span).parent().parent();
	$('#itemnota').html($(span).html());
	var id=$(padre).attr("id");
	var dataid=id.split("_");
	//alert(dataid[1]);
	$('#notaid').val(dataid[1]);
	$('#popupNota').modal("show");
}

function CargarMesas(){
	$('#contentmesas').html("");

    if(localStorage.getItem("con_localhost") == 'true'){
     var apiURL='http://'+localStorage.getItem("ip_servidor")+'/connectnubepos/api2.php';
     $.post(apiURL,{
		id_emp : localStorage.getItem("empresa"),
		action : 'VerMesas',
		id_barra : localStorage.getItem("idbarra"),
		deviceid:$("#deviceid").html(),
		}).done(function(response){
			if(response!='block' && response!='Desactivado'){
				//console.log(response);
                var resp = response.split("||");
                if(resp[0] != ''){
                  var tab1 = resp[0].split("@@");
                  for(var i=0;i<tab1.length;i++){
                    $('#contentmesas_1').append(tab1[i]);
                  }
                }
                if(resp[1] != ''){
                  var tab2 = resp[1].split("@@");
                  for(var j=0;j<tab2.length;j++){
                    $('#contentmesas_2').append(tab2[j]);
                  }
                }
                if(resp[2] != ''){
                  var tab3 = resp[2].split("@@");
                  for(var k=0;k<tab3.length;k++){
                    $('#contentmesas_3').append(tab3[j]);
                  }
                }
                if(resp[3] != ''){
                  var tab4 = resp[4].split("@@");
                  for(var l=0;l<tab4.length;l++){
                    $('#contentmesas_4').append(tab4[l]);
                  }
                }

			}else if(response=='Desactivado'){
			    envia('cloud');
				setTimeout(function(){
					$('.navbar,#barraalternamovil').slideUp();
					$("#demoGratis,#fadeRow,#finalizado,#contentStepSincro,#cuentaactiva").css("display","none");
					$('#desactivo').fadeIn();
				},100);
			}else{
				envia('cloud');
				setTimeout(function(){
					$('#linklogin,#linkloginb').attr("href","https://www.practisis.net/index3.php?rvpas="+localStorage.getItem("userPasswod")+"&rvus="+localStorage.getItem("userRegister"));
					$('.navbar,#barraalternamovil').slideUp();
					$("#demoGratis,#fadeRow,#finalizado,#contentStepSincro,#cuentaactiva").css("display","none");
					$('#bloqueo').fadeIn();
				},100);

			}

		}).fail(function(){
			updateOnlineStatus("OFFLINE");
			setTimeout(function(){SincronizadorNormal()},180000);
		});
    }else{
    //**********************************inicio normal*************************************
	var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
	db.transaction(	function (tx){
		tx.executeSql("SELECT m.top,m.left,m.nombre,m.timespan,t.imagen_activa as act,t.imagen_inactiva as inact,m.enuso,m.tab,t.es_mesa FROM MESAS m, TIPO_MESA t WHERE t.timespan=m.id_tipomesa and m.activo=?",["true"],function(tx,results3){
			if(results3.rows.length>0){
				for(var k=0;k<results3.rows.length;k++){
					var item=results3.rows.item(k);
					var img=item.act;

					var clase="mesaactiva";
					if(item.enuso=="false"){
						img=item.inact;
						clase="mesainactiva";
					}else{
						$('#litab'+item.tab+' a').css('border-bottom','3px solid green');
					}

					var onclick="";
					if(item.es_mesa=='true'){
						onclick="AccionMesa(this);";
					}

					var mitop=item.top-96;
					var mileft=item.left;
					var proporcionw=1;
					var proporcionh=1;
					var anchomesas='';
					var fontsize='';

					var miancho=parseFloat($(window).width());
					var mialto=parseFloat($(window).height());
					if(miancho<800){
						proporcionw=miancho/800;
						mileft=proporcionw*item.left;
						anchomesas='width:40px;';
						fontsize='font-size:11px;'
					}

					if(mialto<600){
						proporcionh=mialto/600;
						mitop=proporcionh*(item.top-96);
					}


					var html="<div id='divmesa_"+item.timespan+"' style='position:absolute; top:"+(mitop)+"px; left:"+mileft+"px;' timespan='"+item.timespan+"' class='"+clase+"' onclick='"+onclick+"' ><div style='"+fontsize+"' id='mesaname_"+item.timespan+"'>"+item.nombre+"</div><img id='mesaimg_"+item.timespan+"' class='imgmesa' src='images/mesas/"+img+"' style='"+anchomesas+"'/></div>";
					$('#contentmesas_'+item.tab).append(html);
				}

			}
		});
	},errorCB,successCB);

    db.transaction(	function (tx){
	$('.mesaactiva').each(function(){
		var id=$(this).attr("id");
		var dataid=id.split("_");
		tx.executeSql("SELECT pax from mesas_datos where id_mesa=? and activo=?",[dataid[1],"true"],function(tx,res2){
			if(res2.rows.length>0){
				var miitem=res2.rows.item(0);
				var divpax="<div style='position:absolute; top:52%; width:100%; text-align:center; font-size:11px; color:white;'>PAX: "+miitem.pax+"</div>";
				$('#divmesa_'+dataid[1]).append(divpax);
			}
		});
	});
	},errorCB,successCB);
    //***********************************fin normal***************************************
    }
}

function AccionMesa(div){
	var clase=$(div).attr('class');
	if(clase=='mesaactiva'){
		VerConsumos($(div).attr("timespan"));
	}else{
		VerActivarMesa($(div).attr("timespan"));
	}
}

function VerActivarMesa(cual){
	$('#popupActivarMesa').modal("show");
	$('#mesaid').val(cual);
	$('.cantidadm').html("1");
	$('.cantidadm').prop("change","false");
	$('#itemmesa').html($('#mesaname_'+cual).html());
}

function ActivarMesa(){
	//alert($('#mesaid').val());

	var cant=parseInt($('.cantidadm').html());
	if(cant==0) cant=1;
	if(cant>=1){
		var id=$('#mesaid').val();
		//var cant=$('.cantidadm').html();
        if(localStorage.getItem("con_localhost") == 'true'){
         var apiURL='http://'+localStorage.getItem("ip_servidor")+'/connectnubepos/api2.php';
         $.post(apiURL,{
    		id_emp : localStorage.getItem("empresa"),
    		action : 'ActivaMesa',
    		id_barra : localStorage.getItem("idbarra"),
    		deviceid:$("#deviceid").html(),
            cantidad : cant,
            idmesa : id
    		}).done(function(response){
    			if(response!='block' && response!='Desactivado'){
    				console.log(response);
                    var resp = response.split("||");
                    if(resp[0] != '0'){
                      console.log("Mesa Activada: "+resp[0]);

                      $('#mesaimg_'+id).attr("src","images/mesas/"+resp[1]);
  					  $('#divmesa_'+id).attr("class","mesaactiva");

                      //$('#btn_mesas').html("PRECUENTA "+resp[2]);
    				  //$('#btn_mesas').attr("class","btn btn-info");
    				    $('#btn_gpedidos,#btn_mesas').attr("title",resp[2]);
    					$('#nombre_mesa').html(resp[2]);
    					$('[data-toggle="tooltip"]').tooltip();
    					$('#tablaCompra').html('');
    					$('#subtotalIva').val('0');
    					$('#subtotalSinIva').val('0');
    					$('#totalmiFactura').val('0');
    					$('#descuentoFactura').val('0');
              $('#descuentoFacturatrue').val('0');
    					$('.esImpuesto').val('0');
    					sessionStorage.setItem("mesa_activa",id);
    					sessionStorage.setItem("mesa_name",resp[2]);
    					sessionStorage.setItem("mesa_pax",cant);

						$('#popupActivarMesa').modal("hide");
						$('#divmesas').hide();
						$('#menuSubNew1,#menuSubNew2').fadeIn();


                    }

    			}else if(response=='Desactivado'){
    			    envia('config');
    				setTimeout(function(){
    					$('.navbar,#barraalternamovil').slideUp();
    					$("#demoGratis,#fadeRow,#finalizado,#contentStepSincro,#cuentaactiva").css("display","none");
    					$('#desactivo').fadeIn();
    				},100);
    			}else{
    				envia('config');
    				setTimeout(function(){
    					$('#linklogin,#linkloginb').attr("href","https://www.practisis.net/index3.php?rvpas="+localStorage.getItem("userPasswod")+"&rvus="+localStorage.getItem("userRegister"));
    					$('.navbar,#barraalternamovil').slideUp();
    					$("#demoGratis,#fadeRow,#finalizado,#contentStepSincro,#cuentaactiva").css("display","none");
    					$('#bloqueo').fadeIn();
    				},100);

    			}

    		}).fail(function(){
    			updateOnlineStatus("OFFLINE");
    			setTimeout(function(){SincronizadorNormal()},180000);
    		});
        }else{
        //******************************inicio normal*************************************
		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
		db.transaction(	function (tx){
			var fecha= new Date().getTime();
			var timespan=getTimeSpan();
			tx.executeSql("SELECT t.imagen_activa as act,m.* FROM TIPO_MESA t,MESAS m WHERE m.timespan=? and m.id_tipomesa=t.timespan",[id],function(tx,results){

					var item=results.rows.item(0);

					tx.executeSql("INSERT INTO MESAS_DATOS (id_mesa,hora_activacion,pax,timespan) values (?,?,?,?);",[id,fecha,cant,timespan],function(tx,results1){
						console.log("Mesa Activada: "+results1.insertId);
					});

					tx.executeSql("UPDATE MESAS SET enuso=? WHERE timespan=?",["true",id],function(tx,results2){
						$('#mesaimg_'+id).attr("src","images/mesas/"+item.act);
						$('#divmesa_'+id).attr("class","mesaactiva");
					});

					/*boton mesas*/
					//$('#btn_mesas').html("PRECUENTA "+item.nombre);
					//$('#btn_mesas').attr("class","btn btn-info");
					$('#btn_gpedidos,#btn_mesas').attr("title",item.nombre);
					$('#nombre_mesa').html(item.nombre);
					$('[data-toggle="tooltip"]').tooltip();
					$('#tablaCompra').html('');
					$('#subtotalIva').val('0');
					$('#subtotalSinIva').val('0');
					$('#totalmiFactura').val('0');
					$('#descuentoFactura').val('0');
          $('#descuentoFacturatrue').val('0');
					$('.esImpuesto').val('0');
					sessionStorage.setItem("mesa_activa",id);
					sessionStorage.setItem("mesa_name",item.nombre);
					sessionStorage.setItem("mesa_pax",cant);
					/**/
			});

			$('#popupActivarMesa').modal("hide");
			$('#divmesas').hide();
			$('#menuSubNew1,#menuSubNew2').fadeIn();
		},errorCB,successCB);
      //********************************fin normal****************************************
      }
	}
}

function VerConsumos(idmesa){
	/*boton mesas*/
		//$('#btn_mesas').html("PRECUENTA: "+$('#mesaname_'+idmesa).html());
		//$('#btn_mesas').attr("class","btn btn-info");
		$('#btn_gpedidos,#btn_mesas').attr("title",$('#mesaname_'+idmesa).html());
		$('#nombre_mesa').html($('#mesaname_'+idmesa).html());
		$('[data-toggle="tooltip"]').tooltip();
		$('#subtotalIva').val('0');
		$('#subtotalSinIva').val('0');
		$('#totalmiFactura').val('0');
		$('#descuentoFactura').val('0');
    $('#descuentoFacturatrue').val('0');
		$('.esImpuesto').val('0');
		sessionStorage.setItem("mesa_activa",idmesa);
		sessionStorage.setItem("mesa_name",$('#mesaname_'+idmesa).html());
	    $('#tablaCompra').html('');

		if($(window).width()<=900)
			$('#menuSubNew1,#menuSubNew2').fadeIn();

    if(localStorage.getItem("con_localhost") == 'true'){
      $('#btn_pagar').attr({onclick: ''});
     var apiURL='http://'+localStorage.getItem("ip_servidor")+'/connectnubepos/api2.php';
     var total = 0;
     var sumTotal = 0;
     var taxTotal = 0;
     $.post(apiURL,{
		id_emp : localStorage.getItem("empresa"),
		action : 'BuscarConsumos',
		id_barra : localStorage.getItem("idbarra"),
		deviceid:$("#deviceid").html(),
        con_notas : localStorage.getItem("con_notas"),
        id_mesa : idmesa
		}).done(function(response){
			if(response!='block' && response!='Desactivado'){
				console.log(response);
                var resp = response.split("/@|");

                if(resp[0] != '0'){

                var cantidadcom=0;

					$('#tablaCompra').append(resp[1]);

                    var datos = resp[2].split("@@");

                    for(var k=0;k<datos.length-1;k++){
                    var subtotalSinIva = $('#subtotalSinIva').val();
					var subtotalIva = $('#subtotalIva').val();
					var subtotalSinIvaCompra = 0;
					var subtotalIvaCompra = 0;
                      var datosin = datos[k].split("@|");

    					var productoImpuestosIndexes=datosin[0];
    					var productoCantidad=datosin[1];
    					var productoPrecio=datosin[2];
    					var sumaagregados=parseFloat(datosin[3]);

    					//alert(productoImpuestosIndexes+"/"+productoCantidad+"/"+productoPrecio+"/"+sumaagregados);

    				if($.trim(productoImpuestosIndexes) != '' && $.trim(productoImpuestosIndexes) != 0){

    					if($.trim(productoImpuestosIndexes).indexOf('@') !== -1){
    						$.each(productoImpuestosIndexes.split('@'), function(index,value){
    							if(productoImpuestosIndexes.indexOf(parseInt($('#idiva').html())) !== -1){
    								subtotalIvaCompra = (parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados));
    								}
    							else{
    								subtotalSinIvaCompra = (parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados));
    								}

    							if($('#impuestoFactura-'+ value).length == 0){

    								var impuestoDetalles = $('#impuesto-'+ value).val().split('|');
    								var currentimp=(parseFloat(productoCantidad) *( parseFloat(productoPrecio)+sumaagregados) * parseFloat(impuestoDetalles[2]));
    								taxTotal+= currentimp;

    								$('#factura').append('<input type="hidden" id="impuestoFactura-'+ value +'" class="esImpuesto" data-id="'+ impuestoDetalles[0] +'" data-nombre="'+ impuestoDetalles[1] +'" data-valor="'+ impuestoDetalles[2] +'" value="'+ currentimp +'"/>');
    								}
    							else{
    								var impuestoDetalles = $('#impuesto-'+ value).val().split('|');
    								var currentTax = $('#impuestoFactura-'+ value).val();
    								var calcimp=((parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados)) * parseFloat(impuestoDetalles[2]));
    								taxTotal += calcimp;

    								$('#impuestoFactura-'+ value).val(parseFloat(currentTax) + parseFloat(calcimp));
    								}
    							});
    						}
    					else{
    						productoImpuestosIndexes == parseInt($('#idiva').html()) ? subtotalIvaCompra = (parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados)) : subtotalSinIvaCompra = (parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados));
    						if($('#impuestoFactura-'+productoImpuestosIndexes).length == 0){
    							var impuestoDetalles = $('#impuesto-'+ productoImpuestosIndexes).val().split('|');
    							taxTotal+= ((parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados)) * parseFloat(impuestoDetalles[2]));
                                //alert('si'+taxTotal);
    							$('#factura').append('<input type="hidden" id="impuestoFactura-'+ productoImpuestosIndexes +'" class="esImpuesto" data-id="'+ impuestoDetalles[0] +'" data-nombre="'+ impuestoDetalles[1] +'" data-valor="'+ impuestoDetalles[2] +'" value="'+ taxTotal +'"/>');
    							}
    						else{
    							var impuestoDetalles = $('#impuesto-'+ productoImpuestosIndexes).val().split('|');
    							var currentTax = $('#impuestoFactura-'+ productoImpuestosIndexes).val();
    							taxTotal+= ((parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados)) * parseFloat(impuestoDetalles[2]));
    							$('#impuestoFactura-'+ productoImpuestosIndexes).val(parseFloat(currentTax) + parseFloat(taxTotal));
    							}
    						}
    					}else{
    						subtotalSinIvaCompra=(parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados));
    					}
    				//impuestos end
                    //alert(subtotalSinIvaCompra+'**'+subtotalIvaCompra);
    					$('#subtotalSinIva').val(parseFloat(subtotalSinIva) + parseFloat(subtotalSinIvaCompra));
    					$('#subtotalIva').val(parseFloat(subtotalIva) + parseFloat(subtotalIvaCompra));

                        $('#impuestoFactura-'+productoImpuestosIndexes).val(taxTotal);
                        //alert($('#impuestoFactura-'+productoImpuestosIndexes).val()+'**'+$('#subtotalIva').val());
    				}

                /*Calculos*/
				$('#itemsVendidos').html(cantidadcom);
				
				//cambio check de sin servicio
				if(cantidadcom==0)
					$('#sinservicio').prop('disabled',false);
				else
					$('#sinservicio').prop('disabled',true);
				
				$('.totales').each(function(){
					sumTotal += parseFloat($.trim($(this).val()));
				});

				$('#totalmiFactura').val(sumTotal);
				$('#total').html('$'+ parseFloat(sumTotal).toFixed(2));

				if($('#total').html().toString().length==9)
					$('#divtotal').css('font-size','26px');
				else if($('#total').html().toString().length>9)
					$('#divtotal').css('font-size','26px');
				else
					$('#divtotal').css('font-size','30px');

				if($('#total').html().toString().length>7){
					$('.den').css('width',4.5*parseFloat($('.producto').css('height')));
				}else{
					$('.den').css('width',3*parseFloat($('.producto').css('height')));
				}

				//$('#total').html('PAGAR $'+ parseFloat(sumTotal).toFixed(2))
				$('#justo').html('$ '+sumTotal.toFixed(2));
				$('#justo').attr('data-value',-1*sumTotal.toFixed(2));
				$('#redondeado,#redondeado2').html(Math.ceil(sumTotal).toFixed(2));
				$('#redondeado,#redondeado2').attr('data-value',-1*Math.ceil(sumTotal).toFixed(2));
				var alta=0;
				for( var t in misdenominaciones){
					if(misdenominaciones[t]>sumTotal)
					{
						alta=misdenominaciones[t];
						break;
					}
				}

				$('#altaden').html('$ '+alta.toFixed(2));
				$('#altaden').attr('data-value',-1*alta.toFixed(2));
				if(alta!=sumTotal&&alta!=Math.ceil(sumTotal)&&alta!=0)
					$('#altaden').parent().css('display','inline');
				else
					$('#altaden,#altaden').parent().css('display','none');

				var prox10=0;
				var iter=1;
				var p10=iter*10;
				while(p10<sumTotal){
					iter++;
					p10=iter*10;
				}
				$('#prox10').html('$ '+p10.toFixed(2));
				$('#prox10').attr('data-value',-1*p10.toFixed(2));
				//console.log(p10+'/'+alta);
				if(p10>0&&p10!=alta)
					$('#prox10').parent().css('display','inline');
				else
					$('#prox10').parent().css('display','none');

				var prox20=0;
				var iter=1;
				var p20=iter*20;
				while(p20<sumTotal){
					iter++;
					p20=iter*20;
				}
				$('#prox20').html('$ '+p20.toFixed(2));
				$('#prox20').attr('data-value',-1*p20.toFixed(2));
				if(p20>0&&p20!=p10)
					$('#prox20').parent().css('display','inline');
				else
					$('#prox20').parent().css('display','none');

				//alert(subtotalSinIva+"/"+subtotalSinIvaCompra);

				$('.cantidad').html('0');
				$('#tableresults').html('');
				$('#inputbusc').val('');
				$('.cantidadnew').html('0');
				$('#tableresultsnew').html('');
				$('#inputbuscnew').val('');
				$('#contentdetalle').animate({
					scrollTop: $('#contentdetalle')[0].scrollHeight
				}, 1000).clearQueue();

                }


			}else if(response=='Desactivado'){
			    envia('cloud');
				setTimeout(function(){
					$('.navbar,#barraalternamovil').slideUp();
					$("#demoGratis,#fadeRow,#finalizado,#contentStepSincro,#cuentaactiva").css("display","none");
					$('#desactivo').fadeIn();
				},100);
			}else{
				envia('cloud');
				setTimeout(function(){
					$('#linklogin,#linkloginb').attr("href","https://www.practisis.net/index3.php?rvpas="+localStorage.getItem("userPasswod")+"&rvus="+localStorage.getItem("userRegister"));
					$('.navbar,#barraalternamovil').slideUp();
					$("#demoGratis,#fadeRow,#finalizado,#contentStepSincro,#cuentaactiva").css("display","none");
					$('#bloqueo').fadeIn();
				},100);

			}

		}).fail(function(){
			updateOnlineStatus("OFFLINE");
			setTimeout(function(){SincronizadorNormal()},180000);
		});
    }else{
    //**********************************inicio normal*************************************
	//Leo los consumos guardados para esa mesa
	var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
	db.transaction(	function (tx){
			tx.executeSql("SELECT * FROM MESAS_CONSUMOS WHERE id_mesa=?",[idmesa],function(tx,results1){
				var total = 0;
				var sumTotal = 0;
				var taxTotal = 0;

			if(results1.rows.length>0){
				var cantidadcom=0;
				for(var k=0;k<results1.rows.length;k++){
					var subtotalSinIva = $('#subtotalSinIva').val();
					var subtotalIva = $('#subtotalIva').val();
					var subtotalSinIvaCompra = 0;
					var subtotalIvaCompra = 0;
					var item=results1.rows.item(k);
					console.log(item.details);
					var dataitem=item.details.split("|");
					cantidadcom+=parseInt(dataitem[2]);

					var html="<tr class='printed' style='background-color:#DDD;' id='cant_"+k+"'><td class='lineadetalle' data-borrarcantidad='"+dataitem[2]+"' data-borrarimpuesto='"+dataitem[5]+"' data-borrarimpuestoindexes='"+dataitem[7]+"' data-borrarprecio='"+dataitem[3]+"' data-agregados='"+dataitem[8]+"' onclick='borrarCompra(this);' style='width:5%;'><button type='button' class='btn btn-danger btn-xs product_del'><span class='glyphicon glyphicon-remove'></span></button><input type='hidden' style='display:none;' class='totales' value='"+parseFloat(dataitem[6]).toFixed(4)+"'/></td>";
					html+="<td onclick='modificarCantidad("+k+","+item.id_real+");' style='border-right:1px solid #909192; text-align: center; width:20%;' class='lineadetalle'><input type='hidden' class='productDetails' value='"+item.details+"' data-detagregados='"+item.agregados+"' data-notes='"+item.notas+"' data-id_real='"+item.id_real+"' /><input type='hidden' class='cantidadproductoscomandados' value='"+dataitem[2]+"'/>"+dataitem[2]+"</td>";
					html+="<td style='border-right:1px solid #909192; padding:5px;text-align: left; width:50%; text-transform:capitalize;' class='lineadetalle'><span class='lineanota' data-id='"+k+"' onclick='";
					var click="";
					if(localStorage.getItem("con_notas")=="true")
						click="MostrarNota(this); "
					html+=click+"'>"+dataitem[1]+"</span>";
					if(item.agregados!=null&&item.agregados!=""){
						html+="<table style='width:100%; font-size:10px; color:#808081;'>";
						var agregado=item.agregados.split("@");
						for(var t=0;t<agregado.length;t++){
							var dataagr=agregado[t].split('|');
							var cn="";
							if(parseFloat(dataagr[3])<1)
								cn="1/2";
							html+="<tr><td>"+cn+dataagr[0]+"</td><td style='text-align:right;'>$"+parseFloat(dataagr[1]).toFixed(2)+"</td></tr>";
						}
						html+="</table>";
					}

					if(item.notas!=null&&item.notas!=""){
						html+="<div class='noteprod' style='font-size:11px;'>"+item.notas+"*</div>";
					}

					html+="</td>";
					html+="<td style='padding-right:20px; text-align: right; border-right:2px solid red;' class='lineadetalle'>"+parseFloat(dataitem[6]).toFixed(4)+"</td>";
					html+="</tr>";
					$('#tablaCompra').append(html);

					var productoImpuestosIndexes=dataitem[7];
					var productoCantidad=dataitem[2];
					var productoPrecio=dataitem[3];
					var sumaagregados=parseFloat(dataitem[8]);

					//alert(productoImpuestosIndexes+"/"+productoCantidad+"/"+productoPrecio+"/"+sumaagregados);

				if($.trim(productoImpuestosIndexes) != '' && $.trim(productoImpuestosIndexes) != 0){
					if($.trim(productoImpuestosIndexes).indexOf('@') !== -1){
						$.each(productoImpuestosIndexes.split('@'), function(index,value){
							if(productoImpuestosIndexes.indexOf(parseInt($('#idiva').html())) !== -1){
								subtotalIvaCompra = (parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados));
								}
							else{
								subtotalSinIvaCompra = (parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados));
								}

							if($('#impuestoFactura-'+ value).length == 0){

								var impuestoDetalles = $('#impuesto-'+ value).val().split('|');
								var currentimp=(parseFloat(productoCantidad) *( parseFloat(productoPrecio)+sumaagregados) * parseFloat(impuestoDetalles[2]));
								taxTotal+= currentimp;

								$('#factura').append('<input type="hidden" id="impuestoFactura-'+ value +'" class="esImpuesto" data-id="'+ impuestoDetalles[0] +'" data-nombre="'+ impuestoDetalles[1] +'" data-valor="'+ impuestoDetalles[2] +'" value="'+ currentimp +'"/>');
								}
							else{
								var impuestoDetalles = $('#impuesto-'+ value).val().split('|');
								var currentTax = $('#impuestoFactura-'+ value).val();
								var calcimp=((parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados)) * parseFloat(impuestoDetalles[2]));
								taxTotal += calcimp;

								$('#impuestoFactura-'+ value).val(parseFloat(currentTax) + parseFloat(calcimp));
								}
							});
						}
					else{
						productoImpuestosIndexes == parseInt($('#idiva').html()) ? subtotalIvaCompra = (parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados)) : subtotalSinIvaCompra = (parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados));

						if($('#impuestoFactura-'+productoImpuestosIndexes).length == 0){
							var impuestoDetalles = $('#impuesto-'+ productoImpuestosIndexes).val().split('|');
							taxTotal+= ((parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados)) * parseFloat(impuestoDetalles[2]));
							$('#factura').append('<input type="hidden" id="impuestoFactura-'+ productoImpuestosIndexes +'" class="esImpuesto" data-id="'+ impuestoDetalles[0] +'" data-nombre="'+ impuestoDetalles[1] +'" data-valor="'+ impuestoDetalles[2] +'" value="'+ taxTotal +'"/>');
							console.log("no existe"+taxTotal);
						}
						else{
							var impuestoDetalles = $('#impuesto-'+ productoImpuestosIndexes).val().split('|');
							var currentTax = $('#impuestoFactura-'+ productoImpuestosIndexes).val();
							taxTotal+= ((parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados)) * parseFloat(impuestoDetalles[2]));
							console.log("existe"+taxTotal);
							//$('#impuestoFactura-'+ productoImpuestosIndexes).val(parseFloat(currentTax) + parseFloat(taxTotal));
							$('#impuestoFactura-'+ productoImpuestosIndexes).val(parseFloat(taxTotal));
							}
						}
					}else{
						subtotalSinIvaCompra=(parseFloat(productoCantidad) * (parseFloat(productoPrecio)+sumaagregados));
					}
				//impuestos end
					$('#subtotalSinIva').val(parseFloat(subtotalSinIva) + parseFloat(subtotalSinIvaCompra));
					$('#subtotalIva').val(parseFloat(subtotalIva) + parseFloat(subtotalIvaCompra));
				}

				/*Calculos*/
				$('#itemsVendidos').html(cantidadcom);
				
				//cambio el check de quitar servicio
				if(cantidadcom>0)
					$('#sinservicio').prop('disabled',true);
				else
					$('#sinservicio').prop('disabled',false);
				
				$('.totales').each(function(){
					sumTotal += parseFloat($.trim($(this).val()));
				});

				$('#totalmiFactura').val(sumTotal);
				$('#total').html('$'+ parseFloat(sumTotal).toFixed(2));
				if($('#total').html().toString().length==9)
					$('#divtotal').css('font-size','26px');
				else if($('#total').html().toString().length>9)
					$('#divtotal').css('font-size','26px');
				else
					$('#divtotal').css('font-size','30px');

				if($('#total').html().toString().length>7){
					$('.den').css('width',4.5*parseFloat($('.producto').css('height')));
				}else{
					$('.den').css('width',3*parseFloat($('.producto').css('height')));
				}

				$('#payButton').html('PAGAR');
				$('#invoiceTotal').html(parseFloat(sumTotal).toFixed(2));
				//$('#total').html('PAGAR $'+ parseFloat(sumTotal).toFixed(2))
				$('#justo').html('$ '+sumTotal.toFixed(2));
				$('#justo').attr('data-value',-1*sumTotal.toFixed(2));
				$('#redondeado').html('$ '+Math.ceil(sumTotal).toFixed(2));
				$('#redondeado').attr('data-value',-1*Math.ceil(sumTotal).toFixed(2));
				var alta=0;
				for( var t in misdenominaciones){
					if(misdenominaciones[t]>sumTotal)
					{
						alta=misdenominaciones[t];
						break;
					}
				}
				$('#altaden').html('$ '+alta.toFixed(2));
				$('#altaden').attr('data-value',-1*alta.toFixed(2));
				if(alta!=sumTotal&&alta!=Math.ceil(sumTotal)&&alta!=0)
					$('#altaden').parent().css('display','inline');
				else
					$('#altaden').parent().css('display','none');

				var prox10=0;
				var iter=1;
				var p10=iter*10;
				while(p10<sumTotal){
					iter++;
					p10=iter*10;
				}
				$('#prox10').html('$ '+p10.toFixed(2));
				$('#prox10').attr('data-value',-1*p10.toFixed(2));
				//console.log(p10+'/'+alta);
				if(p10>0&&p10!=alta)
					$('#prox10').parent().css('display','inline');
				else
					$('#prox10').parent().css('display','none');

				var prox20=0;
				var iter=1;
				var p20=iter*20;
				while(p20<sumTotal){
					iter++;
					p20=iter*20;
				}
				$('#prox20').html('$ '+p20.toFixed(2));
				$('#prox20').attr('data-value',-1*p20.toFixed(2));
				if(p20>0&&p20!=p10)
					$('#prox20').parent().css('display','inline');
				else
					$('#prox20').parent().css('display','none');


				//alert(subtotalSinIva+"/"+subtotalSinIvaCompra);

				$('.cantidad').html('0');
				$('#tableresults').html('');
				$('#inputbusc').val('');
				$('.cantidadnew').html('0');
				$('#tableresultsnew').html('');
				$('#inputbuscnew').val('');
				$('#contentdetalle').animate({
					scrollTop: $('#contentdetalle')[0].scrollHeight
				}, 1000).clearQueue();
				/**/
			}
		});
	},errorCB,successCB);
    //*********************************fin normal*****************************************
    }
	$('#divmesas').hide();
	$('#btn_pagar').show();
}

function SaveMesa(){
  var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
    if(localStorage.getItem("con_localhost") == 'true'){
      var apiURL='http://'+localStorage.getItem("ip_servidor")+'/connectnubepos/api2.php';
      $.post(apiURL,{
		id_emp : localStorage.getItem("empresa"),
		action : 'ListaEmpleados',
		id_barra : localStorage.getItem("idbarra"),
		deviceid:$("#deviceid").html(),
        id_locales : localStorage.getItem("id_locales")
		}).done(function(response){
			if(response!='block' && response!='Desactivado'){
				//console.log(response);
                //var resp = response.split("||");
                $('#listaempleados').html(response);
                $('#popupEmpleados').modal("show");

			}else if(response=='Desactivado'){
			    envia('cloud');
				setTimeout(function(){
					$('.navbar,#barraalternamovil').slideUp();
					$("#demoGratis,#fadeRow,#finalizado,#contentStepSincro,#cuentaactiva").css("display","none");
					$('#desactivo').fadeIn();
				},100);
			}else{
				envia('cloud');
				setTimeout(function(){
					$('#linklogin,#linkloginb').attr("href","https://www.practisis.net/index3.php?rvpas="+localStorage.getItem("userPasswod")+"&rvus="+localStorage.getItem("userRegister"));
					$('.navbar,#barraalternamovil').slideUp();
					$("#demoGratis,#fadeRow,#finalizado,#contentStepSincro,#cuentaactiva").css("display","none");
					$('#bloqueo').fadeIn();
				},100);

			}

		}).fail(function(){
			updateOnlineStatus("OFFLINE");
			setTimeout(function(){SincronizadorNormal()},180000);
		});
      return false;
    }else{
    //*********************************inicio normal**************************************
	var mesaactiva=sessionStorage.getItem("mesa_activa");
	db.transaction(	function (tx){
		tx.executeSql("DELETE FROM MESAS_CONSUMOS WHERE id_mesa=?",[mesaactiva],function(tx,results){});
	},errorCB,successCB);

	$('#tablaCompra>tbody>tr').each(function(){
		var inputdata=$(this).find('.productDetails');
		if(inputdata!=null){
			var details=inputdata.val();
			var agreg=""
			if(inputdata.attr('data-detagregados')!=null&&inputdata.attr('data-detagregados')!=""&&inputdata.attr('data-detagregados')!="undefined")
				agreg=inputdata.attr('data-detagregados');
			var notes="";
			if(inputdata.attr('data-notes')!=null&&inputdata.attr('data-notes')!=""&&inputdata.attr('data-notes')!="undefined")
				notes=inputdata.attr('data-notes');
			var idreal="";
			if(inputdata.attr('data-id_real')!=null&&inputdata.attr('data-id_real')!=""&&inputdata.attr('data-id_real')!="undefined")
				idreal=inputdata.attr('data-id_real');
			var fecha= new Date().getTime();
			db.transaction(	function (tx){
				tx.executeSql("INSERT INTO MESAS_CONSUMOS (id_mesa,hora,details,agregados,notas,id_real) values (?,?,?,?,?,?);",[mesaactiva,fecha,details,agreg,notes,idreal],function(tx,results1){
					console.log("consumo insertado"+results1.insertId);
				});
			},errorCB,successCB);
		}
	});
    //*******************************fin normal*******************************************
    }

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

	var mensajepie="";
	if(localStorage.getItem("mensajefinal")!=''&&localStorage.getItem("mensajefinal")!=null){
		if(!localStorage.getItem("paquete")=="1")
		   mensajepie=localStorage.getItem("mensajefinal");
	}

	//json = json.substring(0,json.length -1);
	json += '],"mesa":"'+sessionStorage.getItem("mesa_name")+'",';
	json += '"lang":"'+localStorage.getItem("idioma")+'",';
	json += '"mensajefinal":"'+mensajepie+'"';
	json += '}]}';


	console.log(json);

	if(localStorage.getItem("lang")==1)
		showalert("Pedido Guardado con éxito");
	else
		showalert("Order Saved Successfully");

	if(cuan>0){
		//comanderas
		db.transaction(function (tx){
		tx.executeSql('SELECT printercom FROM CONFIG where id=1',[],
		function(tx,res){
			if(res.rows.length>0){
				var miprint=res.rows.item(0);
				if(localStorage.getItem("con_mesas")=="true"){
					if(miprint.printercom!=null){
						if(localStorage.getItem("printtradec")==2){
							StarIOAdapter.rawprint(json,miprint.printercom, function(){});
						}else{
							StarIOAdapter.printepson(json,localStorage.getItem("commodel"),localStorage.getItem("comaddress"),localStorage.getItem("comtype"), function(){});
						}
					}else{
						if(localStorage.getItem("idioma")==1)
							showalert("No se ha configurado una impresora para comandas.");
						else if(localStorage.getItem("idioma")==2)
							showalert("There is no configured a command printer.");
					}
				}
			}
		});
		},errorCB,successCB);
				//fin comanderas
	}
	/*imprimir comandas no comandadas*/

	setTimeout(function(){envia("puntodeventa")},2500);
}

function  ImprimirPrecuenta(){


	var mensajepie="";
	if(localStorage.getItem("mensajefinal")!=''&&localStorage.getItem("mensajefinal")!=null){
		if(!localStorage.getItem("paquete")=="1")
		   mensajepie=localStorage.getItem("mensajefinal");
	}

	var mesaactiva=sessionStorage.getItem("mesa_activa");
    //alert(mesaactiva);
	if(mesaactiva!=null&&mesaactiva!=""){

		var subtotalSinIva = $('#subtotalSinIva').val();
		var subtotalIva = $('#subtotalIva').val();
		var descuento = $('#descuentoFactura').val();
		var total = $('#totalmiFactura').val();
		var propina=parseFloat($('#invoiceprop').html());
		var nofactura = $('#invoiceNrComplete').val();

		var json = '{"Precuenta": [{';
			json += '"producto": [';
			$('.productDetails').each(function(){
			var splitDetails = $(this).val().split('|');
			var detalleagregados="";
			var detallenotas="";
			if($(this).attr("data-detagregados")!=''&&$(this).attr("data-detagregados")!=null&&$(this).attr("data-detagregados")!='undefined')
				detalleagregados=$(this).attr("data-detagregados");

			if($(this).attr("data-notes")!=''&&$(this).attr("data-notes")!=null&&$(this).attr("data-notes")!='undefined')
				detallenotas=$(this).attr("data-notes");

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
			json += '},';
		});

		var midevice='';
		if($('#deviceid').html()!=''){
			midevice=$('#deviceid').html();
		}

		var propina=0;
		if($('#propinaFactura').val()!='')
			propina=parseFloat($('#propinaFactura').val());

		var mesa="";
		var mesaname="";
		var pax="";
		if(sessionStorage.getItem("mesa_activa")!=""&&localStorage.getItem("con_mesas")=="true"){
			mesa=sessionStorage.getItem("mesa_activa");
			mesaname=sessionStorage.getItem("mesa_name");
			pax=sessionStorage.getItem("mesa_pax");
		}


		var idimpuestos = '';
		var ivavalor=0;
		var servalor=0;
		var dataimpuestos="";
		var c=0;

		$('.esImpuesto').each(function(){
			var getName = $(this).data('nombre');
			var getId = $(this).data('id');
			var getValue = $(this).data('valor');
			//idimpuestos += getName +'/'+ $(this).val() +'/'+ getId +'/'+ getValue +'@';
			idimpuestos += getId+'@';
			if(getId==parseInt($('#idiva').html()))
				ivavalor=$(this).val();

			if(c>0){
				dataimpuestos+="@";
			}
			dataimpuestos+=getId+"|"+getName+"|"+getValue+"|"+$(this).val();
			c++;
		});

		idimpuestos = idimpuestos.substring(0,idimpuestos.length -1);

		//alert(device+'/'+device.model + '/' +'Device Cordova: '  + device.cordova  + '/' +'Device Platform: ' + device.platform + '/' +'Device UUID: '     + device.uuid     + '/' +'Device Version: '  + device.version);

		json = json.substring(0,json.length -1);
		json += '],'
		json += '"factura" : {';
			json += '"subtotal_sin_iva" : "'+ subtotalSinIva +'",';
			json += '"fecha" : "'+ new Date().getTime() +'",';
			json += '"subtotal_iva" : "'+ subtotalIva +'",';
			json += '"impuestos" : "'+ idimpuestos +'",';
			json += '"iva" : "'+ ivavalor +'",';
			json += '"servicio" : "'+ servalor +'",';
			json += '"descuento" : "'+ $('#descuentoFacturatrue').val()+'",';
			json += '"total" : "'+ (total-descuento+propina) +'",';
			json += '"encabezado" : "'+ localStorage.getItem("encabezado") +'",';
			json += '"largo" : "'+ localStorage.getItem("largo") +'",';
			json += '"impuestosdata" : "'+ dataimpuestos +'",';
			json += '"ordername" : "'+ localStorage.getItem("nameorder") +'",';
			json += '"lang" : "'+ localStorage.getItem("idioma") +'",';
			json += '"propina" : "'+propina+'",';
			json += '"mesa" : "'+mesaname+'",';
			json += '"pax" : "'+pax+'",';
			json += '"mensajefinal" : "'+mensajepie+'"';
		json += '}}]}';

		console.log(json);

		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
		db.transaction(function (tx){
		tx.executeSql('SELECT printer,printercom FROM CONFIG where id=1',[],
		function(tx,res){
			if(res.rows.length>0){
				var miprint=res.rows.item(0);
				if(miprint.printer!=null){
					if(localStorage.getItem("printtrade")==2){
						StarIOAdapter.rawprint(json,miprint.printer, function() {
								if(localStorage.getItem("idioma")==1)
									showalert("Imprimiendo Precuenta.");
								else if(localStorage.getItem("idioma")==2)
									showalert("Printing Check.");
						});
					}else{
						StarIOAdapter.printepson(json,localStorage.getItem("printmodel"),localStorage.getItem("printaddress"),localStorage.getItem("printtype"), function() {
								if(localStorage.getItem("idioma")==1)
									showalert("Imprimiendo Precuenta.");
								else if(localStorage.getItem("idioma")==2)
									showalert("Printing Check.");
						});
					}
				}
			}
		});
		},errorCB,successCB);
	}
}

function ActivarMitades(id){
	contadormitades=0;
	mitades=true;
	$('#mid_'+id).attr("class","btn btn-success btn-lg");
}

function ActivarCant(id){
  $('#mid_1').fadeOut();
  $('#ninguno').fadeOut();
  var cant = $('#auxcant').html();
  var nuevacant = cant+id;
	$('#auxcant').html(nuevacant);
}

function BorrarCant(){
  $('#auxcant').html('');
}

function SaveMesaLocal(){
  var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
  var id_empleado = $('#idempleado').val();
  if(id_empleado == '0'){
    if(localStorage.getItem("idioma")==1){
      alert('Para continuar debe escoger el mesero.');
    }else{
      alert('To continue you must choose the waiter.');
    }
  }else{

    $('#popupEmpleados').modal("hide");
    var apiURL='http://'+localStorage.getItem("ip_servidor")+'/connectnubepos/api2.php';
     var query = '';
     var datos = '';
     var mesaactiva=sessionStorage.getItem("mesa_activa");
     $('#tablaCompra>tbody>tr').each(function(){
		var inputdata=$(this).find('.productDetails');
		if(inputdata!=null){
			var details=inputdata.val();
			var agreg=""
			if(inputdata.attr('data-detagregados')!=null&&inputdata.attr('data-detagregados')!=""&&inputdata.attr('data-detagregados')!="undefined")
				agreg=inputdata.attr('data-detagregados');
			var notes="";
			if(inputdata.attr('data-notes')!=null&&inputdata.attr('data-notes')!=""&&inputdata.attr('data-notes')!="undefined")
				notes=inputdata.attr('data-notes');
			var idreal="";
			if(inputdata.attr('data-id_real')!=null&&inputdata.attr('data-id_real')!=""&&inputdata.attr('data-id_real')!="undefined")
				idreal=inputdata.attr('data-id_real');
			var fecha= new Date().getTime();

            if( $(this).find('.product_del').is(':visible') ){
                query += "INSERT INTO mesas_consumos (id_mesa,hora,details,agregados,notas,id_real) values ('"+mesaactiva+"','"+fecha+"','"+details+"','"+agreg+"','"+notes+"','"+idreal+"')||@";
                datos += details+'|@|'+agreg+'|@|'+notes+'|@|'+idreal+'|@|'+fecha+'|/@';
            }else{
                //alert('Elemento oculto');
            }

		}
	});

    //alert(query);

     $.post(apiURL,{
		id_emp : localStorage.getItem("empresa"),
		action : 'GuardaPedido',
		id_barra : localStorage.getItem("idbarra"),
		deviceid:$("#deviceid").html(),
        id_mesa : mesaactiva,
        query : query,
        datos : datos,
        con_menu : localStorage.getItem("diseno"),
        id_empleado : id_empleado
		}).done(function(response){
			if(response!='block' && response!='Desactivado'){
				console.log(response);
                var resp = response.split("||");
                if(resp[0] == 'ok'){
                  console.log("consumo insertados"+query);
                }else{
                  envia('puntodeventa');
                }

			}else if(response=='Desactivado'){
			    envia('cloud');
				setTimeout(function(){
					$('.navbar,#barraalternamovil').slideUp();
					$("#demoGratis,#fadeRow,#finalizado,#contentStepSincro,#cuentaactiva").css("display","none");
					$('#desactivo').fadeIn();
				},100);
			}else{
				envia('cloud');
				setTimeout(function(){
					$('#linklogin,#linkloginb').attr("href","https://www.practisis.net/index3.php?rvpas="+localStorage.getItem("userPasswod")+"&rvus="+localStorage.getItem("userRegister"));
					$('.navbar,#barraalternamovil').slideUp();
					$("#demoGratis,#fadeRow,#finalizado,#contentStepSincro,#cuentaactiva").css("display","none");
					$('#bloqueo').fadeIn();
				},100);

			}

		}).fail(function(){
			updateOnlineStatus("OFFLINE");
			setTimeout(function(){SincronizadorNormal()},180000);
		});

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

	var mensajepie="";
	if(localStorage.getItem("mensajefinal")!=''&&localStorage.getItem("mensajefinal")!=null){
		if(!localStorage.getItem("paquete")=="1")
		   mensajepie=localStorage.getItem("mensajefinal");
	}

	//json = json.substring(0,json.length -1);
	json += '],"mesa":"'+sessionStorage.getItem("mesa_name")+'",';
	json += '"lang":"'+localStorage.getItem("idioma")+'",';
	json += '"mensajefinal":"'+mensajepie+'"';
	json += '}]}';


	console.log(json);

	if(localStorage.getItem("lang")==1)
		showalert("Pedido Guardado con éxito");
	else
		showalert("Order Saved Successfully");

	if(cuan>0){
		//comanderas
		db.transaction(function (tx){
		tx.executeSql('SELECT printercom FROM CONFIG where id=1',[],
		function(tx,res){
			if(res.rows.length>0){
				var miprint=res.rows.item(0);
				if(localStorage.getItem("con_mesas")=="true"){
					if(miprint.printercom!=null){
						if(localStorage.getItem("printtradec")==2){
							StarIOAdapter.rawprint(json,miprint.printercom, function() {});
						}else if(localStorage.getItem("printtradec")==1){
							StarIOAdapter.printepson(json,localStorage.getItem("commodel"),localStorage.getItem("comaddress"),localStorage.getItem("comtype"), function(){});
						}
					}else{
						if(localStorage.getItem("idioma")==1)
							showalert("No se ha configurado una impresora para comandas.");
						else if(localStorage.getItem("idioma")==2)
							showalert("There is no configured a command printer.");
					}
				}
			}
		});
		},errorCB,successCB);
				//fin comanderas
	}
	/*imprimir comandas no comandadas*/

	setTimeout(function(){envia("puntodeventa")},2500);
  }

}

function ParaConsumoInterno(){
	var pagaconcredito=localStorage.getItem("pagarconcredito");
	if(pagaconcredito==null)
		pagaconcredito='false';
	
	if(pagaconcredito.toString()=='true'){
		var cedula=$('#cedulaP').val();
		var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
		db.transaction(function (tx){
			tx.executeSql('SELECT cupo FROM CLIENTES where cedula=?',[cedula],
			function(tx,res){
				console.log(res);
				if(res.rows.length>0){
					//alert("hola");
					var item=res.rows.item(0);
					var cupo=parseFloat(item.cupo);
					var mitotal=$('#total').html();
					mitotal=mitotal.substring(1);
					var total=parseFloat(mitotal);
					$('#cupoactual').html(cupo.toFixed(2));
					//alert(total+"/"+cupo);
					if(total>cupo){
						//alert("No tiene cupo.");
						$('#cedulaP').val('9999999999999');
						$('#nombreP').val('');
						noCliente();
						cancelPayment();
						$('#popupinsuficiente').modal("show");
						setTimeout(function(){
							$('#popupinsuficiente').modal("hide");
							$('#cupoactual').html("0.00");
							envia("puntodeventa");
						},4000);
					}else{
						//alert("Si tiene cupo");
						jsonNuevoCliente();
					}
				}
			})
		},errorCB,successCB);
		
		
		/*if(tiene==true){
			jsonNuevoCliente();
		}else{
			$('#cedulaP').val('9999999999999');
			$('#nombreP').val('');
			noCliente();
			cancelPayment();
			$('#popupinsuficiente').modal("show");
			setTimeout(function(){
				$('#popupinsuficiente').modal("hide");
				$('#cupoactual').html("0.00");
			},4000);
		}*/
	}else{
		jsonNuevoCliente();
	}
}

function RevisarCupo(RUC){
	var db = window.openDatabase("Database", "1.0", "PractisisMobile", 200000);
	db.transaction(function (tx){
		tx.executeSql('SELECT cupo FROM CLIENTES where cedula=?',[RUC],
		function(tx,res){
			console.log(res);
			if(res.rows.length>0){
				//alert("hola");
				var item=res.rows.item(0);
				var cupo=parseFloat(item.cupo);
				var mitotal=$('#total').html();
				mitotal=mitotal.substring(1);
				var total=parseFloat(mitotal);
				alert(total+"/"+cupo);
				if(total>cupo){
					//alert("No tiene cupo.");
					$('#cupoactual').html(cupo.toFixed(2));
					return false;
				}else{
					//alert("Si tiene cupo");
					return true;
				}
			}
		})
	},errorCB,successCB);
}

function ToggleServicio(){	
	if($('#sinservicio').is(':checked')){
		localStorage.setItem("noservicio",'true');
	}else{
		localStorage.setItem("noservicio",'false');
	}
	$('.categoriaActiva').click();
}

function alertaservicio(){
	if($('#itemsVendidos').html()>0){
		showalertred("Para activar o desactivar el servicio debe eliminar todos los productos comandados.");
	}
}

function UsarBwise(){
	//alert("entra al bwise");
	var subconiva=parseFloat($('#subtotalIva').val()).toFixed(2);
	var subsiniva=parseFloat($('#subtotalSinIva').val());
	var propinaval=parseFloat($('#propinaFactura').val()).toFixed(2);
	$('.esImpuesto').each(function(){
		if(!($.trim($(this).attr('data-nombre').toLowerCase())=='iva')){
			subsiniva+=parseFloat($(this).val());
		}
	});
	
	var referencia=new Date().getTime();
	$('#timespanFactura').val(referencia);
	var cadenavalores=subconiva+"|"+subsiniva.toFixed(2)+"|0.00|"+propinaval+"|"+referencia.toString();
	//alert(cadenavalores);
	StarIOAdapter.bwise(cadenavalores,function(resp){
		//alert(resp);
		var dataresp=resp.split("|");
		var total=$('#total').html().substring(1);
		if(parseFloat(dataresp[0])==parseFloat(total)){
			PagoSimple();
			elegirTarjeta(7);
		}
	},
	function(error){alert(error);});
}

function SubtotalesDescuento(){
	var descuentoconimp=parseFloat($('#descuentoFactura').val());
	var subconiva=parseFloat($('#subtotalIva').val());
	var subsiniva=parseFloat($('#subtotalSinIva').val());
	var total=parseFloat($('#totalmiFactura').val());
	var restanewconiva=subconiva/total*descuentoconimp;
	var restanewsiniva=subsiniva/total*descuentoconimp;
	//var restadescuento=descuentoconimp/total*descuentoconimp;
	var restadescuento=1;
	$('#subtotalIva').val(subconiva-restanewconiva);
	$('#subtotalSinIva').val(subsiniva-restanewsiniva);
	//$('#descuentoFacturatrue').val(descuentoconimp-restadescuento);
	console.log('subconiva:'+(subconiva-restanewconiva));
	console.log('subsiniva:'+(subsiniva-restanewsiniva));
	//console.log('descuento:'+(descuentoconimp-restadescuento));
	$('.esImpuesto').each(function(){
		var valorimp=parseFloat($(this).val());
		var resta_imp=valorimp/total*descuentoconimp;
		$(this).val(valorimp-resta_imp);
		console.log('imp:'+(valorimp-resta_imp));
		restadescuento+=parseFloat($(this).attr('data-valor'));
	});
	var newdesc=descuentoconimp/restadescuento;
	$('#descuentoFacturatrue').val(newdesc.toFixed(3));
}