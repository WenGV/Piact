using CeNAT_CEMEDE.Meteorologia.PIACT.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CeNAT_CEMEDE.Meteorologia.PIACT.Services
{
    public class MediaPublicationRepository : IMediaPublicationRepository
    {
        public List<ClimaticPublication> getPublicationBySection(Sections section)
        {
            try
            {
                return ClimaticPublication.getPublicationBySection(section.ID, Convert.ToInt32(section.pageNum), Convert.ToInt32(section.RowpPage));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}