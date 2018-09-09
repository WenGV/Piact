using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CeNAT_CEMEDE.Meteorologia.PIACT.Models
{
    public static class SecurityContext
    {


        public static void saveAction(String action, String location, String ip, String owner)
        {
            try
            {
                DBcontext.setPiactProblem(action, location, owner, ip, "");
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

    }
}