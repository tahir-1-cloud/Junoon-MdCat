using Azure.Core;
using Mapster;
using Microsoft.EntityFrameworkCore;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Enums;
using StudyApp.API.Domain.Interfaces;
using StudyApp.API.Models;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Services.Implementations
{
    public class AuthenticationServices : IAuthenticationServices
    {
        private readonly IApplicationUserRepository _userRepository;
        private readonly IUserLoginRepository _userLoginRepository;

        public AuthenticationServices(IApplicationUserRepository userRepository, IUserLoginRepository userLoginRepository)
        {
            _userRepository = userRepository;
            _userLoginRepository = userLoginRepository;
        }

        public async Task<CreateApplicationUserModel> AddNewStudent(CreateApplicationUserModel student)
        {
            if (string.IsNullOrWhiteSpace(student.FullName))
            {
                throw new Exception("Name is required");
            }

            if (string.IsNullOrWhiteSpace(student.CNIC))
            {
                throw new Exception("CNIC is required");
            }

            if (string.IsNullOrWhiteSpace(student.EmailAddress))
            {
                throw new Exception("EmailAddress is required");
            }

            if (string.IsNullOrWhiteSpace(student.Password))
            {
                throw new Exception("Password is required");
            }

            ApplicationUser? applicationUser = await _userRepository.FindUserByUniqueFieldsAsync(
                student.CNIC,
                student.EmailAddress,
                student.PhoneNumber
            );

            if (applicationUser != null)
            {
                if (applicationUser.CNIC == student.CNIC)
                    throw new Exception($"Student already exists with CNIC '{student.CNIC}'");

                if (applicationUser.EmailAddress == student.EmailAddress)
                    throw new Exception($"Student already exists with email '{student.EmailAddress}'");

                if (applicationUser.PhoneNumber == student.PhoneNumber)
                    throw new Exception($"Student already exists with phone number '{student.PhoneNumber}'");
            }

            applicationUser = student.Adapt<ApplicationUser>();
            
            applicationUser.RoleId = (int)Roles.Student;
            await _userRepository.AddAsync(applicationUser);

            return applicationUser.Adapt<CreateApplicationUserModel>();
        }

        public async Task<IEnumerable<ApplicationUserModel>> GetAllStudent()
        {
            IEnumerable<ApplicationUser> enumerable = await _userRepository.GetAsync();
            return enumerable.Adapt<IEnumerable<ApplicationUserModel>>();
        }

        public async Task<LoginResponse> LoginStudent(LoginModel student)
        {
            if(string.IsNullOrWhiteSpace(student.UserName))
            {
                throw new Exception("At least one of CNIC, Email Address, or Phone Number is required.");
            }

            if (string.IsNullOrWhiteSpace(student.Password))
            {
                throw new Exception("Password is required");
            }

            ApplicationUser? applicationUser = await _userRepository.FindUserByUserNameAsync(
                student.UserName
            );

            if (applicationUser == null) 
            {
                throw new Exception("Invalid Credentials");
            }

            if (applicationUser.IsBlocked)
            {
                throw new Exception("Please contact administration office");
            }

            if (!applicationUser.Password.Equals(student.Password))
            {
                throw new Exception("Invalid Credentials");
            }

            List<UserLogin> activeSessions = await _userLoginRepository.GetCurrentActiveSessionAsync(applicationUser.Id);

            if (activeSessions.Count >= 2)
            {
                throw new Exception("Maximum number of sessions reached.");
            }

            string token = Guid.NewGuid().ToString();

            // Save session
            var session = new UserLogin
            {
                UserId = applicationUser.Id,
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddMinutes(30),
            };

            await _userLoginRepository.AddAsync(session);

            return new LoginResponse
            {
                FullName = applicationUser.FullName,
                Session = applicationUser.Session.Title,
                Token = token,
            };
        }
    }
}
