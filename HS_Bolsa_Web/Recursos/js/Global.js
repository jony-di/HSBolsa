

$(function () {
    window.onresize();
});

window.onresize = function () {
    var scrollables = $(".scrollable");
    var alturaWindow = $(window).innerHeight();
    var framesVentanas = $("iframe.ventana");
    var i;
    for (i = 0; i < framesVentanas.length; i++) {
        framesVentanas[i].style.height = $(window).innerHeight() + "px";
    }
    for (i = 0; i < scrollables.length; i++) {
        scrollables[i].style.height = (alturaWindow - parseInt(scrollables[i].getAttribute("offset"), 10)) + "px";
    }
}


function SetValor(domXML, tag, idDomElemento, tipo, alias) {
    var valor = "";
    var domElemento = document.getElementById(idDomElemento);
    if (domElemento) {
        try { valor = $(domXML).find(tag)[0].textContent; } catch (e) { }
        if (tipo === "bool") {
            valor = valor.toString();
            if (alias) {
                valor = valor == "true" ? alias.split(":")[0] : alias.split(":")[1];
            }
        }
        else if (tipo === "date") {
            var meses = ["",
                "Ene", "Feb", "Mar",
                "Apr", "May", "Jun", "Jul",
                "Ago", "Sep", "Oct",
                "Nov", "Dic"
            ];
            var data = valor.split("/");
            var fechas = new Date(data[2], data[1], data[0]);
            valor = fechas.getDate() + '/' + meses[fechas.getMonth()] + '/' + fechas.getFullYear();
        }
        if (domElemento.tagName === "INPUT") {
           if (domElemento.type === "checkbox") {
                if (valor === "true") {
                    domElemento.setAttribute("checked", "checked");
                }
                else
                { domElemento.removeAttribute("checked"); }
            }
            else { domElemento.value = valor; }
        }
        else if (domElemento.tagName === "TEXTAREA") {
            domElemento.value = valor;
        } else if (domElemento.tagName === "SELECT") {
            var opciones = domElemento.options;
            for (var i = 0; i < opciones.length; i++) {
                if (opciones[i].value.toString() === valor.toString()) {
                    domElemento.selectedIndex = i
                }
            }
        } else {
            domElemento.innerHTML = valor;
        }
    }
    else { console.error("No se encontro el objeto"); }
    return valor
}


function GetValor(domXML, tag, tipo, alias) {
    var valor = "";
    if (tipo == "longstring"){
        try {
            valor = $(domXML).find(tag)[0].textContent;
        } catch (e) { }
    } else {
        try {
            valor = domXML.getElementsByTagName(tag)[0].childNodes[0].nodeValue;
        } catch (e) { }
    }
    if (tipo === "bool") {
        if (alias !== undefined) {
            if (valor.toString() === "true" || valor.toString() === "1") {
                valor = alias.split(":")[0];
            } else { valor = alias.split(":")[1]; }

        } else {
            valor = (valor == 1);
        }
    }
    else if (tipo === "date") {
        var meses = ["",
            "Ene", "Feb", "Mar",
            "Apr", "May", "Jun", "Jul",
            "Ago", "Sep", "Oct",
            "Nov", "Dic"
        ];
        var data = valor.split("/");
        var fechas = new Date(data[2], data[1], data[0]);
        valor = fechas.getDate() + '/' + meses[fechas.getMonth()] + '/' + fechas.getFullYear().toString();
    }
    return valor.toString();
}

function mapURI(pasadaLiga) {
    var vars = [], hash;
    var hashes = [];
    var firmado = session.firmado();
    var registroCompleto = session.usuario.registroCompleto;
    hashes.push("vacantes=Modulos/Vacantes/Vista/vacantes.html");
    hashes.push("info=Info.html");
    hashes.push("=" + pasadaLiga);

    firmado == true ? hashes.push("validado=Modulos/Vacantes/Vista/vacantes.html") : hashes.push("validado=Modulos/Registro/Vista/validacion.html");
    firmado == true ? registroCompleto == true ? hashes.push("registro=Modulos/Candidatos/Vista/Pefil.html") : hashes.push("registro=Modulos/Registro/Vista/frmBase.html") : hashes.push("registro=Modulos/Registro/Vista/Registro.html");
    firmado == true ? hashes.push("default=Modulos/Vacantes/Vista/vacantes.html") : hashes.push("default=Default.html");
    firmado == true ? hashes.push("cambio=Modulos/Seguridad/Vista/cambio.html") : hashes.push("cambio=Default.html");
    firmado == true ? hashes.push("pefil=Modulos/Candidatos/Vista/Pefil.html") : hashes.push("pefil=Modulos/Registro/Vista/Registro.html");
    firmado == true ? hashes.push("aplicar=Modulos/Vacantes/Vista/frmAplicar.html") : hashes.push("aplicar=Default.html");
    firmado == true ? hashes.push("examenes=Modulos/Examenes/Vista/Examenes.html?cve_puesto=1&cve_examen=2") : hashes.push("examenes=Modulos/Registro/Vista/Registro.html");
    

    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
        for (var j = 2; j < hash.length; j++) {
            vars[hash[0]] += "=" + hash[j];
        }
    }
    return vars;
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function LlenarSelect(url, idSelect, leyenda, clave, descripcion, callback) {
    var selectUI;
    
    if (idSelect) {
        selectUI = document.getElementById(idSelect);
    } else {
        selectUI = document.createElement("select");
    }
    
    if (selectUI) {
        selectUI.innerHTML = "";
        var optionitem = document.createElement("option");
        optionitem.innerHTML = leyenda;
        optionitem.value = "";
        selectUI.appendChild(optionitem);
        $.post(url).done(function (xmlDoc) {
            var departamento = xmlDoc.getElementsByTagName("Table");
            for (var i = 0; i < departamento.length; i++) {
                var optionite = document.createElement("option");
                optionite.innerHTML = GetValor(departamento[i], descripcion);
                optionite.title = GetValor(departamento[i], descripcion);
                optionite.value = GetValor(departamento[i], clave);
                selectUI.appendChild(optionite);
            }
            if (callback) {
                callback(selectUI);
            }
        });
    }
    
}

function SoloNumerosEnteros(e) {
    var key = window.Event ? e.which : e.keyCode;
    return ((key >= 48 && key <= 57) || key == 8 || key == 127);
}

function SoloNumeros(e) {
    var key = window.Event ? e.which : e.keyCode;
    return ((key >= 48 && key <= 57) || key == 46 || key == 8 || key == 127);
}

Number.prototype.formatMoney = function (decPlaces, thouSeparator, decSeparator) {
    var n = this,
        decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
        decSeparator = decSeparator == undefined ? "." : decSeparator,
        thouSeparator = thouSeparator == undefined ? "," : thouSeparator,
        sign = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
};