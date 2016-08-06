using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Collections;
using System.Data;
using System.Web;

namespace HSBolsaServer
{
    public class Validacion
    {
        public static Regex reInyeccionSQL = new Regex("--|select|from|\\*|delete|truncate|scheme|update|alter", RegexOptions.IgnoreCase);

        public static Boolean PuedeVerEmpleado(int cve_usuario, string num_empleado)
        {
            Boolean resultado= false;
            try
            {
                DataSet ds = new Modelo("/Modulos/Seguridad/SeguridadModelo/dboSeguridad.xml", true).GenerarOperacionCX("EsEmpleadoVisible", "Visibilidad", new object[,] { 
                    { "Clave de usuario", "cve_usuario", cve_usuario, true, "int", 0 } 
                    , { "Número de empleado", "num_empleado", num_empleado , true, "string", 30 } 
                });
                resultado=(Convert.ToInt16(ds.Tables[0].Rows[0]["coincidencias"])>=1);
            }catch(Exception exc){}
            return resultado;
        }

        public static Boolean PuedeVerPosicion(int cve_usuario, int num_posicion)
        {
            Boolean resultado = false;
            try
            {
                DataSet ds = new Modelo("/Modulos/Seguridad/SeguridadModelo/dboSeguridad.xml", true).GenerarOperacionCX("EsPosicionVisible", "Visibilidad", new object[,] { 
                    { "Clave de usuario", "cve_usuario", cve_usuario, true, "int", 0 } 
                    , { "Número de posición", "num_posicion", num_posicion , true, "int", 0 } 
                });
                resultado = (Convert.ToInt16(ds.Tables[0].Rows[0]["coincidencias"]) >= 1);
            }
            catch (Exception exc) { }
            return resultado;
        }

        public static Boolean ValidarPermisoMenu(object pagina, object cve_usuario){
            Boolean resultado= false;
            try
            {
                string oPagina = ((Uri)pagina).LocalPath;
                DataSet ds = new Modelo().GenerarOperacion(new object[,] { 
                      { "Url de página", "pagina", oPagina, true, "string", 1024 }
                    , { "Clave de usuario", "cve_usuario", cve_usuario, true, "int", 0 } 
                    , { "IP usuario", "ip", HttpContext.Current.Request.UserHostAddress , false, "string", 200 } 
                }, "PA_SG_CAccesoMenu");
                resultado=(Convert.ToInt16(ds.Tables[0].Rows[0]["estatus"])==1);
            }catch(Exception exc){}
            return resultado;
        }

        public static EstatusOperacion ValidarCamposFormato(object[,] parametros)
        {
            EstatusOperacion oEstatusOperacion= new EstatusOperacion(1,"");
            string alias;
            string nombreParametro;
            object valor;
            bool esRequerido;
            string tipo;
            int longitud;
            string[] camposfaltantes = new string[0];
            string[] camposFormatoIncorrecto = new string[0];
            bool estanLlenosCamposObligatorios = true;
            bool tienenCamposFormatoCorrecto = true;
            for(int i=0; i<parametros.GetLength(0);i++){
                alias = (string)parametros[i, 0];
                nombreParametro = (string)parametros[i, 1];
                valor = parametros[i, 2];
                esRequerido = (bool)parametros[i,3];
                tipo = parametros[i, 4].ToString();
                longitud = parametros[i, 5].ToString().ToUpper().Equals("MAX") ? 8000:(int) parametros[i, 5];
                if (esRequerido && !esRecibidoParametro(valor, tipo.Split('|')[0])){
                    Util.AddElement(ref camposfaltantes, alias);
                    estanLlenosCamposObligatorios = false;
                }
                else if (esRecibidoParametro(valor, tipo.Split('|')[0]))
                {
                    if (!esFormatoPermitido(valor, tipo, longitud))
                    {
                        Util.AddElement(ref camposFormatoIncorrecto, alias);
                        new HackingExcepcion();
                        tienenCamposFormatoCorrecto = false;
                    }
                }
            }

            

            if (estanLlenosCamposObligatorios && tienenCamposFormatoCorrecto)
            {
                oEstatusOperacion.estatus = 1;
                oEstatusOperacion.mensaje = "";
            }
            else
            {
                oEstatusOperacion.estatus = -1;
                if (!estanLlenosCamposObligatorios)
                {
                    oEstatusOperacion.mensaje = "Faltan los siguientes campos: " + String.Join(",", camposfaltantes);
                }
                if (!tienenCamposFormatoCorrecto)
                {
                    if (oEstatusOperacion.mensaje.Trim().Length > 0)
                    {
                        oEstatusOperacion.mensaje += ";";
                    }
                    oEstatusOperacion.mensaje += "Los siguientes campos NO tienen formato válido: " + String.Join(",", camposFormatoIncorrecto);
                }
            }

            return oEstatusOperacion;
        }
        public static bool esRecibidoParametro(object valor, string tipo) {
            bool resultado = true;
            if (valor == null)
                {
                    resultado= false;
                }
            else
            {
                if (tipo == "file")
                {
                    try
                    {
                        System.Web.HttpPostedFile valorFile = (System.Web.HttpPostedFile)valor;
                        if (valorFile.ContentLength == 0)
                        {
                            resultado = false;
                        }
                    }
                    catch (Exception e)
                    {
                        resultado = false;
                    }
                }
                else
                {
                    if (valor.ToString().Length == 0)
                    {
                        resultado = false;
                    }
                }
            }
            return resultado;
        }

