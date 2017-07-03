/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.practisis.fe;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.app.AlertDialog;

import com.bayteq.mpos.integration.MPosApiClient;
import com.bayteq.mpos.integration.MPosConstants;
import com.bayteq.mpos.integration.MPosException;
import com.bayteq.mpos.integration.entities.Deferred;
import com.bayteq.mpos.integration.entities.PaymentRequest;
import com.bayteq.mpos.integration.entities.PaymentResponse;
import com.bayteq.mpos.integration.entities.TransactionResponse;
import com.bayteq.mpos.integration.enums.MPosOperator;
import com.bayteq.mpos.integration.enums.PaymentType;
import com.bayteq.mpos.integration.enums.TransactionStatus;

import org.apache.cordova.*;

/*import java.util.ArrayList;
import java.util.HashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;*/

import java.io.IOException;
import java.io.PrintWriter;
import java.math.BigDecimal;

/*import android.os.Bundle;
import android.os.Handler;
import android.content.Context;*/

/*import com.epson.epsonio.Finder;
import com.epson.epsonio.DeviceInfo;
import com.epson.epsonio.FilterOption;
import com.epson.epsonio.DevType;
import com.epson.epsonio.EpsonIoException;
import com.epson.epsonio.IoStatus;
import com.epson.eposprint.Print;*/

//import android.view.WindowManager;


public class MainActivity extends CordovaActivity
{
	
	/*final static int DISCOVERY_INTERVAL = 500;
    ArrayList<HashMap<String, String>> printerList = null;
    ScheduledExecutorService scheduler;
    ScheduledFuture<?> future;
    final Handler mhandler = new Handler();
	static int INTENTOS=0;*/
	
	private static MPosApiClient mPosApiClients;
	private static String jsonfactura;
	private static String dataresponse;
	private static CallbackContext actualcontext;
	
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
		loadUrl(launchUrl);
		
		mPosApiClients = new MPosApiClient(this);
        mPosApiClients.setAPIKey("GoJV7IEuP27g_qTh3UY1C4d8okPdqs-yLBHF4B2pGrU");
		
