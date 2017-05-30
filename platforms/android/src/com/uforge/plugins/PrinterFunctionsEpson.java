package com.uforge.plugins;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.Iterator;
import java.text.SimpleDateFormat;
import java.text.DecimalFormat;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Typeface;
import android.text.Layout;
import android.text.StaticLayout;
import android.text.TextPaint;
import android.os.Bundle;
import android.os.Handler;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.Context;

import com.epson.epsonio.Finder;
import com.epson.epsonio.DeviceInfo;
import com.epson.epsonio.FilterOption;
import com.epson.epsonio.DevType;
import com.epson.epsonio.EpsonIoException;
import com.epson.epsonio.IoStatus;
import com.epson.eposprint.Print;
import com.epson.eposprint.Builder;
import com.epson.eposprint.EposException;

public class PrinterFunctionsEpson{
	
	private String openDeviceName = "74:2B:62:D6:62:96";
    //private  int connectionType = Print.DEVTYPE_BLUETOOTH;
    private  int connectionType = Print.DEVTYPE_BLUETOOTH;
    private  int printerModel = Builder.LANG_EN;
    private  String printerName = "TM-T20II";
	
	
	public boolean SecuenciaPrint(CallbackContext callbackContext,String portName,String message,String direction,String type,Context context)
	{
			System.out.println("datosimp:"+direction+"/"+portName+"/"+type);
			this.openDeviceName=direction;
			this.printerName=portName;
			if(type.equals("BT"))
				this.connectionType=Print.DEVTYPE_BLUETOOTH;
			else if(type.equals("USB"))
				this.connectionType=Print.DEVTYPE_USB;
			
			Result result = new Result();
			Builder builder = null;
			
			while (true) {
				try {
					Finder.stop();
					break;
				}
				catch (EpsonIoException e) {
					if (e.getStatus() != IoStatus.ERR_PROCESSING) {
						break;
					}
				}
			}
			
			try {
				// Open 
				Print printer = new Print(context);
				printer.openPrinter(connectionType,this.openDeviceName);
				printer.closePrinter();
			}
			catch (EposException e) {
				System.out.println("no se abre la impresora");
				result.setEposException(e);
				return false;
			}

			// Run print sequence of sample receipt 
			builder = createReceiptData(result,message);

			if (result.getEposException() == null) {
				print(builder,result,context);
			}else{
				return false;
			}
			
			// Clear objects 
			if (builder != null) {
				builder.clearCommandBuffer();
			}

			builder = null;
			result = null;

			return true;
	} 
	