        public static bool esFormatoPermitido(object valor, string datosTipo, int longitud)
        {
            bool resultadoValidacion = true;
            int valorEntero; bool valorBool; double valorDecimal;
            string tipoDato= datosTipo.Split(':')[0];
            if (tipoDato == "file")
            {
                System.Web.HttpPostedFile valorFile = (System.Web.HttpPostedFile)valor;
                string[] parametrosFile = datosTipo.Split(':');
                string extension = valorFile.FileName.Substring(valorFile.FileName.LastIndexOf('.'));
                string extensionesPermitidas = parametrosFile[1];
                int longitudArchivo = valorFile.ContentLength;
                //throw new Exception("Extension:" + extension + "; Extensiones Permitidas: " + extensionesPermitidas + "; longitudArchivo: " + longitudArchivo + "; longitud permitida: " + longitud * 1000 + "; Match: " + new Regex(extension, RegexOptions.IgnoreCase).IsMatch(extensionesPermitidas).ToString());
                resultadoValidacion = (longitudArchivo < longitud * 1000) && new Regex(extension,RegexOptions.IgnoreCase).IsMatch(extensionesPermitidas);
            }
            else
            {
                if (!datosTipo.Equals("text") && reInyeccionSQL.IsMatch(valor.ToString()))
                {
                    resultadoValidacion = false;
                    //GuardarExcepcion
                    try
                    {
                        //NotificarProbableInyeccion();
                    }
                    catch (Exception ex) { }
                }
                else
                {
                    switch(tipoDato)
                    {
                        case "int":
                            try { valorEntero = Convert.ToInt32(valor); }
                            catch (Exception ex) { resultadoValidacion = false; }
                            break;
                        case "float":
                            try { valorDecimal = Convert.ToDouble(valor); }
                            catch (Exception ex) { resultadoValidacion = false; }
                            break;
                        case "bool":
                            try { valorBool = Convert.ToBoolean(valor); }
                            catch (Exception ex) { resultadoValidacion = false; }
                            break;
                        case "string":
                            resultadoValidacion = (valor.ToString().Length <= longitud);
                            break;
                        case "text":
                            resultadoValidacion = true;
                            break;
                    }
                }
            }
            return resultadoValidacion;
        }

        public static bool exitoOperacion(DataSet ds){
            bool resultado= false;
            if(ds.Tables.Count > 0) {
                if(ds.Tables[0].Rows.Count > 0) {
                    int estatus;
                    if (ds.Tables[0].Rows[0]["estatus"] != null)
                    {
                        int.TryParse(ds.Tables[0].Rows[0]["estatus"].ToString(),out estatus);
                        resultado = (estatus > 0);
                    }
                }
            }
            return resultado;
        }
    }
}
