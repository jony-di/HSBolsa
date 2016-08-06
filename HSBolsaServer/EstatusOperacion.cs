using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;

namespace HSBolsaServer
{
    [Serializable]
    public class EstatusOperacion 
    {
        public int estatus = 0;
        public string mensaje="Default Aplicación";

        public EstatusOperacion(){}
        public EstatusOperacion(int estatus, string mensaje)
        {
            this.estatus = estatus;
            this.mensaje = mensaje;
        }

        public static DataSet agregarEstatusOperacion(int estatus, string mensaje)
        {
            DataSet ds = new DataSet();
            DataTable tblTemp = new DataTable("Table");
            ds.Tables.Add(tblTemp);
            tblTemp.Columns.Add("estatus", typeof(Int32));
            tblTemp.Columns.Add("mensaje", typeof(string));
            DataRow dr = tblTemp.NewRow();
            dr["estatus"] = estatus;
            dr["mensaje"] = mensaje;
            tblTemp.Rows.Add(dr);
            return ds;
        }

    }
}
