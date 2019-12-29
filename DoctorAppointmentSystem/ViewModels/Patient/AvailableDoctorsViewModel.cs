using DoctorAppointmentSystem.Models.DataBaseModel;
using DoctorAppointmentSystem.Models.Patient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DoctorAppointmentSystem.ViewModels.Patient
{
    public class AvailableDoctorsViewModel
    {
        public IList<AvailableDoctors> AvailableDoctors { get; set; }
       
        public static AvailableDoctorsViewModel GetAllAvailableDoctors()
        {
            using (DoctorAppoinmentDbContext db = new DoctorAppoinmentDbContext())
            {
                var todaydate = DateTime.Today.ToString("dd/MM/yyyy");
                var patientAppointments = new AvailableDoctorsViewModel
                {
                    AvailableDoctors = db.Availabilities.Join(db.Users, x => x.DocId, y => y.UserId, (x, y) => new
                    {
                        a = x,
                        u = y
                    }).Where(s => (s.a.Date.Contains(todaydate))).Select(f => new AvailableDoctors
                    {
                        docId = f.a.DocId,
                        fullName = f.u.FirstName + " " + f.u.LastName,
                        startTime = f.a.TimeStart,
                        endTime = f.a.TimeEnd,
                    }).ToList()
                };
                return patientAppointments;
            }
        }

        public static bool IsTimeSloatReserved(DateTime startTime, DateTime endtime,int docId)
        {
            var todaydate = DateTime.Today.ToString("dd/MM/yyyy");
            using (DoctorAppoinmentDbContext db = new DoctorAppoinmentDbContext())
            {
                var PatientAppointments = db.PatientRequests.Where(x => x.TimeStart == startTime &&
                x.DocId == docId || x.TimeStart < startTime &&
                x.TimeEnd > startTime &&
                x.DocId == docId || x.TimeStart < endtime &&
                x.TimeEnd > endtime && x.DocId == docId && x.Date==todaydate).Count();
                if(PatientAppointments>=1)
                {
                    return true;
                }
            }
            return false;
        }

        public static bool AddNewAppointment(DateTime timeStart, DateTime timeEnd, int docId, int currentUserId)
        {
            var todaydate = DateTime.Today.ToString("dd/MM/yyyy");
            using (DoctorAppoinmentDbContext db = new DoctorAppoinmentDbContext())
            {
                PatientRequest newReq = new PatientRequest();
                newReq.UserId = currentUserId;
                newReq.DocId = docId;
                newReq.Date = todaydate;
                newReq.TimeStart = timeStart;
                newReq.TimeEnd = timeEnd;
                db.PatientRequests.Add(newReq);
                db.SaveChanges();
                return true;
            }
        }
    }
}