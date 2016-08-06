var urlBase_WS = "/Modulos/Examenes/Controlador/";
var Preguntas = function () { }
var Respuestas = function () { }
function MostrarNuevoExamen() {
    var frmExamen = document.getElementById("frmNuevoExamen");
    frmExamen.esEditar = false;
    frmExamen.reset();
    $.post(urlBase_WS + "NExamenes.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "cve_examen", "cve_examen");
    });
    MostrarFormulario();
}

function iniciar(){
    var cve_puesto = getUrlVars().cve_puesto || undefined;
    document.getElementById("cve_puesto").setAttribute("value",cve_puesto);
    CargarCatalogoExamenes(cve_puesto);
}

function VerExamen(cve_examen){
    $.post("../Controlador/Examenes.aspx", { op: "ObtenerExamen", seccion: "Examen", cve_examen: cve_examen }).done(function (xmlDoc) {
        document.getElementById("cve_examen").setAttribute("value",cve_examen);
        document.getElementById("tableCatalogo").style.display = "none";
        document.getElementById("contenedorExamen").style.display = "block";
        var dbPreguntas = xmlDoc.getElementsByTagName("Pregunta");
        if (dbPreguntas.length > 0) {
            var listaPreguntas = document.getElementById("contenedorExamen");
            $(listaPreguntas).html("");
            var totalregistros; var divPregunta, cve_pregunta,stiporespuesta;
            for (var i = 0; i < dbPreguntas.length; i++) {
                cve_pregunta = GetValor(dbPreguntas[i], "cve_pregunta");
                stiporespuesta = GetValor(dbPreguntas[i], "stiporespuesta");
                divPregunta = Preguntas.CearUnaPregunta(
                      cve_examen
                    , cve_pregunta
                    , GetValor(dbPreguntas[i], "descripcion")
                    , GetValor(dbPreguntas[i], "puntaje")
                    , GetValor(dbPreguntas[i], "cve_tiporespuesta")
                    , GetValor(dbPreguntas[i], "secuencia")
                    , stiporespuesta
                );
                listaPreguntas.appendChild(divPregunta);
                var listaRespuestas = $(divPregunta).find(".wrap-respuestas")[0];
                var dbGruposRespuestas = dbPreguntas[i].getElementsByTagName("Agrupacion");
                if (new RegExp("abierta", "gi").test(GetValor(dbPreguntas[i], "stiporespuesta"))) {
                    var divRespuesta = document.createElement("div");
                    divRespuesta.className += " abierta";
                    divRespuesta.innerHTML += "<textarea name='resp_" + cve_examen + "_" + cve_pregunta + "_abierta'></textarea>";
                    listaRespuestas.appendChild(divRespuesta);
                } else if (dbGruposRespuestas.length > 0) {
                    if (new RegExp("agrupa", "gi").test(GetValor(dbPreguntas[i], "stiporespuesta"))) {
                        var listaColumnas = $(divPregunta).find(".columnas-pregunta")[0];
                        var olEtiquetas = document.createElement("ol");
                        var etiqueta;
                        var dbColRespuestas = dbPreguntas[i].getElementsByTagName("ColRespuesta");
                        for (var n = 0; n < dbColRespuestas.length; n++) {
                            olEtiquetas.appendChild(Preguntas.CrearUnaEtiqueta(GetValor(dbColRespuestas[n], "cve_examen"), GetValor(dbColRespuestas[n], "cve_pregunta"), GetValor(dbColRespuestas[n], "cve_etiqueta"), GetValor(dbColRespuestas[n], "etiqueta")));
                        }
                        listaColumnas.appendChild(olEtiquetas);
                    }
                    $(listaRespuestas).html("");
                    var divUnGrupo;
                    for (var k = 0; k < dbGruposRespuestas.length; k++) {
                        divUnGrupo = Respuestas.CrearUnGrupo(
                                 GetValor(dbGruposRespuestas[k], "cve_examen")
                                 , GetValor(dbGruposRespuestas[k], "cve_pregunta")
                                 , GetValor(dbGruposRespuestas[k], "cve_grupo")
                                 , GetValor(dbPreguntas[i], "cve_tiporespuesta")
                                 , GetValor(dbPreguntas[i], "stiporespuesta")
                        );
                        var totalregistros; var divRespuesta;
                        var dbRespuestas = dbGruposRespuestas[k].getElementsByTagName("Respuesta");
                        for (var j = 0; j < dbRespuestas.length; j++) {
                            divRespuesta = Respuestas.CearUnaRespuesta(
                                  GetValor(dbRespuestas[j], "cve_examen")
                                , GetValor(dbRespuestas[j], "cve_pregunta")
                                , GetValor(dbRespuestas[j], "cve_grupo")
                                , GetValor(dbRespuestas[j], "cve_respuesta")
                                , GetValor(dbRespuestas[j], "descripcion")
                                , GetValor(dbRespuestas[j], "descripcionpar")
                                , GetValor(dbPreguntas[i], "cve_tiporespuesta")
                                , GetValor(dbPreguntas[i], "stiporespuesta")
                            );
                            if (new RegExp("agrupa", "gi").test(GetValor(dbPreguntas[i], "stiporespuesta"))) {
                                $(divUnGrupo).find(".wrap-resp-grupo")[0].appendChild(divRespuesta);
                            } else {
                                listaRespuestas.appendChild(divRespuesta);
                            }
                        }
                        if (new RegExp("agrupa", "gi").test(GetValor(dbPreguntas[i], "stiporespuesta"))) {
                            listaRespuestas.appendChild(divUnGrupo);
                        }
                    }
                }
            }
        } else {
            document.getElementById('contenedorExamen').innerHTML = "<h3>Exámen sin contenido.</h3>";
        }
    });
}

