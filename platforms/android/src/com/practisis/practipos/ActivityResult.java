package com.practisis.practipos;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.util.Log;

import com.bayteq.mpos.integration.MPosConstants;
import com.bayteq.mpos.integration.MPosException;
import com.bayteq.mpos.integration.entities.PaymentResponse;
import com.bayteq.mpos.integration.entities.TransactionResponse;

import org.apache.cordova.CordovaActivity;

/**
 * Created by RubenEfrain on 29/06/2015.
 */
public class ActivityResult extends CordovaActivity {

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {

        AlertDialog alertDialog;
        alertDialog = new AlertDialog.Builder(this).create();
        alertDialog.setTitle("Error");
        alertDialog.setMessage("Su error es: "+requestCode);
        alertDialog.show();

        if (requestCode == 0) {
            if (resultCode == Activity.RESULT_OK) {
                try {
                    String raw = data.getStringExtra(
                            MPosConstants.EXTRA_RESULT_DATA);
                    PaymentResponse paymentResponse = new PaymentResponse(raw);
                    //process payment response
                } catch (MPosException ex) {
                    Log.e("Tag", "onActivityResult", ex);
                }
            } else {
                // handler error code
                /*AlertDialog alertDialog;
                alertDialog = new AlertDialog.Builder(this).create();*/
                alertDialog.setTitle("Error");
                alertDialog.setMessage("Su error es:");
                alertDialog.show();
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
