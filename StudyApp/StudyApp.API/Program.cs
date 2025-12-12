//using Microsoft.EntityFrameworkCore;
//using Microsoft.Extensions.FileProviders;
//using StudyApp.API.Data;
//using StudyApp.API.Domain.Interfaces;
//using StudyApp.API.Hubs;
//using StudyApp.API.Mappings;
//using StudyApp.API.Repositories;
//using StudyApp.API.Services.Implementations;
//using StudyApp.API.Services.Interfaces;

//var builder = WebApplication.CreateBuilder(args);

//// Add services to the container.
//builder.Services.AddDbContext<ApplicationDbContext>(option =>
//{
//    option.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
//});
//builder.Services.AddSignalR();

//// Add Base Repository
//builder.Services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
//builder.Services.AddScoped<IPapersRepository, PapersRepository>();
//builder.Services.AddScoped<IApplicationUserRepository, ApplicationUserRepository>();
//builder.Services.AddScoped<ISessionRepository, SessionRepository>();
//builder.Services.AddScoped<IUserLoginRepository, UserLoginRepository>();
//builder.Services.AddScoped<IQuestionRepository, QuestionRepository>();
//builder.Services.AddScoped<IOptionRepository, OptionRepository>();
//builder.Services.AddScoped<IMockRepository, MockRepository>();
//builder.Services.AddScoped<IMockQuestionRepository, MockQuestionRepository>();
//builder.Services.AddScoped<IMockOptionRepository, MockOptionRepository>();
//builder.Services.AddScoped<IStudentEnrollRepository, StudentEnrollRepository>();
//builder.Services.AddScoped<IContactRepository, ContactRepository>();
//builder.Services.AddScoped<ISubscriberRepository, SubscriberRepository>();
//builder.Services.AddScoped<ILecturesRepository, LecturesRepository>();
//builder.Services.AddScoped<ITestResultRepository, TestResultRepository>();
//builder.Services.AddScoped<IAttemptRepository, AttemptRepository>();



//// Register Services
//builder.Services.AddScoped<IAuthenticationServices, AuthenticationServices>();
//builder.Services.AddScoped<ISessionServices, SessionServices>();
//builder.Services.AddScoped<IPaperServices, PaperServices>();
//builder.Services.AddScoped<IQuestionServices, QuestionServices>();
//builder.Services.AddScoped<IOptionServices, OptionServices>();
//builder.Services.AddScoped<IMockServices, MockServices>();
//builder.Services.AddScoped<IMockQuestionServices, MockQuestionServices>();
//builder.Services.AddScoped<IMockOptionServices, MockOptionServices>();
//builder.Services.AddScoped<IStudentEnrollServices, StudentEnrollServices>();
//builder.Services.AddScoped<IContactServices, ContactServices>();
//builder.Services.AddScoped<ISubscriberServices, SubscriberServices>();
//builder.Services.AddScoped<ILectureServices, LectureServices>();
//builder.Services.AddScoped<ITestResultServices, TestResultServices>();
//builder.Services.AddScoped<IAttemptService, AttemptService>();




//// Mapster config
//MappingConfig.RegisterMappings();

