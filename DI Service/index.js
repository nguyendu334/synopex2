const Modbus = require("jsmodbus");
const net = require("net");
const ModbusRTU = require("modbus-serial");
const jsonServer = require("json-server");
const fetch = require("node-fetch");
const convert = require('./converter.js');

// Json server
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares);
server.get("/echo", (req, res) => {
    res.jsonp(req.query);
});
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
    if (req.method === "POST") {
        req.body.createdAt = Date.now();
    }
    next();
});
// Use default router
server.use("/", router);
server.listen(3005, () => {
    console.log("JSON Server is running");
});
var url = "http://localhost:3005/data/1";
var datamqtt = [];
function getdataJson() {
    fetch("http://localhost:3005/data")
        .then((response) => response.json())
        .then((data) => (datamqtt = data))
        .catch((err) => console.log(err));
}
function Updatedata(dataUpdateJson) {
    fetch(url, {
        method: "PATCH",
        body: JSON.stringify(dataUpdateJson),
        headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
    //   .then((json) => console.log(json));
}
// End Json server

//ModbusRTU
const client1 = new ModbusRTU();
const client2 = new ModbusRTU();
const client3 = new ModbusRTU();
// const client4 = new ModbusRTU();
const client5 = new ModbusRTU();

function setClient() {
    // set the client's unit id
    // set a timout for requests default is null (no timeout)
    client1.setID(1);
    client2.setID(1);
    client3.setID(1);
    // client4.setID(1);
    client5.setID(1);
    client1.setTimeout(1000);
    client2.setTimeout(1000);
    client3.setTimeout(1000);
    // client4.setTimeout(1000);
    client5.setTimeout(1000);

    // run program
    // readCoils();
    // readHoldingRegisters();
}
// Kết nối client => server lần đầu
client1.connectTCP("192.168.111.20", { port: 502 })
    .then(setClient)
    .then(function () {
        console.log("Connected");
    })
    .catch(function (e) {
        console.log(e.message);
    })
client2.connectTCP("192.168.111.23", { port: 8000 })
    .then(setClient)
    .then(function () {
        console.log("Connected");
    })
    .catch(function (e) {
        console.log(e.message);
    })
client3.connectTCP("192.168.111.10", { port: 502 })
    .then(setClient)
    .then(function () {
        console.log("Connected");
    })
    .catch(function (e) {
        console.log(e.message);
    })
// Trường hợp đặc biệt Bộ chuyển đổi dữ liệu A-1819 không cho connection nhiều lần
// ---------------------------------------------------------------- Đã đc chuyển đổi sang 192.168.111.20:502  Addr 4x160 length 8
// client4.connectTCP("192.168.111.46", { port: 502 })
//     .then(setClient)
//     .then(function () {
//         console.log("Connected");
//     })
//     .catch(function (e) {
//         console.log(e.message);
//     })
client5.connectTCP("192.168.111.32", { port: 8000 })
    .then(setClient)
    .then(function () {
        console.log("Connected");
    })
    .catch(function (e) {
        console.log(e.message);
    })
// đọc dữ liệu 0x (FC1)
function readCoils() {
    // read the 4 registers starting at address 5
    client1.readCoils(0, 52)
        .then(function (d) {
            console.log("readCoils = > client1:", d.data);
            var dataReadCoilClient1 = d.data;
            Object.keys(data_1.DataLine1RoEDI).forEach((key, value) => {
                data_1.DataLine1RoEDI[key] = dataReadCoilClient1[value];
            });
        })
        .catch(function (e) {
            if (e != null) {
                console.log("Con me no readCoils client1, mat ket noi roi!");
            }
            console.log(e.message);
        })
    client2.readCoils(0, 16)
        .then(function (d) {
            console.log("readCoils = >client2:", d.data);
            var dataReadCoilClient2 = d.data;
            Object.keys(lineRo2.dataLineRO2).forEach((key, value) => {
                lineRo2.dataLineRO2[key] = dataReadCoilClient2[value];
            });
        })
        .catch(function (e) {
            if (e != null) {
                console.log("Con me no readCoils client2, mat ket noi roi!");
            }
            console.log(e.message);
        })
    client3.readCoils(23, 3)
        .then(function (d) {
            console.log("readCoils = > client3:", d.data);
            var dataReadCoilClient3 = d.data;
            RawwaterTank.dataPump.RawPumpA = dataReadCoilClient3[0];
            RawwaterTank.dataPump.RawPumpC = dataReadCoilClient3[1];
            RawwaterTank.dataPump.RawPumpB = dataReadCoilClient3[2];
        })
        .catch(function (e) {
            if (e != null) {
                console.log("Con me no readCoils client3, mat ket noi roi!");
            }
            console.log(e.message);
        })
    client5.readCoils(100, 10)
        .then(function (d) {
            console.log("readCoils = > client5:", d.data);
            var dataClient5 = d.data;
            Object.keys(EDIline1.dataEDIline1).forEach((key, index) => {
                EDIline1.dataEDIline1[key] = dataClient5[index];
            });
        })
        .catch(function (e) {
            if (e != null) {
                console.log("Con me no readCoils client5, mat ket noi roi!");
            }
            console.log(e.message);
        })
}
// đọc dữ liệu 1x (FC2)
function readDiscreteInputs() {
    client1.readDiscreteInputs(0, 8)
        .then(function (d) {
            console.log("readDiscreteInputs = > client1:", d.data);
            var dataReadCoilClient1 = d.data;
            Object.keys(valveLine1.dataValveLine1).forEach((key, value) => {
                valveLine1.dataValveLine1[key] = dataReadCoilClient1[value];
            });
        })
        .catch(function (e) {
            if (e != null) {
                console.log("Con me no readDiscreteInputs client1, mat ket noi roi!");
            }
            console.log(e.message);
        })
}
// đọc dữ liệu 2x (FC3)
// Đặc biệt 2x (FC3) of modbus-Serial Có thể check connection -> thêm reconnect vào hàm này
// Reconnect ngay khi có báo lỗi không cần biết lỗi nhiễu hay mất mạng
// display Dissconnect theo từng IPv4 -> riêng lẻ từng IP dễ kiểm tra đứt mạng
var datareadInputRegistersclient2 = [0, 0, 0, 0, 0, 0, 0, 0];
function ConVertDataClient4() {
    var conductivity1 = convert.convertMeterLine1Cond12(datareadInputRegistersclient2[0]);
    var conductivity2 = convert.convertMeterLine1Cond12(datareadInputRegistersclient2[1]);

    var conductivity3 = convert.convertMeterLine1Cond34(datareadInputRegistersclient2[2]);
    var conductivity4 = convert.convertMeterLine1Cond34(datareadInputRegistersclient2[3]);

    var resistivity1 = convert.convertresistivity(datareadInputRegistersclient2[4]);
    var resistivity2 = convert.convertresistivity(datareadInputRegistersclient2[5]);

    var flow1 = convert.convertflow(datareadInputRegistersclient2[6]);
    var flow2 = convert.convertflow(datareadInputRegistersclient2[7]);

    var arrData = [conductivity1, conductivity2, conductivity3, conductivity4, resistivity1, resistivity2, flow1, flow2]

    Object.keys(menterline1.dataMenterline1).forEach((key, index) => {
        menterline1.dataMenterline1[key] = arrData[index];
    });
}
function readHoldingRegisters() {
    //Chuyển đổi của Client4 -> 192.168.111.46:502 Addr 4x160 length 8
    client1.readHoldingRegisters(160, 8)
        .then(function (d) {
            // console.log("readHoldingRegisters = > client1:", d.data);
            Connection.Connect.Client1 = true;
            console.log("readHoldingRegisters = > client4:", d.data);
            Connection.Connect.Client4 = true;
            datareadInputRegistersclient2 = d.data;
        })
        .catch(function (e) {
            if (e != null) {
                console.log("Con me no client1, mat ket noi roi!");
                Connection.Connect.Client1 = false;
                Connection.Connect.Client4 = false;
                reconnectClient1();
            }
            console.log(e.message);
        })
    client3.readHoldingRegisters(2, 2)
        .then(function (d) {
            console.log("readHoldingRegisters = > client3:", d.data);
            Connection.Connect.Client3 = true;
            var responseModbus = d.data;
            var rawwatertank = convert.convert16to32(responseModbus[0], responseModbus[1]);
            RawwaterTank.dataRawwaterTank.Level = rawwatertank;
        })
        .catch(function (e) {
            if (e != null) {
                console.log("Con me no client3, mat ket noi roi!");
                Connection.Connect.Client3 = false;
                reconnectClient3();
            }
            console.log(e.message);
        })
    // ---------------------------------------------------------------- Đã đc chuyển đổi sang 192.168.111.20:502  Addr 4x160 length 8
    // client4.readHoldingRegisters(160, 8)
    //     .then(function (d) {
    //         console.log("readHoldingRegisters = > client4:", d.data);
    //         Connection.Connect.Client4 = true;
    //         var datareadInputRegistersclient2 = d.data;
    //         var conductivity1 = convert.convertMeterLine1Cond12(datareadInputRegistersclient2[0]);
    //         var conductivity2 = convert.convertMeterLine1Cond12(datareadInputRegistersclient2[1]);

    //         var conductivity3 = convert.convertMeterLine1Cond34(responseModbus[2]);
    //         var conductivity4 = convert.convertMeterLine1Cond34(responseModbus[3]);

    //         var resistivity1 = convert.convertresistivity(responseModbus[4]);
    //         var resistivity2 = convert.convertresistivity(responseModbus[5]);

    //         var flow1 = convert.convertflow(responseModbus[6]);
    //         var flow2 = convert.convertflow(responseModbus[7]);

    //         var arrData = [conductivity1, conductivity2, conductivity3, conductivity4, resistivity1, resistivity2, flow1, flow2]

    //         Object.keys(menterline1.dataMenterline1).forEach((key, index) => {
    //             menterline1.dataMenterline1[key] = arrData[index];
    //         });
    //     })
    //     .catch(function (e) {
    //         if (e != null) {
    //             console.log("Con me no client4, mat ket noi roi!");
    //             Connection.Connect.Client4 = false;
    //             reconnectClient4();
    //         }
    //         console.log(e.message);
    //     })
    client5.readHoldingRegisters(0, 6)
    .then(function (d) {
        console.log("readHoldingRegisters = > client5:", d.data);
        Connection.Connect.Client5 = true;
        var responseModbus = d.data;
        EDIline1.Resistivity.ResDI1 = convert.convert16to32(responseModbus[0], responseModbus[1])
        EDIline1.Resistivity.ResDI2 = convert.convert16to32(responseModbus[2], responseModbus[3])
        EDIline1.Resistivity.ResDI3 = convert.convert16to32(responseModbus[4], responseModbus[5])
    })
    .catch(function (e) {
        if (e != null) {
            console.log("Con me no client5, mat ket noi roi!");
            Connection.Connect.Client5 = false;
            reconnectClient5();
        }
        console.log(e.message);
    })
}
// đọc dữ liệu 3x (FC4)
function readInputRegisters() {
    client2.readInputRegisters(6, 7)
        .then(function (d) {
            console.log("readInputRegisters = > client2:", d.data);
            var responseModbus = d.data;
            var conductivity5 = convert.convertMeterLine2Cond56(responseModbus[0]);
            var conductivity6 = convert.convertMeterLine2Cond56(responseModbus[2]);
            var conductivity7 = convert.convertMeterLine2Cond78(responseModbus[4]);
            var conductivity8 = convert.convertMeterLine2Cond78(responseModbus[6]);
            var data1 = [
                conductivity5,
                conductivity6,
                conductivity7,
                conductivity8
            ]
            // console.log(data1);
            Object.keys(MenterLine2.dataMenterLine2).forEach((key, index) => {
                MenterLine2.dataMenterLine2[key] = data1[index];
            });
        })
        .catch(function (e) {
            if (e != null) {
                console.log("Con me no FC4 readInputRegisters client2-1, mat ket noi roi!");
            }
            console.log(e.message);
        })
    client2.readInputRegisters(0, 1)
        .then(function (d) {
            console.log("readHoldingRegisters = > client2:", d.data);
            var datareadInputRegistersclient2 = d.data;
            ROTank.dataROTank.Level = datareadInputRegistersclient2[0];
            Connection.Connect.Client2 = true;
        })
        .catch(function (e) {
            if (e != null) {
                console.log("Con me no FC4 readInputRegisters client2-2, mat ket noi roi!");
                Connection.Connect.Client2 = false;
                reconnectClient2();
            }
            console.log(e.message);
        })
}
// Reconnect client
function reconnectClient1() {
    client1.connectTCP("192.168.111.20", { port: 502 })
        .then(setClient)
        .then(function () {
            console.log("Connected");
        })
        .catch(function (e) {
            console.log(e.message);
        })
}
function reconnectClient2() {
    client2.connectTCP("192.168.111.23", { port: 8000 })
        .then(setClient)
        .then(function () {
            console.log("Connected");
        })
        .catch(function (e) {
            console.log(e.message);
        })
}
function reconnectClient3() {
    client3.connectTCP("192.168.111.10", { port: 502 })
        .then(setClient)
        .then(function () {
            console.log("Connected");
        })
        .catch(function (e) {
            console.log(e.message);
        })
}
function reconnectClient5() {
    client5.connectTCP("192.168.111.32", { port: 8000 })
        .then(setClient)
        .then(function () {
            console.log("Connected");
        })
        .catch(function (e) {
            console.log(e.message);
        })
}
function reconnectClient4() {
    client4.connectTCP("192.168.111.46", { port: 502 })
        .then(setClient)
        .then(function () {
            console.log("Connected");
        })
        .catch(function (e) {
            console.log(e.message);
        })
}
//Data Object
var Connection = {
    Connect: {
        Client1: 1,
        Client2: 1,
        Client3: 1,
        Client4: 1,
        Client5: 1
    }
}
var data_1 = {
    DataLine1RoEDI: {
        _LT01_H_ON: false,
        _LT01_H_ST: false,
        _MX105: false,
        _MX106: false,
        _MX107: false,
        _MX108: false,
        _CARBON_FILTER_1: false,
        _WATER_SOFTENER_1: false,
        _MX111: false,
        _LP1: false,
        _RO_PRESSURE_PUMP_1: false,
        _MX114: false,
        _MX115: false,
        _CARBON_FILTER_2: false,
        _WATER_SOFTENER_2: false,
        _MX118: false,
        _RO_PRESSURE_PUMP_3: false,
        _MX120: false,
        _MX121: false,
        _RO_PRESSURE_PUMP_2: false,
        _MX123: false,
        _MX124: false,
        _MX125: false,
        _MX126: false,
        _MX127: false,
        _UV_SYSTEM_1: false,
        _EDI_WATER_PUMP_1: false,
        _EDI_WATER_PUMP_2: false,
        _EDI_SYSTEM_1_A_B: false,
        _PS1: false,
        _MX133: false,
        _MX134: false,
        _MX135: false,
        _MX136: false,
        _UV_SYSTEM_2: false,
        _EDI_SYSTEM_2_A_B: false,
        _EDI_WATER_PUMP_3: false,
        _PS2: false,
        _MX141: false,
        _MX142: false,
        _MX143: false,
        _MX144: false,
        _MX145: false,
        _MX146: false,
        _LP2: false,
        _MX148: false,
        _MX149: false,
        _MX150: false,
        _MX151: false,
        _MX152: false,
        _MX153: false,
        _MX154: false
    }
}
var valveLine1 = {
    dataValveLine1: {
        sv1: 0,
        sv2: 0,
        sv3: 0,
        sv4: 0,
        sv5: 0,
        sv6: 0,
        sv7: 0,
        sv8: 0
    }
}
var lineRo2 = {
    dataLineRO2: {
        Pump_A_Raw_Water: 0,
        Pump_C_Raw_Water: 0,
        Pump_B_Raw_Water: 0,
        Pump_A_RO_HP: 0,
        Pump_C_RO_HP: 0,
        Pump_B_RO_HP: 0,
        Pump_A_RO_Product: 0,
        Pump_B_RO_Product: 0,
        cacbon_A: 0,
        softener_A: 0,
        cacbon_B: 0,
        softener_B: 0,
        PS_1_Low: 0,
        PS_2_Low: 0,
        PS_1_High: 0,
        PS_2_High: 0
    }
}
var ROTank = {
    dataROTank: {
        Level: 0
    }
}
var MenterLine2 = {
    dataMenterLine2: {
        cond5: 0,
        cond6: 0,
        cond7: 0,
        cond8: 0
    }
}
var menterline1 = {
    dataMenterline1: {
        cond1: 0,
        cond2: 0,
        cond3: 0,
        cond4: 0,
        res1: 0,
        res2: 0,
        flow1: 0,
        flow2: 0,
    }
}
var RawwaterTank = {
    dataRawwaterTank: {
        Level: 0
    },
    dataPump: {
        RawPumpA: 0,
        RawPumpC: 0,
        RawPumpB: 0
    }
}
var EDIline1 ={
    dataEDIline1:{
        pump2 : 0,
        pump3 : 1,
        UV : 1,
        EDI1: 1,
        EDI2: 1,
        EDI3: 0
    },
    Resistivity :{
        ResDI1:17.1111,
        ResDI2:17,
        ResDI3:17
    }
}

setInterval(() => {

    //Chia Time to đọc modbus, tránh bị nhiều data port mở cùng 1 lúc gây nhiễu data
    // lý do chia time vì có tới 8 data ở địa chỉ khác nhau thì đọc 1 lúc khi phản hồi về sẽ đè lên nhau
    // mặc dù có trễ hơn so với code cũ nhưng độ trính xác cao hơn, ít bị nhiễu và có thời gian để reset connect
    readCoils();
    // readHoldingRegisters();
    // readDiscreteInputs();    // readInputRegisters();
    setTimeout(readDiscreteInputs, 500);
    setTimeout(readInputRegisters, 1000);
    setTimeout(readHoldingRegisters, 1500);

}, 2000);
setInterval(SendUpdate, 1000);
// pOst data on json server per second
async function SendUpdate() {
    getdataJson();
    await Updatedata(Connection);
    await Updatedata(data_1);
    await Updatedata(valveLine1);
    await Updatedata(lineRo2);
    await Updatedata(MenterLine2);
    await ConVertDataClient4();
    await Updatedata(menterline1);
    await Updatedata(RawwaterTank);
    await Updatedata(ROTank);
    await Updatedata(EDIline1);
    TimeRunning();
}

// khai báo biến run time 
var ddata;
var ddd = new Date();
ddata = ddd.getDate();
var giayLine1 = "giayLine1_";
var phutLine1 = "phutLine1_";
var gioLine1 = "gioLine1_";
var giayLine2 = "giayLine2_";
var phutLine2 = "phutLine2_";
var gioLine2 = "gioLine2_";
var giayLine3 = "giayLine3_";
var phutLine3 = "phutLine3_";
var gioLine3 = "gioLine3_";
var giayLine4 = "giayLine4_";
var phutLine4 = "phutLine4_";
var gioLine4 = "gioLine4_";
var timeLine1 = {};
var timeLine2 = {};
var timeLine3 = {};
var timeLine4 = {};

timeLine1 = {
    [giayLine1 + ddata]: 0,
    [phutLine1 + ddata]: 0,
    [gioLine1 + ddata]: 0
}

timeLine2 = {
    [giayLine2 + ddata]: 0,
    [phutLine2 + ddata]: 0,
    [gioLine2 + ddata]: 0
}

timeLine3 = {
    [giayLine3 + ddata]: 0,
    [phutLine3 + ddata]: 0,
    [gioLine3 + ddata]: 0
}
timeLine4 = {
    [giayLine4 + ddata]: 0,
    [phutLine4 + ddata]: 0,
    [gioLine4 + ddata]: 0
}
var k1 = 0;
var k2 = 0;
var k3 = 0;
var k4 = 0;
var dd = new Date();
var day1st = dd.getDate();
var month1st = dd.getMonth();
var oldDay = day1st;
var oldMonth = month1st;

// TimeRunning
async function TimeRunning() {
    var d = new Date();
    var day = d.getDate();
    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    var month = d.getMonth();

    if (oldDay != day) {
        oldDay = day;
        console.log("New day: " + day);
        timeLine1["giayLine1_" + day] = 0;
        timeLine1["phutLine1_" + day] = 0;
        timeLine1["gioLine1_" + day] = 0;
        timeLine2["giayLine2_" + day] = 0;
        timeLine2["phutLine2_" + day] = 0;
        timeLine2["gioLine2_" + day] = 0;
        timeLine3["giayLine3_" + day] = 0;
        timeLine3["phutLine3_" + day] = 0;
        timeLine3["gioLine3_" + day] = 0;
        timeLine4["giayLine4_" + day] = 0;
        timeLine4["phutLine4_" + day] = 0;
        timeLine4["gioLine4_" + day] = 0;
        await Updatedata(timeLine1);
        await Updatedata(timeLine2);
        await Updatedata(timeLine3);
        await Updatedata(timeLine4);
    }
    if (month != oldMonth) {
        oldMonth = month;
        for (var i = 1; i <= 31; i++) {
            timeLine1["giayLine1_" + i] = 0;
            timeLine1["phutLine1_" + i] = 0;
            timeLine1["gioLine1_" + i] = 0;
            timeLine2["giayLine2_" + i] = 0;
            timeLine2["phutLine2_" + i] = 0;
            timeLine2["gioLine2_" + i] = 0;
            timeLine3["giayLine3_" + i] = 0;
            timeLine3["phutLine3_" + i] = 0;
            timeLine3["gioLine3_" + i] = 0;
            timeLine4["giayLine4_" + i] = 0;
            timeLine4["phutLine4_" + i] = 0;
            timeLine4["gioLine4_" + i] = 0;
            Updatedata(timeLine1);
            Updatedata(timeLine2);
            Updatedata(timeLine3);
            Updatedata(timeLine4);
        }
    } else {
        try {
            // console.log(datamqtt[0]["giayLine4_" + day]);
            timeLine1["phutLine1_" + day] = datamqtt[0]["phutLine1_" + day];
            timeLine1["gioLine1_" + day] = datamqtt[0]["gioLine1_" + day];

            timeLine2["phutLine2_" + day] = datamqtt[0]["phutLine2_" + day];
            timeLine2["gioLine2_" + day] = datamqtt[0]["gioLine2_" + day];

            timeLine3["phutLine3_" + day] = datamqtt[0]["phutLine3_" + day];
            timeLine3["gioLine3_" + day] = datamqtt[0]["gioLine3_" + day];

            timeLine4["phutLine4_" + day] = datamqtt[0]["phutLine4_" + day];
            timeLine4["gioLine4_" + day] = datamqtt[0]["gioLine4_" + day];
            //Line 1
            var dataLine1 = datamqtt[0].DataLine1RoEDI._RO_PRESSURE_PUMP_1;
            if (dataLine1 == 1) {
                console.log("True");
                k1++;
                timeLine1["giayLine1_" + day] = k1;
                await Updatedata(timeLine1);

                if (timeLine1["giayLine1_" + day] >= 60) {
                    k1 = 0;
                    k1++;
                    timeLine1["giayLine1_" + day] = k1;
                    timeLine1["phutLine1_" + day] += 1;
                    await Updatedata(timeLine1);

                    if (timeLine1["phutLine1_" + day] >= 60) {
                        timeLine1["phutLine1_" + day] = 0;
                        timeLine1["gioLine1_" + day] += 1;
                        await Updatedata(timeLine1);
                    }
                }
            } else if (dataLine1 == false) {
                console.log("False");
            }

            //Line 2
            var dataLine2 = datamqtt[0].DataLine1RoEDI._RO_PRESSURE_PUMP_3;
            if (dataLine2 == 1) {
                console.log("True");
                k2++;
                timeLine2["giayLine2_" + day] = k2;
                await Updatedata(timeLine2);

                if (timeLine2["giayLine2_" + day] >= 60) {
                    k2 = 0;
                    k2++;
                    timeLine2["giayLine2_" + day] = k2;
                    timeLine2["phutLine2_" + day] += 1;
                    await Updatedata(timeLine2);

                    if (timeLine2["phutLine2_" + day] >= 60) {
                        timeLine2["phutLine2_" + day] = 0;
                        timeLine2["gioLine2_" + day] += 1;
                        await Updatedata(timeLine2);
                    }
                }
            } else if (dataLine2 == false) {
                console.log("False");
            }
            //Line 3
            var dataLine3 = datamqtt[0].dataLineRO2.Pump_A_RO_HP;
            if (dataLine3 == 1) {
                console.log("True");
                k3++;
                timeLine3["giayLine3_" + day] = k3;
                await Updatedata(timeLine3);

                if (timeLine3["giayLine3_" + day] >= 60) {
                    k3 = 0;
                    k3++;
                    timeLine3["giayLine3_" + day] = k3;
                    timeLine3["phutLine3_" + day] += 1;
                    await Updatedata(timeLine3);

                    if (timeLine3["phutLine3_" + day] >= 60) {
                        timeLine3["phutLine3_" + day] = 0;
                        timeLine3["gioLine3_" + day] += 1;
                        await Updatedata(timeLine3);
                    }
                }
            } else if (dataLine3 == false) {
                console.log("False");
            }
            //Line 4
            var dataLine4 = datamqtt[0].dataLineRO2.Pump_B_RO_HP;
            if (dataLine4 == 1) {
                console.log("True");
                k4++;
                timeLine4["giayLine4_" + day] = k4;
                await Updatedata(timeLine4);

                if (timeLine4["giayLine4_" + day] >= 60) {
                    k4 = 0;
                    k4++;
                    timeLine4["giayLine4_" + day] = k4;
                    timeLine4["phutLine4_" + day] += 1;
                    await Updatedata(timeLine4);

                    if (timeLine4["phutLine4_" + day] >= 60) {
                        timeLine4["phutLine4_" + day] = 0;
                        timeLine4["gioLine4_" + day] += 1;
                        await Updatedata(timeLine4);
                    }
                }
            } else if (dataLine4 == false) {
                console.log("False");
            }
        } catch { }
    }
}
