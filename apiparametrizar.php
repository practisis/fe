<?php
session_start();
ini_set('display_startup_errors',1);
ini_set('display_errors',1);
error_reporting(-1);
$em = $_REQUEST['bd'];
$dbname = 'administrador_practisis';
include('../../../enoc.php');
$esfranquiciado = 0;
$esfranquicia = 0;
$principal = 0;
$idfranquicias='';

$consultafranquicia = "select * from franquicias where id_franquicia=$em order by id limit 1";
    $resultadofranquicia = pg_query($consultafranquicia) or die('Consulta fallida: ' . pg_last_error());
      while ($rowfranquicia=pg_fetch_array($resultadofranquicia, null, PGSQL_ASSOC)){
        $esfranquicia = 1;

        $consultafranquicias = "select * from franquicias where id_franquicia=$em order by id";
        $resultadofranquicias = pg_query($consultafranquicias) or die('Consulta fallida: ' . pg_last_error());
          while ($rowfranquicias=pg_fetch_array($resultadofranquicias, null, PGSQL_ASSOC)){
            $idfranquicias .= $rowfranquicias['id_franquiciado'].'|';
          }
          $idfranquicias = $em.'|'.$idfranquicias;
      }

$consultafranquiciado = "select * from franquicias where activo='TRUE' and id_franquiciado=$em order by id";
    $resultadofranquiciado = pg_query($consultafranquiciado) or die('Consulta fallida: ' . pg_last_error());
      while ($rowfranquiciado=pg_fetch_array($resultadofranquiciado, null, PGSQL_ASSOC)){
        $esfranquiciado = 1;
        $idfranquicia = $rowfranquiciado['id_franquicia'];

        $consultafranquicias = "select * from franquicias where id_franquicia=$idfranquicia order by id";
        $resultadofranquicias = pg_query($consultafranquicias) or die('Consulta fallida: ' . pg_last_error());
          while ($rowfranquicias=pg_fetch_array($resultadofranquicias, null, PGSQL_ASSOC)){
            $idfranquicias .= $rowfranquicias['id_franquiciado'].'|';
          }
          $idfranquicias = $idfranquicia.'|'.$idfranquicias;

      }

if($esfranquicia==1 && $esfranquiciado==0){
}else if($esfranquiciado==1 && $esfranquicia==0){
}else{
  $idfranquicias = $em.'|';
  $principal = 1;
}

