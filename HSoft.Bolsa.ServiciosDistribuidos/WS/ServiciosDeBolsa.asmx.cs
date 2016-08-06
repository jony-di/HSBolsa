using System.Data;
using System.Web.Services;
using HSBolsaServer;

namespace HSoft.Bolsa.ServiciosDistribuidos
{
    /// <summary>
    /// Descripción breve de ServiciosDeBolsa
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // Para permitir que se llame a este servicio Web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente. 
    // [System.Web.Script.Services.ScriptService]
    public class ServiciosDeBolsa : System.Web.Services.WebService
    {
        Modelo oModelo = new Modelo("/Modelo/wsbolsa.xml", true);
        [WebMethod]
        public string[] PublicarVacante(DataSet vacanteInfo)
        {
            return Modelo.InsertaRegistrosEnTablas(vacanteInfo);
        }

        //[WebMethod]
        //public void BajaVacabte(int vacateID)
        //{
        //    //bool result = false;
        //    //return result;
        //}

        [WebMethod]
        public DataSet ObtenerCandidatos(int vacateID)
        {
            return oModelo.GenerarOperacionCX("obtenerCandidatos", "Candidatos", new object[,] { { "Clave Vacante", "cve_vacante", vacateID, true, "int", 0 } });
        }
    }
}
