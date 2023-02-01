setInterval(() =>{
    read();
    timer();
},1000)
var connect = document.getElementById("connect");
function read() {
  getJSON("../firealarm.json", function (err, data) {
    if (err != null) {
      console.error(err);
      connect.classList.remove("green");
    } else {
      connect.classList.add("green");
      // console.log(data);
      ShowSTATUS(data);
      setValueButom(data);
      setboder(data);
      connectAll(data);
      autoBaodong(data);
      setDoor(data);
      history(data);
    }
  });
}
function setDoor(data){
  var arrayDoor = Object.values(data.datadoor);
  console.log(arrayDoor);
for(var i = 0 ;i<arrayDoor.length;i++){
  if(arrayDoor[i] == 1){
    document.getElementById("Canhcuatudong" + (i + 1)).style.display = "block";
    document.getElementById("Muiten" + (i + 1)).style.display = "block";
  }else{
    document.getElementById("Canhcuatudong" + (i + 1)).style.display = "none";
    document.getElementById("Muiten" + (i + 1)).style.display = "none";
  }
}
}
function setboder(data){
  var databoder = data.dataZone.datazone;
  // tang1
  for (var i = 0; i < 24; i++) {
    if (databoder[i] == 1) {
      document.getElementById("boderzone" + (i + 1)).style.display = "block";
    } else {
      document.getElementById("boderzone" + (i + 1)).style.display = "none";
    }
  }
  // tang2
  // document.getElementById("anhBoderzone2-1").style.display = "none";
  // console.log(databoder);
  for (var j = 30; j < 35; j++) {
    if (databoder[j] == 1) {
      document.getElementById("anhBoderzone2-" + (j-29)).style.display = "block";
    } else {
      document.getElementById("anhBoderzone2-" + (j-29)).style.display = "none";
    }
  }

}
var getJSON = function (url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "json";

  xhr.onreadystatechange = function () {
    var status = xhr.status;
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        connect.classList.add("on");
        callback(null, xhr.response);
      } else {
        connect.classList.remove("on");
        callback(status);
      }
    }
  };
  xhr.send();
};

function ShowSTATUS(data) {
  var datashow = data.dataZone.datazone;
  // console.log(data.dataZone.datazone[0]);
  var datashowW = data.dataW;
  try {
    var Vachtuong = document.getElementById("vachtuong");
    var Spinkler = document.getElementById("spinkler");
    Vachtuong.VALUE.setValue = (datashowW.Spinkler/100).toFixed(2);
    Spinkler.VALUE.setValue = (datashowW.PipeWall/100).toFixed(2);

    //Set Value LED t1
    for (var i = 0; i < 24; i++) {
      if (datashow[i] == 1) {
        document.getElementById("zone" + (i + 1) + "-fire").style.display =
          "block";
        document.getElementById("zone" + (i + 1)).style.display = "none";
      } else {
        document.getElementById("zone" + (i + 1) + "-fire").style.display =
          "none";
        document.getElementById("zone" + (i + 1)).style.display = "block";
      }
    }

    //Set Value LED t2
    for (var i = 30; i < 35; i++) {
      if (datashow[i] == true) {
        document.getElementById("zone2-" + i + "-fire").style.display = "block";
        document.getElementById("zone2-" + i).style.display = "none";
      } else {
        document.getElementById("zone2-" + i + "-fire").style.display = "none";
        document.getElementById("zone2-" + i).style.display = "block";
      }
    }

    sigmqtt = 0;
  } catch {}
}

var   setValueButom = (data) => {
  var dataButom = data.dataZone.datazone;
  for (var i = 0; i < 30; i++) {
    if(dataButom[i] == 1){
      dataButom[i] = true;
    }
    // console.log(dataButom);
    document.getElementById("bton" + (i + 1)).VALUE.setValue = dataButom[i];
  }
  
  for (var i = 30; i < 50; i++) {
    if(dataButom[i] == 1){
      dataButom[i] = true;
    }
    document.getElementById("btonTop" + (i + 1)).VALUE.setValue = dataButom[i];
  }
};

