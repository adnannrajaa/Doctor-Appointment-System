using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DoctorAppointmentSystem.Models.Patient
{
    public class PatientAppointments
    {
        public int? PatientId { get; set; }
        public int? docId { get; set; }
        public string FullName { get; set; }
        public Nullable<System.DateTime> TimeStart { get; set; }
        public Nullable<System.DateTime> TimeEnd { get; set; }
        public Nullable<bool> Status { get; set; }

    }
}