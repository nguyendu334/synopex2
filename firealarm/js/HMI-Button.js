//#region  create tag

function customTag(tagName, fn) {
    document.createElement(tagName);
    var tagInstances = document.getElementsByTagName(tagName);
    for (var i = 0; i < tagInstances.length; i++) {
        fn(tagInstances[i]);
    }
}

function BUT(element) {
    var canvas = document.createElement("button");
    var _Value = true;
    canvas.style.width = element.attributes.width.value;
    canvas.style.height = element.attributes.height.value;
    var Oncolor = element.attributes.Oncolor.value;
    var Offcolor = element.attributes.Offcolor.value;
    var Ontext = element.attributes.Ontext.value;
    var Offtext = element.attributes.Offtext.value;

    try {
        _Value =element.attributes.value.value=="false"?false:true;
    } catch (error) {

    }
    element.VALUE = new DATABut(_Value, canvas, Ontext, Oncolor, Offtext, Offcolor);
    element.appendChild(canvas);
    element.VALUE.setValue = _Value;
}
//#endregion
class DATABut {
    constructor(height, ele, _ontext, _oncolor, _offtext, _offcolor) {
        this.val = height;
        this.button = ele;
        this.Ontext = _ontext;
        this.Oncolor = _oncolor;
        this.Offtext = _offtext;
        this.Offcolor = _offcolor;
    };
    get getValue() {
        return this.val;
    };
    set setValue(val) {
        this.val = val;
        Draw_but(this.button, this.val, this.Ontext, this.Oncolor, this.Offtext, this.Offcolor);
    };

}

customTag("HMI-BUTTON", BUT);


//#region risgister
function Draw_but(can, va, _ontext, _oncolor, _offtext, _offcolor) {
    var button = can;
    if (va) {
        button.innerHTML = _ontext;
        button.style.backgroundColor = _oncolor;
    } else {
        button.innerHTML = _offtext;
        button.style.backgroundColor = _offcolor;
    }






};

//#endregion