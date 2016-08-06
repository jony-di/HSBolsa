function inico() {
    bucarVacantes('');
 }

 function bucarVacantes(buscar) {
     var criterio = buscar || "";
    $("#bookjobs").empty();

    $.post("../Controlador/Vacantes.aspx", { seccion: "Vacantes", op: "mostrarVacantes", criterio: criterio }).done(function (xmlDoc) {
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

            var field = document.createElement("div");
            field.className = "jobcar";

            var cabeza = document.createElement("div");
            cabeza.className = "section";

            var titulo = document.createElement("span");
            titulo.className = "titlejob";
            titulo.innerHTML = "<a href='#' onclick='verVacante(" + cve_solicitudvacante + ")'>" + NombreVacante + "</a>";

            var fecha = document.createElement("span");
            fecha.className = "datejob";
            fecha.innerHTML = fechaSolicitud;

            cabeza.appendChild(titulo);
            cabeza.appendChild(fecha);

            var cuerpo = document.createElement("div");
            cuerpo.className = "section";

            var detalle = document.createElement("span");
            detalle.className = "jobdetail";
            detalle.innerHTML = detail;

            var salario = document.createElement("span");
            salario.className = "jobpay";
            salario.innerHTML = sal;

            cabeza.appendChild(detalle);
            cabeza.appendChild(salario);

            var pie = document.createElement("div");
            pie.className = "section";

            var ciudad = document.createElement("span");
            ciudad.className = "jobcity";
            ciudad.innerHTML = nombreciudad;

            var estado = document.createElement("span");
            estado.className = "jobcompany";
            estado.innerHTML = nombreestado;

            pie.appendChild(ciudad);
            pie.appendChild(estado);
            field.appendChild(cabeza);
            field.appendChild(cuerpo);
            field.appendChild(pie);

            div.appendChild(field);
            
        }
    });
}

function verVacante(id) {
    var uri = "Modulos/Vacantes/Vista/vacante.html?id=" + id
    parent.document.getElementById("frmDirecciones").setAttribute("src", uri)
}