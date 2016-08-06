var max_file_size = 2070000;
var bolean = false;
var _Escuelas = 0;
var _Trabajos = 0;
$(document).ready(function () {
    
    $("#add-Job").click(function () {
        $('#updatebox').bPopup({
            modalColor: 'lightGrey',
            modalClose: true,
            speed: 450,
            transition: 'slideDown',
            amsl: 50,
            transitionClose: 'slideUp',
            scrollBar: true
        });
    });

    $("#add-college").click(function () {
        $('#updatebox2').bPopup({
            modalColor: 'lightGrey',
            modalClose: true,
            speed: 450,
            transition: 'slideDown',
            amsl: 50,
            transitionClose: 'slideUp',
            scrollBar: true
        });
    });

    $("#fechaNacimiento").datepicker({
        dateFormat: 'dd/M/yy',
        changeMonth: true,
        changeYear: true,
        yearRange: '-90:+0',
        minDate: '-60Y',
        maxDate: '-16Y',
        onSelect: function () { $(this).focus(); }
    });

    $("#fchIngreso").datepicker({
        dateFormat: 'dd/M/yy',
        changeMonth: true,
        changeYear: true,
        yearRange: '-90:+0',
        minDate: '-60Y',
        maxDate: '-1M',
        onSelect: function () { $(this).focus(); }
    });

    $("#fchSalida").datepicker({
        dateFormat: 'dd/M/yy',
        changeMonth: true,
        changeYear: true,
        showButtonPanel: true,
        closeText: "Trabajo actual",
        yearRange: '-90:+0',
        minDate: '-60Y',
        maxDate: '-1D',
        onSelect: function () { $(this).focus(); bolean = true; },
        onClose: function (selectedDate) {
            if (bolean === false) { $(this).val(""); selectedDate = "" }
            if (selectedDate === "") {
                $(this).val("Trabajo actual").focus();
            }
            bolean = false;
        }
    });

    $("#ingrezo").datepicker({
        dateFormat: 'dd/M/yy',
        changeMonth: true,
        changeYear: true,
        yearRange: '-90:+0',
        minDate: '-60Y',
        maxDate: '-1M',
        onSelect: function () { $(this).focus(); }
    });

    $("#termino").datepicker({
        dateFormat: 'dd/M/yy',
        changeMonth: true,
        changeYear: true,
        showButtonPanel: true,
        closeText: "Estudiando actualmente",
        yearRange: '-90:+0',
        minDate: '-60Y',
        maxDate: '-1D',
        onSelect: function () { $(this).focus(); bolean = true; },
        onClose: function (selectedDate) {
            if (bolean === false) { $(this).val(""); selectedDate = "" }
            if (selectedDate === "") {
                $(this).val("Estudiando actualmente").focus();
            }
            bolean = false;
        }
    });

    $("#fechaLiberacion").datepicker({
        dateFormat: 'dd/M/yy',
        changeMonth: true,
        changeYear: true,
        minDate: '-60Y',
        maxDate: -1,
        onSelect: function () { $(this).focus(); }
    });

    $("#fechaFin").datepicker({
        dateFormat: 'dd/M/yy',
        changeMonth: true,
        changeYear: true,
        minDate: '-45Y',
        maxDate: 60,
        onSelect: function () { $(this).focus(); }
    });

    $("#fechaIni").datepicker({
        dateFormat: 'dd/M/yy',
        changeMonth: true,
        changeYear: true,
        minDate: '-50Y',
        maxDate: -1,
        onSelect: function () { $(this).focus(); }
    });

    $("#fechaEnfermedad").datepicker({
        dateFormat: 'dd/M/yy',
        changeMonth: true,
        changeYear: true,
        minDate: '-60Y',
        maxDate: -1,
        onSelect: function () { $(this).focus(); }
    });

    document.getElementById('foto').addEventListener('change', handleFileSelect, false);
    document.getElementById('CV_DOC').addEventListener('change', validaArchivo, false);

    //LlenarSelect("../Controlador/Registro.aspx?seccion=filtros&op=obtenerNacionalidades","pais","","cve_Nacionalidad","Nacionalidad"});    
    LlenarSelect("../Controlador/Registro.aspx?seccion=filtros&op=obtenerEstados", "estado", "", "Clave", "Nombre",
        function () {
            LlenarSelect("../Controlador/Registro.aspx?seccion=filtros&op=obtenerSexos", "sexo", "", "Clave", "descripcion",
            function () {
                LlenarSelect("../Controlador/Registro.aspx?seccion=filtros&op=obtenerEstadoCivil", "civil", "", "Clave", "descripcion",
                function () {
                    LlenarSelect("../Controlador/Registro.aspx?seccion=filtros&op=obtenerNivelEscolar", "Nivelestudios", "", "Clave", "descripcion",
                    function () {
                        LlenarSelect("../Controlador/Registro.aspx?seccion=filtros&op=obtenerEstadoEstudios", "SituacionEstudios", "", "Clave", "descripcion",
                        function () {
                            LlenarSelect("../Controlador/Registro.aspx?seccion=filtros&op=obtenerAreas", "arealExp", "", "Clave", "descripcion",
                            function () {
                                LlenarSelect("../Controlador/Registro.aspx?seccion=filtros&op=obtenerAniosExp", "anios", "", "Clave", "detalle", function () { PintarDatos(); });
                            });
                        });
                    });
                });
            });
        });
});