var connectAll = (data) => {

  var SPINKLER = document.getElementById("SPINKLER");
  var pumpPlc = document.getElementById("pumpPlc");
  var timedata = document.getElementById("timedata");
  var doorplc = document.getElementById("doorplc");

  if (data.PLCConnect.Spinkler_isconnected == true) {
    SPINKLER.classList.add("green");
  } else {
    SPINKLER.classList.remove("green");
  }
  if (data.PLCConnect.PLC_isconnected == true) {
    pumpPlc.classList.add("green");
  } else {
    pumpPlc.classList.remove("green");
  }
  if (data.PLCConnect.PLC_AutoDoor == true) {
    doorplc.classList.add("green");
  } else {
    doorplc.classList.remove("green");
  }
  timedata.value = data.Timespan;
};

function history(data) {
  var dataTable = data.Historians.historians;

  var table = document.getElementById("table");

  table.innerHTML = "";
  for (let index = 0; index < (dataTable.length >= 1 ? 1 : 0); index++) {
    table.innerHTML +=
      '<tr style="vertical-align:top;">' +
      '<td style="width:0px;height:23px;"></td>' +
      '<td class="cs42A12827"style="width:72px;height:21px;line-height:13px;text-align:center;vertical-align:middle;"><nobr>' +
      dataTable[0].DATE +
      "</nobr>" +
      "</td>" +
      '<td class="cs42A12827" style="width:74px;height:21px;line-height:13px;text-align:center;vertical-align:middle;"><nobr>' +
      dataTable[0].TIME +
      "</nobr>" +
      " </td>" +
      '<td class="cs42A12827"style="width:771px;height:21px;line-height:13px;text-align:center;vertical-align:middle;"><nobr>' +
      dataTable[0].ALARM +
      "</nobr></td>" +
      "</tr>";
  }
}
// setInterval(timer, 1000);
sigmqtt = 0;

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
  document.getElementById("myTime").innerHTML =
    h + ":" + m + ":" + s + "      " + day + "/" + month + "/" + year;
  var connect = document.getElementById("connect");
  sigmqtt++;
}

var alarmold = 0;
function baodong(alarm) {
  if (alarmold != alarm) {
    var x = document.getElementById("myAudio");
    var loa = document.getElementById("loa");
    if (alarm == 1) {
      x.muted = false;
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        var _iframe = document.getElementsByTagName("iframe");
        for (var i = 0; i < _iframe.length; i++) {
          if (window.addEventListener) {
            var once = false;
            document
              .getElementById(_iframe[i].id)
              .contentWindow.document.addEventListener(
                "touchstart",
                function () {
                  if (!once) {
                    once = true;
                    x.play();
                  }
                }
              );
          }
        }
        if (window.addEventListener) {
          var once = false;
          document
            .getElementById("container")
            .addEventListener("touchstart", function () {
              if (!once) {
                once = true;
                x.play();
              }
            });
        }
      } else {
        let playAttempt = setInterval(() => {
          x.play()
            .then(() => {
              clearInterval(playAttempt);
            })
            .catch((error) => {});
        }, 1);
      }
      loa.src = "images/ALARM.png";
    } else if (alarm == 0) {
      x.pause();
      loa.src = "images/onvolumn.png";
    } else {
      x.muted = true;
      loa.src = "images/volume.png";
    }
    alarmold = alarm;
  }
}
function ALARM(_ALARM) {
  var buf = 0;
  for (var i = 0; i < 50; i++) {
    if (_ALARM.dataZone.datazone[i]) {
      buf++;
    }
  }
  if (buf > 0) return true;
  else return false;
}
$("#loa").on("click", function () {
  if ((controlsEnabled = !controlsEnabled)) baodong(2);
});

function autoBaodong(data) {
  var buf = 0;

  if (ALARM(data)) {
    buf++;
  }
  if (!controlsEnabled)
    if (buf != 0) {
      baodong(1);
    } else {
      baodong(0);
    }
  else baodong(2);
}
var controlsEnabled = false;

console.log(
  "%cHello Guy !! WelCome To Synopex ",
  "font-weight: bold; font-size: 30px;color:green"
);
console.log(
  "%c->PLC,HMI,MCU,DCS,SCADA IOT, HTML ,CSS ,JS !! ",
  "font-weight: bold; font-size: 15px;color:#068e8e"
);
