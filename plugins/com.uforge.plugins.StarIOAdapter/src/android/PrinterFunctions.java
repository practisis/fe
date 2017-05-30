package com.uforge.plugins;
import java.util.ArrayList;
import java.util.List;
import android.content.Context;
import com.starmicronics.stario.PortInfo;
import com.starmicronics.stario.StarIOPort;
import com.starmicronics.stario.StarIOPortException;
import com.starmicronics.stario.StarPrinterStatus;

import com.epson.epsonio.Finder;
import com.epson.epsonio.DeviceInfo;
import com.epson.epsonio.FilterOption;
import com.epson.epsonio.DevType;
import com.epson.epsonio.EpsonIoException;
import com.epson.epsonio.IoStatus;
import com.epson.eposprint.Print;



public class PrinterFunctions
{
    /**
     * This function checks the status of the printer
     * @param context - Activity for displaying messages to the user
     * @param portName - Port name to use for communication. This should be (TCP:<IPAddress>)
     * @param portSettings - Should be blank
     * @param sensorActiveHigh - boolean variable to tell the sensor active of CashDrawer which is High
     */
    public static StarPrinterStatus GetStatus(Context context, String portName, String portSettings, boolean sensorActiveHigh) throws StarIOPortException {
        StarIOPort port = null;
        StarPrinterStatus status = null;
        try {
			
			String needle="BT:";
			if(portName.toLowerCase().contains(needle.toLowerCase()))
			   //portSettings  = "portable;escpos;l";
			    portSettings  = "portable;l";
				 //port = StarIOPort.getPort(portName, portSettings, 10000);
				
			port = StarIOPort.getPort(portName, portSettings, 10000, context);
			//port = StarIOPort.getPort(portName, "portable;u;l", 10000, context);
            try {
                Thread.sleep(500);
            }
            catch(InterruptedException e) {}

            status = port.retreiveStatus();
        }
        catch (StarIOPortException e) {
            // Bubbling the exception up
            throw e;
        }
        finally {
            if(port != null) {
                try {
                    StarIOPort.releasePort(port);
                } catch (StarIOPortException e) {}
            }
        }
        return status;
    }

    /**
     * Using the portNameSearch parameter, this method searches for the first printer that corresponds to the
     * search
     * @param portNameSearch the name of the printer to search (example BT: or TCP:xxx.xxx.xxx.xxx)
     * @return
     */
    public static String getFirstPrinter(String portNameSearch, Context context) {
        String portName = "";
        List<PortInfo> portList;
        try {
				String needle="USB:";
				if(portNameSearch.toLowerCase().contains( needle.toLowerCase())){
					portList  = StarIOPort.searchPrinter(portNameSearch,context);
				}else{
					portList  = StarIOPort.searchPrinter(portNameSearch);	
					//portList  = StarIOPort.searchPrinter(portNameSearch,context);	
				}
				
           // portList  = StarIOPort.searchPrinter("USB:SN:12345678");

            for (PortInfo portInfo : portList) {
                portName = portInfo.getPortName();
                //portName = portInfo.getModelName();
                break;
            }
        } catch (StarIOPortException e) {
            e.printStackTrace();
        }
        return portName;
    }
	
    /**
     * Using the portNameSearch parameter, this method searches for all printers that corresponds to the
     * search
     * @param portNameSearch the name of the printer to search (example BT: or TCP:xxx.xxx.xxx.xxx)
     * @return
     */
    public static ArrayList<String> getPrinters(String portNameSearch,Context context) throws StarIOPortException{
        //String portName = "";
		ArrayList<String> arrayPortName = new ArrayList<String>();
		ArrayList<String> arraybt=BuscarBluetooth();
		ArrayList<String> arrayusb=BuscarUSB(context);
        if(arraybt.size()>0){
			arrayPortName.addAll(arraybt);
		}
		if(arrayusb.size()>0){
			arrayPortName.addAll(arrayusb);
		}
        return arrayPortName;
    }
	
	
	
	private static ArrayList<String> BuscarBluetooth(){
		List<PortInfo> portListBT;
		ArrayList<String> arrayPortName=new ArrayList<String>();
		try{
		portListBT  = StarIOPort.searchPrinter("BT:");
		if(portListBT.size()>0){
				for (PortInfo theportInfoBT : portListBT) {
						String theportNameBT = theportInfoBT.getPortName();
						String theidNameBT=theportInfoBT.getPortName();

					if (theportInfoBT.getMacAddress().equals("") == false) {
						theportNameBT += "\n - " + theportInfoBT.getMacAddress();
						if (theportInfoBT.getModelName().equals("") == false) {
							theportNameBT += "\n - " + theportInfoBT.getModelName();
						}
					}

					/*arrayPortName.add(portNameBT);
					String theportNameBT = theportInfoBT.getPortName();*/
					arrayPortName.add(theidNameBT+"@"+theportNameBT);
			
				   //break;
				}
			}
		}catch (StarIOPortException e) {
            e.printStackTrace();
        }
        return arrayPortName;
	}
	
