using DoctorAppointmentSystem.Models.DataBaseModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DoctorAppointmentSystem.Controllers
{
    public class AccountController : Controller
    {
        // GET: Account
        public ActionResult Login()
        {
            return View();
        }
        [HttpPost]
        public ActionResult Login(string userName,string password)
        {
            using (DoctorAppoinmentDbContext db = new DoctorAppoinmentDbContext())
            {
                var isAuthenticated = db.Users.Where(s => (s.UserName == userName && s.Password == password)).Count();
                if (isAuthenticated == 1)
                {
                    var IsVerified = db.Users.Where(s => (s.UserName == userName)).Select(s => s.IsVerified).FirstOrDefault();
                    var IsDeleted = db.Users.Where(s => (s.UserName == userName)).Select(s => s.IsDeleted).FirstOrDefault();
                    var IsActive = db.Users.Where(s => (s.UserName == userName)).Select(s => s.IsActive).FirstOrDefault();
                    if (IsVerified == false) { return Json(new { result = 2}, JsonRequestBehavior.AllowGet); }
                    else if (IsDeleted == true) { return Json(new { result = 3 }, JsonRequestBehavior.AllowGet); }
                    else if (IsActive == false) { return Json(new { result = 4 }, JsonRequestBehavior.AllowGet); }
                    else
                    {
                        var currentUserId = db.Users.Where(s => s.UserName == userName).Select(s => s.UserId).FirstOrDefault();
                        var currentUserRole = db.Users.Join(db.Roles, x => x.RoleId, y => y.RoleId, (x, y) => new { u = x, r = y }).Where(s => s.u.UserName == userName).Select(s => s.r.RoleName).FirstOrDefault();
                        Session["currentUser"] = userName;
                        Session["currentUserId"] = currentUserId;
                        Session["currentUserRole"] = currentUserRole;
                        return Json(new { result = 1, UserRole = currentUserRole }, JsonRequestBehavior.AllowGet);

                    }

                }
            }

            return Json(new { result = 5 }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public JsonResult registerUser(User _model)
        {
            using (DoctorAppoinmentDbContext db = new DoctorAppoinmentDbContext())
            {
                db.Users.Add(_model);
                db.SaveChanges();
                return Json(new { result = true }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public JsonResult isUserExist(string UserName)
        {
            using (DoctorAppoinmentDbContext db = new DoctorAppoinmentDbContext())
            {
                var user = db.Users.Where(s => s.UserName == UserName).Count();
                if(user>=1)
                {
                    return Json(new { result = true }, JsonRequestBehavior.AllowGet);
                }
                return Json(new { result = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult VerifyUser()
        {
            using (DoctorAppoinmentDbContext db = new DoctorAppoinmentDbContext())
            {
                var user = db.Users.OrderByDescending(s=>s.UserId).FirstOrDefault();
                user.IsVerified = true;
                db.SaveChanges();
                return Json(new { result = true }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult VerifyUserbyUserName(string UserName)
        {
            using (DoctorAppoinmentDbContext db = new DoctorAppoinmentDbContext())
            {
                var user = db.Users.Where(s => s.UserName==UserName).FirstOrDefault();
                user.IsVerified = true;
                db.SaveChanges();
                return Json(new { result = true }, JsonRequestBehavior.AllowGet);
            }
        }


        public ActionResult Logout()
        {
            Session["currentUser"] = null;
            Session["currentUserId"] = null;
            Session["currentUserRole"] = null;
            return RedirectToAction("Login", "Account");
        }
    }
}