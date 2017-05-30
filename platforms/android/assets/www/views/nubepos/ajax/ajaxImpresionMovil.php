<?php 
	header("Access-Control-Allow-Origin: *");
	// print_r($_POST);
	
	function SinTildes($word){
		$word=str_replace("á","a",$word);
		$word=str_replace("Á","A",$word);
		$word=str_replace("é","e",$word);
		$word=str_replace("É","E",$word);
		$word=str_replace("í","i",$word);
		$word=str_replace("Í","I",$word);
		$word=str_replace("ó","o",$word);
		$word=str_replace("Ó","O",$word);
		$word=str_replace("ú","u",$word);
		$word=str_replace("Ú","U",$word);
		$word=str_replace("ñ","n",$word);
		$word=str_replace("Ñ","N",$word);
		return $word;
	}
	
	$numeroFactura = $_POST['numeroFactura'];
	$nombreCliente = $_POST['nombreCliente'];
	$rucCliente = $_POST['rucCliente'];
	$pagoForm = $_POST['pagoForm'];
	$subnoiva = $_POST['subnoiva'];
	$subiva = $_POST['subiva'];
	$iva = $_POST['iva'];
	$descuen = $_POST['descuen'];
	$total = $_POST['total'];
	$serv = '0.00';
	
	$nombrelocal = 'PRUEBAS';
	$baseu='';
	$extend=230;
	$extend=230;
	$midate=date("Y-m-d");
	$hora=date("H");
	$min=date("i");
	$seg=date("s");
	$baseu.="TEXT+4+0+20+10+".str_replace(" ","+",SinTildes($nombrelocal))."%0d%0aTEXT+7+0+20+60+".str_replace(" ","+",SinTildes($nombreCliente))."-RUC.".$rucCliente."%0d%0aTEXT+7+0+20+110+".$midate."+".$hora."%3a".$min."%3a".$seg."%0d%0a";
	$linep="ML+20%0d%0aTEXT+7+0+20+180%0d%0aProducto%0d%0a";
	$linec="ML+20%0d%0aTEXT+7+0+350+180%0d%0aCant.%0d%0a";
	$lines="ML+20%0d%0aTEXT+7+0+440+180%0d%0aPrecio+U.%0d%0a";
	$distanciatotal=200;
	foreach(explode('@',$_POST['valores']) as $valores){
		$exp = explode('|', $valores);
		$linep.=str_replace(" ","+",substr(SinTildes($exp[1]),0,25))."%0d%0a";
		$micant='';
		$strcan=strlen((string)$exp[1]);
		for($i=1;$i<=(3-$strcan);$i++){
			$micant.='+';
		}
		$linec.="+".$micant.$exp[0]."%0d%0a";
		$mipre='';
		$cadenapre=(string)number_format($exp[2],3);
		$datacadena=explode('.',$cadenapre);
		$strpre=strlen($datacadena[0]);
		for($i=4;$i<=(8-$strpre);$i++){
			$mipre.='+';
		}
		$lines.= $mipre.$exp[2]."%0d%0a";
		$distanciatotal+=40;
		$extend+=70;
	}
			
	$linep.="ENDML%0d%0a";$linec.="ENDML%0d%0a";$lines.="ENDML%0d%0a";
	$linei="ML+20%0d%0aTEXT+7+0+350+".$distanciatotal."%0d%0a+Iva%3a%0d%0aServ%3a%0d%0aENDML%0d%0a";
	$miiva='';
	$cadenaiva=(string)number_format($iva,3);
	$datacadena=explode('.',$cadenaiva);
	$striva=strlen($datacadena[0]);
	for($i=4;$i<=(8-$striva);$i++){
			$miiva.='+';
	}
	$miserv='';
	$cadenaserv=(string)number_format($serv,3);
	$datacadena=explode('.',$cadenaserv);
	$strserv=strlen($datacadena[0]);
	for($i=4;$i<=(8-$strserv);$i++){
			$miserv.='+';
	}
	$linei.="ML+20%0d%0aTEXT+7+0+440+".$distanciatotal."%0d%0a".$miiva.$iva."%0d%0a".$miserv.$serv."%0d%0aENDML%0d%0a";
	$distanciatotal+=80;
	
	// $baseu.="TEXT+7+0+20+130+Fact-No.".$est."-".$caja."-".$idfact."%0d%0a";
	$baseu.=$linep.$linec.$lines.$linei;
	$cadenatotal=(string)number_format($total,2);
	$datacadena=explode('.',$cadenatotal);
	$left=350-(50*strlen($datacadena[0]));
	$baseu.="CONCAT+".$left."+".$distanciatotal."%0d%0a4+2+5+%24%0d%0a4+3+0+".$datacadena[0]."%0d%0a4+2+5+.".$datacadena[1]."%0d%0aENDCONCAT%0d%0a";
	$distanciatotal+=90;
	$extend+=40;

	// $totalp=$datat['h']+$datat['m'];
	// $baseu.="ML+45%0d%0aTEXT+4+0+20+".$distanciatotal."%0d%0a++PERSONAS%3a+".$totalp."++H%3a".$datat['h']."++M%3a".$datat['m']."%0d%0aEGRESADOS%3a++++H%3a".$datat['he']."++M%3a".$datat['me']."%0d%0aENDML%0d%0a";
	// $distanciatotal+=100;
	// $extend+=100;

	$baseu.="BT+7+0+5%0d%0aBARCODE+128+3+3+60+90+".$distanciatotal."+".time()."%0d%0aBT";
	$extend+=60;

	$in="!+0+200+200+".$extend."+1%0d%0a".$baseu."%0d%0aPRINT%0d%0a";
	echo 'ok|'.$in;
?>