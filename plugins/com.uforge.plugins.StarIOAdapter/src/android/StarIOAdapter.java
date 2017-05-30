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

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.Context;

import com.starmicronics.stario.StarIOPortException;
import com.starmicronics.stario.StarPrinterStatus;
import com.starmicronics.stario.PortInfo;
import com.starmicronics.stario.StarIOPort;
import com.uforge.plugins.RasterDocument.RasPageEndMode;
import com.uforge.plugins.RasterDocument.RasSpeed;
import com.uforge.plugins.RasterDocument.RasTopMargin;
import com.uforge.plugins.StarBitmap;

/**
 * @author Luca Del Bianco
 * This class handles the basic printing functions needed to print using the Star SDK
 */
public class StarIOAdapter extends CordovaPlugin {
	
	public enum RasterCommand {
		Standard, Graphics
	};
	
	private static int printableArea = 576;
	
    /* (non-Javadoc)
     * @see org.apache.cordova.CordovaPlugin#execute(java.lang.String, org.json.JSONArray, org.apache.cordova.CallbackContext)
     */
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        final StarIOAdapter currentPluginInstance = this;
        final JSONArray Arguments = args;
        final CallbackContext currentCallbackContext = callbackContext;

        if (action.equals("check")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    try {

                        if(Arguments.length() < 1) {
                            throw new Exception("You must specify a portName search parameter");
                        }

                        currentPluginInstance.check(currentCallbackContext, Arguments.getString(0));
                    } catch (Exception e) {
                        currentCallbackContext.error(e.getMessage());
                    }
                }
            });
            return true;
        } else if (action.equals("rawprint")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    try {
                        String portSettings = "";

                        if(Arguments.length() < 2) {
                            throw new Exception("You must specify a portName search parameter");
                        }

                        if(Arguments.length() == 3) {
                            portSettings = Arguments.getString(2);
                        }
						
                        currentPluginInstance.rawPrint(currentCallbackContext, Arguments.getString(0), Arguments.getString(1), portSettings);
                    } catch (Exception e) {
                        currentCallbackContext.error(e.getMessage());
                    }
                }
            });
            return true;
        } else if (action.equals("searchall")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    try {
                        if(Arguments.length() < 1) {
                            throw new Exception("You must specify a portName search parameter");
                        }
                        currentPluginInstance.searchAll(currentCallbackContext, Arguments.getString(0));
                    } catch (Exception e) {
                        currentCallbackContext.error(e.getMessage());
                    }
                }
            });
            return true;
        } else if (action.equals("printlogo")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    try {
						String portSettings = "";
						
						if(Arguments.length() < 2) {
                            throw new Exception("You must specify a portName search parameter");
                        }

                        if(Arguments.length() == 3) {
                            portSettings = Arguments.getString(2);
                        }
						
                        currentPluginInstance.printImage(currentCallbackContext,Arguments.getString(0),Arguments.getString(1),portSettings);
                    } catch (Exception e) {
                        currentCallbackContext.error(e.getMessage());
                    }
                }
            });
            return true;
        } else if (action.equals("opendrawer")) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    try {
						String portSettings = "";
						if(Arguments.length() < 1) {
                            throw new Exception("You must specify a portName search parameter");
                        }
                        currentPluginInstance.openDrawer(currentCallbackContext,Arguments.getString(0),portSettings);
                    } catch (Exception e) {
                        currentCallbackContext.error(e.getMessage());
                    }
                }
            });
            return true;
        }
        return false;
    }

    /**
     * This method check the status of the first paired device (we assume it's a printer) and returns "OK" to the phonegap plugin if it's online
     * @param callbackContext the callback context of the action
     */
    private void check(CallbackContext callbackContext, String portNameSearch) {
        String portName = "";
        String portSettings = "";
        Context context = this.cordova.getActivity().getApplicationContext();

        portName = PrinterFunctions.getFirstPrinter(portNameSearch,context);

        try {
            StarPrinterStatus status = PrinterFunctions.GetStatus(context, portName, portSettings, true);
            if (status == null) {
                callbackContext.error("Cannot get the printer status.");
            } else if (status.offline) {
                callbackContext.error("The printer is offline.");
            } else {
                callbackContext.success();
            }
        } catch (StarIOPortException e) {
            callbackContext.error(e.getMessage());
        }
    }

    /**
     * This method sends a print command to the printer using the first available paired device (we assume it is a printer)
     * @param callbackContext the callback context of the action
     * @param message the string containing all the content to print
     * @param portSettings the port settings for the connection to the printer ("mini" if you are printing on star portable printers)
     */
    private void rawPrint(CallbackContext callbackContext, String message, String portNameSearch, String portSettings) throws StarIOPortException {
        String portName = "";
        Context context = this.cordova.getActivity().getApplicationContext();
			
        //byte[] data;
        //ArrayList<byte[]> list = new ArrayList<byte[]>();
        //Byte[] tempList;
		

        portName = PrinterFunctions.getFirstPrinter(portNameSearch,context);

       // data = message.getBytes();
        //tempList = new Byte[data.length];
		
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
		String mensajefinal="Generado con avapos.com";
		Integer lang=1;
		JSONArray cierreImpuestos= new JSONArray();
		Integer lineastotales=30; //18cm-2lineas
		Integer lineasencabezado=0; //3cm-2lineas
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
			lineastotales=(2*objfactura.getInt("largo"))-6;
			lineasencabezado=(2*objfactura.getInt("encabezado"))-6;
			
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
				//{"Cierre": [{"fecha_caja":"2015-12-17","fecha_imp":"2015-12-17","num_facts":"1","fact_anuladas":"0","subtotal":"3.13","iva":"0.38","total":"3.50","formaspago":[{"Efectivo":"3.50","Tarjetas":"0.00","Cheques":"0.00","CxC":"0.00"}]}]}
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
				lineastotales=(2*objfactura.getInt("largo"))-6;
				lineasencabezado=(2*objfactura.getInt("encabezado"))-6;
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
			}
			
			if(lang==1){
				mensajefinal="Generado con avapos.com";
			}else{
				mensajefinal="Powered by avapos.com";
			}
			
		}catch(JSONException ex){

			ex.printStackTrace();
		}
		
		/*
		JSONObject expjson=jsonArray.getJSONObject(0);
		JSONObject objcliente=expjson.getJSONObject("cliente");*/
		/**/
		String needle="USB:";
		if(!portNameSearch.toLowerCase().contains(needle.toLowerCase())){
				ArrayList<byte[]> list = new ArrayList<byte[]>();
				
				list.add(new byte[] { 0x1b, 0x1d, 0x74, 0x20 }); // Code Page #1252 (Windows Latin-1)

				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x01 }); // Alignment (center)

				// list.add("[If loaded.. Logo1 goes here]\r\n".getBytes());

				// list.add(new byte[]{0x1b, 0x1c, 0x70, 0x01, 0x00, '\r', '\n'}); //Stored Logo Printing

				// Notice that we use a unicode representation because that is
				// how Java expresses these bytes as double byte unicode

				// Character expansion
				list.add(new byte[] { 0x06, 0x09, 0x1b, 0x69, 0x01, 0x01 });
				
			if(tipo.equals("pagar")){ 
				
				if(!logo.equals("")){
					//printImage(callbackContext,logo,portNameSearch,portSettings);
					int maxWidth=384;
					boolean compressionEnable=false;
					RasterCommand rasterType = RasterCommand.Graphics;
					RasterDocument rasterDoc = new RasterDocument(RasSpeed.Medium,RasPageEndMode.None, RasPageEndMode.None, RasTopMargin.Standard, 0, 0, 0);
					
					//Bitmap bm = BitmapFactory.decodeResource(res, source);
					
					Bitmap bm =BitmapFactory.decodeFile("/data/data/com.practisis.practipos/files//"+logo);
					
					StarBitmap starbitmap = new StarBitmap(bm, false, maxWidth);

					if (rasterType == RasterCommand.Standard) {
						list.add(rasterDoc.BeginDocumentCommandData());
						list.add(starbitmap.getImageRasterDataForPrinting_Standard(compressionEnable));
						list.add(rasterDoc.EndDocumentCommandData());
						
					} else {
						list.add(starbitmap.getImageRasterDataForPrinting_graphic(compressionEnable));
						//list.add(new byte[] { 0x1b, 0x64, 0x02 }); // Feed to cutter position
					}
				}
				
				list.add(createCp1252(nombreEmpresa+"\r\n"));
				list.add(new byte[] { 0x1b, 0x69, 0x00, 0x00 }); // Cancel Character Expansion
				list.add(createCp1252(direccionEmpresa+"-"+telefonoEmpresa+"\r\n"));
				//list.add(createCp1252("08029 BARCELONA\r\n\r\n"));
				
				if(lang.equals(1))
					list.add(createCp1252(nombreCliente+"-"+cedulaCliente+"\r\n"));
				else if(lang.equals(2))
					list.add(createCp1252(nombreCliente.replace("Consumidor Final","Final Customer")+"-"+cedulaCliente+"\r\n"));
					
				
				list.add(createCp1252(direccionCliente+"/"+telefonoCliente+"\r\n"));
				
				if(!textoreimpr.equals("")){
					if(lang.equals(1))
						list.add(createCp1252(textoreimpr+"\r\n"));
					else if(lang.equals(2))
						list.add(createCp1252(textoreimpr.replace("Reimpresion Factura","Invoice Reprint")+"\r\n"));
				}
					
				list.add(createCp1252("--------------------------------\r\n"));

				//list.add(createCp1252("TEL :934199465\r\n"));
				
				//list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x00 }); // Alignment

				//list.add(new byte[] { 0x1b, 0x44, 0x02, 0x10, 0x22, 0x00 }); // Set horizontal tab

				
				
				//list.add(createCp1252("MESA: 100 P: - FECHA: YYYY-MM-DD\r\n"));
			
				Date fechafact=new Date(fechanumber);
				//String fechaf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(fechafact);
				String fechaf=new SimpleDateFormat("MM-dd-yyyy HH:mm:ss").format(fechafact);
				list.add(createCp1252("NO:"+nofact+"            \r\n"));
				if(lang.equals(1)){
					list.add(createCp1252("FECHA:"+fechaf+"       \r\n"));
				}else if(lang.equals(2)){
					list.add(createCp1252("DATE:"+fechaf+"         \r\n"));
				}
				
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x01 }); // Alignment (center)
				list.add(createCp1252("--------------------------------\r\n"));
				if(lang.equals(1)){
					list.add(createCp1252("  # DESCRIPCION             SUMA\r\n"));
				}else if(lang.equals(2)){
					list.add(createCp1252("  # DESCRIPTION          AMMOUNT\r\n"));
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
												
						
						list.add(createCp1252(String.valueOf(cantidad)+" "+String.valueOf(desc)+" "+String.valueOf(totc)+"\r\n"));
						
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
									list.add(createCp1252(cadena+"\r\n"));
								}
							}
						}
						/**/
						
						//list.add(createCp1252(" 4  3,00  JARRA  CERVESA   12,00\r\n"));
						//list.add(createCp1252(" 1  1,60  COPA DE CERVESA   1,60\r\n"));
						}catch(JSONException ex){
							ex.printStackTrace();
						}
					}
					
				}
				
				list.add(createCp1252("--------------------------------\r\n"));
				
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
					list.add(createCp1252("                 SUBTOTAL:"+String.valueOf(subtotal)+"\r\n"));
				}
				/*if(Double.parseDouble(subconiva.replace(",","."))>0){
					list.add(createCp1252("                SUBCONIVA:"+String.valueOf(subconiva)+"\r\n"));
				}
				if(Double.parseDouble(subsiniva.replace(",","."))>0){
					list.add(createCp1252("                SUBSINIVA:"+String.valueOf(subsiniva)+"\r\n"));
				}*/
				
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
								
								list.add(createCp1252(String.valueOf(nombreimp)+String.valueOf(valorimp)+"\r\n"));
								//lineasescritas=lineasescritas+1;
							}
						}
						
					}
				}else{
					if(Double.parseDouble(iva.replace(",","."))>0){
						list.add(createCp1252("                      IVA:"+String.valueOf(iva)+"\r\n"));
						//lineasescritas=lineasescritas+1;
					}
					if(Double.parseDouble(servicio.replace(",","."))>0){
						list.add(createCp1252("                 SERVICIO:"+String.valueOf(servicio)+"\r\n"));
						//lineasescritas=lineasescritas+1;
					}
				}
				/*fin impuestos*/

				/*if(Double.parseDouble(iva.replace(",","."))>0){
					list.add(createCp1252("                      IVA:"+String.valueOf(iva)+"\r\n"));
				}
				if(Double.parseDouble(servicio.replace(",","."))>0){
					list.add(createCp1252("                 SERVICIO:"+String.valueOf(servicio)+"\r\n"));
				}*/
				if(Double.parseDouble(descuento.replace(",","."))>0){
					if(lang.equals(1)){
						list.add(createCp1252("                DESCUENTO:"+String.valueOf(descuento)+"\r\n"));
					}else if(lang.equals(2)){
						list.add(createCp1252("                 DISCOUNT:"+String.valueOf(descuento)+"\r\n"));
					}
					
				}
				
				if(!(propina.equals("")||Double.parseDouble(propina)==0)){
					if(lang.equals(1)){
						list.add(createCp1252("                  PROPINA:"+String.valueOf(propina)+"\r\n"));
					}else{
						list.add(createCp1252("                      TIP:"+String.valueOf(propina)+"\r\n"));
					}
				}
				
				// Character expansion
				list.add(new byte[] { 0x06, 0x09, 0x1b, 0x69, 0x01, 0x01 });
				list.add(createCp1252("TOTAL:"+String.valueOf(totalfact)+"\r\n"));
				list.add(new byte[] { 0x1b, 0x69, 0x00, 0x00 }); // Cancel Character Expansion
				
				//formas de pago
				if(expago.length()>0){
					
					//list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x00 }); // Alignment
					if(lang.equals(1)){
						list.add(createCp1252("Pagado:                         \r\n"));
					}else if(lang.equals(2)){
						list.add(createCp1252("Paid:                           \r\n"));
					}
					
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
							
							list.add(createCp1252(forma+"\r\n"));
							suma=suma+valor;
						}
						
						//totalfact=totalfact.replace(".","");
						Double mivuelto=suma-Double.parseDouble(totalfact.replace(",",""));
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
						list.add(createCp1252("Vuelto:"+String.valueOf(elvuelto)+"\r\n"));
					}else{
						list.add(createCp1252("Change:"+String.valueOf(elvuelto)+"\r\n"));
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
						
				if(lang.equals(1))
					list.add(createCp1252("CIERRE DE CAJA\r\n"));
				else if(lang.equals(2))
					list.add(createCp1252("DAILY SALES\r\n"));
				list.add(new byte[] { 0x1b, 0x69, 0x00, 0x00 }); // Cancel Character Expansion
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x00 }); // Alignment
				list.add(createCp1252("--------------------------------\r\n"));
				if(lang.equals(1))
					list.add(createCp1252("FECHA IMP.:"+fechaImpresion+"\r\n"));
				else if(lang.equals(2))
					list.add(createCp1252("PRINT DATE:"+fechaImpresion+"\r\n"));
				
				if(lang.equals(1))
					list.add(createCp1252("FECHA CIERRE:"+fechaCierre+"\r\n"));
				else if(lang.equals(2))
					list.add(createCp1252("CLOSE DATE:"+fechaCierre+"\r\n"));
				list.add(new byte[] { 0x1b, 0x69, 0x00, 0x00 }); // Cancel Character Expansion
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x00 }); // Alignment
				list.add(createCp1252("--------------------------------\r\n"));
				if(lang.equals(1))
				list.add(createCp1252("FACTURAS\r\n"));
				else if(lang.equals(2))
				list.add(createCp1252("INVOICES\r\n"));
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
					list.add(createCp1252("No. Facturas    "+numeroFacturas+"\r\n"));
				else if(lang.equals(2))
					list.add(createCp1252("Invoices        "+numeroFacturas+"\r\n"));
				
				if(lang.equals(1))
					list.add(createCp1252("No. Anuladas    "+anuladas+"\r\n"));
		 	    else if(lang.equals(2))
					list.add(createCp1252("Canceled        "+anuladas+"\r\n"));
				list.add(new byte[] { 0x1b, 0x69, 0x00, 0x00 }); // Cancel Character Expansion
				list.add(createCp1252("--------------------------------\r\n"));
				if(lang.equals(1))
					list.add(createCp1252("TOTALES\r\n"));
				else if(lang.equals(2))
					list.add(createCp1252("TOTALS\r\n"));
				list.add(createCp1252("Subtotal        "+subtotalCierre+"\r\n"));
				
				if(lang.equals(1))
					list.add(createCp1252("Descuentos      "+descuentoCierre+"\r\n"));
				else if(lang.equals(2))
					list.add(createCp1252("Discounts       "+descuentoCierre+"\r\n"));
				
				if(lang.equals(1))
				    list.add(createCp1252("Sub-desc        "+subdes+"\r\n"));
				else if(lang.equals(2))
				    list.add(createCp1252("Sub-disc        "+subdes+"\r\n"));
				
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
							list.add(createCp1252(String.valueOf(nombre2)+" "+String.valueOf(valor2)+"\r\n"));
						}
					}catch(JSONException ex){
						ex.printStackTrace();
					}
				}
				else{
					list.add(createCp1252("Iva             "+ivaCierre+"\r\n"));
					list.add(createCp1252("Servicio        "+servicioCierre+"\r\n"));
				}
				/**/
				
				if(!(propina.equals("")||Double.parseDouble(propina.replace(",","."))==0)){
					int tam=9-propina.length();
					for(int n=0;n<tam;n++){
							propina=" "+propina;
					}
					if(lang.equals(1))
					list.add(createCp1252("PROPINAS        "+propina+"\r\n"));
					else if(lang.equals(2))
					list.add(createCp1252("TIPS            "+propina+"\r\n"));
				}
			
				list.add(createCp1252("TOTAL           "+totalCierre+"\r\n"));
				list.add(new byte[] { 0x1b, 0x69, 0x00, 0x00 }); // Cancel Character Expansion
				list.add(createCp1252("--------------------------------\r\n"));
				if(lang.equals(1))
					list.add(createCp1252("FORMAS DE PAGO\r\n"));
				else if(lang.equals(2))
					list.add(createCp1252("PAYMENT METHODS\r\n"));
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
							
							list.add(createCp1252(String.valueOf(nombre)+" "+String.valueOf(valor)+"\r\n"));
						}
						/*for(int m=0;m<names.length();m++)
						{
							String nombre=names[m];
							String valor=linea.getString(names[m]);
							list.add(createCp1252(String.valueOf(nombre)+":"+String.valueOf(valor)+"\r\n"));
						}	*/					
						}catch(JSONException ex){
								ex.printStackTrace();
						}
				}
				
			}else if(tipo.equals("comandar")){ 
					
				list.add(createCp1252(nombreEmpresa+"\r\n"));
				list.add(new byte[] { 0x1b, 0x69, 0x00, 0x00 }); // Cancel Character Expansion
				//list.add(createCp1252("08029 BARCELONA\r\n\r\n"));
				
				if(lang.equals(1))
					list.add(createCp1252(nombreCliente+"\r\n"));
				else if(lang.equals(2))
					list.add(createCp1252(nombreCliente.replace("Consumidor Final","Final Customer")+"\r\n"));
					
					
				list.add(createCp1252("--------------------------------\r\n"));

				//list.add(createCp1252("TEL :934199465\r\n"));
				
				//list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x00 }); // Alignment

				//list.add(new byte[] { 0x1b, 0x44, 0x02, 0x10, 0x22, 0x00 }); // Set horizontal tab

				
				
				//list.add(createCp1252("MESA: 100 P: - FECHA: YYYY-MM-DD\r\n"));
			
				Date fechafact=new Date(fechanumber);
				//String fechaf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(fechafact);
				String fechaf=new SimpleDateFormat("MM-dd-yyyy HH:mm:ss").format(fechafact);
				list.add(createCp1252("NO:"+nofact+"            \r\n"));
				if(lang.equals(1)){
					list.add(createCp1252("FECHA:"+fechaf+"       \r\n"));
				}else if(lang.equals(2)){
					list.add(createCp1252("DATE:"+fechaf+"         \r\n"));
				}
				
				
				//list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x01 }); // Alignment (center)
				list.add(createCp1252("--------------------------------\r\n"));
				
				// Character expansion
				list.add(new byte[] { 0x06, 0x09, 0x1b, 0x69, 0x01, 0x01 });
				
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x00 }); // Alignment

				
				if(expprod.length()>0){
					for(int i=0;i<expprod.length();i++){
						try{
						JSONObject linea=expprod.getJSONObject(i);
						String cantidad=linea.getString("cant_prod");
						/*if(cantidad.length()<3){
							int tam=3-cantidad.length();
							for(int n=0;n<tam;n++){
								cantidad=" "+cantidad;
							}
						}*/
						
						
						String desc=linea.getString("nombre_producto");
						/*if(desc.length()>21)
							desc=desc.substring(0,21);
						else if(desc.length()<21){
							int tam=21-desc.length();
							for(int n=0;n<tam;n++){
								desc=desc+" ";
							}
						}*/
												
						
						list.add(createCp1252(String.valueOf(cantidad)+" "+String.valueOf(desc)+"\r\n"));
						
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
									/*if(cadena.length()<32){
										int tam=32-cadena.length();
										for(int n=0;n<tam;n++){
											cadena=cadena+" ";
										}
									}*/
									list.add(createCp1252(cadena+"\r\n"));
								}
							}
						}
						/**/
						
						
						/*notas*/
						if(!(linea.getString("detalle_notas").equals(JSONObject.NULL))){
							if(!(linea.getString("detalle_notas").equals(""))){
								String notasv=linea.getString("detalle_notas");
								String cadena=" "+notasv+"*";
									/*if(cadena.length()<32){
										int tam=32-cadena.length();
										for(int n=0;n<tam;n++){
											cadena=cadena+" ";
										}
									}*/
									list.add(createCp1252(cadena+"\r\n"));
								}
						}
						/**/
						
						//list.add(createCp1252(" 4  3,00  JARRA  CERVESA   12,00\r\n"));
						//list.add(createCp1252(" 1  1,60  COPA DE CERVESA   1,60\r\n"));
						
						
						}catch(JSONException ex){
							ex.printStackTrace();
						}
					}
					
				}
				
				list.add(new byte[] { 0x1b, 0x69, 0x00, 0x00 }); // Cancel Character Expansion
				
				//list.add(createCp1252("--------------------------------\r\n"));
			}else if(tipo.equals("precuenta")){ 
			
				if(lang.equals(1)){
					list.add(createCp1252("PRECUENTA\r\n"));
				}else{
					list.add(createCp1252("CHECK\r\n"));
				}
				
				list.add(new byte[] { 0x1b, 0x69, 0x00, 0x00 }); // Cancel Character Expansion
				list.add(new byte[] { 0x1b, 0x44, 0x02, 0x10, 0x22, 0x00 }); // Set horizontal tab

				
				
				//list.add(createCp1252("MESA: 100 P: - FECHA: YYYY-MM-DD\r\n"));
			
				Date fechafact=new Date(fechanumber);
				//String fechaf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(fechafact);
				String fechaf=new SimpleDateFormat("MM-dd-yyyy HH:mm:ss").format(fechafact);
				if(lang.equals(1)){
					list.add(createCp1252("FECHA:"+fechaf+"       \r\n"));
				}else if(lang.equals(2)){
					list.add(createCp1252("DATE:"+fechaf+"         \r\n"));
				}
				
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x01 }); // Alignment (center)
				list.add(createCp1252("--------------------------------\r\n"));
				if(lang.equals(1)){
					list.add(createCp1252("  # DESCRIPCION             SUMA\r\n"));
				}else if(lang.equals(2)){
					list.add(createCp1252("  # DESCRIPTION          AMMOUNT\r\n"));
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
												
						
						list.add(createCp1252(String.valueOf(cantidad)+" "+String.valueOf(desc)+" "+String.valueOf(totc)+"\r\n"));
						
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
									list.add(createCp1252(cadena+"\r\n"));
								}
							}
						}
						/**/
						
						//list.add(createCp1252(" 4  3,00  JARRA  CERVESA   12,00\r\n"));
						//list.add(createCp1252(" 1  1,60  COPA DE CERVESA   1,60\r\n"));
						}catch(JSONException ex){
							ex.printStackTrace();
						}
					}
					
				}
				
				list.add(createCp1252("--------------------------------\r\n"));
				
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
					list.add(createCp1252("                 SUBTOTAL:"+String.valueOf(subtotal)+"\r\n"));
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
								
								list.add(createCp1252(String.valueOf(nombreimp)+String.valueOf(valorimp)+"\r\n"));
								//lineasescritas=lineasescritas+1;
							}
						}
						
					}
				}else{
					if(Double.parseDouble(iva.replace(",","."))>0){
						list.add(createCp1252("                      IVA:"+String.valueOf(iva)+"\r\n"));
						//lineasescritas=lineasescritas+1;
					}
					if(Double.parseDouble(servicio.replace(",","."))>0){
						list.add(createCp1252("                 SERVICIO:"+String.valueOf(servicio)+"\r\n"));
						//lineasescritas=lineasescritas+1;
					}
				}
				/*fin impuestos*/

				/*if(Double.parseDouble(iva.replace(",","."))>0){
					list.add(createCp1252("                      IVA:"+String.valueOf(iva)+"\r\n"));
				}
				if(Double.parseDouble(servicio.replace(",","."))>0){
					list.add(createCp1252("                 SERVICIO:"+String.valueOf(servicio)+"\r\n"));
				}*/
				if(Double.parseDouble(descuento.replace(",","."))>0){
					if(lang.equals(1)){
						list.add(createCp1252("                DESCUENTO:"+String.valueOf(descuento)+"\r\n"));
					}else if(lang.equals(2)){
						list.add(createCp1252("                 DISCOUNT:"+String.valueOf(descuento)+"\r\n"));
					}
					
				}
				
				if(!(propina.equals("")||Double.parseDouble(propina)==0)){
					if(lang.equals(1)){
						list.add(createCp1252("                  PROPINA:"+String.valueOf(propina)+"\r\n"));
					}else{
						list.add(createCp1252("                      TIP:"+String.valueOf(propina)+"\r\n"));
					}
				}
				
				//list.add(new byte[] { 0x09, 0x1b, 0x69, 0x01, 0x00 });
				//list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x02 });

				list.add(new byte[] { 0x06, 0x09, 0x1b, 0x69, 0x01, 0x01 });
				list.add(createCp1252("TOTAL:"+String.valueOf(totalfact)+"\r\n"));
				list.add(new byte[] { 0x1b, 0x69, 0x00, 0x00 }); // Cancel Character Expansion
				
			}else if(tipo.equals("comandasmesas")){ 
					
				if(lang.equals(1)){
					list.add(createCp1252("Mesa: "+mesa+"\r\n"));
				}else{
					list.add(createCp1252("Table: "+mesa+"\r\n"));
				}
				
				list.add(new byte[] { 0x1b, 0x69, 0x00, 0x00 }); // Cancel Character Expansion
				//list.add(createCp1252("08029 BARCELONA\r\n\r\n"));	
					
				list.add(createCp1252("--------------------------------\r\n"));

				//list.add(createCp1252("TEL :934199465\r\n"));
				
				//list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x00 }); // Alignment

				//list.add(new byte[] { 0x1b, 0x44, 0x02, 0x10, 0x22, 0x00 }); // Set horizontal tab

				
				
				//list.add(createCp1252("MESA: 100 P: - FECHA: YYYY-MM-DD\r\n"));
			
				//Date fechafact=new Date(fechanumber);
				//String fechaf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(fechafact);
				//String fechaf=new SimpleDateFormat("MM-dd-yyyy HH:mm:ss").format(fechafact);
				if(lang.equals(1)){
					list.add(createCp1252("FECHA:"+hoy+"       \r\n"));
				}else if(lang.equals(2)){
					list.add(createCp1252("DATE:"+hoy+"         \r\n"));
				}
				
				

				//list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x01 }); // Alignment (center)
				list.add(createCp1252("--------------------------------\r\n"));
				
				// Character expansion
				list.add(new byte[] { 0x06, 0x09, 0x1b, 0x69, 0x01, 0x01 });
				
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x00 }); // Alignment

				
				if(expprod.length()>0){
					for(int i=0;i<expprod.length();i++){
						try{
						JSONObject linea=expprod.getJSONObject(i);
						String cantidad=linea.getString("cant_prod");
						/*if(cantidad.length()<3){
							int tam=3-cantidad.length();
							for(int n=0;n<tam;n++){
								cantidad=" "+cantidad;
							}
						}*/
						
						
						String desc=linea.getString("nombre_producto");
						/*if(desc.length()>21)
							desc=desc.substring(0,21);
						else if(desc.length()<21){
							int tam=21-desc.length();
							for(int n=0;n<tam;n++){
								desc=desc+" ";
							}
						}*/
												
						
						list.add(createCp1252(String.valueOf(cantidad)+" "+String.valueOf(desc)+"\r\n"));
						
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
									/*if(cadena.length()<32){
										int tam=32-cadena.length();
										for(int n=0;n<tam;n++){
											cadena=cadena+" ";
										}
									}*/
									list.add(createCp1252(cadena+"\r\n"));
								}
							}
						}
						/**/
						
						
						/*notas*/
						if(!(linea.getString("detalle_notas").equals(JSONObject.NULL))){
							if(!(linea.getString("detalle_notas").equals(""))){
								String notasv=linea.getString("detalle_notas");
								String cadena=" "+notasv+"*";
									/*if(cadena.length()<32){
										int tam=32-cadena.length();
										for(int n=0;n<tam;n++){
											cadena=cadena+" ";
										}
									}*/
									list.add(createCp1252(cadena+"\r\n"));
								}
						}
						/**/
						
						//list.add(createCp1252(" 4  3,00  JARRA  CERVESA   12,00\r\n"));
						//list.add(createCp1252(" 1  1,60  COPA DE CERVESA   1,60\r\n"));
						
						
						}catch(JSONException ex){
							ex.printStackTrace();
						}
					}
					
				}
				
				list.add(new byte[] { 0x1b, 0x69, 0x00, 0x00 }); // Cancel Character Expansion
				
				//list.add(createCp1252("--------------------------------\r\n"));
			}
				//list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x00 });
				//list.add(new byte[] { 0x09, 0x1b, 0x69, 0x00, 0x00 });
				//list.add(createCp1252("NO: 000018851     IVA IXNCLUIDO\r\n"));
				list.add(createCp1252("--------------------------------\r\n"));
				

				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x01 });
				
				if(tipo.equals("precuenta")){
					if(lang.equals(1)){
						list.add(createCp1252("Datos de la Factura:\r\n"));
						list.add(createCp1252("                                \r\n"));
						list.add(createCp1252("Propina:________________________\r\n"));
						list.add(createCp1252("                                \r\n"));
						list.add(createCp1252("Nombre:_________________________\r\n"));
						list.add(createCp1252("                                \r\n"));
						list.add(createCp1252("CI:_____________________________\r\n"));
						list.add(createCp1252("                                \r\n"));
						list.add(createCp1252("Dirección:______________________\r\n"));
						list.add(createCp1252("                                \r\n"));
						list.add(createCp1252("Teléfono:_______________________\r\n"));
						list.add(createCp1252("                                \r\n"));
						list.add(createCp1252("Email:__________________________\r\n"));
						list.add(createCp1252("                                \r\n"));
						list.add(createCp1252("Fecha Cumpleaños:_______________\r\n"));	
						list.add(createCp1252("                                \r\n"));
					}else if(lang.equals(2)){
						list.add(createCp1252("Invoice Data:\r\n"));
						list.add(createCp1252("Tip:____________________________\r\n"));
						list.add(createCp1252("                                \r\n"));
						list.add(createCp1252("Name:___________________________\r\n"));
						list.add(createCp1252("                                \r\n"));
						list.add(createCp1252("ID No.:_________________________\r\n"));
						list.add(createCp1252("                                \r\n"));
						list.add(createCp1252("Address:________________________\r\n"));
						list.add(createCp1252("                                \r\n"));
						list.add(createCp1252("Phone:__________________________\r\n"));
						list.add(createCp1252("                                \r\n"));
						list.add(createCp1252("Email:__________________________\r\n"));
						list.add(createCp1252("                                \r\n"));
						list.add(createCp1252("Birthday:_______________________\r\n"));
						list.add(createCp1252("                                \r\n"));
					}
					
				}
				
				if(tipo.equals("pagar")||tipo.equals("comandar")||tipo.equals("precuenta")){
					if(lang.equals(1)){
						if(!ordername.equals("")){
							list.add(createCp1252("*Orden para: "+ordername+"*\r\n"));
						}
						String conmesas="";
						if(!mesa.equals("")){
							conmesas="Mesa: "+mesa;
						}
						String conpax="";
						if(!pax.equals("")&&Double.parseDouble(pax)>0)
							conpax="- Pax: "+pax+conpax;
						
						list.add(createCp1252(conmesas+conpax+"\r\n"));
					
					}else if(lang.equals(2)){
						if(!ordername.equals("")){
							list.add(createCp1252("*Name Order: "+ordername+"*\r\n"));
						}
						String conmesas="";
						if(!mesa.equals("")){
							conmesas="Table: "+mesa;
							
						}
						String conpax="";
						if(!pax.equals("")&&Double.parseDouble(pax)>0)
							conpax="- Pax: "+pax+conpax;
						
						list.add(createCp1252(conmesas+conpax+"\r\n"));
					}
				}
				
				//list.add(createCp1252(mensajefinal+"\r\n"));
				list.add(createCp1252(mensajefinal+"\r\n"));
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x00 });

				// 1D barcode example
				//list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x01 });
				//list.add(new byte[] { 0x1b, 0x62, 0x06, 0x02, 0x02 });
				//list.add(createCp1252(" 12ab34cd56\u001e\r\n"));

				list.add(new byte[] { 0x1b, 0x64, 0x02 }); // Cut
				list.add(new byte[] { 0x07 }); // Kick cash drawer
				try {
					PrinterFunctions.SendCommand(context, portName, portSettings, list);
					callbackContext.success();
				} catch (StarIOPortException e) {
					callbackContext.error(e.getMessage());
				}
				
		}else{
			ArrayList<byte[]> list = new ArrayList<byte[]>();
			if(tipo.equals("pagar")==true){
				
				Integer lineasescritas=0;
				
				list.add(new byte[] { 0x1b, 0x1d, 0x74, 0x20 }); // Code Page #1252 (Windows Latin-1)

				list.add(new byte[] { 0x1b, 0x44, 0x02, 0x06, 0x0a, 0x10, 0x14, 0x1a, 0x22, 0x24, 0x28, 0x00 }); // Set horizontal tab

				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x01 }); // Alignment (center)

				// list.add("[If loaded.. Logo1 goes here]\r\n".getBytes());

				// list.add(new byte[]{0x1b, 0x1c, 0x70, 0x01, 0x00, '\r', '\n'}); //Stored Logo Printing

				// Notice that we use a unicode representation because that is
				// how Java expresses these bytes as double byte unicode

				// Character expansion
				//list.add(new byte[] { 0x1b, 0x68, 0x01 });

				//list.add(createCp1252(nombreEmpresa+"\r\n")); lineasescritas=lineasescritas+1;
				//list.add(new byte[] { 0x1b, 0x68, 0x00 }); // Cancel Character Expansion
				//list.add(createCp1252(direccionEmpresa+"\r\n")); lineasescritas=lineasescritas+1;
				//list.add(createCp1252("08029 BARCELONA\r\n\r\n"));
				if(!logo.equals("")){
					//printImage(callbackContext,logo,portNameSearch,portSettings);
					int maxWidth=384;
					boolean compressionEnable=false;
					RasterCommand rasterType = RasterCommand.Standard;
					RasterDocument rasterDoc = new RasterDocument(RasSpeed.Medium,RasPageEndMode.None, RasPageEndMode.None, RasTopMargin.Standard, 0, 0, 0);
					
					//Bitmap bm = BitmapFactory.decodeResource(res, source);
					
					Bitmap bm =BitmapFactory.decodeFile("/data/data/com.practisis.practipos/files//"+logo);
					
					StarBitmap starbitmap = new StarBitmap(bm, false, maxWidth);

					if (rasterType == RasterCommand.Standard) {
						list.add(rasterDoc.BeginDocumentCommandData());
						list.add(starbitmap.getImageRasterDataForPrinting_Standard(compressionEnable));
						list.add(rasterDoc.EndDocumentCommandData());
						
					} else {
						list.add(starbitmap.getImageRasterDataForPrinting_graphic(compressionEnable));
						//list.add(new byte[] { 0x1b, 0x64, 0x02 }); // Feed to cutter position
					}
				}
				
				while(lineasescritas<lineasencabezado){
					list.add(createCp1252("\r\n"));
					lineasescritas=lineasescritas+1;
				}
				
				if(lang.equals(2)){
					nombreCliente=nombreCliente.replace("Consumidor Final","Final Customer");
				}
				
					
				
				list.add(createCp1252(nombreCliente+"-"+cedulaCliente+"\r\n")); lineasescritas=lineasescritas+1;
				list.add(createCp1252(direccionCliente+"/"+telefonoCliente+"\r\n")); lineasescritas=lineasescritas+1;
				if(textoreimpr!=""){
					if(lang.equals(2)){
						list.add(createCp1252(textoreimpr.replace("Reimpresion Factura","Invoce Reprint")+"\r\n"));
					}
					else if (lang.equals(1)){
						list.add(createCp1252(textoreimpr+"\r\n"));
					}
					lineasescritas=lineasescritas+1;
				}
				list.add(createCp1252("------------------------------------------\r\n"));lineasescritas=lineasescritas+1;
				list.add(createCp1252("NO:"+nofact+"                      \r\n"));lineasescritas=lineasescritas+1;
				Date fechafact=new Date(fechanumber);
				String fechaf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(fechafact);lineasescritas=lineasescritas+1;
				if(lang.equals(1)){
					list.add(createCp1252("FECHA:"+fechaf+"                      \r\n"));
				}else if(lang.equals(2)){
					list.add(createCp1252("DATE:"+fechaf+"                       \r\n"));
				}
				lineasescritas=lineasescritas+1;
				if(lang.equals(1)){
					list.add(createCp1252("  # DESCRIPCION                       SUMA\r\n"));
				}else if(lang.equals(1)){
					list.add(createCp1252("  # DESCRIPTION                    AMMOUNT\r\n"));
				}
				lineasescritas=lineasescritas+1;
				
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x00 }); // Alignment
				list.add(createCp1252("------------------------------------------\r\n"));lineasescritas=lineasescritas+1;
				
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
						if(totc.length()<7){
							int tam=7-totc.length();
							for(int n=0;n<tam;n++){
								totc=" "+totc;
							}
						}
						
						String desc=linea.getString("nombre_producto");
						if(desc.length()>31)
							desc=desc.substring(0,30);
						else if(desc.length()<31){
							int tam=30-desc.length();
							for(int n=0;n<tam;n++){
								desc=desc+" ";
							}
						}
												
						
						list.add(createCp1252(String.valueOf(cantidad)+" "+String.valueOf(desc)+" "+String.valueOf(totc)+"\r\n"));
						lineasescritas=lineasescritas+1;
						//list.add(createCp1252(" 4  3,00  JARRA  CERVESA   12,00\r\n"));
						//list.add(createCp1252(" 1  1,60  COPA DE CERVESA   1,60\r\n"));
						
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
									list.add(createCp1252("    "+medio+detalleagr[0]+"\r\n"));
									lineasescritas=lineasescritas+1;
								}
							}
						}
						/**/
						}catch(JSONException ex){
							ex.printStackTrace();
						}
					}
					
				}
				
				list.add(createCp1252("------------------------------------------\r\n"));lineasescritas=lineasescritas+1;
				
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
						
						if(descuento.length()<6){
							int tam=6-descuento.length();
							for(int n=0;n<tam;n++){
								descuento=" "+descuento;
							}
						}
						
						if(servicio.length()<6){
							int tam=6-servicio.length();
							for(int n=0;n<tam;n++){
								servicio=" "+servicio;
							}
						}
						
						if(propina.length()<6){
							int tam=6-propina.length();
							for(int n=0;n<tam;n++){
								propina=" "+propina;
							}
						}

				if(Double.parseDouble(subtotal.replace(",","."))>0){
					list.add(createCp1252("                           SUBTOTAL:"+String.valueOf(subtotal)+"\r\n"));
					lineasescritas=lineasescritas+1;
				}
				/*if(Double.parseDouble(subconiva.replace(",","."))>0){
					list.add(createCp1252("                          SUBCONIVA:"+String.valueOf(subconiva)+"\r\n"));
					lineasescritas=lineasescritas+1;
				}
				if(Double.parseDouble(subsiniva.replace(",","."))>0){
					list.add(createCp1252("                          SUBSINIVA:"+String.valueOf(subsiniva)+"\r\n"));
					lineasescritas=lineasescritas+1;
				}*/
				
				/*imprime impuestos*/
				if(!cadimpuestos.equals("")){
					String[] imps = cadimpuestos.split("@");
					for(int k=0;k<imps.length;k++){
						if(!imps[k].equals("")){
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
								
								if(nombreimp.length()<36){
									int tam=36-nombreimp.length();
									for(int n=0;n<tam;n++){
										nombreimp=" "+nombreimp;
									}
								}
								
								list.add(createCp1252(String.valueOf(nombreimp)+String.valueOf(valorimp)+"\r\n"));
								lineasescritas=lineasescritas+1;
							}
						}
					}
				}else{
					if(Double.parseDouble(iva.replace(",","."))>0){
						list.add(createCp1252("                                IVA:"+String.valueOf(iva)+"\r\n"));
						lineasescritas=lineasescritas+1;
					}
					if(Double.parseDouble(servicio.replace(",","."))>0){
						list.add(createCp1252("                           SERVICIO:"+String.valueOf(servicio)+"\r\n"));
						lineasescritas=lineasescritas+1;
					}
				}
				/*fin impuestos*/
				
				
				
				
				if(Double.parseDouble(descuento.replace(",","."))>0){
					if(lang.equals(1)){
						list.add(createCp1252("                          DESCUENTO:"+String.valueOf(descuento)+"\r\n"));
					}else{
						list.add(createCp1252("                           DISCOUNT:"+String.valueOf(descuento)+"\r\n"));
					}
					
					lineasescritas=lineasescritas+1;
				}
				
				if(!(propina.equals("")||Double.parseDouble(propina.replace(",","."))==0)){
					
					if(lang.equals(1)){
						list.add(createCp1252("                            PROPINA:"+String.valueOf(propina)+"\r\n"));
					}else{
						list.add(createCp1252("                                TIP:"+String.valueOf(propina)+"\r\n"));
					}
					lineasescritas=lineasescritas+1;
				}
				
				//list.add(new byte[] { 0x09, 0x1b, 0x69, 0x01, 0x00 });
				list.add(new byte[] { 0x1b, 0x57, 0x01});
				list.add(new byte[] { 0x1b, 0x1d, 0x61,0x02});
				list.add(createCp1252("TOTAL:	"+String.valueOf(totalfact)+"\r\n"));
				lineasescritas=lineasescritas+1;
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x00 });
				list.add(new byte[] { 0x1b, 0x57, 0x00 });
				
				
				
				list.add(createCp1252("------------------------------------------\r\n"));lineasescritas=lineasescritas+1;
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x01 });				
				list.add(new byte[] { 0x1b, 0x68, 0x01 });	
				if(lang.equals(1)){
					if(!ordername.equals("")){
						list.add(createCp1252("*Orden para: "+ordername+"*\r\n"));
						lineasescritas=lineasescritas+1;
					}
					String conmesas="";
					if(!mesa.equals("")){
						conmesas="*Mesa: "+mesa;
						
					}
					String conpax="*";
					if(!pax.equals(""))
						conpax="- Pax: "+pax+conpax;
					
					list.add(createCp1252(conmesas+conpax+"\r\n"));
					lineasescritas=lineasescritas+1;
				}
				else if(lang.equals(2)){
					if(!ordername.equals("")){
						list.add(createCp1252("*Order Name: "+ordername+"*\r\n"));
						lineasescritas=lineasescritas+1;
					}
					String conmesas="";
					if(!mesa.equals("")){
						conmesas="*Table: "+mesa;
						
					}
					String conpax="*";
					if(!pax.equals(""))
						conpax="- Pax: "+pax+conpax;
					
					list.add(createCp1252(conmesas+conpax+"\r\n"));
					lineasescritas=lineasescritas+1;
				}
				
				list.add(createCp1252(mensajefinal+"\r\n"));
				lineasescritas=lineasescritas+1;
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x00 });	
				list.add(new byte[] { 0x1b, 0x68, 0x00 });
				//list.add(new byte[] { 0x1b, 0x68, 0x00 });
				//aumentar filas si faltan
				if(lineasescritas<lineastotales){
					while(lineasescritas<lineastotales){
						list.add(createCp1252("\r\n"));
						lineasescritas=lineasescritas+1;
					}
				}
				list.add(new byte[] { 0x1b, 0x64, 0x02 }); // Cut
				list.add(new byte[] { 0x07 }); // Kick cash draweR
				
			}else if(tipo.equals("cierre")==true){
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
				
				if(totalCierre.length()<9){
					int tam=9-totalCierre.length();
						for(int n=0;n<tam;n++){
								totalCierre=" "+totalCierre;
						}
				}
				
				list.add(new byte[] { 0x1b, 0x1d, 0x74, 0x20 }); // Code Page #1252 (Windows Latin-1)
				list.add(new byte[] { 0x1b, 0x44, 0x02, 0x06, 0x0a, 0x10, 0x14, 0x1a, 0x22, 0x24, 0x28, 0x00 }); // Set horizontal tab
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x01 }); // Alignment (center)
				// list.add("[If loaded.. Logo1 goes here]\r\n".getBytes());
				// list.add(new byte[]{0x1b, 0x1c, 0x70, 0x01, 0x00, '\r', '\n'}); //Stored Logo Printing
				// Notice that we use a unicode representation because that is
				// how Java expresses these bytes as double byte unicode
				// Character expansion
				list.add(new byte[] { 0x1b, 0x68, 0x01 });	
				if(lang.equals(1))
					list.add(createCp1252("CIERRE DE CAJA\r\n"));
				else if(lang.equals(2))
					list.add(createCp1252("DAILY SALES\r\n"));
				
				list.add(new byte[] { 0x1b, 0x68, 0x00 }); // Cancel Character Expansion
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x00 }); // Alignment
				list.add(createCp1252("--------------------------------\r\n"));
				if(lang.equals(1))
					list.add(createCp1252("FECHA IMP.:"+fechaImpresion+"\r\n"));
				else if(lang.equals(2))
					list.add(createCp1252("PRINT DATE:"+fechaImpresion+"\r\n"));
				
				if(lang.equals(1))
					list.add(createCp1252("FECHA CIERRE:"+fechaCierre+"\r\n"));
				else if(lang.equals(2))
					list.add(createCp1252("CLOSE DATE:"+fechaCierre+"\r\n"));
			
				list.add(new byte[] { 0x1b, 0x69, 0x00, 0x00 }); // Cancel Character Expansion
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x00 }); // Alignment
				list.add(createCp1252("--------------------------------\r\n"));
				if(lang.equals(1))
				list.add(createCp1252("FACTURAS\r\n"));
				else if(lang.equals(2))
				list.add(createCp1252("INVOICES\r\n"));
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
				
				if(descuentoCierre.length()<9){
					int tam=9-descuentoCierre.length();
						for(int n=0;n<tam;n++){
								descuentoCierre=" "+descuentoCierre;
						}
				}
				
				if(subdes.length()<9){
					int tam=9-subdes.length();
						for(int n=0;n<tam;n++){
								subdes=" "+subdes;
						}
				}
				
				if(servicioCierre.length()<9){
					int tam=9-servicioCierre.length();
						for(int n=0;n<tam;n++){
								servicioCierre=" "+servicioCierre;
						}
				}
				
				if(propina.length()<9){
					int tam=9-propina.length();
						for(int n=0;n<tam;n++){
								propina=" "+propina;
						}
				}
				
				if(lang.equals(1))
					list.add(createCp1252("No. Facturas    "+numeroFacturas+"\r\n"));
				else if(lang.equals(2))
					list.add(createCp1252("Invoices        "+numeroFacturas+"\r\n"));
				
				if(lang.equals(1))
					list.add(createCp1252("No. Anuladas    "+anuladas+"\r\n"));
		 	    else if(lang.equals(2))
					list.add(createCp1252("Canceled        "+anuladas+"\r\n"));
				
				list.add(new byte[] { 0x1b, 0x69, 0x00, 0x00 }); // Cancel Character Expansion
				list.add(createCp1252("--------------------------------\r\n"));
				if(lang.equals(1))
					list.add(createCp1252("TOTALES\r\n"));
				else if(lang.equals(2))
					list.add(createCp1252("TOTALS\r\n"));
				
				list.add(createCp1252("Subtotal        "+subtotalCierre+"\r\n"));
				
				if(lang.equals(1))
					list.add(createCp1252("Descuentos      "+descuentoCierre+"\r\n"));
				else if(lang.equals(2))
					list.add(createCp1252("Discounts       "+descuentoCierre+"\r\n"));
				
				if(lang.equals(1))
				list.add(createCp1252("Sub-desc        "+subdes+"\r\n"));
				else if(lang.equals(2))
				list.add(createCp1252("Sub-disc        "+subdes+"\r\n"));
				 
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
							list.add(createCp1252(String.valueOf(nombre2)+" "+String.valueOf(valor2)+"\r\n"));
						}
					}catch(JSONException ex){
						ex.printStackTrace();
					}
				}
				else{
					list.add(createCp1252("Iva             "+ivaCierre+"\r\n"));
					list.add(createCp1252("Servicio        "+servicioCierre+"\r\n"));
				}
				
				/**/
				
				if(!(propina.equals("")||Double.parseDouble(propina.replace(",","."))==0)){
					list.add(new byte[] { 0x1b, 0x69, 0x00, 0x00 }); // Cancel Character Expansion
					list.add(createCp1252("--------------------------------\r\n"));
					if(lang.equals(1))
					list.add(createCp1252("PROPINAS        "+propina+"\r\n"));
					else if(lang.equals(2))
					list.add(createCp1252("TIPS            "+propina+"\r\n"));
				}
				
				
				
				list.add(createCp1252("TOTAL           "+totalCierre+"\r\n"));
				list.add(new byte[] { 0x1b, 0x69, 0x00, 0x00 }); // Cancel Character Expansion
				list.add(createCp1252("--------------------------------\r\n"));
				
				if(lang.equals(1))
					list.add(createCp1252("FORMAS DE PAGO\r\n"));
				else if(lang.equals(2))
					list.add(createCp1252("PAYMENT METHODS\r\n"));
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
							
							list.add(createCp1252(String.valueOf(nombre)+" "+String.valueOf(valor)+"\r\n"));
						}
						/*for(int m=0;m<names.length();m++)
						{
							String nombre=names[m];
							String valor=linea.getString(names[m]);
							list.add(createCp1252(String.valueOf(nombre)+":"+String.valueOf(valor)+"\r\n"));
						}	*/					
						}catch(JSONException ex){
								ex.printStackTrace();
						}
				}
				
				
				
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x00 });
				list.add(new byte[] { 0x1b, 0x57, 0x00 });
				list.add(createCp1252("------------------------------------------\r\n"));
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x01 });				
				list.add(new byte[] { 0x1b, 0x68, 0x01 });				
				list.add(createCp1252(mensajefinal+"\r\n"));
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x00 });	
				list.add(new byte[] { 0x1b, 0x68, 0x00 });
				list.add(new byte[] { 0x1b, 0x68, 0x00 });
				list.add(new byte[] { 0x1b, 0x64, 0x02 }); // Cut
				list.add(new byte[] { 0x07 }); // Kick cash draweR
				
			}else if(tipo.equals("comandar")==true){
				
				
				list.add(new byte[] { 0x1b, 0x1d, 0x74, 0x20 }); // Code Page #1252 (Windows Latin-1)

				list.add(new byte[] { 0x1b, 0x44, 0x02, 0x06, 0x0a, 0x10, 0x14, 0x1a, 0x22, 0x24, 0x28, 0x00 }); // Set horizontal tab

				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x01 }); // Alignment (center)
				
				// Character expansion
				list.add(new byte[] { 0x1b, 0x68, 0x01 });
					
				list.add(createCp1252(nombreEmpresa+"\r\n"));
				if(lang.equals(2)){
					nombreCliente=nombreCliente.replace("Consumidor Final","Final Customer");
				}
				
				list.add(createCp1252(nombreCliente+"\r\n"));
				
				list.add(new byte[] { 0x1b, 0x69, 0x00, 0x00 }); // Cancel Character Expansion
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x00 }); // Alignment
				
				list.add(createCp1252("------------------------------------------\r\n"));
				list.add(createCp1252("NO:"+nofact+"                      \r\n"));
				Date fechafact=new Date(fechanumber);
				String fechaf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(fechafact);
				
				if(lang.equals(1)){
					list.add(createCp1252("FECHA:"+fechaf+"                      \r\n"));
				}else if(lang.equals(2)){
					list.add(createCp1252("DATE:"+fechaf+"                       \r\n"));
				}
				
				list.add(new byte[] { 0x1b, 0x68, 0x01 });//expansion
				
				
				//list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x00 }); // Alignment
				list.add(createCp1252("------------------------------------------\r\n"));
				
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
						
						
						String desc=linea.getString("nombre_producto");
						if(desc.length()>31)
							desc=desc.substring(0,30);
						else if(desc.length()<31){
							int tam=30-desc.length();
							for(int n=0;n<tam;n++){
								desc=desc+" ";
							}
						}
												
						
						list.add(createCp1252(String.valueOf(cantidad)+" "+String.valueOf(desc)+"        "+"\r\n"));
						//list.add(createCp1252(" 4  3,00  JARRA  CERVESA   12,00\r\n"));
						//list.add(createCp1252(" 1  1,60  COPA DE CERVESA   1,60\r\n"));
						
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
									list.add(createCp1252("    "+medio+detalleagr[0]+"\r\n"));
								}
							}
						}
						/**/
						
						
						/**/
						if(!(linea.getString("detalle_notas").equals(JSONObject.NULL))){
							if(!(linea.getString("detalle_notas").equals(""))){
								String notasv=linea.getString("detalle_notas");
								list.add(createCp1252("    "+notasv+"*"+"\r\n"));
							}
						}
						/**/
						
						}catch(JSONException ex){
							ex.printStackTrace();
						}
					}
					
				}
				
				list.add(createCp1252("------------------------------------------\r\n"));
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x01 });				
				list.add(new byte[] { 0x1b, 0x68, 0x01 });	
				if(lang.equals(1)){
					if(!ordername.equals(""))
						list.add(createCp1252("*Orden para: "+ordername+"*\r\n"));
					String conmesas="";
					if(!mesa.equals("")){
						conmesas="*Mesa: "+mesa;
						
					}
					String conpax="*";
					if(!pax.equals(""))
						conpax="- Pax: "+pax+conpax;
					
					list.add(createCp1252(conmesas+conpax+"\r\n"));
				}
				else if(lang.equals(2)){
					if(!ordername.equals(""))	
						list.add(createCp1252("*Order Name: "+ordername+"*\r\n"));
					
					String conmesas="";
					if(!mesa.equals("")){
						conmesas="*Table: "+mesa;
						
					}
					String conpax="*";
					if(!pax.equals(""))
						conpax="- Pax: "+pax+conpax;
					
					list.add(createCp1252(conmesas+conpax+"\r\n"));
				}
				
				list.add(createCp1252(mensajefinal+"\r\n"));
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x00 });	
				list.add(new byte[] { 0x1b, 0x68, 0x00 });
				list.add(new byte[] { 0x1b, 0x64, 0x02 }); // Cut
				list.add(new byte[] { 0x07 }); // Kick cash draweR
				
			}else if(tipo.equals("precuenta")==true){
				
				Integer lineasescritas=0;
				
				list.add(new byte[] { 0x1b, 0x1d, 0x74, 0x20 }); // Code Page #1252 (Windows Latin-1)

				list.add(new byte[] { 0x1b, 0x44, 0x02, 0x06, 0x0a, 0x10, 0x14, 0x1a, 0x22, 0x24, 0x28, 0x00 }); // Set horizontal tab

				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x01 }); // Alignment (center)
				
				while(lineasescritas<lineasencabezado){
					list.add(createCp1252("\r\n"));
					lineasescritas=lineasescritas+1;
				}
				
				if(lang.equals(1)){
					list.add(createCp1252("PRECUENTA\r\n"));lineasescritas=lineasescritas+1;
				}else{
					list.add(createCp1252("CHECK\r\n"));lineasescritas=lineasescritas+1;
				}
				
				list.add(createCp1252("------------------------------------------\r\n"));lineasescritas=lineasescritas+1;
				Date fechafact=new Date(fechanumber);
				String fechaf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(fechafact);lineasescritas=lineasescritas+1;
				if(lang.equals(1)){
					list.add(createCp1252("FECHA:"+fechaf+"                      \r\n"));
				}else if(lang.equals(2)){
					list.add(createCp1252("DATE:"+fechaf+"                       \r\n"));
				}
				lineasescritas=lineasescritas+1;
				if(lang.equals(1)){
					list.add(createCp1252("  # DESCRIPCION                       SUMA\r\n"));
				}else if(lang.equals(1)){
					list.add(createCp1252("  # DESCRIPTION                    AMMOUNT\r\n"));
				}
				lineasescritas=lineasescritas+1;
				
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x00 }); // Alignment
				list.add(createCp1252("------------------------------------------\r\n"));lineasescritas=lineasescritas+1;
				
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
						if(totc.length()<7){
							int tam=7-totc.length();
							for(int n=0;n<tam;n++){
								totc=" "+totc;
							}
						}
						
						String desc=linea.getString("nombre_producto");
						if(desc.length()>31)
							desc=desc.substring(0,30);
						else if(desc.length()<31){
							int tam=30-desc.length();
							for(int n=0;n<tam;n++){
								desc=desc+" ";
							}
						}
												
						
						list.add(createCp1252(String.valueOf(cantidad)+" "+String.valueOf(desc)+" "+String.valueOf(totc)+"\r\n"));
						lineasescritas=lineasescritas+1;
						//list.add(createCp1252(" 4  3,00  JARRA  CERVESA   12,00\r\n"));
						//list.add(createCp1252(" 1  1,60  COPA DE CERVESA   1,60\r\n"));
						
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
									list.add(createCp1252("    "+medio+detalleagr[0]+"\r\n"));
									lineasescritas=lineasescritas+1;
								}
							}
						}
						/**/
						}catch(JSONException ex){
							ex.printStackTrace();
						}
					}
					
				}
				
				list.add(createCp1252("------------------------------------------\r\n"));lineasescritas=lineasescritas+1;
				
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
						
						if(descuento.length()<6){
							int tam=6-descuento.length();
							for(int n=0;n<tam;n++){
								descuento=" "+descuento;
							}
						}
						
						if(servicio.length()<6){
							int tam=6-servicio.length();
							for(int n=0;n<tam;n++){
								servicio=" "+servicio;
							}
						}
						
						if(propina.length()<6){
							int tam=6-propina.length();
							for(int n=0;n<tam;n++){
								propina=" "+propina;
							}
						}

				if(Double.parseDouble(subtotal.replace(",","."))>0){
					list.add(createCp1252("                           SUBTOTAL:"+String.valueOf(subtotal)+"\r\n"));
					lineasescritas=lineasescritas+1;
				}
				
				/*imprime impuestos*/
				if(!cadimpuestos.equals("")){
					String[] imps = cadimpuestos.split("@");
					for(int k=0;k<imps.length;k++){
						if(!imps[k].equals("")){
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
								
								if(nombreimp.length()<36){
									int tam=36-nombreimp.length();
									for(int n=0;n<tam;n++){
										nombreimp=" "+nombreimp;
									}
								}
								
								list.add(createCp1252(String.valueOf(nombreimp)+String.valueOf(valorimp)+"\r\n"));
								lineasescritas=lineasescritas+1;
							}
						}
					}
				}else{
					if(Double.parseDouble(iva.replace(",","."))>0){
						list.add(createCp1252("                                IVA:"+String.valueOf(iva)+"\r\n"));
						lineasescritas=lineasescritas+1;
					}
					if(Double.parseDouble(servicio.replace(",","."))>0){
						list.add(createCp1252("                           SERVICIO:"+String.valueOf(servicio)+"\r\n"));
						lineasescritas=lineasescritas+1;
					}
				}
				/*fin impuestos*/
				
				
				
				
				if(Double.parseDouble(descuento.replace(",","."))>0){
					if(lang.equals(1)){
						list.add(createCp1252("                          DESCUENTO:"+String.valueOf(descuento)+"\r\n"));
					}else{
						list.add(createCp1252("                           DISCOUNT:"+String.valueOf(descuento)+"\r\n"));
					}
					
					lineasescritas=lineasescritas+1;
				}
				
				if(!(propina.equals("")||Double.parseDouble(propina.replace(",","."))==0)){
					
					if(lang.equals(1)){
						list.add(createCp1252("                            PROPINA:"+String.valueOf(propina)+"\r\n"));
					}else{
						list.add(createCp1252("                                TIP:"+String.valueOf(propina)+"\r\n"));
					}
					lineasescritas=lineasescritas+1;
				}
				
				//list.add(new byte[] { 0x09, 0x1b, 0x69, 0x01, 0x00 });
				list.add(new byte[] { 0x1b, 0x57, 0x01});
				list.add(new byte[] { 0x1b, 0x1d, 0x61,0x02});
				list.add(createCp1252("TOTAL:	"+String.valueOf(totalfact)+"\r\n"));
				lineasescritas=lineasescritas+1;
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x00 });
				list.add(new byte[] { 0x1b, 0x57, 0x00 });
				
				
				
				list.add(createCp1252("------------------------------------------\r\n"));lineasescritas=lineasescritas+1;
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x01 });				
				list.add(new byte[] { 0x1b, 0x68, 0x01 });	
				if(lang.equals(1)){
					if(!ordername.equals("")){
						list.add(createCp1252("*Orden para: "+ordername+"*\r\n"));
						lineasescritas=lineasescritas+1;
					}
					String conmesas="";
					if(!mesa.equals("")){
						conmesas="*Mesa: "+mesa;
						
					}
					String conpax="*";
					if(!pax.equals(""))
						conpax="- Pax: "+pax+conpax;
					
					list.add(createCp1252(conmesas+conpax+"\r\n"));
					lineasescritas=lineasescritas+1;
				}
				
				else if(lang.equals(2)){
					if(!ordername.equals("")){
						list.add(createCp1252("*Order Name: "+ordername+"*\r\n"));
						lineasescritas=lineasescritas+1;
					}
					String conmesas="";
					if(!mesa.equals("")){
						conmesas="*Table: "+mesa;
						
					}
					String conpax="*";
					if(!pax.equals(""))
						conpax="- Pax: "+pax+conpax;
					
					list.add(createCp1252(conmesas+conpax+"\r\n"));
					lineasescritas=lineasescritas+1;
				}
				
				list.add(createCp1252(mensajefinal+"\r\n"));
				lineasescritas=lineasescritas+1;
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x00 });	
				list.add(new byte[] { 0x1b, 0x68, 0x00 });
				//list.add(new byte[] { 0x1b, 0x68, 0x00 });
				//aumentar filas si faltan
				/*if(lineasescritas<lineastotales){
					while(lineasescritas<lineastotales){
						list.add(createCp1252("\r\n"));
						lineasescritas=lineasescritas+1;
					}
				}*/
				
					if(lang.equals(1)){
						list.add(createCp1252("Datos de la Factura:\r\n"));
						list.add(createCp1252("Propina:________________________\r\n"));
						list.add(createCp1252("                                \r\n"));
						list.add(createCp1252("Nombre:_________________________\r\n"));
						list.add(createCp1252("                                \r\n"));
						list.add(createCp1252("CI:_____________________________\r\n"));
						list.add(createCp1252("                                \r\n"));
						list.add(createCp1252("Dirección:______________________\r\n"));
						list.add(createCp1252("                                \r\n"));
						list.add(createCp1252("Teléfono:_______________________\r\n"));
						list.add(createCp1252("                                \r\n"));
						list.add(createCp1252("Email:__________________________\r\n"));
						list.add(createCp1252("                                \r\n"));
						list.add(createCp1252("Fecha Cumpleaños:_______________\r\n"));	
						list.add(createCp1252("                                \r\n"));
					}else if(lang.equals(2)){
						list.add(createCp1252("Invoice Data:\r\n"));
						list.add(createCp1252("Tip:____________________________\r\n"));
						list.add(createCp1252("                                \r\n"));
						list.add(createCp1252("Name:___________________________\r\n"));
						list.add(createCp1252("                                \r\n"));
						list.add(createCp1252("ID No.:_________________________\r\n"));
						list.add(createCp1252("                                \r\n"));
						list.add(createCp1252("Address:________________________\r\n"));
						list.add(createCp1252("                                \r\n"));
						list.add(createCp1252("Phone:__________________________\r\n"));
						list.add(createCp1252("                                \r\n"));
						list.add(createCp1252("Email:__________________________\r\n"));
						list.add(createCp1252("                                \r\n"));
						list.add(createCp1252("Birthday:_______________________\r\n"));
						list.add(createCp1252("                                \r\n"));
					}
				list.add(new byte[] { 0x1b, 0x64, 0x02 }); // Cut
				list.add(new byte[] { 0x07 }); // Kick cash draweR
				
			}else if(tipo.equals("comandasmesas")){
				
				 // Character expansion
				list.add(new byte[] { 0x1b, 0x68, 0x01 });
				
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x00 }); // Alignment
				
				list.add(createCp1252("------------------------------------------\r\n"));
				if(lang.equals(1)){
					list.add(createCp1252("FECHA:"+hoy+"                         \r\n"));
				}else if(lang.equals(2)){
					list.add(createCp1252("DATE:"+hoy+"                          \r\n"));
				}
				
				//list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x01 }); // Alignment (center)
				list.add(createCp1252("------------------------------------------\r\n"));
				
			   

				
				if(expprod.length()>0){
					for(int i=0;i<expprod.length();i++){
						try{
						JSONObject linea=expprod.getJSONObject(i);
						String cantidad=linea.getString("cant_prod").replace(",",".");
						String desc=linea.getString("nombre_producto");
						list.add(createCp1252(String.valueOf(cantidad)+" "+String.valueOf(desc)+"\r\n"));
						
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
									String cadena="  "+medio+detalleagr[0];
									list.add(createCp1252(cadena+"\r\n"));
								}
							}
						}
						/**/
						
						
						/*notas*/
						if(!(linea.getString("detalle_notas").equals(JSONObject.NULL))){
							if(!(linea.getString("detalle_notas").equals(""))){
								String notasv=linea.getString("detalle_notas");
								String cadena=" "+notasv+"*";
									list.add(createCp1252(cadena+"\r\n"));
								}
						}
						}catch(JSONException ex){
							ex.printStackTrace();
						}
					}
					
				}
				list.add(new byte[] { 0x1b, 0x69, 0x00, 0x00 }); // Cancel Character Expansion
				list.add(createCp1252("------------------------------------------\r\n"));
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x01 });				
				list.add(new byte[] { 0x1b, 0x68, 0x01 });	
				if(lang.equals(1)){
					String conmesas="";
					if(!mesa.equals("")){
						conmesas="*Mesa: "+mesa;
						
					}
					String conpax="*";
					if(!pax.equals(""))
						conpax="- Pax: "+pax+conpax;
					
					list.add(createCp1252(conmesas+conpax+"\r\n"));
				}
				else if(lang.equals(2)){
					String conmesas="";
					if(!mesa.equals("")){
						conmesas="*Table: "+mesa;
						
					}
					String conpax="";
					if(!pax.equals("")&&Double.parseDouble(pax)>0)
						conpax="- Pax: "+pax+conpax;
					
					list.add(createCp1252(conmesas+conpax+"\r\n"));
				}
				
				list.add(createCp1252(mensajefinal+"\r\n"));
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x00 });	
				list.add(new byte[] { 0x1b, 0x68, 0x00 });
				list.add(new byte[] { 0x1b, 0x64, 0x02 }); // Cut
				list.add(new byte[] { 0x07 }); // Kick cash draweR
				
				//list.add(createCp1252("--------------------------------\r\n"));
			}
			
			PrinterFunctions.SendCommand(context, portName, portSettings, list);
				/*try {
					PrinterFunctions.SendCommand(context, portName, portSettings, list);
					callbackContext.success();
				} catch (StarIOPortException e) {
					callbackContext.error(e.getMessage());
				}*/
				
				//list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x00 });		
				//list.add(new byte[] { 0x1b, 0x57, 0x00 });	
				/*list.add(createCp1252("------------------------------------------\r\n"));
				list.add(new byte[] { 0x1b, 0x1d, 0x61, 0x01 });				
				list.add(new byte[] { 0x1b, 0x68, 0x01 });				
				list.add(createCp1252("**** NUBEPOS ****\r\n"));
				list.add(new byte[] { 0x1b, 0x68, 0x00 });
				list.add(new byte[] { 0x1b, 0x68, 0x00 });
				list.add(new byte[] { 0x1b, 0x64, 0x02 }); // Cut
				list.add(new byte[] { 0x07 }); // Kick cash draweR*/
		}		
    }
	
	 /**
     * This method search all printers
     * @param callbackContext the callback context of the action
     * @param message the string containing all the content to print
     * @param portSettings the port settings for the connection to the printer ("mini" if you are printing on star portable printers)
     */
    private void searchAll(CallbackContext callbackContext, String portNameSearch) {
        ArrayList<String> portNames =new ArrayList<String>();
		//String portNames="";
        String portSettings = "";
        Context context = this.cordova.getActivity().getApplicationContext();
		String portarray="";
		//int x=0;
        try {
			portNames = PrinterFunctions.getPrinters(portNameSearch,context);
			//portNames = PrinterFunctions.getFirstPrinter(portNameSearch);
			if(portNames.size()>0){
				int cont=0;
				for(int x=0;x<portNames.size();x++) {
					String needle="BT:";
					if(portNames.get(x).toLowerCase().contains(needle.toLowerCase())){
						String[] parts = portNames.get(x).split("@");
						StarPrinterStatus status = PrinterFunctions.GetStatus(context,parts[0], portSettings, true);
					   //StarPrinterStatus status = PrinterFunctions.GetStatus(context, portNames, portSettings, true);
						if (status == null) {
							callbackContext.error("Cannot get the printer status.");
						} else if (status.offline) {
							callbackContext.error("The printer is offline.");
						} else {
							if(cont>0){
								portarray=portarray+"||";
							}
							portarray=portarray+portNames.get(x);
							cont++;
						}
					}else{
						StarPrinterStatus status = PrinterFunctions.GetStatus(context,portNames.get(x), portSettings, true);
					   //StarPrinterStatus status = PrinterFunctions.GetStatus(context, portNames, portSettings, true);
						if (status == null) {
							callbackContext.error("Cannot get the printer status.");
						} else if (status.offline) {
							callbackContext.error("The printer is offline.");
						} else {
							if(cont>0){
								portarray=portarray+"||";
							}
							portarray=portarray+portNames.get(x);
							//callbackContext.success(portNames);
						} 
					}
				}
				callbackContext.success(portarray);
			}else{
				callbackContext.error("No printers found.");
			}
        } catch (StarIOPortException e) {
            callbackContext.error(e.getMessage());
        }
	}
	
	 /**
     * This method print an image given the path
     * @param callbackContext the callback context of the action
     * @param portName the string containing the printer name
     * @param portSettings the port settings for the connection to the printer ("mini" if you are printing on star portable printers)
     */
	private void printImage(CallbackContext callbackContext,String imagename,String portName, String portSettings)throws StarIOPortException {
		try{
			int maxWidth=384;
			Context context = this.cordova.getActivity().getApplicationContext();
			boolean compressionEnable=false;
			RasterCommand rasterType = RasterCommand.Standard;
			String needle="BT:";
			if(portName.toLowerCase().contains(needle.toLowerCase())){
					rasterType=RasterCommand.Graphics;
			}
			
			ArrayList<byte[]> commands = new ArrayList<byte[]>();
			RasterDocument rasterDoc = new RasterDocument(RasSpeed.Medium,RasPageEndMode.None, RasPageEndMode.None, RasTopMargin.Standard, 0, 0, 0);
			
			//Bitmap bm = BitmapFactory.decodeResource(res, source);
			
			Bitmap bm =BitmapFactory.decodeFile("/data/data/com.practisis.practipos/files//"+imagename);
			
			StarBitmap starbitmap = new StarBitmap(bm, false, maxWidth);

			if (rasterType == RasterCommand.Standard) {
				commands.add(rasterDoc.BeginDocumentCommandData());
				commands.add(starbitmap.getImageRasterDataForPrinting_Standard(compressionEnable));
				commands.add(rasterDoc.EndDocumentCommandData());
				
			} else {
				commands.add(starbitmap.getImageRasterDataForPrinting_graphic(compressionEnable));
				//commands.add(new byte[] { 0x1b, 0x64, 0x02 }); // Feed to cutter position
			}
			PrinterFunctions.SendCommand(context, portName, portSettings, commands);
		}catch (StarIOPortException e) {
            callbackContext.error(e.getMessage());
        }
	}
	
	/**
     * This method open the cash drawer
     * @param callbackContext the callback context of the action
     * @param portName the string containing the printer name
     * @param portSettings the port settings for the connection to the printer ("mini" if you are printing on star portable printers)
     */
	private void openDrawer(CallbackContext callbackContext,String portName, String portSettings)throws StarIOPortException {
		try{
			Context context = this.cordova.getActivity().getApplicationContext();
			ArrayList<byte[]> commands = new ArrayList<byte[]>();
			commands.add(new byte[] { 0x07 }); // Kick cash draweR
			PrinterFunctions.SendCommand(context, portName, portSettings, commands);
		}catch (StarIOPortException e) {
            callbackContext.error(e.getMessage());
        }
	}
	
	
	private static byte[] createCp1252(String inputText) {
		byte[] byteBuffer = null;
		
		try {
			byteBuffer = inputText.getBytes("Windows-1252");
		} catch (UnsupportedEncodingException e) {
			byteBuffer = inputText.getBytes();
		}
		
		return byteBuffer;
	}
	
	private static byte[] createCpUTF8(String inputText) {
		byte[] byteBuffer = null;
		
		try {
			byteBuffer = inputText.getBytes("UTF-8");
		} catch (UnsupportedEncodingException e) {
			byteBuffer = inputText.getBytes();
		}
		
		return byteBuffer;
	}
	
	public static String DoubleFormat(double parDouble)
	{
		DecimalFormat formatter = new DecimalFormat("##,###0.00"); 
		String myNumero = formatter.format(parDouble);
		return myNumero;
	}
	
	private static byte[] createRasterCommand(String printText, int textSize, int bold, RasterCommand rasterType) {
		byte[] command;

		Paint paint = new Paint();
		paint.setStyle(Paint.Style.FILL);
		paint.setColor(Color.BLACK);
		paint.setAntiAlias(true);

		Typeface typeface;

		try {
			typeface = Typeface.create(Typeface.SERIF, bold);
		} catch (Exception e) {
			typeface = Typeface.create(Typeface.DEFAULT, bold);
		}

		paint.setTypeface(typeface);
		paint.setTextSize(textSize * 2);
		paint.setLinearText(true);

		TextPaint textpaint = new TextPaint(paint);
		textpaint.setLinearText(true);
		android.text.StaticLayout staticLayout = new StaticLayout(printText, textpaint, printableArea, Layout.Alignment.ALIGN_NORMAL, 1, 0, false);
		int height = staticLayout.getHeight();

		Bitmap bitmap = Bitmap.createBitmap(staticLayout.getWidth(), height, Bitmap.Config.RGB_565);
		Canvas c = new Canvas(bitmap);
		c.drawColor(Color.WHITE);
		c.translate(0, 0);
		staticLayout.draw(c);

		StarBitmap starbitmap = new StarBitmap(bitmap, false, printableArea);

		if (rasterType == RasterCommand.Standard) {
			command = starbitmap.getImageRasterDataForPrinting_Standard(true);
		} else {
			command = starbitmap.getImageRasterDataForPrinting_graphic(true);
		}
		return command;
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
}

