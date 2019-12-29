using DoctorAppointmentSystem.Models.DataBaseModel;
using DoctorAppointmentSystem.Models.Patient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DoctorAppointmentSystem.ViewModels.Patient
{
    public class MyAppointmentsViewModel
    {
        public IList<PatientAppointments> PatientAppointments { get; set; }
        public IList<PrescriptionModel> Prescription { get; set; }
        public static MyAppointmentsViewModel MyTodayAppointments(int currentUserId)
        {
            using (DoctorAppoinmentDbContext db = new DoctorAppoinmentDbContext())
            {
                var todaydate = DateTime.Today.ToString("dd/MM/yyyy");
                var Appointments = new MyAppointmentsViewModel
                {
                    PatientAppointments = db.PatientRequests.Join(db.Users, x => x.DocId, y => y.UserId, (x, y) => new
                    {
                        p = x,
                        u = y
                    }).Where(s => (s.p.UserId == currentUserId && s.p.Date.Contains(todaydate))).Select(f => new PatientAppointments
                    {
                        PatientId = f.p.PatientId,
                        docId = f.p.DocId,
                        FullName = f.u.FirstName + " " + f.u.LastName,
                        TimeStart = f.p.TimeStart,
                        TimeEnd = f.p.TimeEnd,
                        Status = f.p.Status
                    }).ToList()
                };
                return Appointments;
            }
        }

        public static MyAppointmentsViewModel myPrescriptionDetail(int patientId)
        {
            using (DoctorAppoinmentDbContext db = new DoctorAppoinmentDbContext())
            {
                var todaydate = DateTime.Today.ToString("dd/MM/yyyy");
                var patientPrescription = new MyAppointmentsViewModel
                {
                    Prescription = db.Prescriptions.Where(s => (s.Date == todaydate && s.PatientId == patientId)).Select(f => new PrescriptionModel
                    {
                        PrescriptionDetail = f.Description
                    }).ToList()
                };
                return patientPrescription;
            }
        }

    }
}