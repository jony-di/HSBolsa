using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace HSBolsaServer
{
    public static class Seguridad
    {
        public static bool iniciarSesion()
        {
            bool result=false;
            try
            {
                HttpRequest oRequest = HttpContext.Current.Request;
                string usuario = oRequest["usuario"];
                string Pass = Encripta.cifradoMD5(oRequest["pass"]);
                using (Modelo oModelo = new Modelo())
                {
                    oModelo.GenerarOperacion(new object[,] { { "Usuaro", "usuario", usuario, true, "string", 50 }, { "Pass", "pass", Pass, true, "string", 50 } }, "");
                    HttpContext context = HttpContext.Current;
                    context.Session["usario"] = usuario;
                    result = true;
                }
            }
            catch { }
            return result;
        }

        public static bool validaSesion()
        {
            bool result = false;
            try
            {
                HttpContext context = HttpContext.Current;
                string usuario = context.Session["usario"].ToString();

                using (Modelo oModelo = new Modelo())
                {
                    oModelo.GenerarOperacion(new object[,] { { "Usuaro", "usuario", usuario, true, "string", 50 } }, "");
                    result = true;
                }
            }
            catch { }
           
            return result;
        }

        public static void cerrarSesion()
        {
            HttpContext context = HttpContext.Current;
            context.Session.Clear();
        }
    }
}
