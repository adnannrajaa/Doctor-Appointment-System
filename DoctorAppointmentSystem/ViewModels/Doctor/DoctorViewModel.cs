using DoctorAppointmentSystem.Models.DataBaseModel;
using DoctorAppointmentSystem.Models.Doctor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DoctorAppointmentSystem.ViewModels.Doctor
{
    public class DoctorViewModel
    {
        public IList<DoctorModel> appointments { get; set; }
        public static DoctorViewModel getPatientAppointmentsReuquests(int docId,bool? status)
        {
            using (DoctorAppoinmentDbContext db = new DoctorAppoinmentDbContext())
            {
                var todaydate = DateTime.Today.ToString("dd/MM/yyyy");
                var patientAppointments = new DoctorViewModel
                {
                    appointments = db.PatientRequests.Join(db.Users, x => x.UserId, y => y.UserId, (x, y) => new
                    {
                        p = x,
                        u = y
                    }).Where(s => (s.p.DocId == docId && s.p.Status== status && s.p.Date.Contains(todaydate))).Select(f => new DoctorModel
                    {
                        PatientId = f.p.PatientId,
                        FullName = f.u.FirstName+ " "+f.u.LastName,
                        TimeStart = f.p.TimeStart,
                        TimeEnd = f.p.TimeEnd,
                        Status=f.p.Status
                    }).ToList()
                };
                return patientAppointments;
            }
        }
    }
}