	private Builder createReceiptData(Result result,String message) {
		
		System.out.println(message);
        Builder builder = null;
		
		/*sacadatos del json*/
		String cedulaCliente="";
		String nombreCliente="";
		String direccionCliente="";
		String telefonoCliente="";
		String nombreEmpresa="";
		String direccionEmpresa="";
		String telefonoEmpresa="";
		JSONArray expprod=new JSONArray();
		JSONArray expago=new JSONArray();
		String subconiva="0.00";
		String subsiniva="0.00";
		String totalfact="0.00";
		Double totalfactd=0.00;
		String subtotal="0.00";
		String iva="0.00";
		String servicio="0.00";
		String descuento="0.00";
		String ordername="";
		String mesa="";
		String nofact="";
		SimpleDateFormat hoyformat=new SimpleDateFormat("MM-dd-yyyy HH:mm:ss");
		String hoy= hoyformat.format(new Date());
		String tipo="";
		String fechaCierre="";
		String fechaImpresion="";
		String numeroFacturas="";
		String anuladas="0";
		String subtotalCierre="0.00";
		String descuentoCierre="0.00";
		String subdes="0.00";
		String servicioCierre="0.00";
		String totalCierre="0.00";
		String ivaCierre="0.00";
		String cadimpuestos="";
		String propina="";
		String pax="";
		String logo="";
		String factelectronica="";
		String mensajefinal="Generado con avapos.com";
		Integer lang=1;
		String codigoprint="";
		Integer preimpresas=0;
		JSONArray cierreImpuestos= new JSONArray();
		long lineastotales=36; //18cm-36lineas
		long lineasencabezado=6; //3cm-7lineas
		long fechanumber=0;
		JSONArray expformas=new JSONArray();
		String textoreimpr="";
		if(message.contains("reimpr")){
			message=message.replace("reimpr","");
			textoreimpr="Reimpresion Factura "+hoy;
		}
		try{
			JSONObject jsonobject = new JSONObject(message);
			JSONArray nombres=jsonobject.names();
			if(nombres.toString().contains("Pagar")){
			JSONArray jsonArray = jsonobject.getJSONArray("Pagar");
			JSONObject expjson=jsonArray.getJSONObject(0);
			JSONObject objcliente=expjson.getJSONObject("cliente");
			JSONObject objfactura=expjson.getJSONObject("factura");
			JSONObject objempresa=expjson.getJSONObject("empresa");
			expago=expjson.getJSONArray("pagos");
			expprod=expjson.getJSONArray("producto");
			//expprod=objproducto.getJSONArray("0");
			
			cedulaCliente=objcliente.getString("cedula");
			nombreCliente=objcliente.getString("nombre");
			telefonoCliente=objcliente.getString("telefono");
			direccionCliente=objcliente.getString("direccion");
			if(objcliente.has("logo")){
				if(!(objcliente.getString("logo").equals(JSONObject.NULL)))
					logo=objcliente.getString("logo");
			}
			
			if(objcliente.has("mensajefinal")){
				if(!(objcliente.getString("mensajefinal").equals(JSONObject.NULL)||objcliente.getString("mensajefinal").equals("")))
					mensajefinal=objcliente.getString("mensajefinal");
			}
			
			if(objcliente.has("linkelectronica")){
				if(!(objcliente.getString("linkelectronica").equals(JSONObject.NULL)||objcliente.getString("linkelectronica").equals("")))
					factelectronica=objcliente.getString("linkelectronica");
			}
			
			subconiva=DoubleFormat(objfactura.getDouble("subtotal_iva"));
			//iva=DoubleFormat(objfactura.getDouble("subtotal_iva")*0.12);
			iva=DoubleFormat(objfactura.getDouble("iva"));
			servicio=DoubleFormat(objfactura.getDouble("servicio"));
			subsiniva=DoubleFormat(Double.parseDouble(objfactura.getString("subtotal_sin_iva").replace(",",".")));
			subtotal=DoubleFormat(Double.parseDouble(objfactura.getString("subtotal_sin_iva").replace(",","."))+Double.parseDouble(objfactura.getString("subtotal_iva").replace(",",".")));
			descuento=DoubleFormat(Double.parseDouble(objfactura.getString("descuento").replace(",",".")));
			totalfact=DoubleFormat(Double.parseDouble(objfactura.getString("total").replace(",",".")));
			totalfactd=objfactura.getDouble("total");
			nofact=objfactura.getString("numerofact");
			nombreEmpresa=objempresa.getString("nombre");
			direccionEmpresa=objempresa.getString("direccion");
			fechanumber=(long)objfactura.getDouble("fecha");
			lineastotales=Math.round(2.25*(objfactura.getInt("largo")-2));
			lineasencabezado=Math.round(2*objfactura.getInt("encabezado"));
			
			/*Iterator<?> keys = objfactura.keys();

			while( keys.hasNext() ) {
				String key = (String)keys.next();
				System.out.println(key);
			}*/

			if(objfactura.has("impuestosdata")){
				if(!(objfactura.getString("impuestosdata").equals(JSONObject.NULL)))
					cadimpuestos=objfactura.getString("impuestosdata");
			}
			if(objfactura.has("ordername")){
				if(!(objfactura.getString("ordername").equals(JSONObject.NULL))){
					if(!(objfactura.getString("ordername").equals("")||objfactura.getString("ordername").equals("null")))
					ordername=objfactura.getString("ordername");
				}
				
			}
			
			if(objfactura.has("mesa")){
				if(!(objfactura.getString("mesa").equals(JSONObject.NULL)))
				mesa=objfactura.getString("mesa");
			}
			
			if(objfactura.has("lang")){
				if(!(objfactura.getString("lang").equals(JSONObject.NULL)))
				lang=objfactura.getInt("lang");
			}
			
			if(objfactura.has("propina")){
				if(!(objfactura.getString("propina").equals(JSONObject.NULL)))
				propina=objfactura.getString("propina");
			}
			
			if(objfactura.has("pax")){
				if(!(objfactura.getString("pax").equals(JSONObject.NULL)))
				pax=objfactura.getString("pax");
			}
			
			//System.out.println("viene 1: "+objfactura.getInt("largo"));
			if(objfactura.has("factimpresas")){
				System.out.println("viene: "+objfactura.getInt("factimpresas"));
				if(objfactura.getInt("factimpresas")>=0){
					preimpresas=objfactura.getInt("factimpresas");
				}
			}
			
			//preimpresas=1;
			
			tipo="pagar";
			}else if(nombres.toString().contains("Cierre")){
				tipo="cierre";
				JSONArray jsonArrayc = jsonobject.getJSONArray("Cierre");
				JSONObject expjson=jsonArrayc.getJSONObject(0);
				fechaCierre=expjson.getString("fecha_caja");
				fechaImpresion=expjson.getString("fecha_imp");
				numeroFacturas=expjson.getString("num_facts");
				anuladas=expjson.getString("fact_anuladas");
				numeroFacturas=expjson.getString("num_facts");
				subtotalCierre=expjson.getString("subtotal");
				ivaCierre=expjson.getString("iva");
				totalCierre=expjson.getString("total");
				servicioCierre=expjson.getString("servicio");
				descuentoCierre=expjson.getString("descuento");
				subdes=expjson.getString("subdesc");
				expformas=expjson.getJSONArray("formaspago");
				
				if(!(expjson.getJSONArray("impuestos").equals(JSONObject.NULL)))
					cierreImpuestos=expjson.getJSONArray("impuestos");
				
				if(expjson.has("lang")){
					if(!(expjson.getString("lang").equals(JSONObject.NULL)))
						lang=expjson.getInt("lang");
				}
				
				if(expjson.has("propina")){
					if(!(expjson.getString("propina").equals(JSONObject.NULL)))
						propina=expjson.getString("propina");
				}
				
				if(expjson.has("mensajefinal")){
					if(!(expjson.getString("mensajefinal").equals(JSONObject.NULL)||expjson.getString("mensajefinal").equals("")))
						mensajefinal=expjson.getString("mensajefinal");
				}
				
			}else if(nombres.toString().contains("Comandar")){
				JSONArray jsonArray = jsonobject.getJSONArray("Comandar");
				JSONObject expjson=jsonArray.getJSONObject(0);
				JSONObject objcliente=expjson.getJSONObject("cliente");
				JSONObject objfactura=expjson.getJSONObject("factura");
				JSONObject objempresa=expjson.getJSONObject("empresa");
				expprod=expjson.getJSONArray("producto");
				//expprod=objproducto.getJSONArray("0");
			
				nombreEmpresa=objempresa.getString("nombre");
				nombreCliente=objcliente.getString("nombre");
				fechanumber=(long)objfactura.getDouble("fecha");
				nofact=objfactura.getString("numerofact");
			
				if(objfactura.has("ordername")){
					if(!(objfactura.getString("ordername").equals(JSONObject.NULL))){
						if(!(objfactura.getString("ordername").equals("")||objfactura.getString("ordername").equals("null")))
						ordername=objfactura.getString("ordername");
					}
				}
			
				if(objfactura.has("lang")){
					if(!(objfactura.getString("lang").equals(JSONObject.NULL)))
					lang=objfactura.getInt("lang");
				}
				
				if(objcliente.has("mensajefinal")){
					if(!(objcliente.getString("mensajefinal").equals(JSONObject.NULL)))
						mensajefinal=objcliente.getString("mensajefinal");
				}
				
				tipo="comandar";
			}else if(nombres.toString().contains("Precuenta")){
				JSONArray jsonArray = jsonobject.getJSONArray("Precuenta");
				JSONObject expjson=jsonArray.getJSONObject(0);
				JSONObject objfactura=expjson.getJSONObject("factura");
				expprod=expjson.getJSONArray("producto");
				//expprod=objproducto.getJSONArray("0");
				
				subconiva=DoubleFormat(objfactura.getDouble("subtotal_iva"));
				//iva=DoubleFormat(objfactura.getDouble("subtotal_iva")*0.12);
				iva=DoubleFormat(objfactura.getDouble("iva"));
				servicio=DoubleFormat(objfactura.getDouble("servicio"));
				subsiniva=DoubleFormat(objfactura.getDouble("subtotal_sin_iva"));
				subtotal=DoubleFormat(objfactura.getDouble("subtotal_sin_iva")+objfactura.getDouble("subtotal_iva"));
				descuento=DoubleFormat(objfactura.getDouble("descuento"));
				totalfact=DoubleFormat(objfactura.getDouble("total"));
				fechanumber=(long)objfactura.getDouble("fecha");
				lineastotales=Math.round(2.25*(objfactura.getInt("largo")-2));
				lineasencabezado=Math.round(2*objfactura.getInt("encabezado"));
				if(objfactura.has("impuestosdata")){
					if(!(objfactura.getString("impuestosdata").equals(JSONObject.NULL)))
						cadimpuestos=objfactura.getString("impuestosdata");
				}
				
				if(objfactura.has("ordername")){
					if(!(objfactura.getString("ordername").equals(JSONObject.NULL))){
						if(!(objfactura.getString("ordername").equals("")||objfactura.getString("ordername").equals("null")))
						ordername=objfactura.getString("ordername");
					}
					
				}
				
				if(objfactura.has("mesa")){
					if(!(objfactura.getString("mesa").equals(JSONObject.NULL)))
					mesa=objfactura.getString("mesa");
				}
				
				if(objfactura.has("lang")){
					if(!(objfactura.getString("lang").equals(JSONObject.NULL)))
					lang=objfactura.getInt("lang");
				}
				
				if(objfactura.has("propina")){
					if(!(objfactura.getString("propina").equals(JSONObject.NULL)))
					propina=objfactura.getString("propina");
				}
				
				if(objfactura.has("mensajefinal")){
					if(!(objfactura.getString("mensajefinal").equals(JSONObject.NULL)))
					mensajefinal=objfactura.getString("mensajefinal");
				}
				
				tipo="precuenta";
			}else if(nombres.toString().contains("ComandasMesas")){
				JSONArray jsonArray = jsonobject.getJSONArray("ComandasMesas");
				JSONObject expjson=jsonArray.getJSONObject(0);
				expprod=expjson.getJSONArray("producto");
				mesa=expjson.getString("mesa");
				lang=expjson.getInt("lang");
				tipo="comandasmesas";
				
			}else if(nombres.toString().contains("Barras")){
				JSONArray jsonArray = jsonobject.getJSONArray("Barras");
				JSONObject expjson=jsonArray.getJSONObject(0);
				codigoprint=expjson.getString("codigo");
				tipo="barras";
			}else if(nombres.toString().contains("opendrawer")){
				tipo="opendrawer";
			}
			
			if(lang==1){
				mensajefinal="Generado con avapos.com";
			}else{
				mensajefinal="Powered by avapos.com";
			}
			
		}catch(JSONException ex){

			ex.printStackTrace();
		}
		
		// Top logo data 
        //Bitmap logoData = BitmapFactory.decodeResource(getResources(), R.drawable.store);

        // Text buffer 
        StringBuilder textData = new StringBuilder();
        // Null check
        if (result == null) {
            return null;
        }

        // init result
        result.setPrinterStatus(0);
        result.setBatteryStatus(0);
        result.setEposException(null);
        result.setEpsonIoException(null);
        try {
            // Create builder 
            builder = new Builder(this.printerName, printerModel);
			
			if(tipo.equals("opendrawer")){
				builder.addPulse(Builder.PARAM_DEFAULT, Builder.PULSE_100);
			}else{

            // Set alignment to center 
            builder.addTextAlign(Builder.ALIGN_CENTER);
			 // Section 1 : Store information 
            //builder.addFeedLine(1);
			
		///comienzan comandos
			if(tipo.equals("pagar")){
				
				Integer lineasescritas=0;
				
				if(preimpresas.equals(0)){
					if(!logo.equals("")){
						Bitmap logoData =BitmapFactory.decodeFile("/data/data/com.practisis.practipos/files//"+logo);
						// Add top logo to command buffer 
						builder.addImage(logoData, 0, 0,
								 logoData.getWidth(),
								 logoData.getHeight(),
								 Builder.COLOR_1,
								 Builder.MODE_MONO,
								 Builder.HALFTONE_DITHER,
								 Builder.PARAM_DEFAULT,
								 getCompress(this.connectionType));
						
						builder.addFeedLine(1);
					}
					
					builder.addTextDouble(Builder.TRUE, Builder.TRUE);
					builder.addText(nombreEmpresa+"\n");
					builder.addTextDouble(Builder.FALSE, Builder.FALSE);
					builder.addFeedLine(1);
					textData.append(direccionEmpresa+"-"+telefonoEmpresa+"\n");
				}
				
				System.out.println("preimpresas: "+preimpresas+"/"+lineastotales+"/"+lineasencabezado+"/"+lineasescritas);
				if(preimpresas.equals(1)){
					while(lineasescritas<lineasencabezado){
						textData.append("\n");
						lineasescritas=lineasescritas+1;
					}
				}
				
				if(nombreCliente.equals(""))
					nombreCliente="Consumidor Final";
				
				if(lang.equals(1)){
					
					textData.append(nombreCliente+"-"+cedulaCliente+"\n");
					lineasescritas=lineasescritas+1;
				}
				else if(lang.equals(2)){
					textData.append(nombreCliente.replace("Consumidor Final","Final Customer")+"-"+cedulaCliente+"\n");
					lineasescritas=lineasescritas+1;
				}
					
				textData.append(direccionCliente+"/"+telefonoCliente+"\n");
				lineasescritas=lineasescritas+1;
				
				if(!textoreimpr.equals("")){
					if(lang.equals(1))
						textData.append(textoreimpr+"\n");
					else if(lang.equals(2))
						textData.append(textoreimpr.replace("Reimpresion Factura","Invoice Reprint")+"\n");
					lineasescritas=lineasescritas+1;
				}
					
				textData.append("--------------------------------\n");
				lineasescritas=lineasescritas+1;
				builder.addText(textData.toString());
				textData.delete(0, textData.length());
				
				
				Date fechafact=new Date(fechanumber);
				//String fechaf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(fechafact);
				String fechaf=new SimpleDateFormat("MM-dd-yyyy HH:mm:ss").format(fechafact);
				textData.append("NO:"+nofact+"            \n");
				if(lang.equals(1)){
					textData.append("FECHA:"+fechaf+"       \n");
				}else if(lang.equals(2)){
					textData.append("DATE:"+fechaf+"         \n");
				}
				
				textData.append("--------------------------------\n");
				if(lang.equals(1)){
					textData.append("  # DESCRIPCION             SUMA\n");
				}else if(lang.equals(2)){
					textData.append("  # DESCRIPTION          AMMOUNT\n");
				}
				
				lineasescritas=lineasescritas+3;
				
				
				if(expprod.length()>0){
					for(int i=0;i<expprod.length();i++){
						try{
						JSONObject linea=expprod.getJSONObject(i);
						String cantidad=linea.getString("cant_prod");
						if(cantidad.length()<3){
							int tam=3-cantidad.length();
							for(int n=0;n<tam;n++){
								cantidad=" "+cantidad;
							}
						}
						
						String totc=DoubleFormat((linea.getDouble("precio_orig")+linea.getDouble("agregados"))*linea.getDouble("cant_prod"));
						if(totc.length()<6){
							int tam=6-totc.length();
							for(int n=0;n<tam;n++){
								totc=" "+totc;
							}
						}
						
						String desc=linea.getString("nombre_producto");
						if(desc.length()>21)
							desc=desc.substring(0,21);
						else if(desc.length()<21){
							int tam=21-desc.length();
							for(int n=0;n<tam;n++){
								desc=desc+" ";
							}
						}
												
						
						textData.append(String.valueOf(cantidad)+" "+String.valueOf(desc)+" "+String.valueOf(totc)+"\n");
						
						/**/
						if(!(linea.getString("detalle_agregados").equals(JSONObject.NULL))){
							if(!(linea.getString("detalle_agregados").equals(""))){
								String [] agregadosv=linea.getString("detalle_agregados").split("@");
								for(int s=0;s<agregadosv.length;s++){
									String [] detalleagr=agregadosv[s].split("\\|");
									String medio="";
									if(Double.parseDouble(detalleagr[3])<1&&detalleagr[3]!=null){
										medio="1/2";
									}
									String cadena="    "+medio+detalleagr[0];
									if(cadena.length()<32){
										int tam=32-cadena.length();
										for(int n=0;n<tam;n++){
											cadena=cadena+" ";
										}
									}
									textData.append(cadena+"\n");
								}
							}
						}
						}catch(JSONException ex){
							ex.printStackTrace();
						}
						lineasescritas=lineasescritas+1;
					}
					
				}
				
				textData.append("--------------------------------\n");
				lineasescritas=lineasescritas+1;
				
						if(subconiva.length()<6){
							int tam=6-subconiva.length();
							for(int n=0;n<tam;n++){
								subconiva=" "+subconiva;
							}
						}
				
						if(subsiniva.length()<6){
							int tam=6-subsiniva.length();
							for(int n=0;n<tam;n++){
								subsiniva=" "+subsiniva;
							}
						}
						
						if(subtotal.length()<6){
							int tam=6-subtotal.length();
							for(int n=0;n<tam;n++){
								subtotal=" "+subtotal;
							}
						}
						
						if(iva.length()<6){
							int tam=6-iva.length();
							for(int n=0;n<tam;n++){
								iva=" "+iva;
							}
						}
						
						if(totalfact.length()<6){
							int tam=6-totalfact.length();
							for(int n=0;n<tam;n++){
								totalfact=" "+totalfact;
							}
						}
						
						if(iva.length()<6){
							int tam=6-iva.length();
							for(int n=0;n<tam;n++){
								iva=" "+iva;
							}
						}
						
						if(servicio.length()<6){
							int tam=6-servicio.length();
							for(int n=0;n<tam;n++){
								servicio=" "+servicio;
							}
						}
						
						if(descuento.length()<6){
							int tam=6-descuento.length();
							for(int n=0;n<tam;n++){
								descuento=" "+descuento;
							}
						}
						
						if(propina.length()<6){
							int tam=6-propina.length();
							for(int n=0;n<tam;n++){
								propina=" "+propina;
							}
						}
						
				if(Double.parseDouble(subtotal.replace(",","."))>0){
					textData.append("                 SUBTOTAL:"+String.valueOf(subtotal)+"\n");
					lineasescritas=lineasescritas+1;
				}
				
				
				/*imprime impuestos*/
				if(!cadimpuestos.equals("")){
					String[] imps = cadimpuestos.split("@");
					for(int k=0;k<imps.length;k++){
						if(!(imps[k].equals(""))){
							String [] dataimp=imps[k].split("\\|");
							if(Double.parseDouble(dataimp[3].replace(",","."))>0.00){
								String porcen=DoubleFormat(Double.parseDouble(dataimp[2])*100);
								String nombreimp=dataimp[1]+" "+porcen+"%:";
								String valorimp=DoubleFormat(Double.parseDouble(dataimp[3].replace(",",".")));
								if(valorimp.length()<6){
									int tam=6-valorimp.length();
									for(int n=0;n<tam;n++){
										valorimp=" "+valorimp;
									}
								}
								
								if(nombreimp.length()<26){
									int tam=26-nombreimp.length();
									for(int n=0;n<tam;n++){
										nombreimp=" "+nombreimp;
									}
								}
								
								textData.append(String.valueOf(nombreimp)+String.valueOf(valorimp)+"\n");
							}
						}
						lineasescritas=lineasescritas+1;
					}
				}else{
					if(Double.parseDouble(iva.replace(",","."))>0){
						textData.append("                      IVA:"+String.valueOf(iva)+"\n");
						lineasescritas=lineasescritas+1;
					}
					if(Double.parseDouble(servicio.replace(",","."))>0){
						textData.append("                 SERVICIO:"+String.valueOf(servicio)+"\n");
						lineasescritas=lineasescritas+1;
					}
				}
				/*fin impuestos*/
				if(Double.parseDouble(descuento.replace(",","."))>0){
					if(lang.equals(1)){
						textData.append("                DESCUENTO:"+String.valueOf(descuento)+"\n");
					}else if(lang.equals(2)){
						textData.append("                 DISCOUNT:"+String.valueOf(descuento)+"\n");
					}
					lineasescritas=lineasescritas+1;
				}
				
				if(!(propina.equals("")||Double.parseDouble(propina)==0)){
					if(lang.equals(1)){
						textData.append("                  PROPINA:"+String.valueOf(propina)+"\n");
					}else{
						textData.append("                      TIP:"+String.valueOf(propina)+"\n");
					}
					lineasescritas=lineasescritas+1;
				}
				
				builder.addText(textData.toString());
				textData.delete(0, textData.length());
				
				builder.addTextDouble(Builder.TRUE, Builder.TRUE);
				builder.addText("TOTAL:"+String.valueOf(totalfact)+"\n");
				lineasescritas=lineasescritas+1;
				builder.addTextDouble(Builder.FALSE, Builder.FALSE);
				builder.addFeedLine(1);
				
				//formas de pago
				if(expago.length()>0){
					
					if(lang.equals(1)){
						textData.append("Pagado:                         \n");
					}else if(lang.equals(2)){
						textData.append("Paid:                           \n");
					}
					lineasescritas=lineasescritas+1;
					
					String forma="";
					String elvuelto="0.00";
					Double suma=0.00;
					for(int i=0;i<expago.length();i++){
						try{
						JSONObject linea=expago.getJSONObject(i);
						Double valor=linea.getDouble("valor");
						Double vuelto=0.00;
					
						if(valor<0){
							vuelto=-1*valor;
						}else{
							if(lang.equals(2)){
								forma=transpayment(linea.getString("forma"))+":"+DoubleFormat(valor);
							}else{
								forma=linea.getString("forma")+":"+DoubleFormat(valor);
							}
							
							if(forma.length()<32){
								int tam=32-forma.length();
								for(int n=0;n<tam;n++){
									forma=forma+" ";
								}
							}
							
							textData.append(forma+"\n");
							lineasescritas=lineasescritas+1;
							suma=suma+valor;
						}
						
						//totalfact=totalfact.replace(".","");
						Double mivuelto=suma-Double.parseDouble(totalfact.replace(",","."));
						//Double mivuelto=suma-Double.parseDouble(totalfact);
						//Double mivuelto=suma-totalfactd;
							
						//elvuelto=DoubleFormat(vuelto);
						elvuelto=DoubleFormat(mivuelto);
						
						}catch(JSONException ex){
							ex.printStackTrace();
						}
					}
					
					if(elvuelto.length()<25){
						int tam=25-elvuelto.length();
						for(int n=0;n<tam;n++){
							elvuelto=elvuelto+" ";
						}
					}
					
					if(lang.equals(1)){
						textData.append("Vuelto:"+String.valueOf(elvuelto)+"\n");
					}else{
						textData.append("Change:"+String.valueOf(elvuelto)+"\n");
					}
					
					
					builder.addText(textData.toString());
					textData.delete(0, textData.length());
					lineasescritas=lineasescritas+1;
					builder.addFeedLine(1);
					lineasescritas=lineasescritas+1;
					
					if(!factelectronica.equals("")){
						if(lang.equals(1)){
							textData.append("Revisa tu Factura Electrónica en:\n");
						}else{
							textData.append("Check your electronic bill in:\n");
						}
						factelectronica=factelectronica.replace(",","#");
						String [] vectordata=factelectronica.split("#");
						textData.append(vectordata[0]+"\n");
						if(vectordata.length>1){
							textData.append(vectordata[1]+" -"+vectordata[2]+"\n");
						}
						lineasescritas=lineasescritas+2;
					}
						
				}
				builder.addText(textData.toString());
				textData.delete(0, textData.length());
				
				if(preimpresas==1){
					if(lineasescritas<lineastotales){
						while(lineasescritas<lineastotales){
							builder.addFeedLine(1);
							lineasescritas=lineasescritas+1;
						}
					}
				}
				
			}else if(tipo.equals("cierre")){
				
				if(subtotalCierre.length()<9){
					int tam=9-subtotalCierre.length();
						for(int n=0;n<tam;n++){
							subtotalCierre=" "+subtotalCierre;
						}
				}
						
				if(ivaCierre.length()<9){
					int tam=9-ivaCierre.length();
						for(int n=0;n<tam;n++){
								ivaCierre=" "+ivaCierre;
						}
				}
				
				if(descuentoCierre.length()<9){
					int tam=9-descuentoCierre.length();
						for(int n=0;n<tam;n++){
								descuentoCierre=" "+descuentoCierre;
						}
				}
				
				if(servicioCierre.length()<9){
					int tam=9-servicioCierre.length();
						for(int n=0;n<tam;n++){
								servicioCierre=" "+servicioCierre;
						}
				}
				
				if(totalCierre.length()<9){
					int tam=9-totalCierre.length();
						for(int n=0;n<tam;n++){
								totalCierre=" "+totalCierre;
						}
				}
				
				builder.addTextDouble(Builder.TRUE, Builder.TRUE);
				if(lang.equals(1))
					builder.addText("CIERRE DE CAJA\n");
				else if(lang.equals(2))
					builder.addText("DAILY SALES\n");
				builder.addTextDouble(Builder.FALSE, Builder.FALSE);
				builder.addFeedLine(1);
				
				textData.append("--------------------------------\n");
				if(lang.equals(1))
					textData.append("FECHA IMP.:"+fechaImpresion+"  \n");
				else if(lang.equals(2))
					textData.append("PRINT DATE:"+fechaImpresion+"  \n");
				
				if(lang.equals(1))
					textData.append("FECHA CIERRE:"+fechaCierre+"        \n");
				else if(lang.equals(2))
					textData.append("CLOSE DATE:"+fechaCierre+"          \n");
				
				textData.append("--------------------------------\n");
				if(lang.equals(1))
				textData.append("FACTURAS\n");
				else if(lang.equals(2))
				textData.append("INVOICES\n");
				if(numeroFacturas.length()<9){
								int tam=9-numeroFacturas.length();
									for(int n=0;n<tam;n++){
											numeroFacturas=" "+numeroFacturas;
									}
							}
				
				if(anuladas.length()<9){
					int tam=9-anuladas.length();
					for(int n=0;n<tam;n++){
							anuladas=" "+anuladas;
						}
				}
				
				if(subdes.length()<9){
					int tam=9-subdes.length();
						for(int n=0;n<tam;n++){
								subdes=" "+subdes;
						}
				}
				
				if(lang.equals(1))
					textData.append("No. Facturas    "+numeroFacturas+"\n");
				else if(lang.equals(2))
					textData.append("Invoices        "+numeroFacturas+"\n");
				
				if(lang.equals(1))
					textData.append("No. Anuladas    "+anuladas+"\n");
		 	    else if(lang.equals(2))
					textData.append("Canceled        "+anuladas+"\n");
				
				textData.append("--------------------------------\n");
				if(lang.equals(1))
					textData.append("TOTALES\n");
				else if(lang.equals(2))
					textData.append("TOTALS\n");
				textData.append("Subtotal        "+subtotalCierre+"\n");
				
				if(lang.equals(1))
					textData.append("Descuentos      "+descuentoCierre+"\n");
				else if(lang.equals(2))
					textData.append("Discounts       "+descuentoCierre+"\n");
				
				if(lang.equals(1))
				    textData.append("Sub-desc        "+subdes+"\n");
				else if(lang.equals(2))
				    textData.append("Sub-disc        "+subdes+"\n");
				
				/*impuestos*/
				if(cierreImpuestos.length()>0){
					try{
						JSONObject linea2=cierreImpuestos.getJSONObject(0);
						//String [] names=JSONObject.getNames(linea);
						Iterator key2 = linea2.keys();
						while (key2.hasNext()) {
							String nombre2 = key2.next().toString();
							String valor2=linea2.getString(nombre2);
							
							if(valor2.length()<9){
								int tam=9-valor2.length();
									for(int n=0;n<tam;n++){
											valor2=" "+valor2;
									}
							}
							
							if(nombre2.length()<15){
								int tam=15-nombre2.length();
									for(int n=0;n<tam;n++){
											nombre2=nombre2+" ";
									}
							}
							textData.append(String.valueOf(nombre2)+" "+String.valueOf(valor2)+"\n");
						}
					}catch(JSONException ex){
						ex.printStackTrace();
					}
				}
				else{
					textData.append("Iva             "+ivaCierre+"\n");
					textData.append("Servicio        "+servicioCierre+"\n");
				}
				/**/
				
				if(!(propina.equals("")||Double.parseDouble(propina.replace(",","."))==0)){
					int tam=9-propina.length();
					for(int n=0;n<tam;n++){
							propina=" "+propina;
					}
					if(lang.equals(1))
					textData.append("PROPINAS        "+propina+"\n");
					else if(lang.equals(2))
					textData.append("TIPS            "+propina+"\n");
				}
				
				textData.append("TOTAL           "+totalCierre+"\n");
				builder.addText(textData.toString());
				textData.delete(0, textData.length());
				builder.addFeedLine(1);
				
				textData.append("--------------------------------\n");
				if(lang.equals(1))
					textData.append("FORMAS DE PAGO\n");
				else if(lang.equals(2))
					textData.append("PAYMENT METHODS\n");
				if(expformas.length()>0){
					try{
						JSONObject linea=expformas.getJSONObject(0);
						//String [] names=JSONObject.getNames(linea);
						Iterator key = linea.keys();
						while (key.hasNext()) {
							String nombre = key.next().toString();
							String valor=linea.getString(nombre);
							
							if(valor.length()<9){
								int tam=9-valor.length();
									for(int n=0;n<tam;n++){
											valor=" "+valor;
									}
							}
							
							if(lang.equals(2))
								nombre=transpayment(nombre);
							
							if(nombre.length()<15){
								int tam=15-nombre.length();
									for(int n=0;n<tam;n++){
											nombre=nombre+" ";
									}
							}
							
							textData.append(String.valueOf(nombre)+" "+String.valueOf(valor)+"\n");
						}					
					}catch(JSONException ex){
								ex.printStackTrace();
					}
				}
				builder.addText(textData.toString());
				textData.delete(0, textData.length());
				
			}else if(tipo.equals("comandar")){ 
				
				builder.addTextDouble(Builder.TRUE, Builder.TRUE);
				builder.addText(nombreEmpresa+"\n");
				builder.addTextDouble(Builder.FALSE, Builder.FALSE);
				builder.addFeedLine(1);
				
				if(lang.equals(1))
					textData.append(nombreCliente+"\n");
				else if(lang.equals(2))
					textData.append(nombreCliente.replace("Consumidor Final","Final Customer")+"\n");
					
				textData.append("--------------------------------\n");
				Date fechafact=new Date(fechanumber);
				//String fechaf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(fechafact);
				String fechaf=new SimpleDateFormat("MM-dd-yyyy HH:mm:ss").format(fechafact);
				textData.append("NO:"+nofact+"            \n");
				if(lang.equals(1)){
					textData.append("FECHA:"+fechaf+"       \n");
				}else if(lang.equals(2)){
					textData.append("DATE:"+fechaf+"         \n");
				}
				textData.append("--------------------------------\n");
				builder.addText(textData.toString());
				textData.delete(0, textData.length());
				
				builder.addTextDouble(Builder.TRUE, Builder.TRUE);
				if(expprod.length()>0){
					for(int i=0;i<expprod.length();i++){
						try{
						JSONObject linea=expprod.getJSONObject(i);
						String cantidad=linea.getString("cant_prod");
						String desc=linea.getString("nombre_producto");
						builder.addText(String.valueOf(cantidad)+" "+String.valueOf(desc)+"\n");
						
						/**/
						if(!(linea.getString("detalle_agregados").equals(JSONObject.NULL))){
							if(!(linea.getString("detalle_agregados").equals(""))){
								String [] agregadosv=linea.getString("detalle_agregados").split("@");
								for(int s=0;s<agregadosv.length;s++){
									String [] detalleagr=agregadosv[s].split("\\|");
									String medio="";
									if(Double.parseDouble(detalleagr[3])<1&&detalleagr[3]!=null){
										medio="1/2";
									}
									String cadena=" "+medio+detalleagr[0];
									builder.addText(cadena+"\n");
								}
							}
						}
						/**/
						
						/*notas*/
						if(!(linea.getString("detalle_notas").equals(JSONObject.NULL))){
							if(!(linea.getString("detalle_notas").equals(""))){
								String notasv=linea.getString("detalle_notas");
								String cadena=" "+notasv+"*";
									builder.addText(cadena+"\n");
								}
						}
						}catch(JSONException ex){
							ex.printStackTrace();
						}
					}
					
				}
				builder.addTextDouble(Builder.FALSE, Builder.FALSE);
				builder.addFeedLine(1);
			}else if(tipo.equals("precuenta")){ 
				
				builder.addTextDouble(Builder.TRUE, Builder.TRUE);
				if(lang.equals(1)){
					builder.addText("PRECUENTA\n");
				}else{
					builder.addText("CHECK\n");
				}
				builder.addTextDouble(Builder.FALSE, Builder.FALSE);
				builder.addFeedLine(1);
				Date fechafact=new Date(fechanumber);
				//String fechaf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(fechafact);
				String fechaf=new SimpleDateFormat("MM-dd-yyyy HH:mm:ss").format(fechafact);
				if(lang.equals(1)){
					textData.append("FECHA:"+fechaf+"       \n");
				}else if(lang.equals(2)){
					textData.append("DATE:"+fechaf+"         \n");
				}
				
				
				textData.append("--------------------------------\n");
				if(lang.equals(1)){
					textData.append("  # DESCRIPCION             SUMA\n");
				}else if(lang.equals(2)){
					textData.append("  # DESCRIPTION          AMMOUNT\n");
				}
				if(expprod.length()>0){
					for(int i=0;i<expprod.length();i++){
						try{
						JSONObject linea=expprod.getJSONObject(i);
						String cantidad=linea.getString("cant_prod");
						if(cantidad.length()<3){
							int tam=3-cantidad.length();
							for(int n=0;n<tam;n++){
								cantidad=" "+cantidad;
							}
						}
						
						String totc=DoubleFormat((linea.getDouble("precio_orig")+linea.getDouble("agregados"))*linea.getDouble("cant_prod"));
						//String totc=String.valueOf(total);
						if(totc.length()<6){
							int tam=6-totc.length();
							for(int n=0;n<tam;n++){
								totc=" "+totc;
							}
						}
						
						String desc=linea.getString("nombre_producto");
						if(desc.length()>21)
							desc=desc.substring(0,21);
						else if(desc.length()<21){
							int tam=21-desc.length();
							for(int n=0;n<tam;n++){
								desc=desc+" ";
							}
						}
												
						
						textData.append(String.valueOf(cantidad)+" "+String.valueOf(desc)+" "+String.valueOf(totc)+"\n");
						
						/**/
						if(!(linea.getString("detalle_agregados").equals(JSONObject.NULL))){
							if(!(linea.getString("detalle_agregados").equals(""))){
								String [] agregadosv=linea.getString("detalle_agregados").split("@");
								for(int s=0;s<agregadosv.length;s++){
									String [] detalleagr=agregadosv[s].split("\\|");
									String medio="";
									if(Double.parseDouble(detalleagr[3].replace(",","."))<1&&detalleagr[3]!=null){
										medio="1/2";
									}
									String cadena="    "+medio+detalleagr[0];
									if(cadena.length()<32){
										int tam=32-cadena.length();
										for(int n=0;n<tam;n++){
											cadena=cadena+" ";
										}
									}
									textData.append(cadena+"\n");
								}
							}
						}
						
						}catch(JSONException ex){
							ex.printStackTrace();
						}
					}
					
				}
				
				textData.append("--------------------------------\n");
				
						if(subconiva.length()<6){
							int tam=6-subconiva.length();
							for(int n=0;n<tam;n++){
								subconiva=" "+subconiva;
							}
						}
				
						if(subsiniva.length()<6){
							int tam=6-subsiniva.length();
							for(int n=0;n<tam;n++){
								subsiniva=" "+subsiniva;
							}
						}
						
						if(subtotal.length()<6){
							int tam=6-subtotal.length();
							for(int n=0;n<tam;n++){
								subtotal=" "+subtotal;
							}
						}
						
						if(iva.length()<6){
							int tam=6-iva.length();
							for(int n=0;n<tam;n++){
								iva=" "+iva;
							}
						}
						
						if(totalfact.length()<6){
							int tam=6-totalfact.length();
							for(int n=0;n<tam;n++){
								totalfact=" "+totalfact;
							}
						}
						
						if(iva.length()<6){
							int tam=6-iva.length();
							for(int n=0;n<tam;n++){
								iva=" "+iva;
							}
						}
						
						if(servicio.length()<6){
							int tam=6-servicio.length();
							for(int n=0;n<tam;n++){
								servicio=" "+servicio;
							}
						}
						
						if(descuento.length()<6){
							int tam=6-descuento.length();
							for(int n=0;n<tam;n++){
								descuento=" "+descuento;
							}
						}
						
						if(propina.length()<6){
							int tam=6-propina.length();
							for(int n=0;n<tam;n++){
								propina=" "+propina;
							}
						}
						
				if(Double.parseDouble(subtotal.replace(",","."))>0){
					textData.append("                 SUBTOTAL:"+String.valueOf(subtotal)+"\n");
				}
				
				
				/*imprime impuestos*/
				if(!cadimpuestos.equals("")){
					String[] imps = cadimpuestos.split("@");
					for(int k=0;k<imps.length;k++){
						if(!(imps[k].equals(""))){
							String [] dataimp=imps[k].split("\\|");
							if(Double.parseDouble(dataimp[3].replace(",","."))>0.00){
								String porcen=DoubleFormat(Double.parseDouble(dataimp[2])*100);
								String nombreimp=dataimp[1]+" "+porcen+"%:";
								String valorimp=DoubleFormat(Double.parseDouble(dataimp[3].replace(",",".")));
								if(valorimp.length()<6){
									int tam=6-valorimp.length();
									for(int n=0;n<tam;n++){
										valorimp=" "+valorimp;
									}
								}
								
								if(nombreimp.length()<26){
									int tam=26-nombreimp.length();
									for(int n=0;n<tam;n++){
										nombreimp=" "+nombreimp;
									}
								}
								
								textData.append(String.valueOf(nombreimp)+String.valueOf(valorimp)+"\n");
								//lineasescritas=lineasescritas+1;
							}
						}
						
					}
				}else{
					if(Double.parseDouble(iva.replace(",","."))>0){
						textData.append("                      IVA:"+String.valueOf(iva)+"\n");
						//lineasescritas=lineasescritas+1;
					}
					if(Double.parseDouble(servicio.replace(",","."))>0){
						textData.append("                 SERVICIO:"+String.valueOf(servicio)+"\n");
						//lineasescritas=lineasescritas+1;
					}
				}
				/*fin impuestos*/
				if(Double.parseDouble(descuento.replace(",","."))>0){
					if(lang.equals(1)){
						textData.append("                DESCUENTO:"+String.valueOf(descuento)+"\n");
					}else if(lang.equals(2)){
						textData.append("                 DISCOUNT:"+String.valueOf(descuento)+"\n");
					}
					
				}
				
				if(!(propina.equals("")||Double.parseDouble(propina)==0)){
					if(lang.equals(1)){
						textData.append("                  PROPINA:"+String.valueOf(propina)+"\n");
					}else{
						textData.append("                      TIP:"+String.valueOf(propina)+"\n");
					}
				}
				
				builder.addText(textData.toString());
				textData.delete(0, textData.length());
				
				builder.addTextDouble(Builder.TRUE, Builder.TRUE);
				builder.addText("TOTAL:"+String.valueOf(totalfact)+"\n");
				builder.addTextDouble(Builder.FALSE, Builder.FALSE);
				builder.addFeedLine(1);
			}else if(tipo.equals("comandasmesas")){ 
				
				builder.addTextDouble(Builder.TRUE, Builder.TRUE);
				if(lang.equals(1)){
					builder.addText("Mesa: "+mesa+"\n");
				}else{
					builder.addText("Table: "+mesa+"\n");
				}
				builder.addTextDouble(Builder.FALSE, Builder.FALSE);
				builder.addFeedLine(1);

				textData.append("--------------------------------\n");
				if(lang.equals(1)){
					textData.append("FECHA:"+hoy+"       \n");
				}else if(lang.equals(2)){
					textData.append("DATE:"+hoy+"         \n");
				}
				textData.append("--------------------------------\n");
				builder.addText(textData.toString());
				textData.delete(0, textData.length());
				builder.addTextDouble(Builder.TRUE, Builder.TRUE);
				if(expprod.length()>0){
					for(int i=0;i<expprod.length();i++){
						try{
						JSONObject linea=expprod.getJSONObject(i);
						String cantidad=linea.getString("cant_prod");
						String desc=linea.getString("nombre_producto");
						builder.addText(String.valueOf(cantidad)+" "+String.valueOf(desc)+"\n");
						
						/**/
						if(!(linea.getString("detalle_agregados").equals(JSONObject.NULL))){
							if(!(linea.getString("detalle_agregados").equals(""))){
								String [] agregadosv=linea.getString("detalle_agregados").split("@");
								for(int s=0;s<agregadosv.length;s++){
									String [] detalleagr=agregadosv[s].split("\\|");
									String medio="";
									if(Double.parseDouble(detalleagr[3].replace(",","."))<1&&detalleagr[3]!=null){
										medio="1/2";
									}
									String cadena=" "+medio+detalleagr[0];
									builder.addText(cadena+"\n");
								}
							}
						}
						/**/
						/*notas*/
						if(!(linea.getString("detalle_notas").equals(JSONObject.NULL))){
							if(!(linea.getString("detalle_notas").equals(""))){
								String notasv=linea.getString("detalle_notas");
								String cadena=" "+notasv+"*";
									builder.addText(cadena+"\n");
								}
						}
						/**/
						}catch(JSONException ex){
							ex.printStackTrace();
						}
					}
					
				}
				builder.addTextDouble(Builder.FALSE, Builder.FALSE);
				builder.addFeedLine(1);
			}else if(tipo.equals("barras")){
				// addBarcode API settings 
				final int barcodeWidth = 2;
				final int barcodeHeight = 100;
				builder.addFeedLine(1);

				// Add barcode data to command buffer 
				builder.addBarcode(codigoprint,
								   Builder.BARCODE_CODE39,
								   Builder.HRI_BELOW,
								   Builder.FONT_A,
								   barcodeWidth,
								   barcodeHeight);

			}
			builder.addFeedLine(1);
			if(!tipo.equals("barras")){
				textData.append("--------------------------------\n");
			}
				if(tipo.equals("precuenta")){
					if(lang.equals(1)){
						textData.append("Datos de la Factura:\n");
						textData.append("                                \n");
						textData.append("Propina:________________________\n");
						textData.append("                                \n");
						textData.append("Nombre:_________________________\n");
						textData.append("                                \n");
						textData.append("CI:_____________________________\n");
						textData.append("                                \n");
						textData.append("Dirección:______________________\n");
						textData.append("                                \n");
						textData.append("Teléfono:_______________________\n");
						textData.append("                                \n");
						textData.append("Email:__________________________\n");
						textData.append("                                \n");
						textData.append("Fecha Cumpleaños:_______________\n");	
						textData.append("                                \n");
					}else if(lang.equals(2)){
						textData.append("Invoice Data:\n");
						textData.append("Tip:____________________________\n");
						textData.append("                                \n");
						textData.append("Name:___________________________\n");
						textData.append("                                \n");
						textData.append("ID No.:_________________________\n");
						textData.append("                                \n");
						textData.append("Address:________________________\n");
						textData.append("                                \n");
						textData.append("Phone:__________________________\n");
						textData.append("                                \n");
						textData.append("Email:__________________________\n");
						textData.append("                                \n");
						textData.append("Birthday:_______________________\n");
						textData.append("                                \n");
					}
					
				}
				
				if(tipo.equals("pagar")||tipo.equals("comandar")||tipo.equals("precuenta")){
					if(lang.equals(1)){
						if(!ordername.equals("")){
							textData.append("*Orden para: "+ordername+"*\n");
						}
						String conmesas="";
						if(!mesa.equals("")){
							conmesas="Mesa: "+mesa;
						}
						String conpax="";
						if(!pax.equals("")&&Double.parseDouble(pax)>0)
							conpax="- Pax: "+pax+conpax;
						
						textData.append(conmesas+conpax+"\n");
					
					}else if(lang.equals(2)){
						if(!ordername.equals("")){
							textData.append("*Name Order: "+ordername+"*\n");
						}
						String conmesas="";
						if(!mesa.equals("")){
							conmesas="Table: "+mesa;
							
						}
						String conpax="";
						if(!pax.equals("")&&Double.parseDouble(pax)>0)
							conpax="- Pax: "+pax+conpax;
						
						textData.append(conmesas+conpax+"\n");
					}
				}
				if(!tipo.equals("barras")){
					textData.append(mensajefinal+"\n");
					builder.addText(textData.toString());
					textData.delete(0, textData.length());
					builder.addFeedLine(2);
				}
				// Add command to cut receipt to command buffer 
				builder.addCut(Builder.CUT_FEED);
				if(tipo.equals("pagar")){
					builder.addPulse(Builder.PARAM_DEFAULT, Builder.PULSE_100);	
				}
			}
		}
        catch (EposException e) {
            result.setEposException(e);
        }
        // Discard text buffer 
        textData = null;
        return builder;
    }

