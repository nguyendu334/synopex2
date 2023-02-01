var MQTT_CLIENT_ID =
  "iot_web_oke11_" +
  Math.floor((1 + Math.random()) * 0x10000000000).toString(16);
var reconnect = false;
// Create a MQTT client instance
var MQTT_CLIENT = new Paho.MQTT.Client(
  "broker.hivemq.com",
  8000,
  MQTT_CLIENT_ID
);

// Tell the client instance to connect to the MQTT broker
MQTT_CLIENT.connect({ onSuccess: myClientConnected });
// Tell MQTT_CLIENT to call myMessageArrived(message) each time a new message arrives

MQTT_CLIENT.onMessageArrived = myMessageArrived;
// set callback handlers
MQTT_CLIENT.onConnectionLost = onConnectionLost;

var mqtt_isconnected = false;

// This is the function which handles subscribing to topics after a connection is made
function myClientConnected() {
  MQTT_CLIENT.subscribe("Itserverroom");

  mqtt_isconnected = true;
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
    mqtt_isconnected = false;
  }
}
function myMessageArrived(message) {
  var topic = message.destinationName;
  var data = JSON.parse(message.payloadString);
  console.log(data);
  endTime();
  timeTank(data);
}

// tính số ngày trong 2 năm và find ra thanh %
var endTime = () => {
  var dt = new Date();
  var month = dt.getMonth() + 1;
  var year = dt.getFullYear();
  var day = dt.getDate();
  if (month < 10) month = "0" + month;
  var ngayHienTai = "" + year + "-" + month + "-" + day + "";
  const getDaysDiffBetweenDates = (dateInitial, dateFinal) =>
    (dateFinal - dateInitial) / (1000 * 3600 * 24);

  var total = getDaysDiffBetweenDates(
    new Date("2021-01-01"),
    new Date("2023-01-22")
  );

  var totalhientai = getDaysDiffBetweenDates(
    new Date("2021-01-01"),
    new Date(ngayHienTai)
  );

  var phantramhethan = ((totalhientai / total) * 100).toFixed(1);
  console.log(phantramhethan);
};
var changeValve = (data) => {
  var connectServer = document.getElementById("plcConnect");
};
var connectAll = (data) => {
  var i = data.id;
  // var connectServer = document.getElementById("plcConnect");

  // if (data.Rawsystem_PLC_isconnect == true) {
  //   connectServer.classList.add("on");
  // } else {
  //   connectServer.classList.remove("on");
  // }

  if (data.Server_isconnect == true) {
    document.getElementById("acu" + i + "-connect").classList.add("on");
  } else {
    document.getElementById("acu" + i + "-connect").classList.remove("on");
  }
};
function timeTank(dataMQTT) {
  var dt = new Date();
  var month = dt.getMonth() + 1;
  var year = dt.getFullYear();
  var daysInMonth = new Date(year, month, 0).getDate();
  var xValues = [];
  for (let index = 1; index <= daysInMonth; index++) {
    xValues.push(index);
  }

  const data = {
    labels: xValues,
    datasets: [
      {
        label: "Runtime #A1",
        data: [
          18, 12, 6, 9, 12, 3, 9, 18, 12, 6, 9, 12, 3, 9, 18, 12, 6, 9, 12, 3,
          9, 18, 12, 6, 9, 12, 3, 9, 8, 8, 8,
        ],
        backgroundColor: "#408cf0",
        borderColor: "#408cf0",
        borderWidth: 1,
      },
      {
        label: "Runtime #B1",
        data: [
          18, 12, 6, 9, 12, 3, 9, 18, 12, 6, 9, 12, 3, 9, 18, 12, 6, 9, 12, 3,
          9, 18, 12, 6, 9, 12, 3, 9, 8, 8, 8,
        ],
        backgroundColor: "#fbb441",
        borderColor: "#fbb441",
        borderWidth: 1,
      },
      {
        label: "Runtime #A2",
        data: [
          18, 12, 6, 9, 12, 3, 9, 18, 12, 6, 9, 12, 3, 9, 18, 12, 6, 9, 12, 3,
          9, 18, 12, 6, 9, 12, 3, 9, 8, 8, 8,
        ],
        backgroundColor: "#e03f0a",
        borderColor: "#e03f0a",
        borderWidth: 1,
      },
      {
        label: "Runtime #B2",
        data: [
          18, 12, 6, 9, 12, 3, 9, 18, 12, 6, 9, 12, 3, 9, 18, 12, 6, 9, 12, 3,
          9, 18, 12, 6, 9, 12, 3, 9, 8, 8, 8,
        ],
        backgroundColor: "#046392",
        borderColor: "#046392",
        borderWidth: 1,
      },
    ],
  };
  // config
  const config = {
    type: "bar",
    data,
    options: {
      scales: {
        X: {
          stacked: true,
          ticks: {
            font: {
              size: 7,
            },
          },
        },
        y: {
          beginAtZero: true,
          stacked: true,
          max: 100,
        },
      },
      plugins: {
        legend: {
          labels: {
            // This more specific font property overrides the global property
            font: {
              size: 10,
            },
          },
        },
      },
    },
  };

  // render init block
  const myChart = new Chart(document.getElementById("myChart"), config);
}

