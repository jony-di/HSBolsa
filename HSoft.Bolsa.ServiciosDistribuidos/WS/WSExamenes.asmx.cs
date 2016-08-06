using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Services;
using HSBolsaServer;
namespace HSoft.Bolsa.ServiciosDistribuidos
{
    /// <summary>
    /// Descripción breve de WSExamenes
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente. 
    // [System.Web.Script.Services.ScriptService]
    public class WSExamenes : System.Web.Services.WebService
    {
        [WebMethod]
        public DataSet ObtenerRespuestasCandidato(string cve_candidato, int cve_examen, int cve_vacante)
        {
            DataSet ds = new DataSet();
            try{
                Modelo oModelo = new Modelo("/WS/Modelo/wsbolsa.xml");
                ds = oModelo.GenerarOperacionCX("ObtenerRespuestasCandidato", "Examenes", new object[,]{
                     { "Usuario", "cve_candidato", cve_candidato, true, "string", 50 }
                    ,{ "Clave de exámen", "cve_examen", cve_examen, true, "int", 0}
                    ,{ "Clave de vacante", "cve_vacante", cve_vacante, true, "int", 0}
               });               
            }catch (Exception e){
                ds= EstatusOperacion.agregarEstatusOperacion(-1, e.Message);
            }
            return ds;
        }

        [WebMethod]
        public string[] InsertaRegistrosEnTablas(DataSet dsTablas){
            return Modelo.InsertaRegistrosEnTablas(dsTablas);
        }
    }
}
