using CeNAT_CEMEDE.Meteorologia.PIACT.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CeNAT_CEMEDE.Meteorologia.PIACT.Services
{
    public interface IMediaPublicationRepository
    {
        List<ClimaticPublication> getPublicationBySection(Sections section);
    }
}