var pumpOnOff = (data) => {
  var rawpumpA1 = document.getElementById("rawpumpA1");
  var rawpumpC1 = document.getElementById("rawpumpC1");
  var rawpumpB1 = document.getElementById("rawpumpB1");
  var rawpumpA2 = document.getElementById("rawpumpA2");
  var rawpumpB2 = document.getElementById("rawpumpB2");
  var rawpumpC2 = document.getElementById("rawpumpC2");

  var ropressurepumpA1 = document.getElementById("ropressurepumpA1");
  var ropressurepumpC1 = document.getElementById("ropressurepumpC1");
  var ropressurepumpB1 = document.getElementById("ropressurepumpB1");
  var ropressurepumpA2 = document.getElementById("ropressurepumpA2");
  var ropressurepumpC2 = document.getElementById("ropressurepumpC2");
  var ropressurepumpB2 = document.getElementById("ropressurepumpB2");

  var ediwaterpumpTop1 = document.getElementById("ediwaterpumpTop1");
  var ediwaterpumpTop2 = document.getElementById("ediwaterpumpTop2");
  var ediwaterpumpTop3 = document.getElementById("ediwaterpumpTop3");
  var ediwaterpumpBottom1 = document.getElementById("ediwaterpumpBottom1");
  var ediwaterpumpBottom2 = document.getElementById("ediwaterpumpBottom2");
  var ediwaterpumpBottom3 = document.getElementById("ediwaterpumpBottom3");

  var ro2ProductA = document.getElementById("ro2ProductA");
  var ro2ProductB = document.getElementById("ro2ProductB");
};

