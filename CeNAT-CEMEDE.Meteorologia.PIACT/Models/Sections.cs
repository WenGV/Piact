using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CeNAT_CEMEDE.Meteorologia.PIACT.Models
{
    public class Sections
    {
        public int ID { get; set; }
        public String Name { get; set; }
        public int CategoryID { get; set; }
        public String pageNum { get; set; }


        public static IQueryable<Sections> getSectionsData()
        {
            return DBcontext.getListSection().AsQueryable();
        }
    }
}