    private void print(Builder builder, Result result, Context context) {
        int printerStatus[] = new int[1];
        int batteryStatus[] = new int[1];
        boolean isBeginTransaction = false;

        // sendData API timeout setting (10000 msec) 
        final int sendTimeout = 10000;
        Print printer = null;

        // Null check 
        if ((builder == null) || (result == null)) {
            return;
        }

        // init result 
        result.setPrinterStatus(0);
        result.setBatteryStatus(0);
        result.setEposException(null);
        result.setEpsonIoException(null);

        printer = new Print(context);

        try {
            // Open 
            printer.openPrinter(connectionType,this.openDeviceName,Print.FALSE,Print.PARAM_DEFAULT,Print.PARAM_DEFAULT);
        }
        catch (EposException e) {
            result.setEposException(e);
            return;
        }

        try {
            // Print data if printer is printable 
            printer.getStatus(printerStatus, batteryStatus);
            result.setPrinterStatus(printerStatus[0]);
            result.setBatteryStatus(batteryStatus[0]);

            if (isPrintable(result)) {
                printerStatus[0] = 0;
                batteryStatus[0] = 0;

                printer.beginTransaction();
                isBeginTransaction = true;

                printer.sendData(builder, sendTimeout, printerStatus, batteryStatus);
                result.setPrinterStatus(printerStatus[0]);
                result.setBatteryStatus(batteryStatus[0]);
            }
        }
        catch (EposException e) {
            result.setEposException(e);
        }
        finally {
            if (isBeginTransaction) {
                try {
                    printer.endTransaction();
                }
                catch (EposException e) {
                    // Do nothing
                }
            }
        }

        try {
            printer.closePrinter();
        }
        catch (EposException e) {
            // Do nothing 
        }

        return;
    }

	 // Determine whether printer is printable 
    private boolean isPrintable(Result result) {
        if (result == null) {
            return false;
        }

        int status = result.getPrinterStatus();
        if ((status & Print.ST_OFF_LINE) == Print.ST_OFF_LINE) {
            return false;
        }

        if ((status & Print.ST_NO_RESPONSE) == Print.ST_NO_RESPONSE) {
            return false;
        }

        return true;
    }
	
	public static String DoubleFormat(double parDouble)
	{
		DecimalFormat formatter = new DecimalFormat("#####0.00"); 
		String myNumero = formatter.format(parDouble);
		return myNumero;
	}
	
	private static String transpayment(String word){
		if(word.toLowerCase().equals("efectivo")){
			word="cash";
		}else if(word.toLowerCase().equals("tarjetas")){
			word="cards";
		}else if(word.toLowerCase().equals("cheques")){
			word="checks";
		}
		return word;
	}
	
	// Get Compress parameter of addImage API 
    private int getCompress(int connection) {
        if (connection == Print.DEVTYPE_BLUETOOTH) {
            return Builder.COMPRESS_DEFLATE;
        }
        else {
            return Builder.COMPRESS_NONE;
        }
    }
}