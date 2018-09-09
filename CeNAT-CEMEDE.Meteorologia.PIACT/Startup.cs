using System;
using Microsoft.Owin;
using Microsoft.Owin.Builder;
using Owin;

[assembly: OwinStartupAttribute(typeof(CeNAT_CEMEDE.Meteorologia.PIACT.Startup))]
namespace CeNAT_CEMEDE.Meteorologia.PIACT
{
    public partial class Startup
    {
        public void Configuration(AppBuilder app)
        {
            ConfigureAuth(app);
        }

        private void ConfigureAuth(AppBuilder app)
        {
            throw new NotImplementedException();
        }
    }
}
