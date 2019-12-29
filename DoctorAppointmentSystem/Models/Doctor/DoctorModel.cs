using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DoctorAppointmentSystem.Models.Doctor
{
    public class DoctorModel
    {
        public int PatientId { get; set; }
        public string FullName { get; set; }
        public Nullable<System.DateTime> TimeStart { get; set; }
        public Nullable<System.DateTime> TimeEnd { get; set; }
        public Nullable<bool> Status { get; set; }
    }
}