function PintarDatos() {
    $.post("../Controlador/Registro.aspx", "op=obtenerTodo&seccion=frmBase").done(function (xmlDoc) {
        var info = xmlDoc.getElementsByTagName("Table")[0];
        var div = document.getElementById("lst-Trabajos");
        var verPerfil = GetValor(info, "verPerfil");
        $(div).empty();
        if (verPerfil === "true") {
            var cve_estado = SetValor(info, "cve_estado", "estado");
            llenarMunicipios(cve_estado, GetValor(info, "cve_municipio", "municipio"));
            SetValor(info, "cve_pais", "pais");
            SetValor(info, "CP", "cp");
            SetValor(info, "cve_sexo", "sexo");
            SetValor(info, "cve_estadoCivil", "civil");
            SetValor(info, "FechaNacimiento", "fechaNacimiento", "date");
            SetValor(info, "Telefonos", "tel");
            SetValor(info, "Titulo", "resumetitle");
            SetValor(info, "cve_Area", "arealExp");
            SetValor(info, "cve_AniosExp", "anios");
            SetValor(info, "municipio", "municipio");
            $("input,select,textarea").each(function (index) {
                $("label[for='" + $(this).attr("id") + "']:not(.error)").addClass("active");
            });
            obtenerReferenciasLaborales();
            obtenerEscolaridad();
        }
    });
}

function llenarMunicipios(estado,cve_municipio) {
    //var estado=paisestado.split("-");
    LlenarSelect("../Controlador/Registro.aspx?seccion=filtros&op=obtenerMunicipios&estado=" + estado, "municipio", "", "cve_municipio", "nombremuni", function (xmlDoc) {
        if (cve_municipio) {
            $("#municipio").val(cve_municipio);
        }
    });
}

function siguientePaso() {
    var obg = $("div.actual");
    $(obg).next().addClass("actual");
    $(obg).removeClass("actual");
    obg = $("fieldset.mostrar");
    $(obg).next().addClass("mostrar");
    $(obg).next().removeClass("ocultar");
    $(obg).removeClass("mostrar");
    $(obg).addClass("ocultar");
}

function atras() {
    var obg = $("div.actual");
    $(obg).prev().addClass("actual");
    $(obg).removeClass("actual");
    obg = $("fieldset.mostrar");
    $(obg).prev().addClass("mostrar");
    $(obg).prev().removeClass("ocultar");
    $(obg).removeClass("mostrar");
    $(obg).addClass("ocultar");
}