		jsonfactura="";
		dataresponse="";
		/// init printer list control
       /* printerList = new ArrayList<HashMap<String, String>>();
		// start find thread scheduler
        scheduler = Executors.newSingleThreadScheduledExecutor();
        // find start
		miHilo();*/
    }
	
	@JavascriptInterface
    public void customFunctionCalled(String conimp,String sinimp,String servicio,String propina,String referenciakey,CallbackContext callcontext) throws MPosException {
        PaymentRequest request = new PaymentRequest();
        request.setAmount(new BigDecimal(conimp));
        request.setAmountNotPayVAT(new BigDecimal(sinimp));
        request.setAmountTip(new BigDecimal(propina));
        request.setAmountService(new BigDecimal(servicio));
        request.setReference(referenciakey);
        //doPaymentRequest(mPosApiClient, request, operator);
		this.actualcontext=callcontext;
	    //this.jsonfactura=mijsonfactura;
        //create and lunch intent
        Intent intent = new Intent(MPosConstants.TRANSACTION_INTENT_PAYMENT,MPosOperator.DATAMOVIL.getUri());
		//this.jsonfactura=mifactura;

        intent.putExtra(MPosConstants.EXTRA_MPOS_CONFIGURATION, mPosApiClients.build());
        intent.putExtra(MPosConstants.EXTRA_REQUEST_PAYMENT, request.build());
        startActivityForResult(intent, 0);
    }
	
	public void onActivityResult(int requestCode, int resultCode, Intent data) {

        AlertDialog alertDialog;
        alertDialog = new AlertDialog.Builder(this).create();

        if (requestCode == 0) {
            if (resultCode == Activity.RESULT_OK) {
                try {
                    String raw = data.getStringExtra(MPosConstants.EXTRA_RESULT_DATA);
                    PaymentResponse paymentResponse = new PaymentResponse(raw);
                    //process payment response

                    //super.onCreate(data);
                    /*super.init();
                    WebView webview = new WebView(this);
                    setContentView(webview);
                    webview.getSettings().setJavaScriptEnabled(true);
                    webview.addJavascriptInterface(this,"MainActivity");*/

                    TransactionStatus estado = paymentResponse.getStatus();
                    String autorizacion = paymentResponse.getAuthorization();
                    Double total = paymentResponse.getTotalAmount().doubleValue();
                    String referencia = paymentResponse.getAuthorization();
                    String referenciakey = paymentResponse.getReference();
                    String referencianumero = "";
                    String lote = paymentResponse.getLot();
                    String tipo = "";
                    String auxcodigo = "";
                    String codigo = "";
                    String descodigo = "";
                    String d = "";
                    //String ip = "192.168.2.128";

                    if (paymentResponse.getReferenceNumber() != null && paymentResponse.getReferenceNumber().length() > 0) {
                        referencianumero = paymentResponse.getReferenceNumber();
                    }

                    if (paymentResponse.getType() == PaymentType.STANDAR) {
                        tipo = "Corriente";
                    } else if (paymentResponse.getType() == PaymentType.DEFERRED) {
                        tipo = "Diferido";
                        Deferred deferred = paymentResponse.getDeferred();
                        if (deferred != null) {
                            String description;
                            if (deferred.getMonthsGrace() > 0) {
                                description = deferred.getName()+"@"+deferred.getMonths()+"@"+deferred.getMonthsGrace();
                            } else {
                                description = deferred.getName()+"@"+deferred.getMonths();
                            }
                        }
                    }

                    if (paymentResponse.getTransactionCode() != null) {
                        auxcodigo = paymentResponse.getTransactionCode().getCode()+"@"+paymentResponse.getTransactionCode().getDescription();
                        codigo = paymentResponse.getTransactionCode().getCode();
                        descodigo = paymentResponse.getTransactionCode().getDescription();
                    }

                    switch (estado) {
                        case APPROVED:
                            d = total+"|"+autorizacion+"|"+referencia+"|"+referencianumero+"|"+lote+"|"+tipo+"|"+codigo+"|"+descodigo+"|"+referenciakey;
                            //webview.loadUrl("http://"+ip+"/conwifibar/aceptado.php?d="+d);
                            //webview.loadUrl("http://"+ip+"/conwifibar/index.php?d="+d);
                            //webview.loadUrl("file:///android_asset/www/index.html");
							//webview.loadUrl("javascript:SaveInvoice(\""+this.jsonfactura+"\")");
							/*webview.setWebViewClient(new WebViewClient() {
								public void onPageFinished(WebView view, String url)
								{
									webview.loadUrl("javascript:SaveInvoice(\""+Activity.getActivity().jsonfactura+"\")");
								}
							});*/
							actualcontext.success(d);
                            break;
                        case DENIED:
                            /*alertDialog.setTitle("Pago Denegado");
                            alertDialog.setMessage("Monto Total: " + total + "\nTipo de pago: " + tipo + "\nCodigo: " + codigo + "\nMensaje: " + descodigo);
                            alertDialog.show();*/
							actualcontext.error("Pago Denegado\nMonto Total: " + total + "\nTipo de pago: " + tipo + "\nCodigo: " + codigo + "\nMensaje: " + descodigo);
                            break;
                        case UNAUTHENTICATED:
                           /*alertDialog.setTitle("No Autenticado");
                            alertDialog.setMessage("Monto Total: " + total +"\nTipo de pago: " + tipo +"\nCodigo: " + codigo +"\nMensaje: " + descodigo);
                            alertDialog.show();*/
							actualcontext.error("No Autenticado\nMonto Total: " + total +"\nTipo de pago: " + tipo +"\nCodigo: " + codigo +"\nMensaje: " + descodigo);
                        default:
                            break;
                    }

                } catch (MPosException ex) {
                    Log.e("Tag", "onActivityResult", ex);
                }
            } else {
                /*alertDialog.setTitle("Mensaje");
                alertDialog.setMessage("Transaccion Cancelada");
                alertDialog.show();*/
				actualcontext.error("Error:\nTransaccion Cancelada");
				/*String d = "5.00|789|1245|1246|000|0125|896|754|145";
				actualcontext.success(d);*/
			}
        } else if (requestCode == 1) {
            if (resultCode == Activity.RESULT_OK) {
                try {
                    String raw = data.getStringExtra(
                            MPosConstants.EXTRA_RESULT_DATA);
                    TransactionResponse transactionResponse = new TransactionResponse(raw);
                    //process annulment response
                } catch (MPosException ex) {
                    Log.e("Tag", "onActivityResult", ex);
                }
            } else {
                // handler error code
            }
        } else {
            super.onActivityResult(requestCode, resultCode, data);

        }
    }
}
