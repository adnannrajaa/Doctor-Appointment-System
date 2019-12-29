using DoctorAppointmentSystem.Models.Admin;
using DoctorAppointmentSystem.Models.DataBaseModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DoctorAppointmentSystem.ViewModels.Admin
{
    public class UsersViewModel
    {
        public IList<UsersModel> Users { get; set; }
        public static UsersViewModel GetAllUsers(int RoleId)
        {
            using (DoctorAppoinmentDbContext db = new DoctorAppoinmentDbContext())
            {
                var doctors = new UsersViewModel
                {
                    Users = db.Users.Where(s => (s.RoleId == RoleId && s.IsDeleted == false)).Select(f => new UsersModel
                    {
                        UserId = f.UserId,
                        UserName = f.UserName,
                        FirstName = f.FirstName,
                        LastName = f.LastName,
                        IsActive = f.IsActive
                    }).ToList()
                };
                return doctors;
            }
        }
    }
}