//// Add CORS services
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("StudyApp", policy =>
//    {
//        policy.WithOrigins("http://localhost:3000") // your Next.js frontend URL
//              .AllowAnyHeader()
//              .AllowAnyMethod()
//              .AllowCredentials(); // only if you're using cookies/auth
//    });
//});

//builder.Services.AddControllers();
//// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

//var app = builder.Build();

//app.UseStaticFiles(new StaticFileOptions
//{
//    FileProvider = new PhysicalFileProvider(
//        Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads")
//    ),
//    RequestPath = "/api/uploads"
//});

//// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

//app.UseHttpsRedirection();

//app.UseStaticFiles();
//app.UseRouting();
//app.UseCors("StudyApp");

//app.UseAuthorization();

//app.MapControllers();
//app.MapHub<AttemptHub>("/hubs/attempt");

//app.Run();


// Program.cs
using CloudinaryDotNet;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;
using StudyApp.API.Cloudinary;
using StudyApp.API.Data;
using StudyApp.API.Domain.Interfaces;
using StudyApp.API.Hubs;
using StudyApp.API.Mappings;
using StudyApp.API.Repositories;
using StudyApp.API.Services.Implementations;
using StudyApp.API.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<ApplicationDbContext>(option =>
{
    option.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

//cloudinary cloud for video and image upload
builder.Services.Configure<CloudinarySettings>(
    builder.Configuration.GetSection("CloudinarySettings"));

builder.Services.AddSingleton(x =>
{
    var config = x.GetRequiredService<IOptions<CloudinarySettings>>().Value;
    return new CloudinaryDotNet.Cloudinary(
        new CloudinaryDotNet.Account(
            config.CloudName,
            config.ApiKey,
            config.ApiSecret
        )
    );
});


builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 524_288_000; // 500 MB
});

// SignalR
builder.Services.AddSignalR();

// Add Base Repository
builder.Services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
builder.Services.AddScoped<IPapersRepository, PapersRepository>();
builder.Services.AddScoped<IApplicationUserRepository, ApplicationUserRepository>();
builder.Services.AddScoped<ISessionRepository, SessionRepository>();
builder.Services.AddScoped<IUserLoginRepository, UserLoginRepository>();
builder.Services.AddScoped<IQuestionRepository, QuestionRepository>();
builder.Services.AddScoped<IOptionRepository, OptionRepository>();
builder.Services.AddScoped<IMockRepository, MockRepository>();
builder.Services.AddScoped<IMockQuestionRepository, MockQuestionRepository>();
builder.Services.AddScoped<IMockOptionRepository, MockOptionRepository>();
builder.Services.AddScoped<IStudentEnrollRepository, StudentEnrollRepository>();
builder.Services.AddScoped<IContactRepository, ContactRepository>();
builder.Services.AddScoped<ISubscriberRepository, SubscriberRepository>();
builder.Services.AddScoped<ILecturesRepository, LecturesRepository>();
builder.Services.AddScoped<ITestResultRepository, TestResultRepository>();
builder.Services.AddScoped<IAttemptRepository, AttemptRepository>();
builder.Services.AddScoped<IStudentLectureRepository, StudentLectureRepository>();


// Register Services
builder.Services.AddScoped<IAuthenticationServices, AuthenticationServices>();
builder.Services.AddScoped<ISessionServices, SessionServices>();
builder.Services.AddScoped<IPaperServices, PaperServices>();
builder.Services.AddScoped<IQuestionServices, QuestionServices>();
builder.Services.AddScoped<IOptionServices, OptionServices>();
builder.Services.AddScoped<IMockServices, MockServices>();
builder.Services.AddScoped<IMockQuestionServices, MockQuestionServices>();
builder.Services.AddScoped<IMockOptionServices, MockOptionServices>();
builder.Services.AddScoped<IStudentEnrollServices, StudentEnrollServices>();
builder.Services.AddScoped<IContactServices, ContactServices>();
builder.Services.AddScoped<ISubscriberServices, SubscriberServices>();
builder.Services.AddScoped<ILectureServices, LectureServices>();
builder.Services.AddScoped<ITestResultServices, TestResultServices>();
builder.Services.AddScoped<IAttemptService, AttemptService>();
builder.Services.AddScoped<IStudentLectureService, StudentLectureService>();


// Mapster config
MappingConfig.RegisterMappings();

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("StudyApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // your Next.js frontend URL
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // only if you're using cookies/auth
    });
});

// Add controllers and swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Serve uploaded files (static)
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads")
    ),
    RequestPath = "/api/uploads"
});

// Development diagnostics and swagger UI
if (app.Environment.IsDevelopment())
{
    // Show detailed exception page in development to help debug negotiate errors
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

// IMPORTANT: Routing -> CORS -> Authentication/Authorization -> MapHub/Controllers
app.UseRouting();

// Apply CORS BEFORE mapping hubs/controllers so negotiate requests are allowed
app.UseCors("StudyApp");

// If you use authentication, enable it here (uncomment and ensure services are configured)
// app.UseAuthentication();

app.UseAuthorization();

// Map hubs and controllers
// Map the hub endpoint (negotiate will be handled here)
app.MapHub<AttemptHub>("/hubs/attempt");

// Map API controllers
app.MapControllers();

app.Run();

