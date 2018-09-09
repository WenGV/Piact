using System.Web;
using System.Web.Mvc;

namespace CeNAT_CEMEDE.Meteorologia.PIACT
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
