$(document).ready(function () {
    $("input,select,textarea").focus(function () {
        $("label[for='" + $(this).attr("id") + "']:not(.error)").addClass("active");
    });

    $("input,select,textarea").blur(function () {
        if (!$(this).val()) {
            $("label[for='" + $(this).attr("id") + "']:not(.error)").removeClass("active");
        }
    });

   

});

function guardar() {
    var frmNuevo = document.getElementById("register-form");
    var parametros = $(frmNuevo).serialize();
    $.post("../Controlador/Registro.aspx", "op=nuevo&seccion=registo&" + parametros).done(function (xmlDoc) {
        var estatus = GetValor(xmlDoc, "estatus");
        var mensaje = GetValor(xmlDoc, "mensaje");
        if (estatus == 1) {
            var formulario = document.getElementById("formulario");
            var confimar = document.getElementById("Confirm");
            var txtmali = document.getElementById("email").value;
            
            var host = txtmali.split("@");
            document.getElementById("email_confim").innerHTML = txtmali;
            document.getElementById("spmtpop").innerHTML = host[1];
            document.getElementById("btnGoto").setAttribute("onClick", "redireccionar('http://www." + host[1] + "')");
            formulario.className = "ocultar";
            confimar.className = "mostrar";
        }
        else {
            alert(mensaje);
            $("#enviar").show();
            window.location.reload();
        }
    });
}

function redireccionar(url) {
    window.parent.document.location.replace(url);
    //window.parent.open(url,"_blanck");
}