Preguntas.CrearUnaEtiqueta = function (cve_examen, cve_pregunta, cve_etiqueta, etiqueta) {
    var liColumna = document.createElement("li");
    liColumna.className = "definicionRespuesta";
    liColumna.setAttribute("cve_examen", cve_examen);
    liColumna.setAttribute("cve_pregunta", cve_pregunta);
    liColumna.innerHTML =
        "<img class='editar' src='/Recursos/imagenes/eliminar.png' onclick='Preguntas.EliminarColumna(this.parentNode," + cve_examen + "," + cve_pregunta + "," + cve_etiqueta + ");'" + "/>" +
        "<label class='etiqueta'>" + etiqueta + "</label>";
    return liColumna;
}

Preguntas.EliminarColumna = function (objeto, cve_examen, cve_pregunta, cve_etiqueta) {
    if (confirm("Confirme que desea eliminar la columna:")) {
        $.post(urlBase_WS + "NExamenes.aspx", { op: "EliminarColumna", seccion: "Columnas", cve_examen: cve_examen, cve_pregunta: cve_pregunta, cve_columna: cve_etiqueta }).done(function (xmlDoc) {
            mostrarNotificacion(xmlDoc, "notificacion", function () {
                VerExamen(true);
            });
        });
    }
}

/*****************************************************************************************************************************************************************************/
function ObtenerCatalogoTiposPregunta(selectTipoPregunta, callback) {
    LlenarSelect(urlBase_WS + "NExamenes.aspx?op=ObtenerCatalogoTiposPregunta&seccion=Preguntas", undefined, "Tipo de pregunta", "cve_tipopregunta", "descripcion", function (selectLleno) {
        selectTipoPregunta.parentNode.replaceChild(selectLleno, selectTipoPregunta);
        if (callback) callback(selectLleno);
    });
}

function MostrarNuevoExamen() {
    var frmExamen = document.getElementById("frmNuevoExamen");
    frmExamen.esEditar = false;
    frmExamen.reset();
    $.post(urlBase_WS + "NExamenes.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "cve_examen", "cve_examen");
    });
    MostrarFormulario();
}

