using DoctorAppointmentSystem.Models.DataBaseModel;
using DoctorAppointmentSystem.ViewModels.Patient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DoctorAppointmentSystem.Controllers
{
    public class PatientController : Controller
    {
        // GET: Patient
        public ActionResult Deshboard()
        {
            return View();
        }
        public ActionResult ViewAppointments()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetAllTodaysAvailableDoctors()
        {
            var data = AvailableDoctorsViewModel.GetAllAvailableDoctors();
            return Json(new { result = data }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult verifyTimeSlot(DateTime startTime , DateTime endtime,int docId)
        {
            bool data = AvailableDoctorsViewModel.IsTimeSloatReserved(startTime, endtime , docId);
            return Json(new { result = data }, JsonRequestBehavior.AllowGet);

        }
        [HttpGet]
        public JsonResult GetPatientScheduleAppointments()
        {
            var currentUserId= Convert.ToInt32(Session["currentUserId"].ToString());
            var data = MyAppointmentsViewModel.MyTodayAppointments(currentUserId);
            return Json(new { result = data }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetPatientPrescriptionDetail(int patientId)
        {
            var data = MyAppointmentsViewModel.myPrescriptionDetail(patientId);
            return Json(new { result = data }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult saveNewAppointment(DateTime timeStart, DateTime TimeEnd, int docId)
        {
            var currentUserId = Convert.ToInt32(Session["currentUserId"].ToString());
            var data = AvailableDoctorsViewModel.AddNewAppointment(timeStart, TimeEnd, docId, currentUserId);
            return Json(new { result = data }, JsonRequestBehavior.AllowGet);
        }
    }
}