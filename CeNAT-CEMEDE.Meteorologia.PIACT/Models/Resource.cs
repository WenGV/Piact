using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CeNAT_CEMEDE.Meteorologia.PIACT.Models
{
    public class Resource
    {
        public int ID { get; set; }
        public String Name { get; set; }
        public String Source { get; set; }
        public String SourceEscala { get; set; }
        public int IDsection { get; set; }
        public int pubState { get; set; }
        public int Pos { get; set; }

        public static IQueryable<Resource> getResourcesData()
        {
            return DBcontext.getResourceList().AsQueryable();
        }

        /* public static Resource getSourceByID(int IDsection)
         {
             return DBcontext.getResourceSourceByID(IDsection);
         }
        */
        public static List<Resource> setResourcePosition(Resource resource)
        {
            return DBcontext.setResourcePosition(resource);
        }
    }
}