Preguntas.MostrarEditarPregunta = function (objeto, cve_examen, cve_pregunta, esAfter, esEditar, secuencia) {
    var frmPregunta = document.createElement("form");
    frmPregunta.className = "unaPregunta agrupacion";
    frmPregunta.target = "consola";
    frmPregunta.onsubmit = function () { return false; };
    frmPregunta.method = "post";
    frmPregunta.enctype = "multipart/form-data";
    frmPregunta.esEditar = esEditar;
    var descripcion, puntaje, tipopregunta;

    var parametros = { op: "DetallePregunta", seccion: "Preguntas", cve_examen: cve_examen, cve_pregunta: cve_pregunta };
    if (esAfter) {
        parametros = { op: "ClaveSiguientePregunta", seccion: "Preguntas", cve_examen: cve_examen };
    }
    $.post(urlBase_WS + "NExamenes.aspx", parametros).done(function (xmlDoc) {
        frmPregunta.innerHTML = '<span class="eliminar btnFormularios" onclick="Preguntas.CancelaEdicionPregunta(this.parentNode,' + cve_examen + "," + GetValor(xmlDoc, "cve_pregunta") + ')">x</span>' +
                          '<input name="cve_examen" type="hidden" value="' + cve_examen + '"/>' +
                          '<input name="cve_pregunta"  class="cve_pregunta" value="' + GetValor(xmlDoc, "cve_pregunta") + '"/>' +
                          '<input name="secuencia"  type="hidden" class="secuencia" value="' + secuencia + '"/>' +
                          '<textarea name="descripcion" class="descripcion" placeholder="Escriba aquí la pregunta.">' + GetValor(xmlDoc, "descripcion") + '</textarea>' +
                          '<input name="puntaje_pregunta" class="puntaje_pregunta" style="width:50px;float:left;margin-right:15px;" placeholder="Puntaje" value="' + GetValor(xmlDoc, "puntaje") + '"/>' +
                          '<input type="file" name="adjunto" />' +
                          '<select class="tipoPregunta" name="cve_tipopregunta"></select>' +
                          '<select class="tipoRespuesta" name="cve_tiporespuesta"></select>' +
                          '<button class="guardar btnFormularios" onclick="Preguntas.GuardarPregunta(this.parentNode)">Guardar</button>';
        if (typeof objeto == "string") {
            var contenedor = document.getElementById(objeto);
            contenedor.innerHTML = "";
            contenedor.appendChild(frmPregunta);
        } else if (esAfter) {
            var btnAgregarItem = $(objeto).find(".agregarItemExamen")[0];
            btnAgregarItem.style.display = "none";
            frmPregunta.btnAgregarItem = btnAgregarItem;
            $(frmPregunta).insertAfter(objeto);
        } else {
            objeto.parentNode.replaceChild(frmPregunta, objeto);
        }
        var selectTipoPregunta = $(frmPregunta).find("select.tipoPregunta")[0];
        ObtenerCatalogoTiposPregunta(selectTipoPregunta, function (selectCompleto) {
            selectCompleto.setAttribute("name", "cve_tipopregunta");
            selectCompleto.className = "tipoPregunta";
            SetValorDx(selectCompleto, GetValor(xmlDoc, "cve_tipopregunta"));
        });
        var selectTipoRespuesta = $(frmPregunta).find("select.tipoRespuesta")[0];
        ObtenerCatalogoTiposRespuesta(selectTipoRespuesta, function (selectCompleto) {
            selectCompleto.setAttribute("name", "cve_tiporespuesta");
            selectCompleto.className = "tipoRespuesta";
            SetValorDx(selectCompleto, GetValor(xmlDoc, "cve_tiporespuesta"));
        });
    });
}

Preguntas.CancelaEdicionPregunta = function (frmEdicion, cve_examen, cve_pregunta) {
    try { frmEdicion.btnAgregarItem.style.display = "inline" } catch (e) { }
    Preguntas.CambiarFormularioPorPregunta(frmEdicion, cve_examen, cve_pregunta);
}

Preguntas.GuardarPregunta = function (formPregunta) {
    if (!formPregunta.esEditar){
        Preguntas.GuardarEdicionPregunta("NuevaPregunta", formPregunta);
    } else {
        Preguntas.GuardarEdicionPregunta("EditarPregunta", formPregunta);
    }
}


Preguntas.CargarDatosPregunta = function (cve) {
    $.post(urlBase_WS + "NExamenes.aspx", { op: "ObtenerDetallePregunta", seccion: "Preguntaes", pagina: 1, longitudPagina: 50, criterio: "", cve_examen: cve }).done(function (xmlDoc) {
        var dbPregunta = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(dbPregunta, "cve_examen", "cve_examen");
        SetValor(dbPregunta, "nombre", "nombre");
        SetValor(dbPregunta, "objetivo", "objetivo", "bool");
        SetValor(dbPregunta, "cantidad", "cantidad");
        SetValor(dbPregunta, "tiemporespuesta", "tiemporespuesta");
        SetValor(dbPregunta, "aleatorio", "aleatorio", "bool");
        SetValor(dbPregunta, "puntaje", "puntaje");
    });
}

Preguntas.GuardarEdicionPregunta = function (op, formPregunta) {
    window.preguntaActiva = formPregunta;
    formPregunta.action = "../ContratacionNegocio/NExamenes.aspx?seccion=Preguntas&op=" + op + "&cve_examen=" + document.getElementById("cve_examen").value;
    formPregunta.submit();
}

Preguntas.HandlerGuardarPregunta = function (estatus, mensaje, cve_examen, cve_pregunta) {
    mostrarNotificacion(undefined, "notificaciones-2", function () {
        VerExamen(true);
    }, estatus, mensaje);
}

Preguntas.CambiarFormularioPorPregunta = function (frmPregunta, cve_examen, cve_pregunta) {
    $.post(urlBase_WS + "NExamenes.aspx", { op: "DetallePregunta", seccion: "Preguntas", cve_examen: cve_examen, cve_pregunta: cve_pregunta }).done(function (xmlDoc) {
        if (GetValor(xmlDoc, "cve_examen") != "" || GetValor(xmlDoc, "cve_pregunta") != "") {
            var divPregunta = Preguntas.CearUnaPregunta(GetValor(xmlDoc, "cve_examen"), GetValor(xmlDoc, "cve_pregunta"), GetValor(xmlDoc, "descripcion"), GetValor(xmlDoc, "puntaje"), GetValor(xmlDoc, "cve_tiporespuesta"), GetValor(xmlDoc, "secuencia"), GetValor(xmlDoc, "stiporespuesta"));
            frmPregunta.parentNode.replaceChild(divPregunta, frmPregunta);
        } else {
            frmPregunta.parentNode.removeChild(frmPregunta);
        }
    });
}

