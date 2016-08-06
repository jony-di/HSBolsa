using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HSBolsaServer
{
    internal class Usuario : IDisposable
    {
        internal Usuario()
        {
            
        }

        //internal bool validaUsuario(string usuario, string Pass)
        //{ 
        //    bool result=false;
        //    validaUsuario(string usuario, string Pass);
        //    return result;
        //}

        #region IDisposable
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
        
        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
            }
        }
        ~Usuario()
        {
            Dispose(false);
        }
        #endregion

    }
}
