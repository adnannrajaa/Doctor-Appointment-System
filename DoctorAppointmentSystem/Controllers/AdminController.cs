using DoctorAppointmentSystem.Models.DataBaseModel;
using DoctorAppointmentSystem.ViewModels.Admin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DoctorAppointmentSystem.Controllers
{
    public class AdminController : Controller
    {
        public ActionResult GetAllDoctorUsers()
        {
            return View();
        }
        public ActionResult GetAllPatientUsers()
        {
            return View(UsersViewModel.GetAllUsers(3));
        }

        [HttpPost]
        public ActionResult EnableDisable(int id)
        {
            bool status = false;
            using (DoctorAppoinmentDbContext db = new DoctorAppoinmentDbContext())
            {

                var finddata = db.Users.Find(id);
                if (finddata.IsActive == true)
                {
                    finddata.IsActive = false;
                }
                else
                {
                    finddata.IsActive = true;
                    status = true;
                }
                db.SaveChanges();
            }
            return new JsonResult { Data = status, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }
        [HttpPost]
        public ActionResult DeleteUser(int id)
        {
            using (DoctorAppoinmentDbContext db = new DoctorAppoinmentDbContext())
            {
                var finddata = db.Users.Find(id);
                finddata.IsDeleted = true;
                db.SaveChanges();

            }
            return new JsonResult { Data = true, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

        }

        [HttpGet]
        public JsonResult GetAllUsers(int roleId)
        {
            var data = UsersViewModel.GetAllUsers(roleId);
            return Json(new { result = data }, JsonRequestBehavior.AllowGet); 
        }

    }
}