var ledOnOf = () => {
  var LedrawpumpA1 = document.getElementById("LedrawpumpA1");
  var LedrawpumpC1 = document.getElementById("LedrawpumpC1");
  var LedrawpumpB1 = document.getElementById("LedrawpumpB1");
  var LedrawpumpA2 = document.getElementById("LedrawpumpA2");
  var LedrawpumpB2 = document.getElementById("LedrawpumpB2");
  var LedrawpumpC2 = document.getElementById("LedrawpumpC2");

  var LedropressurepumpA1 = document.getElementById("LedropressurepumpA1");
  var LedropressurepumpC1 = document.getElementById("LedropressurepumpC1");
  var LedropressurepumpB1 = document.getElementById("LedropressurepumpB1");
  var LedropressurepumpA2 = document.getElementById("LedropressurepumpA2");
  var LedropressurepumpC2 = document.getElementById("LedropressurepumpC2");
  var LedropressurepumpB2 = document.getElementById("LedropressurepumpB2");

  var LedediwaterpumpTop1 = document.getElementById("LedediwaterpumpTop1");
  var LedediwaterpumpTop2 = document.getElementById("LedediwaterpumpTop2");
  var LedediwaterpumpTop3 = document.getElementById("LedediwaterpumpTop3");
  var LedediwaterpumpBottom1 = document.getElementById(
    "LedediwaterpumpBottom1"
  );
  var LedediwaterpumpBottom2 = document.getElementById(
    "LedediwaterpumpBottom2"
  );
  var LedediwaterpumpBottom3 = document.getElementById(
    "LedediwaterpumpBottom3"
  );

  var Ledro2ProductA = document.getElementById("Ledro2ProductA");
  var Ledro2ProductB = document.getElementById("Ledro2ProductB");

  for (let i = 1; index < 9; i++) {
    if (i > 9) {
      document.getElementById("LedTankxanh" + i).classList.add("on");
    } else {
      document.getElementById("LedTankxanh" + i).classList.remove("on");
    }
  }

  var LedEdisystem1ATop = document.getElementById("LedEdisystem1ATop");
  var LedEdisystem1BTop = document.getElementById("LedEdisystem1BTop");
  var LedEdisystem2ATop = document.getElementById("LedEdisystem2ATop");
  var LedEdisystem2BTop = document.getElementById("LedEdisystem2BTop");

  var LedEdisystem1ABottom = document.getElementById("LedEdisystem1ABottom");
  var LedEdisystem1BBottom = document.getElementById("LedEdisystem1BBottom");
  var LedEdisystem2ABottom = document.getElementById("LedEdisystem2ABottom");
  var LedEdisystem2BBottom = document.getElementById("LedEdisystem2BBottom");

  var Ledsv1 = document.getElementById("Ledsv1");
  var Ledsv2 = document.getElementById("Ledsv2");

  for (let i = 3; index < 9; i++) {
    if (i > 9) {
      document.getElementById("Ledsv" + i + "Bottom").classList.add("on");
    } else {
      document.getElementById("Ledsv" + i + "Bottom").classList.remove("on");
    }
  }

  for (let i = 3; index < 9; i++) {
    if (i > 9) {
      document.getElementById("Ledsv" + i + "Top").classList.add("on");
    } else {
      document.getElementById("Ledsv" + i + "Top").classList.remove("on");
    }
  }

  var Ledlp1 = document.getElementById("Ledlp1");
  var Ledlp2 = document.getElementById("Ledlp2");
  var Ledps1l = document.getElementById("Ledps1l");
  var Ledps2l = document.getElementById("Ledps2l");
  var Ledps1h = document.getElementById("Ledps1h");
  var Ledps2h = document.getElementById("Ledps2h");
  var Ledfs1top = document.getElementById("Ledfs1top");
  var Ledfs2top = document.getElementById("Ledfs2top");
  var Ledfs1bottom = document.getElementById("Ledfs1bottom");
  var Ledfs2bottom = document.getElementById("Ledfs2bottom");
  var Leduv1top = document.getElementById("Leduv1top");
  var Leduv2top = document.getElementById("Leduv2top");
  var Leduv1bottom = document.getElementById("Leduv1bottom");
  var Leduv2bottom = document.getElementById("Leduv2bottom");
};
// cập nhật valve
var changeImgVavle = (data) => {
  for (let i = 3; index < 9; i++) {
    if (i > 9) {
      document.getElementById("sv" + i + "top").src = "images/comprun.png";
    } else {
      document.getElementById("sv" + i + "top").src = "images/comprun.png";
    }
  }
  for (let i = 3; index < 9; i++) {
    if (i > 9) {
      document.getElementById("sv" + i + "bottom").src = "images/comprun.png";
    } else {
      document.getElementById("sv" + i + "bottom").src = "images/comprun.png";
    }
  }
  var sv1 = document.getElementById("sv1");
  var sv2 = document.getElementById("sv2");
};
// cập nhật dữ liệu
var dataPump = (data) => {
  var dataRawpumpA2 = document.getElementById("dataRawpumpA2");
  var dataRawpumpC2 = document.getElementById("dataRawpumpC2");
  var dataRawpumpB2 = document.getElementById("dataRawpumpB2");

  var dataRoPresspumpA2 = document.getElementById("dataRoPresspumpA2");
  var dataRoPresspumpC2 = document.getElementById("dataRoPresspumpC2");
  var dataRoPresspumpB2 = document.getElementById("dataRoPresspumpB2");

  for (let i = 1; index < 9; i++) {
    document.getElementById("dataConductivity" + i).innerHTML =
      "images/comprun.png";
  }
  for (let i = 1; index < 9; i++) {
    document.getElementById("dataResistivity" + i).innerHTML =
      "images/comprun.png";
  }
};

var dataTank = (data) => {
  // tank bé
  var tank1 = document.getElementById("TANK1");
  tank1.duytran.setValue = 5000;
  var DataRAWWATERTANK = document.getElementById("DataRAWWATERTANK");

  // Tank to
  var bentrongtankto = document.getElementById("bentrongtankto");
  bentrongtankto.style.height = data.Level.HNO3_I.toFixed(1) + "%";

  var phantramtankTo = document.getElementById("phantramtankTo");
  var m3tankTo = document.getElementById("m3tankTo");

  var LedAL1 = document.getElementById("LedAL1");
  var LedAL2 = document.getElementById("LedAL2");
  var LedAL3 = document.getElementById("LedAL3");
  var LedAL4 = document.getElementById("LedAL4");

  var valueAL1 = document.getElementById("valueAL1");
  var valueAL2 = document.getElementById("valueAL2");
  var valueAL3 = document.getElementById("valueAL3");
  var valueAL4 = document.getElementById("valueAL4");
};
// cập nhật Arrow

