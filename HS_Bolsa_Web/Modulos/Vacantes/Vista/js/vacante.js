var idVacante=0;

function inicio() {
    var cve_vacante = getUrlVars()["id"] || "0";
    idVacante = cve_vacante;
    mostrarInfo();
}

function mostrarInfo() {
    $.post("../Controlador/Vacantes.aspx", { seccion: "Vacante", op: "mostrarVacante", vacanteId: idVacante }).done(function (xmlDoc) {
        var info = xmlDoc.getElementsByTagName("Table");
        var div = document.getElementById("bookjobs");

        for (var j = 0; j < info.length; j++) {

            var cve_solicitudvacante = GetValor(info[j], "cve_solicitudvacante");
            var NombreVacante = GetValor(info[j], "NombreVacante");
            var fechaSolicitud = GetValor(info[j], "fechaSolicitud");
            var sal = GetValor(info[j], "salario");
            var nombreestado = GetValor(info[j], "nombreestado");
            var nombreciudad = GetValor(info[j], "nombreciudad");
            var detail = GetValor(info[j], "detalle");
            var horario = GetValor(info[j], "horario");
            var HTML = GetValor(info[j], "HTML");

            document.getElementById("titulo").innerHTML = NombreVacante;
            document.getElementById("detalle").innerHTML = detail;
            document.getElementById("ciudad").innerHTML = nombreciudad;
            document.getElementById("estado").innerHTML = nombreestado;
            document.getElementById("horario").innerHTML = horario;
            document.getElementById("salario").innerHTML = sal;
        }
        var iframeElementContainer = document.getElementById('perfil').contentDocument;
        iframeElementContainer.open();
        iframeElementContainer.writeln(HTML);
        iframeElementContainer.close();


    });
}

function aplicar() {
    var firmado = window.parent.session.firmado();
    var registroCompleto = window.parent.session.usuario.registroCompleto;
    var ir = "";
    if (firmado == true) {
        if (registroCompleto == true) {
            $.ajaxSetup({ async: false });
            $.post("../Controlador/Vacantes.aspx", { seccion: "Vacante", op: "aplicar", vacanteId: idVacante }).done(function (xmlDoc) {
                var estatus = GetValor(xmlDoc, "estatus");
                var mensaje = GetValor(xmlDoc, "mensaje");
                if (estatus == 1) {
                    ir = 'aplicar';
                }
                else {
                    alert(mensaje);
                    ir = 'registro';
                }
            });
        } else {
            alert("Por favor completa tu registro");
            ir = 'registro';
        }
    } else {
        alert("Por favor ingresa tu usuario o registrate");
        ir = 'registro';
    }
    window.parent.llamaPagina(ir)
}