Preguntas.CearUnaPregunta = function (cve_examen, cve_pregunta, descripcion, puntaje, cve_tiporespuesta, secuencia, stiporespuesta) {
    var divPregunta = document.createElement("div");
    divPregunta.className = "definicionPregunta agrupacion";
    divPregunta.innerHTML =
        "<label class='clave'>Clave:<b>" + cve_pregunta + "</b></label>" +        
        "<label class='descripcion'><b>" + secuencia + ") </b>" + descripcion + "</label>" +
        //"<label class='tipopregunta'>" + GetValor(xmlDoc, "stiporespuesta") + "</label>" +
        "<label class='puntaje'>Puntaje:<b>" + puntaje + "</b></label>" +
        (new RegExp("agrupa", "gi").test(stiporespuesta) ? "<div class='wrap-columnas'><div class='columnas-pregunta'></div><button style='clear:both;display:block;' onclick='Preguntas.MostrarEditarColumna(this.parentNode," + cve_examen + "," + cve_pregunta + ",undefined,false,true)'>Agregar etiqueta de columna</button></div>" : "") +
        "<div class='wrap-respuestas'></div>";
    return divPregunta;
}


Preguntas.MostrarEditarColumna = function (objeto, cve_examen, cve_pregunta, cve_columna, esEditar, esAfter) {
    var frmColumna = document.createElement("form");
    frmColumna.className = "unaColumna agrupacion";
    frmColumna.target = "consola";
    frmColumna.onsubmit = function () { return false; };
    frmColumna.method = "post";
    frmColumna.enctype = "multipart/form-data";
    frmColumna.esEditar = esEditar;
    var descripcion, puntaje, tiporespuesta;
    var parametros = { op: "ObtenerDetalleColumna", seccion: "Columnas", cve_examen: cve_examen, cve_pregunta: cve_pregunta, cve_columna: cve_columna };
    if (esAfter) {
        parametros = { op: "ClaveSiguiente", seccion: "Columnas", cve_examen: cve_examen, cve_pregunta: cve_pregunta };
    }
    $.post(urlBase_WS + "NExamenes.aspx", parametros).done(function (xmlDoc) {
        frmColumna.innerHTML = '<span class="eliminar btnFormularios" onclick="VerExamen(true);">x</span>' +
                          '<input name="cve_examen" type="hidden" value="' + cve_examen + '"/>' +
                          '<input name="cve_pregunta"  type="hidden" value="' + cve_pregunta + '"/>' +
                          '<input name="cve_columna" type="hidden" value="' + GetValor(xmlDoc, "cve_columna") + '"/>' +
                          '<input name="descripcion" class="descripcion" placeholder="Etiqueta.." value="' + GetValor(xmlDoc, "descripcion") + '"/>' +
                          '<button class="guardar btnFormularios" onclick="Preguntas.GuardarColumna(this.parentNode);">Guardar</button>';
        var contenedor = $(objeto).find(".columnas-pregunta")[0];
        contenedor.appendChild(frmColumna);
    });
}


Preguntas.GuardarColumna = function (formColumna) {
    if (!formColumna.esEditar) {
        Preguntas.GuardarEdicionColumna("Nuevo", formColumna);
    } else {
        Preguntas.GuardarEdicionColumna("Editar", formColumna);
    }
}

Preguntas.GuardarEdicionColumna = function (op, form) {
    form.action = "../ContratacionNegocio/NExamenes.aspx?seccion=Columnas&op=" + op;
    var parametros = $(form).serialize();
    $.post(form.action + "&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            VerExamen(true);
        });
    });
}

Respuestas.MostrarAgregarGrupoRespuestas = function (objeto, cve_examen, cve_pregunta, cve_tiporespuesta, stiporespuesta) {
    $.post(urlBase_WS + "NExamenes.aspx", { op: "ObtenerClaveSiguienteGrupo", seccion: "Respuestas", cve_examen: cve_examen, cve_pregunta: cve_pregunta }).done(function (xmlDoc) {
        $(objeto).find(".wrap-respuestas")[0].appendChild(Respuestas.CrearUnGrupo(cve_examen, cve_pregunta, GetValor(xmlDoc, "cve_grupo"), cve_tiporespuesta, stiporespuesta));
    });
}

