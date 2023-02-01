var old = 0;
function check(){
    var d = new Date();
    var day = d.getDate();
    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();

    if (m != old){
        old = m;
        console.log("Change Date!");
    }
    console.log(s);
}
setInterval(check,1000);