function gardarDatos() {
    var parametros = $("#frmGenerales").serialize();
    $.post("../Controlador/Registro.aspx", "op=gardarDatosGenerales&seccion=frmBase&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        if (estatus === "1") {
            siguientePaso();
        }
        else {
            alert(mensaje);
        }
    });
}

function gardarDocumentos() {
    var Foto = document.getElementById("foto");
    var CV_DOC = document.getElementById("CV_DOC");
    var formData = new FormData();
    var file = Foto.files[0];
    var file2 = CV_DOC.files[0];
    formData.append("foto", file);
    formData.append("CV", file2);
    $.ajax({
        type: "POST",
        url: "../Controlador/Registro.aspx?op=archivos&seccion=frmBase",
        data: formData,
        contentType: false,
        processData: false,
        success: function () {
            window.parent.session.usuario.registroCompleto = true;
            window.parent.session.usuario.getFoto();
            window.parent.llamaPagina('registro');
            console.log("ok");
        },
        error: function (result) {
            console.log("FAILED");
            console.log(result);
        }
    });
}

function guadarDatosLaborales() {
    if (_Trabajos > -1) {
        var parametros = $("#DatosLaborales").serialize();
        $.post("../Controlador/Registro.aspx", "op=DatosLaborales&seccion=frmBase&" + parametros).done(function (xmlDoc) {
            var estatus = GetValor(xmlDoc, "estatus");
            var mensaje = GetValor(xmlDoc, "mensaje");
            if (estatus === "1") {
                siguientePaso();
            }
            else {
                alert(mensaje);
            }
        });
    }
    else { alert("Por favor ingresa tus ultimos trabajos"); }
}

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {
        if (f.size < max_file_size) {
            // Only process image files.
            if (!f.type.match('image.*')) {
                continue;
            }
            var reader = new FileReader();
            // Closure to capture the file information.
            reader.onload = (function () {
                return function (e) {
                    // Render thumbnail.
                    document.getElementById('imagen').setAttribute("src", e.target.result)
                };
            })(f);
            // Read in the image file as a data URL.
            reader.readAsDataURL(f);
        }
        else {
            alert("El archivo sobrepasa de los 2MB")
            return false;
        }
    }
}

function validaArchivo(evt) {
    var files = evt.target.files;
    //max_file_size = 2300000;
    for (var i = 0, f; f = files[i]; i++) {
        //var ext = f.name.split(".");
        
        if (f.size < max_file_size) {
            if (!f.type.match('application/vnd.openxmlformats-officedocument.wordprocessingml.document') /*&& !f.type.match('application/msword')*/) {
                alert("Tu CV deve de estar en un archivo de Word 2010 o Superior");
                return false;
            }
//            else if (ext[ext.length - 1].toUpperCase() !== "DOCX") {
//                alert("Tu CV deve de estar en un archivo de Word 2010 o Superior");
//                return false;
//            }
        }else {
            alert("El archivo sobrepasa de los 2MB")
            return false;
        }
        $("#pathfile").val(f.name);
    }
}

function guadarReferenciaLaboral() {
    var frmEmpresas = document.getElementById("frmEmpresas");
    var parametros = $(frmEmpresas).serialize();
    $.post("../Controlador/Registro.aspx", "op=guardarReferenciaLaboral&seccion=frmBase&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        if (estatus === "1") {
            frmEmpresas.reset();
            obtenerReferenciasLaborales();
            $('#updatebox').bPopup().close();
        }
        else {
            alert(mensaje);
        }
    });
}