Respuestas.MostrarAgregarColumnas = function (objeto, cve_examen, cve_pregunta, cve_tiporespuesta, stiporespuesta) {
    $.post(urlBase_WS + "NExamenes.aspx", { op: "ObtenerClaveSiguienteGrupo", seccion: "Respuestas", cve_examen: cve_examen, cve_pregunta: cve_pregunta }).done(function (xmlDoc) {
        $(objeto).find(".wrap-respuestas")[0].appendChild(Respuestas.CrearUnaColumna(cve_examen, cve_pregunta, GetValor(xmlDoc, "cve_grupo"), cve_tiporespuesta, stiporespuesta));
    });
}

Respuestas.CrearUnaColumna = function (cve_examen, cve_pregunta, cve_grupo, cve_tiporespuesta, stiporespuesta) {
    var divColumna = document.createElement("div");
    var wrapRepGrupo = document.createElement("div");
    wrapRepGrupo.className = "wrap-resp-grupo";
    divGrupo.appendChild(wrapRepGrupo);
    var btnEditarRespuesta = document.createElement("button");
    btnEditarRespuesta.innerHTML = "+";
    divGrupo.appendChild(btnEditarRespuesta);
    btnEditarRespuesta.onclick = function () {
        wrapRepGrupo.parentNode.style.width = "100%";
        Respuestas.MostrarEditarRespuesta(this.parentNode, cve_examen, cve_pregunta, undefined, cve_tiporespuesta, stiporespuesta, false, true, true);
        this.style.display = "none";
    }
    divGrupo.className = "grupo-respuestas";
    divGrupo.setAttribute("cve_examen", cve_examen);
    divGrupo.setAttribute("cve_pregunta", cve_pregunta);
    divGrupo.setAttribute("cve_grupo", cve_grupo);
    return divGrupo;
}

Respuestas.CrearUnGrupo = function (cve_examen, cve_pregunta, cve_grupo, cve_tiporespuesta, stiporespuesta) {
    var divGrupo = document.createElement("div");
    if (new RegExp("agrupa", "gi").test(stiporespuesta)) {
        var wrapRepGrupo = document.createElement("div");
        wrapRepGrupo.className = "wrap-resp-grupo";
        divGrupo.appendChild(wrapRepGrupo);
        var btnEditarRespuesta = document.createElement("button");
        btnEditarRespuesta.innerHTML = "+";
        divGrupo.appendChild(btnEditarRespuesta);
        btnEditarRespuesta.onclick = function () {
            wrapRepGrupo.parentNode.style.width = "100%";
            Respuestas.MostrarEditarRespuesta(this.parentNode, cve_examen, cve_pregunta, undefined, cve_tiporespuesta, stiporespuesta, false, true, true);
            this.style.display = "none";
        }
        divGrupo.className = "grupo-respuestas";
        divGrupo.setAttribute("cve_examen", cve_examen);
        divGrupo.setAttribute("cve_pregunta", cve_pregunta);
        divGrupo.setAttribute("cve_grupo", cve_grupo);
    }
    return divGrupo;
}

Preguntas.EliminarPregunta = function (divPregunta, cve_examen, cve_pregunta, secuencia) {
    if (confirm("Confirme que desea eliminar la pregunta:")) {
        $.post(urlBase_WS + "NExamenes.aspx", { op: "EliminarPregunta", seccion: "Preguntas", cve_examen: cve_examen, cve_pregunta: cve_pregunta, secuencia: secuencia }).done(function (xmlDoc) {
            mostrarNotificacion(xmlDoc, "notificacion", function () {
                VerExamen(true);
            });
        });
    }
}

Preguntas.DesactivarPregunta = function (cve_departamento) {
    $.post(urlBase_WS + "NExamenes.aspx", { op: "CambiarEstatusActivo", cve_departamento: cve_departamento, activo: false }).done(function (xmlDoc) {
        cargarCatalogoPregunta();
    });
}

/****************************************************************************************************************************************************************************
 Respuestas
*****************************************************************************************************************************************************************************/

function ObtenerCatalogoTiposRespuesta(selectTipoRespuesta, callback) {
    LlenarSelect(urlBase_WS + "NExamenes.aspx?op=ObtenerCatalogoTiposRespuesta&seccion=Respuestas", undefined, "Tipo de respuesta", "cve_tiporespuesta", "descripcion", function (selectLleno) {
        selectTipoRespuesta.parentNode.replaceChild(selectLleno, selectTipoRespuesta);
        if (callback) callback(selectLleno);
    });
}

function MostrarNuevoExamen() {
    var frmExamen = document.getElementById("frmNuevoExamen");
    frmExamen.esEditar = false;
    frmExamen.reset();
    $.post(urlBase_WS + "NExamenes.aspx", { op: "obtenerSiguienteClave" }).done(function (xmlDoc) {
        SetValor(xmlDoc, "cve_examen", "cve_examen");
    });
    MostrarFormulario();
}

