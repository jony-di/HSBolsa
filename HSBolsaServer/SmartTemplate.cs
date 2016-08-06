using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Text;

namespace HSBolsaServer
{
    public class SmartTemplate
    {
        private NameValueCollection templateVariables;
        private StringBuilder input;
        public SmartTemplate()
        {
            this.templateVariables = new NameValueCollection();
            this.input = new StringBuilder();
        }
        public void assign(string nameVariable, string valueVariable)
        {
            this.templateVariables.Add(nameVariable, valueVariable);
        }
        public string compile(string input)
        {
            this.input.Append(input);

            for(int iVar =0; iVar < templateVariables.Count; iVar++)
            {
                string stringVar = "{$" + templateVariables.AllKeys[iVar] + "}";
                input = input.Replace(stringVar, templateVariables[iVar]); 
            }
            return input;
        }
    }
}