var changeArrow = (data) => {
  var arrow_left1 = document.getElementById("arrow_left1");
  var arrow_right1 = document.getElementById("arrow_right1");
  var arrow_right2 = document.getElementById("arrow_right2");

  var cum1_arrow1_0 = document.getElementById("cum1_arrow1_0");
  var cum1_arrow1_1 = document.getElementById("cum1_arrow1_1");
  var cum1_arrow1_2 = document.getElementById("cum1_arrow1_2");
  var cum1_arrow1_3 = document.getElementById("cum1_arrow1_3");
  var cum1_arrow1_4 = document.getElementById("cum1_arrow1_4");
  var cum1_arrow1_5 = document.getElementById("cum1_arrow1_5");
  var cum1_arrow1_6 = document.getElementById("cum1_arrow1_6");
  var cum1_arrow1_7 = document.getElementById("cum1_arrow1_7");
  var cum1_arrow1_8 = document.getElementById("cum1_arrow1_8");
  var cum1_arrow1_9 = document.getElementById("cum1_arrow1_9");

  var cum1_arrow2_0 = document.getElementById("cum1_arrow2_0");
  var cum1_arrow2_1 = document.getElementById("cum1_arrow2_1");
  var cum1_arrow2_2 = document.getElementById("cum1_arrow2_2");
  var cum1_arrow2_3 = document.getElementById("cum1_arrow2_3");
  var cum1_arrow2_4 = document.getElementById("cum1_arrow2_4");

  var cum2_arrow1_0 = document.getElementById("cum2_arrow1_0");
  var cum2_arrow1_1 = document.getElementById("cum2_arrow1_1");
  var cum2_arrow1_2 = document.getElementById("cum2_arrow1_2");
  var cum2_arrow1_3 = document.getElementById("cum2_arrow1_3");
  var cum2_arrow1_4 = document.getElementById("cum2_arrow1_4");
  var cum2_arrow1_5 = document.getElementById("cum2_arrow1_5");
  var cum2_arrow1_6 = document.getElementById("cum2_arrow1_6");
  var cum2_arrow1_7 = document.getElementById("cum2_arrow1_7");
  var cum2_arrow1_8 = document.getElementById("cum2_arrow1_8");

  var cum2_arrow2_0 = document.getElementById("cum2_arrow2_0");
  var cum2_arrow2_1 = document.getElementById("cum2_arrow2_1");
  var cum2_arrow2_3 = document.getElementById("cum2_arrow2_3");

  var cum3_arrow1_0 = document.getElementById("cum3_arrow1_0");
  var cum3_arrow1_1 = document.getElementById("cum3_arrow1_1");
  var cum3_arrow1_2 = document.getElementById("cum3_arrow1_2");
  var cum3_arrow1_3 = document.getElementById("cum3_arrow1_3");
  var cum3_arrow1_4 = document.getElementById("cum3_arrow1_4");
  var cum3_arrow1_5 = document.getElementById("cum3_arrow1_5");

  var cum3_arrow2_0 = document.getElementById("cum3_arrow2_0");
  var cum3_arrow2_1 = document.getElementById("cum3_arrow2_1");
  var cum3_arrow2_2 = document.getElementById("cum3_arrow2_2");
  var cum3_arrow2_3 = document.getElementById("cum3_arrow2_3");
};
// Thời gian
setInterval(timer, 1000);
sigmqtt = 0;
var i = 0;

var k = 0;
var seconds = 0;
var milliseconds = 0;
var hours = 0;

function timer() {
  var dt = new Date();
  var month = dt.getMonth() + 1;
  var year = dt.getFullYear();
  var day = dt.getDate();
  var h = dt.getHours();
  var m = dt.getMinutes();
  var s = dt.getSeconds();
  if (h < 10) h = "0" + h;
  if (m < 10) m = "0" + m;
  if (s < 10) s = "0" + s;
  var tankto = document.getElementById("bentrongtankto");
  var phantramtankTo = document.getElementById("phantramtankTo");

  i++;
  if (i == 100) i = 0;
  tankwater("#TANK1", i, "height:" + i + "%");
  tankto.style.height = i + "%";
  phantramtankTo.innerHTML = i + "%";

  // document.getElementById("myTime").innerHTML =
  //   h + ":" + m + ":" + s + "      " + day + "/" + month + "/" + year;
  var connect = document.getElementById("connect");
  sigmqtt++;
  if (!mqtt_isconnected) {
    connect.classList.remove("on");
  } else {
    connect.classList.add("on");
  }
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

  k++;
  seconds = k;
  if (seconds >= 60) {
    k = 0;
    k++;
    seconds = k;
    milliseconds += 1;
    if (milliseconds >= 60) {
      milliseconds = 0;
      hours += 1;
    }
  }

  document.getElementById("myTime").innerHTML =
    hours +
    ":" +
    milliseconds +
    ":" +
    seconds +
    "      " +
    day +
    "/" +
    month +
    "/" +
    year;
}
console.log(
  "%cHello Guy !! WelCome To Synopex ",
  "font-weight: bold; font-size: 30px;color:green"
);
console.log(
  "%c->PLC,HMI,MCU,DCS,SCADA IOT, HTML ,CSS ,JS !! ",
  "font-weight: bold; font-size: 15px;color:#068e8e"
);