Respuestas.MostrarEditarRespuesta = function (objeto, cve_examen, cve_pregunta, cve_respuesta, cve_tiporespuesta, stiporespuesta, esEditar, esAfter, esGrupo) {
    var frmRespuesta = document.createElement("form");
    frmRespuesta.className = "unaRespuesta agrupacion";
    frmRespuesta.target = "consola";
    frmRespuesta.onsubmit = function () { return false; };
    frmRespuesta.method = "post";
    frmRespuesta.enctype = "multipart/form-data";
    frmRespuesta.esEditar = esEditar;
    var descripcion, puntaje, tiporespuesta;

    var parametros = { op: "ObtenerDetalleRespuesta", seccion: "Respuestas", cve_examen: cve_examen, cve_pregunta: cve_pregunta, cve_respuesta: cve_respuesta };
    if (esAfter) {
        parametros = { op: "ClaveSiguienteRespuesta", seccion: "Respuestas", cve_examen: cve_examen, cve_pregunta: cve_pregunta };
    }
    $.post(urlBase_WS + "NExamenes.aspx", parametros).done(function (xmlDoc) {
        var cve_grupo = (new RegExp("agrupa", "gi").test(stiporespuesta) ? objeto.getAttribute("cve_grupo") : undefined);
        frmRespuesta.innerHTML = '<span class="eliminar btnFormularios" onclick="Respuestas.CancelaEdicionRespuesta(this.parentNode,' + cve_examen + "," + cve_pregunta + "," + cve_respuesta + ')">x</span>' +
                          '<input name="cve_examen" type="hidden" value="' + cve_examen + '"/>' +
                          '<input name="cve_pregunta"  type="hidden" value="' + cve_pregunta + '"/>' +
                          '<input name="cve_respuesta"  class="cve_respuesta" value="' + GetValor(xmlDoc, "cve_respuesta") + '"/>' +
                          '<textarea name="descripcion" class="descripcion" placeholder="Escriba aquí la respuesta.">' + GetValor(xmlDoc, "descripcion") + '</textarea>' +
                          (new RegExp("asociaci", "gi").test(stiporespuesta) ? "<input type='text' name='descripcionpar' class='descripcionpar'/>" : "") +
                          (cve_grupo ? "<input type='hidden' name='cve_grupo' value='" + cve_grupo + "' />" : "") +
                          '<label style="float:left;margin-left:3px;color:#000;">Es correcto</label><input name="correcto" class="correcto" style="float:left;margin-right:15px;" type="checkbox" value="' + GetValor(xmlDoc, "correcto") + '"/>' +
                          '<input type="file" name="adjunto" />' +
                          '<button class="guardar btnFormularios" onclick="Respuestas.GuardarRespuesta(this.parentNode)">Guardar</button>';
        if (typeof objeto == "string") {
            var contenedor = document.getElementById(objeto);
            contenedor.innerHTML = "";
            contenedor.appendChild(frmRespuesta);
        } else if (new RegExp("definicionRespuesta", "gi").test(objeto.className)) {
            objeto.parentNode.replaceChild(frmRespuesta, objeto);
        } else if (esGrupo) {
            var contenedor = $(objeto).find(".wrap-resp-grupo")[0];
            contenedor.appendChild(frmRespuesta);
        } else {
            var contenedor = $(objeto).find(".wrap-respuestas")[0];
            contenedor.appendChild(frmRespuesta);
        }
        if (frmRespuesta.parentNode.parentNode.className = "grupo-respuestas") {
            frmRespuesta.parentNode.parentNode.setAttribute("widthRespaldo", $(frmRespuesta.parentNode.parentNode).css("width"));
            frmRespuesta.parentNode.parentNode.style.width = "100%";
        }
        //var selectTipoRespuesta = $(frmRespuesta).find("select.tipoRespuesta")[0];
        //ObtenerCatalogoTiposRespuesta(selectTipoRespuesta, function (selectCompleto) {
        //    selectCompleto.setAttribute("name", "cve_tiporespuesta");
        //    selectCompleto.className = "tipoRespuesta";
        //    SetValorDx(selectCompleto, GetValor(xmlDoc, "cve_tiporespuesta"));
        //});
    });
}

Respuestas.CancelaEdicionRespuesta = function (frmEdicion, cve_examen, cve_pregunta, cve_respuesta) {
    VerExamen(true);
}

Respuestas.GuardarRespuesta = function (formRespuesta) {
    if (!formRespuesta.esEditar) {
        Respuestas.GuardarEdicionRespuesta("NuevaRespuesta", formRespuesta);
    } else {
        Respuestas.GuardarEdicionRespuesta("EditarRespuesta", formRespuesta);
    }
}


