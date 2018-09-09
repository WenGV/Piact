using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CeNAT_CEMEDE.Meteorologia.PIACT.Models
{
    public class ClimaticData
    {
        public List<Category> categories { get; set; }
        public List<Sections> sections { get; set; }
        public List<Resource> resources { get; set; }
    }
}