$rvpass = $_REQUEST['rvpass'];
$dbname = 'emp'.$_REQUEST['bd'];
include('../../../enoc.php');
    if($rvpass==16){
        $idtipo = $_REQUEST['idtipo'];
        $consulta = "select * from locales where activo";
        $resulta = pg_query($consulta) or die('Consulta fallida: ' . pg_last_error());
        while ($row=pg_fetch_array($resulta, null, PGSQL_ASSOC)){
        $idlocal = $row['id'];
        //echo  $idtipo.'**'.$idlocal;

        $valor = '';
        $valorsi = '';
		$valorc = '';
        $valorco ='';
        $valorceco = '';

        $consultatipo = "select id_cuenta,id_cuenta_sin_iva,id_cuenta_compra,id_cuenta_costo,id_centro_costo from formulados_tipo_cuentas where id_formulado_tipo=$idtipo and id_locales=$idlocal";
        $resultatipo = pg_query($consultatipo) or die('Consulta fallida: ' . pg_last_error());
        while ($rowtipo=pg_fetch_array($resultatipo, null, PGSQL_ASSOC)){
                $valor = $rowtipo['id_cuenta'];
                $valorsi = $rowtipo['id_cuenta_sin_iva'];
                $valorc = $rowtipo['id_cuenta_compra'];
                $valorco = $rowtipo['id_cuenta_costo'];
                $valorceco = $rowtipo['id_centro_costo'];
        }
        ?>
        <tr><td colspan='2'>&nbsp;</td></tr>
        <tr>
          <td colspan='1' style="width: 25%;padding-left: 2px;"><div id="nomlocal<?php echo $row['id'];?>" style="padding-left: 2px;"><?php echo $row['local'];?></div></td>
          <td colspan='1' style="width: 15%;text-align: center;">
		  <!---<input type='text' class='form-control input-sm editable' id="valorx<?php echo $row['id'];?>" name="valorx<?php echo $row['id'];?>" />-->
          <select id="valorx<?php echo $row['id'];?>" class="editable" name="valorx<?php echo $row['id'];?>" size="1" style="width: 100%;height:20px;">
          <option value="0"></option>
          <?php
          $consultacuentas = "select * from plancuentas where activo and detalle and cuenta ilike '4.%' order by cuenta";
            $resultacuentas = pg_query($consultacuentas) or die('Consulta fallida: ' . pg_last_error());
            while ($rowcuentas=pg_fetch_array($resultacuentas, null, PGSQL_ASSOC)){
                $idcuenta = $rowcuentas['id'];
                $numcuenta = $rowcuentas['cuenta'];
                $descuenta = $rowcuentas['descripcion'];

            if($valor==$idcuenta){
              $selcuenta = 'selected="selected"';
            }else{
              $selcuenta = '';
            }

          ?>
          <option value="<?php echo $idcuenta;?>" <?php echo $selcuenta;?> ><?php echo $numcuenta.' '.$descuenta;?></option>
          <?php
            }
          ?>
          </select>
          </td>
          <td colspan='1'>&nbsp;</td>
          <td colspan='1' style="width: 15%;text-align: center;">
		   <!--<input type='text' class='form-control input-sm editable' id="valorsi<?php echo $row['id'];?>" name="valorsi<?php echo $row['id'];?>" />--->
          <select id="valorsi<?php echo $row['id'];?>" class="editable" name="valorsi<?php echo $row['id'];?>" size="1" style="width: 100%;height:20px;">
          <option value="0"></option>
          <?php
          $consultacuentassi = "select * from plancuentas where activo and detalle and cuenta ilike '4.%' order by cuenta";
            $resultacuentassi = pg_query($consultacuentassi) or die('Consulta fallida: ' . pg_last_error());
            while ($rowcuentassi=pg_fetch_array($resultacuentassi, null, PGSQL_ASSOC)){
                $idcuentasi = $rowcuentassi['id'];
                $numcuentasi = $rowcuentassi['cuenta'];
                $descuentasi = $rowcuentassi['descripcion'];

            if($valorsi==$idcuentasi){
              $selcuentasi = 'selected="selected"';
            }else{
              $selcuentasi = '';
            }
          ?>
         <option value="<?php echo $idcuentasi;?>" <?php echo $selcuentasi;?> ><?php echo $numcuentasi.' '.$descuentasi;?></option>
          <?php
            }
          ?>
          </select>
          </td>
          <td colspan='1'>&nbsp;</td>
          <td colspan='1' style="width: 15%;text-align: center;">
		   <!--<input type='text' class='form-control input-sm editable' id="valorv<?php echo $row['id'];?>" name="valorv<?php echo $row['id'];?>" />-->
          <select id="valorv<?php echo $row['id'];?>" class="editable" name="valorv<?php echo $row['id'];?>" size="1" style="width: 100%;height:20px;">
          <option value="0"></option>
          <?php
			$consultacuentasc = "select * from plancuentas where activo and detalle order by cuenta";
            $resultacuentasc = pg_query($consultacuentasc) or die('Consulta fallida: ' . pg_last_error());
            while ($rowcuentasc=pg_fetch_array($resultacuentasc, null, PGSQL_ASSOC)){
                $idcuentac = $rowcuentasc['id'];
                $numcuentac = $rowcuentasc['cuenta'];
                $descuentac = $rowcuentasc['descripcion'];

            if($valorc==$idcuentac){
              $selcuentac = 'selected="selected"';
            }else{
              $selcuentac = '';
            }

          ?>
          <option value="<?php echo $idcuentac;?>" <?php echo $selcuentac;?> ><?php echo $numcuentac.' '.$descuentac;?></option>
          <?php
            }
          ?>
          </select>
          </td>
          <td colspan='1'>&nbsp;</td>
          <td colspan='1' style="width: 15%;text-align: center;">
		   <!---<input type='text' class='form-control input-sm editable' id="valorco<?php echo $row['id'];?>" name="valorco<?php echo $row['id'];?>"/>-->
          <select id="valorco<?php echo $row['id'];?>" class="editable" name="valorco<?php echo $row['id'];?>" size="1" style="width: 100%;height:20px;">
          <option value="0"></option>
          <?php
          $consultacuentasco = "select * from plancuentas where activo and detalle and (cuenta ilike '5%' or cuenta ilike '7%') order by cuenta";
            $resultacuentasco = pg_query($consultacuentasco) or die('Consulta fallida: ' . pg_last_error());
            while ($rowcuentasco=pg_fetch_array($resultacuentasco, null, PGSQL_ASSOC)){
                $idcuentaco = $rowcuentasco['id'];
                $numcuentaco = $rowcuentasco['cuenta'];
                $descuentaco = $rowcuentasco['descripcion'];

            if($valorco==$idcuentaco){
              $selcuentaco = 'selected="selected"';
            }else{
              $selcuentaco = '';
            }

          ?>
          <option value="<?php echo $idcuentaco;?>" <?php echo $selcuentaco;?> ><?php echo $numcuentaco.' '.$descuentaco;?></option>
          <?php
          }
          ?>
          </select>
          </td>
          <td colspan='1'>&nbsp;</td>
          <td colspan='1' style="width: 15%;text-align: center;">
		  <!--<input type='text' class='form-control input-sm editable' id="valorceco<?php echo $row['id'];?>" name="valorceco<?php echo $row['id'];?>"/>-->
          <select id="valorceco<?php echo $row['id'];?>" class="editable" name="valorceco<?php echo $row['id'];?>" size="1" style="width: 100%;height:20px;">
          <option value="0"></option>
          <?php
          $consultacuentasceco = "select * from centrocosto order by centrocosto";
            $resultacuentasceco = pg_query($consultacuentasceco) or die('Consulta fallida: ' . pg_last_error());
            while ($rowcuentasceco=pg_fetch_array($resultacuentasceco, null, PGSQL_ASSOC)){
                $idcuentaceco = $rowcuentasceco['id'];
                $centrocosto = $rowcuentasceco['centrocosto'];

            if($valorceco==$idcuentaceco){
              $selcuentaceco = 'selected="selected"';
            }else{
              $selcuentaceco = '';
            }

          ?>
          <option value="<?php echo $idcuentaceco;?>" <?php echo $selcuentaceco;?> ><?php echo $centrocosto;?></option>
          <?php
            }
          ?>
          </select>
          </td>
        </tr>
        <?php

        }
    }

    if($rvpass==17){
        $idtipo = $_REQUEST['idtipo'];
        $datos = $_REQUEST['datos'];
        $datosaux = explode('|',$datos);
        $datossi = $_REQUEST['datossi'];
        $datossiaux = explode('|',$datossi);
        $datosc = $_REQUEST['datosc'];
        $datosauxc = explode('|',$datosc);
        $datosco = $_REQUEST['datosco'];
        $datosauxco = explode('|',$datosco);
		//print_r($datosauxco);
        $datosceco = $_REQUEST['datosceco'];
        $datosauxceco = explode('|',$datosceco);

          $query = "update formulados_tipo_cuentas set id_cuenta=0,id_cuenta_sin_iva=0,id_cuenta_compra=0,id_cuenta_costo=0,id_centro_costo=0 where id_formulado_tipo=$idtipo";
          $result = pg_query($query);

          for($i=0;$i<count($datosaux)-1;$i++){
            $locales = explode('//',$datosaux[$i]);
            $idlocal = $locales[0];
            $valor = $locales[1];
            //echo $idlocal.'**'.$valor;

            $existe = 0;

            $consultatipo = "select * from formulados_tipo_cuentas where id_formulado_tipo=$idtipo and id_locales=$idlocal";
			//echo $consultatipo;
            $resultatipo = pg_query($consultatipo) or die('Consulta fallida: ' . pg_last_error());
            if($rowtipo=pg_fetch_array($resultatipo, null, PGSQL_ASSOC)){
                $existe = 1;
            }

			//echo "Ana".'/'.$existe.'/'.$idtipo;
			
            if($existe==1){
              $queryup = "update formulados_tipo_cuentas set id_cuenta='$valor' where id_formulado_tipo='$idtipo' and id_locales='$idlocal'";
              //echo $queryup;
              $resultup = pg_query($queryup) or die (pg_last_error());
            }else if($existe==0){
              $queryini = "insert into formulados_tipo_cuentas (id_formulado_tipo,id_locales,id_cuenta) values ('$idtipo','$idlocal','$valor');";
              //echo $queryini;
              $resultini = pg_query($queryini) or die (pg_last_error());
            }
          }

          for($isi=0;$isi<count($datossiaux)-1;$isi++){
            $localessi = explode('//',$datossiaux[$isi]);
            $idlocalsi = $localessi[0];
            $valorsi = $localessi[1];

            $existesi = 0;

            $consultatiposi = "select * from formulados_tipo_cuentas where id_formulado_tipo=$idtipo and id_locales=$idlocal";
			//echo $consultatipo;
            $resultatiposi = pg_query($consultatiposi) or die('Consulta fallida: ' . pg_last_error());
            if($rowtiposi=pg_fetch_array($resultatiposi, null, PGSQL_ASSOC)){
                $existesi = 1;
            }

            if($existesi==1){
              $queryupsi = "update formulados_tipo_cuentas set id_cuenta_sin_iva='$valorsi' where id_formulado_tipo=$idtipo and id_locales=$idlocalsi";
              //echo $queryupsi;
              $resultupsi = pg_query($queryupsi);
            }else if($existesi==0){
              $queryinisi = "insert into formulados_tipo_cuentas (id_formulado_tipo,id_locales,id_cuenta_sin_iva) values ($idtipo,$idlocalsi,'$valorsi');";
              //echo $queryinisi;
              $resultinisi = pg_query($queryinisi);
            }
          }

          for($ic=0;$ic<count($datosauxc)-1;$ic++){
            $localesc = explode('//',$datosauxc[$ic]);
            $idlocalc = $localesc[0];
            $valorc = $localesc[1];
            //echo $idlocalc.'**'.$valorc;

            $existec = 0;

            $consultatipoc = "select * from formulados_tipo_cuentas where id_formulado_tipo=$idtipo and id_locales=$idlocalc";
            $resultatipoc = pg_query($consultatipoc) or die('Consulta fallida: ' . pg_last_error());
            if ($rowtipoc=pg_fetch_array($resultatipoc, null, PGSQL_ASSOC)){
                $existec = 1;
            }

            if($existec==1){
              $queryupc = "update formulados_tipo_cuentas set id_cuenta_compra='$valorc' where id_formulado_tipo=$idtipo and id_locales=$idlocalc";
              //echo $queryupc;
              $resultupc = pg_query($queryupc);
            }else if($existec==0){
              $queryinic = "insert into formulados_tipo_cuentas (id_formulado_tipo,id_locales,id_cuenta_compra) values ($idtipo,$idlocalc,'$valorc');";
              //echo $queryinic;
              $resultinic = pg_query($queryinic);
            }

          }

          for($ico=0;$ico<count($datosauxco)-1;$ico++){
            $localesco = explode('//',$datosauxco[$ico]);
            $idlocalco = $localesco[0];
            $valorco = $localesco[1];
            //echo $idlocalco.'**'.$valorco;

            $existeco = 0;

            $consultatipoco = "select * from formulados_tipo_cuentas where id_formulado_tipo=$idtipo and id_locales=$idlocalco";
            $resultatipoco = pg_query($consultatipoco) or die('Consulta fallida: ' . pg_last_error());
            if($rowtipoco=pg_fetch_array($resultatipoco, null, PGSQL_ASSOC)){
                $existeco = 1;
            }
			//echo $existeco;
            if($existeco==1){
              $queryupco = "update formulados_tipo_cuentas set id_cuenta_costo='$valorco' where id_formulado_tipo=$idtipo and id_locales=$idlocalco";
              //echo $queryupco;
              $resultupco = pg_query($queryupco);
            }else if($existeco==0){
              $queryinico = "insert into formulados_tipo_cuentas (id_formulado_tipo,id_locales,id_cuenta_costo) values ($idtipo,$idlocalco,'$valorco');";
              //echo $queryinico;
              $resultinico = pg_query($queryinico);
            }

          }

          for($iceco=0;$iceco<count($datosauxceco)-1;$iceco++){
            $localesceco = explode('//',$datosauxceco[$iceco]);
            $idlocalceco = $localesceco[0];
            $valorceco = $localesceco[1];
            //echo $idlocalceco.'**'.$valorceco;

            $existececo = 0;

            $consultatipoceco = "select * from formulados_tipo_cuentas where id_formulado_tipo=$idtipo and id_locales=$idlocalceco";
            $resultatipoceco = pg_query($consultatipoceco) or die('Consulta fallida: ' . pg_last_error());
            if ($rowtipoceco=pg_fetch_array($resultatipoceco, null, PGSQL_ASSOC)){
                $existececo = 1;
            }

            if($existececo==1){
              $queryupceco = "update formulados_tipo_cuentas set id_centro_costo='$valorceco' where id_formulado_tipo=$idtipo and id_locales=$idlocalceco";
              //echo $queryupceco;
              $resultupceco = pg_query($queryupceco);
            }else if($existececo==0){
              $queryiniceco = "insert into formulados_tipo_cuentas (id_formulado_tipo,id_locales,id_centro_costo) values ($idtipo,$idlocalceco,'$valorceco');";
              //echo $queryiniceco;
              $resultiniceco = pg_query($queryiniceco);
            }

          }

    }

    if($rvpass==18){
        $idevento = $_REQUEST['idevento'];
        $cuenta = $_REQUEST['cuenta'];

        $query = "update eventos set idplancuenta=$cuenta where id=$idevento";
        $result = pg_query($query);
		echo "ok";
    }
	
	if($rvpass==19){
		$idrvventas=array();
		$idrvporcen=array();
		$idrvcuenta=array();
		$idrcventas=array();
		$idrcporcen=array();
		$idrccuenta=array();
		
		if(isset($_POST['retidv']))
			$idrvventas=$_POST['retidv'];
		if(isset($_POST['retporv']))
			$idrvporcen=$_POST['retporv'];
		if(isset($_POST['retcuentav']))
			$idrvcuenta=$_POST['retcuentav'];
		if(isset($_POST['retidc']))
			$idrcventas=$_POST['retidc'];
		if(isset($_POST['retporc']))
			$idrcporcen=$_POST['retporc'];
		if(isset($_POST['retcuentac']))
			$idrccuenta=$_POST['retcuentac'];
		
		$n=0;
		foreach($idrvventas as $val){
			$queryupdate = "update codigoretenciones set idcuentaretuvo='$idrvcuenta[$n]',porcentaje='$idrvporcen[$n]' where id='$val'";
              //echo $queryinico;
            $resultinico = pg_query($queryupdate) or die (pg_last_error());
			$n++;
		}
		$n=0;
		foreach($idrcventas as $val){
			$queryupdate = "update cod_retenciones set id_cuenta='$idrccuenta[$n]',porcentaje='$idrcporcen[$n]' where id='$val'";
              //echo $queryinico;
            $resultinico = pg_query($queryupdate) or die (pg_last_error());
			$n++;
		}
		echo "OK";
	}
	
	if($rvpass==21){
		try{
			$micadena=$_POST['cajaventas'];
			$cadenacards=$_POST['tarjetas'];
			$cadenaotras=$_POST['otras'];
			
			///para efectivo
			
			$string=explode("@",$micadena);
			foreach($string as $cadena){
				$explode=explode("_",$cadena);
				$locales='';
				$queryselect = "select id_locales_ventas,id from plancuentas where id_locales_ventas!=''";
				$resultsel = pg_query($queryselect) or die (pg_last_error());
				while($rowsel=pg_fetch_array($resultsel)){
					$todos=explode(",",$rowsel['id_locales_ventas']);
					if(in_array($explode[1],$todos)){
						$position=array_search($explode[1],$todos);
						array_splice($todos,$position,1);
					}
					$locales=implode(",",$todos);
					$queryupdate = "update plancuentas set id_locales_ventas='$locales' where id='$rowsel[id]'";
					$resultinico = pg_query($queryupdate) or die (pg_last_error());
				}
				if($explode[2]>0){
					$todos=array();
					$queryselect = "select id_locales_ventas from plancuentas where id='$explode[2]'";
					$resultsel = pg_query($queryselect) or die (pg_last_error());
					$rowsel=pg_fetch_array($resultsel);
					//echo "Ana".$rowsel['id_locales_ventas'];
					if($rowsel['id_locales_ventas']!=''&&$rowsel['id_locales_ventas']!=null){
						//echo "entra un if";
						$todos=explode(",",$rowsel['id_locales_ventas']);
						if(!in_array($explode[1],$todos)){
							//echo "entra dos if";
								$todos[]=$explode[1];
						}
					}else{
						$todos[]=$explode[1];
					}
					
					$locales=implode(",",$todos);
					$queryupdate = "update plancuentas set id_locales_ventas='$locales' where id='$explode[2]'";
					$resultinico = pg_query($queryupdate) or die (pg_last_error());
				}
			}
			
			//para tarjetas
			$string=explode("@",$cadenacards);
			$queryselect = "select id_tarjetas,id from plancuentas where id_tarjetas!=''";
			$resultsel = pg_query($queryselect) or die (pg_last_error());
			while($rowsel=pg_fetch_array($resultsel)){
				$queryupdate = "update plancuentas set id_tarjetas='' where id='$rowsel[id]'";
				$resultinico = pg_query($queryupdate) or die (pg_last_error());
			}
			
			//$locales='';
			$todos=array();
			foreach($string as $cadena){
				$explode=explode("_",$cadena);
				if((int)$explode[2]>0){
					//print_r($explode[2]);
					$queryselect = "select id_tarjetas from plancuentas where id='$explode[2]'";
					$resultsel = pg_query($queryselect) or die (pg_last_error());
					$rowsel=pg_fetch_array($resultsel);
					/*if($rowsel['id_tarjetas']!=''&&$rowsel['id_tarjetas']!=null){
						$todos=explode(",",$rowsel['id_tarjetas']);
						if(!in_array($explode[1],$todos)){
							$todos[]=$explode[1];
						}
					}else{*/
						$todos[$explode[2]][]=$explode[1];
					//}
				}
			}
			//print_r($todos);
			foreach($todos as $key=>$value){
				$locales=implode(",",$value);
				$queryupdate = "update plancuentas set id_tarjetas='$locales' where id='$key'";
				$resultinico = pg_query($queryupdate) or die (pg_last_error());
			}
			
			//para otras formas de pago
			$string=explode("@",$cadenaotras);
			$sqlinicio="update plancuentas set cortesia='false',retencion='false',notadecredito='false',iva='false',servicio='false',propina='false' where cortesia or retencion or notadecredito or iva or servicio or propina";
			pg_query($sqlinicio) or die (pg_last_error());
			foreach($string as $cadena){
				$explode=explode("_",$cadena);
				if($explode[2]>0){
					if($explode[1]==9){
						$queryupdate = "update plancuentas set cortesia='true' where id='$explode[2]'";
						$resultsel = pg_query($queryupdate) or die (pg_last_error());
					}
					if($explode[1]==5){
						$queryupdate = "update plancuentas set retencion='true' where id='$explode[2]'";
						$resultsel = pg_query($queryupdate) or die (pg_last_error());
					}
					if($explode[1]==7){
						$queryupdate = "update plancuentas set notadecredito='true' where id='$explode[2]'";
						$resultsel = pg_query($queryupdate) or die (pg_last_error());
					}
				}
			}
			
			if($_REQUEST['cuentaiva']>0){
				$queryupdate = "update plancuentas set iva='true' where id='$_REQUEST[cuentaiva]'";
				$resultsel = pg_query($queryupdate) or die (pg_last_error());
			}
			if($_REQUEST['cuentaser']>0){
				$queryupdate = "update plancuentas set servicio='true' where id='$_REQUEST[cuentaser]'";
				$resultsel = pg_query($queryupdate) or die (pg_last_error());
			}
			if($_REQUEST['cuentaprop']>0){
				$queryupdate = "update plancuentas set propina='true' where id='$_REQUEST[cuentaprop]'";
				$resultsel = pg_query($queryupdate) or die (pg_last_error());
			}	
			echo "OK";
		}catch(Exception $e){
			print_r($e);
		}
	}
?>