Respuestas.CargarDatosRespuesta = function (cve) {
    $.post(urlBase_WS + "NExamenes.aspx", { op: "ObtenerDetalleRespuesta", seccion: "Respuestaes", pagina: 1, longitudPagina: 50, criterio: "", cve_examen: cve }).done(function (xmlDoc) {
        var dbRespuesta = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(dbRespuesta, "cve_examen", "cve_examen");
        SetValor(dbRespuesta, "nombre", "nombre");
        SetValor(dbRespuesta, "objetivo", "objetivo", "bool");
        SetValor(dbRespuesta, "cantidad", "cantidad");
        SetValor(dbRespuesta, "tiemporespuesta", "tiemporespuesta");
        SetValor(dbRespuesta, "aleatorio", "aleatorio", "bool");
        SetValor(dbRespuesta, "puntaje", "puntaje");
    });
}

Respuestas.GuardarEdicionRespuesta = function (op, formRespuesta) {
    window.respuestaActiva = formRespuesta;
    formRespuesta.action = "../ContratacionNegocio/NExamenes.aspx?seccion=Respuestas&op=" + op + "&cve_examen=" + document.getElementById("cve_examen").value;
    formRespuesta.submit();
}

Respuestas.HandlerGuardarRespuesta = function (estatus, mensaje, cve_examen, cve_respuesta){
    mostrarNotificacion(undefined, "notificaciones-2", function(){
        Preguntas.InsertarRespuesta();
    }, estatus, mensaje);
}

Respuestas.CambiarFormularioPorRespuesta = function (frmRespuesta, cve_examen, cve_pregunta, cve_respuesta) {
    $.post(urlBase_WS + "NExamenes.aspx", { op: "DetalleRespuesta", seccion: "Respuestas", cve_examen: cve_examen, cve_pregunta: cve_pregunta, cve_respuesta: cve_respuesta }).done(function (xmlDoc) {
        if (GetValor(xmlDoc, "cve_examen") != "" || GetValor(xmlDoc, "cve_respuesta") != "") {
            var divRespuesta = Respuestas.CearUnaRespuesta(GetValor(xmlDoc, "cve_examen"), GetValor(xmlDoc, "cve_pregunta"), GetValor(xmlDoc, "cve_grupo"), GetValor(xmlDoc, "cve_respuesta"), GetValor(xmlDoc, "descripcion"), GetValor(xmlDoc, "descripcionpar"), GetValor(xmlDoc, "puntaje"), GetValor(xmlDoc, "cve_tipoRespuesta"), GetValor(xmlDoc, "secuencia"));
            frmRespuesta.parentNode.replaceChild(divRespuesta, frmRespuesta);
        } else {
            frmRespuesta.parentNode.removeChild(frmRespuesta);
        }
    });
}

Respuestas.CearUnaRespuesta = function (cve_examen, cve_pregunta, cve_grupo, cve_respuesta, descripcion, descripcionpar, cve_tiporespuesta, stiporespuesta) {
    var divRespuesta = document.createElement("div");
    divRespuesta.className = "definicionRespuesta";
    divRespuesta.setAttribute("cve_examen", cve_examen);
    divRespuesta.setAttribute("cve_pregunta", cve_pregunta);
    if (new RegExp("varias", "gi").test(stiporespuesta)) {
        divRespuesta.className += " varias";
        divRespuesta.innerHTML += "<input type='checkbox' name='resp_" + cve_examen + "_" + cve_pregunta + "_varias' value='" + cve_respuesta + "'/><label>" + descripcion + "</label>";
    } else if (new RegExp("multiple", "gi").test(stiporespuesta)){
        divRespuesta.className += " multiple";
        divRespuesta.innerHTML += "<input type='radio' name='resp_" + cve_examen + "_" + cve_pregunta + "_multiple' value='" + cve_respuesta + "'/><label>" + descripcion + "</label>";
    } else if (new RegExp("prioridad", "gi").test(stiporespuesta)) {
        divRespuesta.className += " prioridad";
        divRespuesta.innerHTML += "<input type='text' name='resp_" + cve_examen + "_" + cve_pregunta + "_prioridad'/><label>" + descripcion + "</label>";
    } else if (new RegExp("asocia", "gi").test(stiporespuesta)){
        divRespuesta.style.display = "block";
        divRespuesta.className += " asocia";
        divRespuesta.innerHTML += "<span class='itemasocia'><input type='text'/><label>" + descripcion + "</label></span>";
        divRespuesta.innerHTML += "<span class='itemasociapar'><input type='text'/><label>" + descripcionpar + "</label></span>";
    } else if (new RegExp("agrupadas", "gi").test(stiporespuesta)) {
        divRespuesta.className += " agrupadas";
        divRespuesta.innerHTML += "<input type='text'/><label>" + descripcion + "</label>";
    } else {
        alert("Tipo de pregunta no definido");
    }
    return divRespuesta;
}

