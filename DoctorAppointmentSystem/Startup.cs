using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(DoctorAppointmentSystem.Startup))]
namespace DoctorAppointmentSystem
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            //ConfigureAuth(app);
        }
    }
}
