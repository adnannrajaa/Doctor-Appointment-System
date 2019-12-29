using DoctorAppointmentSystem.Models.DataBaseModel;
using DoctorAppointmentSystem.ViewModels.Doctor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DoctorAppointmentSystem.Controllers
{
    public class DoctorsController : Controller
    {
        // GET: Doctors
        public ActionResult Deshboard()
        {
            return View();
        }
        public ActionResult Appointments()
        {
            return View();
        }
        [HttpGet]
        public JsonResult GetAppointmentList(bool? status = null)
        {
            var currentUserId = Convert.ToInt32(Session["currentUserId"].ToString());
            var data = DoctorViewModel.getPatientAppointmentsReuquests(currentUserId,status);
            return Json(new { result = data }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult ApproveOrRejactAppointment(int id,bool status)
        {
            using (DoctorAppoinmentDbContext db = new DoctorAppoinmentDbContext())
            {
                var pat = db.PatientRequests.Find(id);
                pat.Status = status;
                db.SaveChanges();
                return new JsonResult { Data = true, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }

        }
        [HttpPost]
        public ActionResult AddPrescription(int id, string perscription)
        {
            var todaydate = DateTime.Today.ToString("dd/MM/yyyy");
            using (DoctorAppoinmentDbContext db = new DoctorAppoinmentDbContext())
            {
                Prescription prescriptionDetail = new Prescription();
                prescriptionDetail.PatientId = id;
                prescriptionDetail.Description = perscription;
                prescriptionDetail.Date = todaydate;
                db.Prescriptions.Add(prescriptionDetail);
                db.SaveChanges();
                return new JsonResult { Data = true, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }

        }
        [HttpPost]
        public ActionResult Appointments(string startTime,string endTime)
        {
            var currentUserId =  Convert.ToInt32(Session["currentUserId"].ToString());
            var todayDate = DateTime.Today.ToString("dd/MM/yyyy");
            using (DoctorAppoinmentDbContext db = new DoctorAppoinmentDbContext())
            {
                var verifyTimeSlot = db.Availabilities.Where(s => (s.DocId == currentUserId && s.Date == todayDate)).Count();
                if (verifyTimeSlot >= 1)
                {
                    return new JsonResult { Data = false, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
                }
                else
                {
                    Availability available = new Availability();
                    available.DocId = currentUserId;
                    available.Date = todayDate;
                    available.TimeStart = startTime;
                    available.TimeEnd = endTime;
                    db.Availabilities.Add(available);
                    db.SaveChanges();

                    return new JsonResult { Data = true, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

                }
            }
        }

    }
}