function obtenerReferenciasLaborales() {
    $.post("../Controlador/Registro.aspx", "op=obtenerReferenciasLaborales&seccion=frmBase").done(function (xmlDoc) {
        var info = xmlDoc.getElementsByTagName("Table");
        var div = document.getElementById("lst-Trabajos");
        $(div).empty();
        _Trabajos = info.length;
        for (var j = 0; j < info.length; j++) {

            var cve = GetValor(info[j], "Clave");
            var Empresa = GetValor(info[j], "NombreCompania");
            var Puesto = GetValor(info[j], "Puesto");
            var Fecha = GetValor(info[j], "Fecha");
            var tabajos = document.createElement("div");
            var nombreEmpresa = document.createElement("div");
            var Cuerpo = document.createElement("div");
            var fin = document.createElement("div");
            var btn = document.createElement("span");

            nombreEmpresa.innerHTML = "<h2>" + Empresa + "</h2>";
            Cuerpo.innerHTML = "<p>" + Puesto + "<br/>" + Fecha + "</p>"
            tabajos.className = "tabajos";
            btn.className = "icon-bin";
            btn.setAttribute("onclick", "quitarReferenciaLaboral('" + cve + "')")
            fin.appendChild(btn);
            tabajos.appendChild(nombreEmpresa);
            tabajos.appendChild(Cuerpo);
            tabajos.appendChild(fin);
            div.appendChild(tabajos);
        }
    });
}

function quitarReferenciaLaboral(cve) {
    $.post("../Controlador/Registro.aspx", "op=quitarReferenciaLaboral&seccion=frmBase&cve=" + cve).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        if (estatus === "1") {
            obtenerReferenciasLaborales();
        }
        else {
            alert(mensaje);
        }
    });
}

function gardarEscolaridad() {
    var frmEmpresas = document.getElementById("frmAcademico");
    var parametros = $(frmEmpresas).serialize();
    $.post("../Controlador/Registro.aspx", "op=gardarEscolaridad&seccion=frmBase&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        if (estatus === "1") {
            frmEmpresas.reset();
            obtenerEscolaridad();
            $('#updatebox2').bPopup().close();
        }
        else {
            alert(mensaje);
        }
    });
}

function obtenerEscolaridad() {
    $.post("../Controlador/Registro.aspx", "op=obtenerEscolaridad&seccion=frmBase").done(function (xmlDoc) {
        var info = xmlDoc.getElementsByTagName("Table");
        var div = document.getElementById("lst-Escuelas");
        $(div).empty();
        _Escuelas = info.length;
        for (var j = 0; j < info.length; j++) {
            var cve = GetValor(info[j], "Clave");
            var Empresa = GetValor(info[j], "Institucion");
            var Puesto = GetValor(info[j], "TituloRecibido");
            var Fecha = GetValor(info[j], "descripcion");
            var tabajos = document.createElement("div");
            var nombreEmpresa = document.createElement("div");
            var Cuerpo = document.createElement("div");
            var fin = document.createElement("div");
            var btn = document.createElement("span");

            nombreEmpresa.innerHTML = "<h2>" + Empresa + "</h2>";
            Cuerpo.innerHTML = "<p>" + Puesto + "<br/>" + Fecha + "</p>"
            tabajos.className = "tabajos";
            btn.className = "icon-bin";
            btn.setAttribute("onclick", "quitarEscuela('" + cve + "')")
            fin.appendChild(btn);
            tabajos.appendChild(nombreEmpresa);
            tabajos.appendChild(Cuerpo);
            tabajos.appendChild(fin);
            div.appendChild(tabajos);
        }
    });
    
}

function quitarEscuela(cve) {
    $.post("../Controlador/Registro.aspx", "op=quitarEscuela&seccion=frmBase&cve=" + cve).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        if (estatus === "1") {
            obtenerEscolaridad();
        }
        else {
            alert(mensaje);
        }
    });
}

function gardarHistorial() {
    if (_Escuelas > 0) {
        siguientePaso();
    } else {
        alert("Por favor Ingresa tu ultimo nivel de estudios");
    }
}