	private static ArrayList<String> BuscarUSB(Context context){
		List<PortInfo> portList;
		ArrayList<String> arrayPortName=new ArrayList<String>();
		try{
			portList  = StarIOPort.searchPrinter("USB:",context);
			for (PortInfo theportInfo : portList) {
				String theportName = theportInfo.getPortName();
				String theidName=theportInfo.getPortName();

				if (theportInfo.getMacAddress().equals("") == false) {
							theportName += "\n - " + theportInfo.getMacAddress();
							if (theportInfo.getModelName().equals("") == false) {
								theportName += "\n - " + theportInfo.getModelName();
							}
				} else {
							if (!theportInfo.getModelName().equals("")) {
								theportName += "\n - " + theportInfo.getModelName();
							}
							if (!theportInfo.getUSBSerialNumber().equals(" SN:")) {
								theportName += "\n - " + theportInfo.getUSBSerialNumber();
							}
				}

						/*arrayPortName.add(portName);
							String theportName = theportInfo.getPortName();*/
						
						arrayPortName.add(theidName+"@"+theportName);
				
					   //break;
			}
			
		}catch (StarIOPortException e) {
            e.printStackTrace();
        }
        return arrayPortName;
	}

    /*private static byte[] convertFromListByteArrayTobyteArray(List<Byte> ByteArray) {
        byte[] byteArray = new byte[ByteArray.size()];
        for(int index = 0; index < byteArray.length; index++) {
            byteArray[index] = ByteArray.get(index);
        }

        return byteArray;
    }*/
	
	private static byte[] convertFromListByteArrayTobyteArray(List<byte[]> ByteArray) {
		int dataLength = 0;
		for (int i = 0; i < ByteArray.size(); i++) {
			dataLength += ByteArray.get(i).length;
		}

		int distPosition = 0;
		byte[] byteArray = new byte[dataLength];
		for (int i = 0; i < ByteArray.size(); i++) {
			System.arraycopy(ByteArray.get(i), 0, byteArray, distPosition, ByteArray.get(i).length);
			distPosition += ByteArray.get(i).length;
		}

		return byteArray;
	}

    public static void CopyArray(byte[] srcArray, Byte[] cpyArray) {
        for (int index = 0; index < cpyArray.length; index++) {
            cpyArray[index] = srcArray[index];
        }
    }

    public static void SendCommand(Context context, String portName, String portSettings, ArrayList<byte[]> byteList) throws StarIOPortException {
        StarIOPort port = null;
        try {
            /*
                using StarIOPort3.1.jar (support USB Port)
                Android OS Version: upper 2.2
            */
            port = StarIOPort.getPort(portName,portSettings,30000, context);
            /*
                using StarIOPort.jar
                Android OS Version: under 2.1
                port = StarIOPort.getPort(portName, portSettings, 10000);
            */
            try {
                Thread.sleep(100);
            }
            catch (InterruptedException e) { }

            /*
               Using Begin / End Checked Block method
               When sending large amounts of raster data,
               adjust the value in the timeout in the "StarIOPort.getPort"
               in order to prevent "timeout" of the "endCheckedBlock method" while a printing.

               *If receipt print is success but timeout error occurs(Show message which is "There was no response of the printer within the timeout period."),
                 need to change value of timeout more longer in "StarIOPort.getPort" method. (e.g.) 10000 -> 30000
             */
            //StarPrinterStatus status = port.retreiveStatus();
            StarPrinterStatus status = port.beginCheckedBlock();

            if (true==status.offline) {
                throw new StarIOPortException("A printer is offline");
            }

            byte[] commandToSendToPrinter = convertFromListByteArrayTobyteArray(byteList);
            port.writePort(commandToSendToPrinter, 0, commandToSendToPrinter.length);

			//port.setEndCheckedBlockTimeoutMillis(30000);
			status = port.endCheckedBlock();

            if (status.coverOpen) {
                throw new StarIOPortException("Printer cover is open");
            }
            else if (status.receiptPaperEmpty) {
                throw new StarIOPortException("Receipt paper is empty");
            }
            else if (status.offline) {
                throw new StarIOPortException("Printer is offline");
            }
        }
        catch (StarIOPortException e) {
            // Bubbling the exception up
            throw e;
        }
        finally {
            if (port != null) {
                try {
                    StarIOPort.releasePort(port);
                }
                catch (StarIOPortException e) { 
					throw e;
				}
            }
        }
    }
}
