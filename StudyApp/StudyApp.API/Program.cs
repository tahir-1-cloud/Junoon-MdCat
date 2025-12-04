using Microsoft.EntityFrameworkCore;
using StudyApp.API.Data;
using StudyApp.API.Domain.Interfaces;
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

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("StudyApp");

app.UseAuthorization();

app.MapControllers();

app.Run();