Respuestas.EliminarRespuesta = function (divRespuesta, cve_examen, cve_pregunta, cve_respuesta) {
    if (confirm("Confirme que desea eliminar la respuesta:")) {
        $.post(urlBase_WS + "NExamenes.aspx", { op: "EliminarRespuesta", seccion: "Respuestas", cve_examen: cve_examen, cve_pregunta: cve_pregunta, cve_respuesta: cve_respuesta }).done(function (xmlDoc) {
            mostrarNotificacion(xmlDoc, "notificacion", function () {
                VerExamen(true);
            });
        });
    }
}

Respuestas.DesactivarRespuesta = function (cve_departamento) {
    $.post(urlBase_WS + "NExamenes.aspx", { op: "CambiarEstatusActivo", cve_departamento: cve_departamento, activo: false }).done(function (xmlDoc) {
        cargarCatalogoRespuesta();
    });
}

/*****************************************************************************************************************************************************/



var ordenador;
function CargarCatalogoExamenes(cve_puesto) {
    $.post(urlBase_WS + "Examenes.aspx", { op: "ObtenerExamenesPuesto", seccion: "Examen", cve_puesto: cve_puesto }).done(function (xmlDoc) {
        document.getElementById("tableCatalogo").style.display = "block";
        document.getElementById("contenedorExamen").style.display = "none";
        var dbExamenes = xmlDoc.getElementsByTagName("Table");
        var listaExamen = document.getElementById("contenedorLista");
        $(listaExamen).html("");
        var totalregistros;
        for (var i = 0; i < dbExamenes.length; i++){
            var cve_examen = GetValor(dbExamenes[i], "cve_examen");
            var itemLista = document.createElement("tr");
            itemLista.className = "seleccionable";
            totalregistros = GetValor(dbExamenes[i], "totalRegistros");
            itemLista.setAttribute("cve_examen",cve_examen);
            itemLista.onclick = function () {
                VerExamen(this.getAttribute("cve_examen"));
            }
            $(itemLista).html(
                '<td>' + cve_examen + '</td>' +
                '<td>' + GetValor(dbExamenes[i], "nombre") + '</td>' +
                '<td>' + GetValor(dbExamenes[i], "cantidad") + '</td>' +
                '<td>' + GetValor(dbExamenes[i], "tiemporespuesta") + '</td>'
            );
            listaExamen.appendChild(itemLista);
        }
    });
}

function GuardarExamen() {
    if (confirm("¿Esta seguro que desea guardar los cambios?")) {
        var frmExamen = document.getElementById("frmNuevoExamen");
        if (!frmExamen.esEditar) {
            GuardarEdicionExamen("Nuevo");
        } else {
            GuardarEdicionExamen("Editar");
        }
    } else {
        MostrarCatalogo();
    }
}

function MostrarEditarExamen(cve) {
    var frmExamen = document.getElementById("frmNuevoExamen");
    frmExamen.reset();
    frmExamen.esEditar = true;
    MostrarFormulario();
    CargarDatosExamen(cve);
}

function CargarDatosExamen(cve) {
    $.post(urlBase_WS + "NExamenes.aspx", { op: "ObtenerDetalleExamen", seccion: "Examen", pagina: 1, longitudPagina: 50, criterio: "", cve_examen: cve }).done(function (xmlDoc) {
        var dbExamen = xmlDoc.getElementsByTagName("Table")[0];
        SetValor(dbExamen, "cve_examen", "cve_examen");
        SetValor(dbExamen, "nombre", "nombre");
        SetValor(dbExamen, "objetivo", "objetivo", "bool");
        SetValor(dbExamen, "cantidad", "cantidad");
        SetValor(dbExamen, "tiemporespuesta", "tiemporespuesta");
        SetValor(dbExamen, "aleatorio", "aleatorio", "bool");
        SetValor(dbExamen, "puntaje", "puntaje");
    });
}

function GuardarEdicionExamen(op) {
    var frmNuevoExamen = document.getElementById("frmNuevoExamen");
    var parametros = $(frmNuevoExamen).serialize();
    $.post(urlBase_WS + "NExamenes.aspx", "op=" + op + "&seccion=Examen&" + parametros).done(function (xmlDoc) {
        mostrarNotificacion(xmlDoc, "notificacion", function () {
            CargarCatalogoExamenes();
        });
    });
}

function DesactivarExamen(cve_departamento) {
    $.post(urlBase_WS + "NExamen.aspx", { op: "CambiarEstatusActivo", cve_departamento: cve_departamento, activo: false }).done(function (xmlDoc) {
        //  alert(xmlDoc);
        cargarCatalogoExamen();
    })
}

