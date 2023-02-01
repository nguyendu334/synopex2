setInterval(timer, 1000);

var text;
var datacheck = [];
var k = 0;
var seconds = 0;
var milliseconds = 0;
var hours = 0;

var dt = new Date();
var month = dt.getMonth() + 1;
var year = dt.getFullYear();
var daysInMonth1 = new Date(year, month, 0).getDate();
var xValues = [];
for (let index = 1; index <= daysInMonth1; index++) {
  xValues.push(index);
}
// khởi tạo mảng chứa các phần tử % line
var dataLine1 = new Array(daysInMonth1);
var dataLine2 = new Array(daysInMonth1);
var dataLine3 = new Array(daysInMonth1);
var dataLine4 = new Array(daysInMonth1);
function timer() {
  getJSON("http://10.100.203.78:3005/data/", function (err, data) {
    var connect = document.getElementById("connect");
    if (err != null) {
      console.error(err);
      connect.classList.remove("on");
    } else {
      connect.classList.add("on");
      console.log(data);

      endTime();
      dataConductivity(data);
      dataTankWater(data);

      changeImgVavle(data);
      onRoSystem(data);
      ledOnOf(data);
      updateTable(data);
      setDataChart(data);
      pumpOnOff(data);

      myChart.update(); //Update chart real-time

      var dt1 = new Date();
      var month = dt1.getMonth() + 1;
      var year = dt1.getFullYear();
      var day = dt1.getDate();
      var h = dt1.getHours();
      var m = dt1.getMinutes();
      var s = dt1.getSeconds();
      if (h < 10) h = "0" + h;
      if (m < 10) m = "0" + m;
      if (s < 10) s = "0" + s;
      document.getElementById("myTime").innerHTML =
        h + ":" + m + ":" + s + "      " + day + "/" + month + "/" + year;
    }
  });
}
function dataTankWater(data) {
  var tankto = document.getElementById("bentrongtankto");
  var phantramtankTo = document.getElementById("phantramtankTo");
  var m3tankTo = document.getElementById("m3tankTo");

  tankwater(
    "#TANK1",
    data[0].dataRawwaterTank.Level.toFixed(2),
    "height:" + data[0].dataRawwaterTank.Level + "%"
  );
  tankto.style.height = data[0].dataROTank.Level / 10 + "%";
  phantramtankTo.innerHTML = data[0].dataROTank.Level / 10 + "%";
  m3tankTo.innerHTML = (120 * data[0].dataROTank.Level) / 10 / 100 + " m3";
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
function onRoSystem(data) {
  if (data[0].DataLine1RoEDI._RO_PRESSURE_PUMP_1 == 1) {
    document.getElementById("rosystemOn1").style.display = "block";
  } else {
    document.getElementById("rosystemOn1").style.display = "none";
  }
  if (data[0].DataLine1RoEDI._RO_PRESSURE_PUMP_3 == 1) {
    document.getElementById("rosystemOn2").style.display = "block";
  } else {
    document.getElementById("rosystemOn2").style.display = "none";
  }

  if (data[0].dataLineRO2.Pump_A_RO_HP == 1) {
    document.getElementById("rosystemOn3").style.display = "block";
  } else {
    document.getElementById("rosystemOn3").style.display = "none";
  }
  if (data[0].dataLineRO2.Pump_B_RO_HP == 1) {
    document.getElementById("rosystemOn4").style.display = "block";
  } else {
    document.getElementById("rosystemOn4").style.display = "none";
  }
}

var dataLine4 = new Array(daysInMonth1);

function updateTable(data) {
  var dt = new Date();
  var month = dt.getMonth() + 1;
  var year = dt.getFullYear();
  var day = dt.getDate();
  var daysInMonth = new Date(year, month, 0).getDate();

  var htmlDataTable = document.getElementById("sheet0");
  htmlDataTable.innerHTML =
    '<tr class="row2">' +
    '<td class="column1 style1 s style1" rowspan="2">Date</td>' +
    '<td class="column2 style2 s style2" colspan="2">LINE #A1</td>' +
    '<td class="column4 style2 s style2" colspan="2">LINE #B1</td>' +
    '<td class="column6 style2 s style2" colspan="2">LINE #A2</td>' +
    '<td class="column8 style2 s style2" colspan="2">LINE #B2</td>' +
    '<td class="column10 style1 s style1" rowspan="2">Total</td>' +
    '<td class="column11 style1 s style1" rowspan="2">%</td>' +
    "</tr>" +
    '<tr class="row3">' +
    '  <td class="column2 style3 s">Runtime</td>' +
    '  <td class="column3 style3 s">m3</td>' +
    '  <td class="column4 style3 s">Runtime</td>' +
    '  <td class="column5 style3 s">m3</td>' +
    '  <td class="column6 style3 s">Runtime</td>' +
    '  <td class="column7 style3 s">m3</td>' +
    '  <td class="column8 style3 s">Runtime</td>' +
    '  <td class="column9 style3 s">m3</td>' +
    "</tr>";
  for (var i = 1; i <= daysInMonth; i++) {
    var TimeLine1 =
      (data[0]["gioLine1_" + i] != undefined ? data[0]["gioLine1_" + i] : 0) +
      ":" +
      (data[0]["phutLine1_" + i] != undefined ? data[0]["phutLine1_" + i] : 0) +
      ":" +
      (data[0]["giayLine1_" + i] != undefined ? data[0]["giayLine1_" + i] : 0);
    var TimeLine2 =
      (data[0]["gioLine2_" + i] != undefined ? data[0]["gioLine2_" + i] : 0) +
      ":" +
      (data[0]["phutLine2_" + i] != undefined ? data[0]["phutLine2_" + i] : 0) +
      ":" +
      (data[0]["giayLine2_" + i] != undefined ? data[0]["giayLine2_" + i] : 0);
    var TimeLine3 =
      (data[0]["gioLine3_" + i] != undefined ? data[0]["gioLine3_" + i] : 0) +
      ":" +
      (data[0]["phutLine3_" + i] != undefined ? data[0]["phutLine3_" + i] : 0) +
      ":" +
      (data[0]["giayLine3_" + i] != undefined ? data[0]["giayLine3_" + i] : 0);
    var TimeLine4 =
      (data[0]["gioLine4_" + i] != undefined ? data[0]["gioLine4_" + i] : 0) +
      ":" +
      (data[0]["phutLine4_" + i] != undefined ? data[0]["phutLine4_" + i] : 0) +
      ":" +
      (data[0]["giayLine4_" + i] != undefined ? data[0]["giayLine4_" + i] : 0);
    var totalh =
      (data[0]["gioLine1_" + i] != undefined ? data[0]["gioLine1_" + i] : 0) +
      (data[0]["gioLine2_" + i] != undefined ? data[0]["gioLine2_" + i] : 0) +
      (data[0]["gioLine3_" + i] != undefined ? data[0]["gioLine3_" + i] : 0) +
      (data[0]["gioLine4_" + i] != undefined ? data[0]["gioLine4_" + i] : 0);
    var totalm =
      (data[0]["phutLine1_" + i] != undefined ? data[0]["phutLine1_" + i] : 0) +
      (data[0]["phutLine2_" + i] != undefined ? data[0]["phutLine2_" + i] : 0) +
      (data[0]["phutLine3_" + i] != undefined ? data[0]["phutLine3_" + i] : 0) +
      (data[0]["phutLine4_" + i] != undefined ? data[0]["phutLine4_" + i] : 0);
    var totals =
      (data[0]["giayLine1_" + i] != undefined ? data[0]["giayLine1_" + i] : 0) +
      (data[0]["giayLine2_" + i] != undefined ? data[0]["giayLine2_" + i] : 0) +
      (data[0]["giayLine3_" + i] != undefined ? data[0]["giayLine3_" + i] : 0) +
      (data[0]["giayLine4_" + i] != undefined ? data[0]["giayLine4_" + i] : 0);
    var tonggiay = totalh * 3600 + totalm * 60 + totals;
    var phantram = ((tonggiay / (24 * 3600 * 4)) * 100).toFixed(2);

    var hh = Math.floor(tonggiay / 3600);
    var mm = Math.floor((tonggiay % 3600) / 60);
    var ss = Math.floor((tonggiay % 3600) % 60);
    var total = hh + ":" + mm + ":" + ss;

    htmlDataTable.innerHTML +=
      '<tr class="row5">' +
      '<td class="column1 style4 n">' +
      i +
      "</td>" +
      '<td class="column2 style5 n">' +
      TimeLine1 +
      "</td>" +
      '<td class="column3 style4 null"></td>' +
      '<td class="column4 style5 n">' +
      TimeLine2 +
      "</td>" +
      '<td class="column5 style4 null"></td>' +
      '<td class="column6 style5 n">' +
      TimeLine3 +
      "</td>" +
      '<td class="column7 style4 null"></td>' +
      '<td class="column8 style5 n">' +
      TimeLine4 +
      "</td>" +
      '<td class="column9 style4 null"></td>' +
      '<td class="column10 style5 n">' +
      total +
      "</td>" +
      '<td class="column11 style4 null">' +
      phantram +
      "</td>" +
      "</tr>";
  }
}
function setDataChart(data) {
  for (var i = 1; i <= 31; i++) {
    var giayssLine1 =
      (data[0]["gioLine1_" + i] != undefined ? data[0]["gioLine1_" + i] : 0) *
      3600 +
      (data[0]["phutLine1_" + i] != undefined ? data[0]["phutLine1_" + i] : 0) *
      60 +
      (data[0]["giayLine1_" + i] != undefined ? data[0]["giayLine1_" + i] : 0);
    var phantramLine1 = ((giayssLine1 / (24 * 4 * 3600)) * 100).toFixed(2);
    dataLine1[i - 1] = phantramLine1;

    var giayssLine2 =
      (data[0]["gioLine2_" + i] != undefined ? data[0]["gioLine2_" + i] : 0) *
      3600 +
      (data[0]["phutLine2_" + i] != undefined ? data[0]["phutLine2_" + i] : 0) *
      60 +
      (data[0]["giayLine2_" + i] != undefined ? data[0]["giayLine2_" + i] : 0);
    var phantramLine2 = ((giayssLine2 / (24 * 4 * 3600)) * 100).toFixed(2);
    dataLine2[i - 1] = phantramLine2;

    var giayssLine3 =
      (data[0]["gioLine3_" + i] != undefined ? data[0]["gioLine3_" + i] : 0) *
      3600 +
      (data[0]["phutLine3_" + i] != undefined ? data[0]["phutLine3_" + i] : 0) *
      60 +
      (data[0]["giayLine3_" + i] != undefined ? data[0]["giayLine3_" + i] : 0);
    var phantramLine3 = ((giayssLine3 / (24 * 4 * 3600)) * 100).toFixed(2);
    dataLine3[i - 1] = phantramLine3;

    var giayssLine4 =
      (data[0]["gioLine4_" + i] != undefined ? data[0]["gioLine4_" + i] : 0) *
      3600 +
      (data[0]["phutLine4_" + i] != undefined ? data[0]["phutLine4_" + i] : 0) *
      60 +
      (data[0]["giayLine4_" + i] != undefined ? data[0]["giayLine4_" + i] : 0);
    var phantramLine4 = ((giayssLine4 / (24 * 4 * 3600)) * 100).toFixed(2);
    dataLine4[i - 1] = phantramLine4;
  }
}
const data = {
  labels: xValues,
  datasets: [
    {
      label: "Runtime #A1",
      data: dataLine1,
      backgroundColor: "#408cf0",
      borderColor: "#408cf0",
      borderWidth: 1,
    },
    {
      label: "Runtime #B1",
      data: dataLine2,
      backgroundColor: "#fbb441",
      borderColor: "#fbb441",
      borderWidth: 1,
    },
    {
      label: "Runtime #A2",
      data: dataLine3,
      backgroundColor: "#e03f0a",
      borderColor: "#e03f0a",
      borderWidth: 1,
    },
    {
      label: "Runtime #B2",
      data: dataLine4,
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
  }
};

// render init block
const myChart = new Chart(document.getElementById("myChart"), config);

/* Declaring three variables. */
var RawPumpAold = null;
var RawPumpBold = null;
var RawPumpCold = null;
/* Declaring three variables. */
var rawpumpA2old = null;
var rawpumpB2old = null;
var rawpumpC2old = null;
/* Declaring three variables. */
var ropressurepumpA1old = null;
var ropressurepumpC1old = null;
var ropressurepumpB1old = null;
/* Declaring three variables. */
var ropressurepumpA2old = null;
var ropressurepumpC2old = null;
var ropressurepumpB2old = null;
/* Declaring three variables. */
var ediwaterpumpTop1old = null;
var ediwaterpumpTop2old = null;
var ediwaterpumpTop3old = null;
/* Declaring two variables. */
var ro2ProductAold = null;
var ro2ProductBold = null;
function pumpOnOff(data) {
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
  // ediwaterpumpBottom1.src = "svg/FanOff.svg";
  // ediwaterpumpBottom2.src = "svg/FanOff.svg";
  // ediwaterpumpBottom3.src = "svg/FanOff.svg";
  var ro2ProductA = document.getElementById("ro2ProductA");
  var ro2ProductB = document.getElementById("ro2ProductB");

  if (RawPumpAold != data[0].dataPump.RawPumpA) {
    RawPumpAold = data[0].dataPump.RawPumpA;
    if (data[0].dataPump.RawPumpA == 1) {
      rawpumpA1.src = "svg/fanolfinal.svg";
    } else {
      rawpumpA1.src = "svg/FanOff.svg";
    }
  }
  if (RawPumpCold != data[0].dataPump.RawPumpC) {
    RawPumpCold = data[0].dataPump.RawPumpC;
    if (data[0].dataPump.RawPumpC == 1) {
      rawpumpC1.src = "svg/fanolfinal.svg";
    } else {
      rawpumpC1.src = "svg/FanOff.svg";
    }
  }
  if (RawPumpBold != data[0].dataPump.RawPumpB) {
    RawPumpBold = data[0].dataPump.RawPumpB;
    if (data[0].dataPump.RawPumpB == 1) {
      rawpumpB1.src = "svg/fanolfinal.svg";
    } else {
      rawpumpB1.src = "svg/FanOff.svg";
    }
  }

  // var ropressurepumpA1old = null;
  // var ropressurepumpC1old = null;
  // var ropressurepumpB1old = null;
  if (ropressurepumpA1old != data[0].DataLine1RoEDI._RO_PRESSURE_PUMP_1) {
    ropressurepumpA1old = data[0].DataLine1RoEDI._RO_PRESSURE_PUMP_1;
    if (data[0].DataLine1RoEDI._RO_PRESSURE_PUMP_1 == 1) {
      ropressurepumpA1.src = "svg/fanolfinal.svg";
    } else {
      ropressurepumpA1.src = "svg/FanOff.svg";
    }
  }
  if (ropressurepumpC1old != data[0].DataLine1RoEDI._RO_PRESSURE_PUMP_2) {
    ropressurepumpC1old = data[0].DataLine1RoEDI._RO_PRESSURE_PUMP_2;
    if (data[0].DataLine1RoEDI._RO_PRESSURE_PUMP_2 == 1) {
      ropressurepumpC1.src = "svg/fanolfinal.svg";
    } else {
      ropressurepumpC1.src = "svg/FanOff.svg";
    }
  }
  if (ropressurepumpB1old != data[0].DataLine1RoEDI._RO_PRESSURE_PUMP_3) {
    ropressurepumpB1old = data[0].DataLine1RoEDI._RO_PRESSURE_PUMP_3;
    if (data[0].DataLine1RoEDI._RO_PRESSURE_PUMP_3 == 1) {
      ropressurepumpB1.src = "svg/fanolfinal.svg";
    } else {
      ropressurepumpB1.src = "svg/FanOff.svg";
    }
  }
  // var ediwaterpumpTop1old = null;
  // var ediwaterpumpTop2old = null;
  // var ediwaterpumpTop3old = null;
  if (ediwaterpumpTop1old != data[0].DataLine1RoEDI._EDI_WATER_PUMP_1) {
    ediwaterpumpTop1old = data[0].DataLine1RoEDI._EDI_WATER_PUMP_1;
    if (data[0].DataLine1RoEDI._EDI_WATER_PUMP_1 == 1) {
      ediwaterpumpTop1.src = "svg/fanolfinal.svg";
    } else {
      ediwaterpumpTop1.src = "svg/FanOff.svg";
    }
  }
  if (ediwaterpumpTop2old != data[0].DataLine1RoEDI._EDI_WATER_PUMP_2) {
    ediwaterpumpTop2old = data[0].DataLine1RoEDI._EDI_WATER_PUMP_2;
    if (data[0].DataLine1RoEDI._EDI_WATER_PUMP_2 == 1) {
      ediwaterpumpTop2.src = "svg/fanolfinal.svg";
    } else {
      ediwaterpumpTop2.src = "svg/FanOff.svg";
    }
  }
  if (ediwaterpumpTop3old != data[0].DataLine1RoEDI._EDI_WATER_PUMP_3) {
    ediwaterpumpTop3old = data[0].DataLine1RoEDI._EDI_WATER_PUMP_3;
    if (data[0].DataLine1RoEDI._EDI_WATER_PUMP_3 == 1) {
      ediwaterpumpTop3.src = "svg/fanolfinal.svg";
    } else {
      ediwaterpumpTop3.src = "svg/FanOff.svg";
    }
  }


  // var rawpumpA2old = null;
  // var rawpumpB2old = null;
  // var rawpumpC2old = null;
  if (rawpumpA2old != data[0].dataLineRO2.Pump_A_Raw_Water) {
    rawpumpA2old = data[0].dataLineRO2.Pump_A_Raw_Water;
    if (data[0].dataLineRO2.Pump_A_Raw_Water == 1) {
      rawpumpA2.src = "svg/fanolfinal.svg";
    } else {
      rawpumpA2.src = "svg/FanOff.svg";
    }
  }
  if (rawpumpB2old != data[0].dataLineRO2.Pump_B_Raw_Water) {
    rawpumpB2old = data[0].dataLineRO2.Pump_B_Raw_Water;
    if (data[0].dataLineRO2.Pump_B_Raw_Water == 1) {
      rawpumpB2.src = "svg/fanolfinal.svg";
    } else {
      rawpumpB2.src = "svg/FanOff.svg";
    }
  }
  if (rawpumpC2old != data[0].dataLineRO2.Pump_C_Raw_Water) {
    rawpumpC2old = data[0].dataLineRO2.Pump_C_Raw_Water;
    if (data[0].dataLineRO2.Pump_C_Raw_Water == 1) {
      rawpumpC2.src = "svg/fanolfinal.svg";
    } else {
      rawpumpC2.src = "svg/FanOff.svg";
    }
  }

  // var ropressurepumpA2old = null;
  // var ropressurepumpC2old = null;
  // var ropressurepumpB2old = null;
  if (ropressurepumpA2old != data[0].dataLineRO2.Pump_A_RO_HP) {
    ropressurepumpA2old = data[0].dataLineRO2.Pump_A_RO_HP;
    if (data[0].dataLineRO2.Pump_A_RO_HP == 1) {
      ropressurepumpA2.src = "svg/fanolfinal.svg";
    } else {
      ropressurepumpA2.src = "svg/FanOff.svg";
    }
  }
  if (ropressurepumpB2old != data[0].dataLineRO2.Pump_B_RO_HP) {
    ropressurepumpB2old = data[0].dataLineRO2.Pump_B_RO_HP;
    if (data[0].dataLineRO2.Pump_B_RO_HP == 1) {
      ropressurepumpB2.src = "svg/fanolfinal.svg";
    } else {
      ropressurepumpB2.src = "svg/FanOff.svg";
    }
  }
  if (ropressurepumpC2old != data[0].dataLineRO2.Pump_C_RO_HP) {
    ropressurepumpC2old = data[0].dataLineRO2.Pump_C_RO_HP;
    if (data[0].dataLineRO2.Pump_C_RO_HP == 1) {
      ropressurepumpC2.src = "svg/fanolfinal.svg";
    } else {
      ropressurepumpC2.src = "svg/FanOff.svg";
    }
  }
  //   var ro2ProductAold = null;
  // var ro2ProductBold = null;
  if (ro2ProductAold != data[0].dataLineRO2.Pump_A_RO_Product) {
    ro2ProductAold = data[0].dataLineRO2.Pump_A_RO_Product;
    if (data[0].dataLineRO2.Pump_A_RO_Product == 1) {
      ro2ProductA.src = "svg/fanolfinal.svg";
    } else {
      ro2ProductA.src = "svg/FanOff.svg";
    }
  }
  if (ro2ProductBold != data[0].dataLineRO2.Pump_B_RO_Product) {
    ro2ProductBold = data[0].dataLineRO2.Pump_B_RO_Product;
    if (data[0].dataLineRO2.Pump_B_RO_Product == 1) {
      ro2ProductB.src = "svg/fanolfinal.svg";
    } else {
      ro2ProductB.src = "svg/FanOff.svg";
    }
  }
}

function ledOnOf(data) {
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
  var LedEdisystem1ATop = document.getElementById("LedEdisystem1ATop");
  var LedEdisystem1BTop = document.getElementById("LedEdisystem1BTop");
  var LedEdisystem2ATop = document.getElementById("LedEdisystem2ATop");
  var LedEdisystem2BTop = document.getElementById("LedEdisystem2BTop");

  var LedTankxanh1 = document.getElementById("LedTankxanh1");
  var LedTankxanh2 = document.getElementById("LedTankxanh2");
  var LedTankxanh3 = document.getElementById("LedTankxanh3");
  var LedTankxanh4 = document.getElementById("LedTankxanh4");

  var LedTankxanh5 = document.getElementById("LedTankxanh5");
  var LedTankxanh6 = document.getElementById("LedTankxanh6");
  var LedTankxanh7 = document.getElementById("LedTankxanh7");
  var LedTankxanh8 = document.getElementById("LedTankxanh8");

  if (data[0].DataLine1RoEDI._CARBON_FILTER_1 == 1) {
    LedTankxanh1.classList.add("on");
  } else {
    LedTankxanh1.classList.remove("on");
  }  
  if (data[0].DataLine1RoEDI._CARBON_FILTER_2 == 1) {
    LedTankxanh3.classList.add("on");
  } else {
    LedTankxanh3.classList.remove("on");
  }  
  if (data[0].DataLine1RoEDI._WATER_SOFTENER_1 == 1) {
    LedTankxanh2.classList.add("on");
  } else {
    LedTankxanh2.classList.remove("on");
  }  
  if (data[0].DataLine1RoEDI._WATER_SOFTENER_2 == 1) {
    LedTankxanh4.classList.add("on");
  } else {
    LedTankxanh4.classList.remove("on");
  }  
  //
  if (data[0].DataLine1RoEDI.cacbon_A == 1) {
    LedTankxanh5.classList.add("on");
  } else {
    LedTankxanh5.classList.remove("on");
  }  
  if (data[0].DataLine1RoEDI.cacbon_B == 1) {
    LedTankxanh7.classList.add("on");
  } else {
    LedTankxanh7.classList.remove("on");
  }  
  if (data[0].DataLine1RoEDI.softener_A == 1) {
    LedTankxanh6.classList.add("on");
  } else {
    LedTankxanh6.classList.remove("on");
  }  
  if (data[0].DataLine1RoEDI.softener_B == 1) {
    LedTankxanh8.classList.add("on");
  } else {
    LedTankxanh8.classList.remove("on");
  }  

  if (data[0].DataLine1RoEDI._UV_SYSTEM_1 == 1) {
    Leduv1top.classList.add("on");
  } else {
    Leduv1top.classList.remove("on");
  }  
  if (data[0].DataLine1RoEDI._UV_SYSTEM_2 == 1) {
    Leduv2top.classList.add("on");
  } else {
    Leduv2top.classList.remove("on");
  }  

  if (data[0].DataLine1RoEDI._EDI_SYSTEM_1_A_B == 1) {
    LedEdisystem1ATop.classList.add("on");
    LedEdisystem1BTop.classList.add("on");
  } else {
    LedEdisystem1ATop.classList.remove("on");
    LedEdisystem1BTop.classList.remove("on");
  }  
  if (data[0].DataLine1RoEDI._EDI_SYSTEM_2_A_B == 1) {
    LedEdisystem2ATop.classList.add("on");
    LedEdisystem2BTop.classList.add("on");
  } else {
    LedEdisystem2ATop.classList.remove("on");
    LedEdisystem2BTop.classList.remove("on");
  }

  if (data[0].DataLine1RoEDI._LP1 == 1) {
    Ledlp1.classList.add("on");
  } else {
    Ledlp1.classList.remove("on");
  }
  if (data[0].DataLine1RoEDI._LP2 == 1) {
    Ledlp2.classList.add("on");
  } else {
    Ledlp2.classList.remove("on");
  }

  if (data[0].DataLine1RoEDI._PS1 == 1) {
    Ledfs1top.classList.add("on");
  } else {
    Ledfs1top.classList.remove("on");
  }
  if (data[0].DataLine1RoEDI._PS2 == 1) {
    Ledfs2top.classList.add("on");
  } else {
    Ledfs2top.classList.remove("on");
  }

  if (data[0].dataLineRO2.PS_1_Low == 1) {
    Ledps1l.classList.add("on");
  } else {
    Ledps1l.classList.remove("on");
  }
  if (data[0].dataLineRO2.PS_2_Low == 1) {
    Ledps2l.classList.add("on");
  } else {
    Ledps2l.classList.remove("on");
  }

  if (data[0].dataLineRO2.PS_1_High == 1) {
    Ledps1h.classList.add("on");
  } else {
    Ledps1h.classList.remove("on");
  }
  if (data[0].dataLineRO2.PS_2_High == 1) {
    Ledps2h.classList.add("on");
  } else {
    Ledps2h.classList.remove("on");
  }


  var Client1_20_502 = document.getElementById("Client1_20_502");
  var Client2_23_8000 = document.getElementById("Client2_23_8000");
  var Client3_10_502 = document.getElementById("Client3_10_502");
  var ConnectRawwaterTank = document.getElementById("Client4_46_502");
  if (data[0].Connect.Client1 == 1) {
    Client1_20_502.classList.add("on");
  } else {
    Client1_20_502.classList.remove("on");
  }
  if (data[0].Connect.Client2 == 1) {
    Client2_23_8000.classList.add("on");
  } else {
    Client2_23_8000.classList.remove("on");
  }
  if (data[0].Connect.Client3 == 1) {
    Client3_10_502.classList.add("on");
  } else {
    Client3_10_502.classList.remove("on");
  }
  // if (data[0].ConnectRawwaterTank == 1) {
  //   ConnectRawwaterTank.classList.add("on");
  // } else {
  //   ConnectRawwaterTank.classList.remove("on");
  // }
}
// cập nhật valve
function changeImgVavle(data) {
  for (let i = 1; i < 9; i++) {
    if (data[0].dataValveLine1["sv" + i] == 1) {
      document.getElementById("sv" + i + "top").src = "images/vavleOn.png";
    } else {
      document.getElementById("sv" + i + "top").src = "images/ValveOff.png";
    }
  }
}
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
// cập nhật dataConductivity

function dataConductivity(data) {
  var dataConductivity1 = document.getElementById("dataConductivity1");
  var dataConductivity2 = document.getElementById("dataConductivity2");
  var dataConductivity3 = document.getElementById("dataConductivity3");
  var dataConductivity4 = document.getElementById("dataConductivity4");
  var dataConductivity5 = document.getElementById("dataConductivity5");
  var dataConductivity6 = document.getElementById("dataConductivity6");
  var dataConductivity7 = document.getElementById("dataConductivity7");
  var dataConductivity8 = document.getElementById("dataConductivity8");

  var dataResistivity1 = document.getElementById("dataResistivity1");
  var dataResistivity2 = document.getElementById("dataResistivity2");
  var dataResistivity3 = document.getElementById("dataResistivity3");
  var dataResistivity4 = document.getElementById("dataResistivity4");

  dataConductivity1.innerHTML = data[0].dataMenterline1.cond1.toFixed(2);
  dataConductivity2.innerHTML = data[0].dataMenterline1.cond2.toFixed(2);
  dataConductivity3.innerHTML = data[0].dataMenterline1.cond3.toFixed(2);
  dataConductivity4.innerHTML = data[0].dataMenterline1.cond4.toFixed(2);

  dataResistivity1.innerHTML = data[0].dataMenterline1.res1.toFixed(2);
  dataResistivity2.innerHTML = data[0].dataMenterline1.flow1.toFixed(2);
  dataResistivity3.innerHTML = data[0].dataMenterline1.res2.toFixed(2);
  dataResistivity4.innerHTML = data[0].dataMenterline1.flow2.toFixed(2);

  dataConductivity5.innerHTML = data[0].dataMenterLine2.cond5.toFixed(2);
  dataConductivity6.innerHTML = data[0].dataMenterLine2.cond6.toFixed(2);
  dataConductivity7.innerHTML = data[0].dataMenterLine2.cond7.toFixed(2);
  dataConductivity8.innerHTML = data[0].dataMenterLine2.cond8.toFixed(2);
}

console.log(
  "%cHello Guy !! WelCome To Synopex ",
  "font-weight: bold; font-size: 30px;color:green"
);
console.log(
  "%c->PLC,HMI,MCU,DCS,SCADA IOT, HTML ,CSS ,JS !! ",
  "font-weight: bold; font-size: 15px;color:#068e8e"
);
var connect = document.getElementById("connect");
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
const sendHttpRequest = (method, url, data) => {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url);

    xhr.responseType = "json";

    if (data) {
      xhr.setRequestHeader("Content-Type", "application/json");
    }

    xhr.onload = () => {
      if (xhr.status >= 400) {
        reject(xhr.response);
      } else {
        resolve(xhr.response);
      }
    };
    txt = xhr.response;
    xhr.onerror = () => {
      reject("Something went wrong!");
    };

    xhr.send(JSON.stringify(data));
  });
  return promise;
};
