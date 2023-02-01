// Generate a new random MQTT client id on each page load
var MQTT_CLIENT_ID = "iot_web_test" + Math.floor((1 + Math.random()) * 0x10000000000).toString(16);
var reconnect = false;
// Create a MQTT client instance
var MQTT_CLIENT = new Paho.MQTT.Client("broker.hivemq.com", 8000, MQTT_CLIENT_ID + randomString(20));

// Tell the client instance to connect to the MQTT broker
MQTT_CLIENT.connect({ onSuccess: myClientConnected });
MQTT_CLIENT.onMessageArrived = myMessageArrived;
MQTT_CLIENT.onConnectionLost = onConnectionLost;
var mqttServer_isconnected = false;
// This is the function which handles subscribing to topics after a connection is made
function myClientConnected() {
    MQTT_CLIENT.subscribe("SYNOPEXVINA/HIEUNV/MQTT/FIREALARM/");
    mqttServer_isconnected = true;
}

function randomString(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:"+responseObject.errorMessage);
     mqttServer_isconnected = false;
    }
  }
// This is the function which handles received messages
function myMessageArrived(message) {
    // Get the payload
    var data = JSON.parse(message.payloadString);
    console.log(data);
    connectAll(data);
    history(data);
    // byte[] data = (sender as MQTTHieunv.Client).ReceivedMessage;
    if (data.dataZone.length == 32) {
        try {
            //byte[] dataTime = new byte[5] {data[0],0x3A, data[2], 0x3A, data[4]};
            var datenow = data[0] + ":" + data[2] + ":" + data[4];
            if (reconnect) {

                reconnect = false;
            } else
                sigmqtt = 0;

            // ShowSTATUS(data);
          

        } catch {

        }
    }

};



var connectAll=(data)=>{
    var rawWater = document.getElementById("rawWater");
    var diRoNew = document.getElementById("diRoNew");
    var pumpPlc = document.getElementById("pumpPlc");
    var timedata = document.getElementById("timedata");
    if(data.PLCConnect.MQTT_isconnected == false){
        rawWater.classList.add("green");
    }
    else{
        rawWater.classList.remove("green");
    }
    if(data.PLCConnect.Spinkler_isconnected == true){
        diRoNew.classList.add("green");
    }
    else{
        diRoNew.classList.remove("green");
    }
    if(data.PLCConnect.PLC_isconnected == true){
        pumpPlc.classList.add("green");
    }
       else{
        pumpPlc.classList.remove("green");
    }
    timedata.value = data.Timespan;
}
function history(data){
    var dataTable = data.Historians.historians;

    var table = document.getElementById("table");
    var table1 = document.getElementById("tableHeder");
    table1.innerHTML = '<tr>'+
    '<td style="width:0px;height:0px;"></td>'+
    '<td style="height:0px;width:76px;"></td>'+
    '<td style="height:0px;width:78px;"></td>'+
    '<td style="height:0px;width:775px;"></td>'+
'</tr>'+
'<tr style="vertical-align:top;">'+
    '<td style="width:0px;height:17px;"></td>'+
  ' <td class="cs5C43E5F9"style="width:72px;height:15px;line-height:13px;text-align:center;vertical-align:middle;"><nobr>DATE</nobr></td>'+
    '<td class="cs5C43E5F9" style="width:74px;height:15px;line-height:13px;text-align:center;vertical-align:middle;">'+
       ' <nobr>TIME</nobr>'+
    '</td>'+
    '<td class="cs5C43E5F9"style="width:771px;height:15px;line-height:13px;text-align:center;vertical-align:middle;">'+
       '<nobr>ALARM</nobr>'+
    '</td>'+
    '</tr>';
    table.innerHTML='';
;
    for (let index = 0; index < dataTable.length; index++) {
        table.innerHTML+='<tr style="vertical-align:top;">'+
        '<td style="width:0px;height:23px;"></td>'+
        '<td class="cs42A12827"style="width:72px;height:21px;line-height:13px;text-align:center;vertical-align:middle;"><nobr>'+dataTable[index].DATE+'</nobr>'+
        '</td>'+
        '<td class="cs42A12827" style="width:74px;height:21px;line-height:13px;text-align:center;vertical-align:middle;"><nobr>'+dataTable[index].TIME+'</nobr>'+
       ' </td>'+
        '<td class="cs42A12827"style="width:771px;height:21px;line-height:13px;text-align:center;vertical-align:middle;"><nobr>'+dataTable[index].ALARM+'</nobr></td>'+
    '</tr>';
        
    }
}

setInterval(timer, 1000);
sigmqtt = 0;

function timer() {

    var dt = new Date();
    var month = dt.getMonth() + 1;
    var year = dt.getFullYear();
    var day = dt.getDate();
    var h = dt.getHours();
    var m = dt.getMinutes();
    var s = dt.getSeconds();
    if (h < 10)
    h = "0" + h;
    if (m < 10)
    m = "0" + m;
    if (s < 10)
    s = "0" + s;
    document.getElementById("myTime").innerHTML =h + ":" + m + ":" + s +"      "+day+"/"+month+"/"+year;
    var connect = document.getElementById("connect");
    sigmqtt++;

    if(!mqttServer_isconnected){
        connect.classList.remove("green");
    }
       else{
        connect.classList.add("green");
    }
    // _sig.VALUE.setValue = sigmqtt > 7 ? false : true;
    //  buttonSignal.BackColor = (/*DateTime.ParseExact(DateTime.Now.ToString("H:mm:ss"), "H:mm:ss", CultureInfo.InvariantCulture).Second-DateTime.ParseExact(datenow, "H:mm:ss", CultureInfo.InvariantCulture).Second*/sigmqtt > 10) ? Color.Red : Color.Gold;
    // ERRShow((sigmqtt > 20) ? "ERR- CHECK INTERNET PLZ         " : "SYSTEM PROSSING    ");

    //  if (sigmqtt > 20)
    //      datalog = new string[18] { "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" };


    try {
        if (sigmqtt > 15) {
            reconnect = true;
            m = MQTT_CLIENT.isConnected;
            MQTT_CLIENT.connect({ onSuccess: myClientConnected });
            sigmqtt = 10;
            console.log("reconnect");
        
        }
    } catch (err) {
        loi = err.message;
    }


}

console.log("%cHello Guy !! WelCome To Synopex ","font-weight: bold; font-size: 30px;color:green");
console.log("%c->PLC,HMI,MCU,DCS,SCADA IOT, HTML ,CSS ,JS !! ","font-weight: bold; font-size: 15px;color:#068e8e");