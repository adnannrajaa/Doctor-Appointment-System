using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DoctorAppointmentSystem.Models.Patient
{
    public class AvailableDoctors
    {
        public int? docId { get; set; }
        public string fullName { get; set; }
        public string startTime { get; set; }
        public string endTime { get; set; }
    }
}