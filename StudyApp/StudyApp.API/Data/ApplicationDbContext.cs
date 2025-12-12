using Microsoft.EntityFrameworkCore;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Models;

namespace StudyApp.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {            
        }

        public DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public DbSet<Session> Sessions { get; set; }
        public DbSet<Paper> Papers { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Option> Options { get; set; }
        public DbSet<UserLogin> UserLogins { get; set; }

        public DbSet<MockTest> MockTests { get; set; }
        public DbSet<MockQuestion> MockQuestions { get; set; }

        public DbSet<MockOption> MockOptions { get; set; }

        public DbSet<StudentEnrollment> StudentEnrollments { get; set; }

        public DbSet<PaperSession> PaperSessions { get; set; }
        public DbSet<StudentAttempt> StudentAttempts { get; set; }
        public DbSet<StudentAnswer> StudentAnswers { get; set; }
        public DbSet<ContactMessage> ContactMessages { get; set; }
        public DbSet<Subscriber> Subscribers { get; set; }
        
        public DbSet<Lecture> Lectures { get; set; }
        public DbSet<TestResult> TestResults { get; set; }

        public DbSet<TestResultAnswer> TestResultAnswers { get; set; }

        public DbSet<StudentLecture> StudentLectures { get; set; }
        public DbSet<Lecturedetails> Lecturedetails { get; set; }  


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // existing query filters
            modelBuilder.Entity<ApplicationUser>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<Session>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<Paper>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<Question>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<Option>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<UserLogin>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<StudentEnrollment>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<Lecture>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<Subscriber>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<ContactMessage>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<TestResult>().HasQueryFilter(x => !x.IsDeleted);


            // --- ensure Paper -> Question -> Option cascade ---
            modelBuilder.Entity<Question>()
                .HasOne(q => q.Paper)
                .WithMany(p => p.Questions)
                .HasForeignKey(q => q.PaperId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Option>()
                .HasOne(o => o.Question)
                .WithMany(q => q.Options)
                .HasForeignKey(o => o.QuestionId)
                .OnDelete(DeleteBehavior.Cascade);

            // --- PaperSession (link table) ---
            modelBuilder.Entity<PaperSession>()
                .HasKey(ps => new { ps.PaperId, ps.SessionId });

            modelBuilder.Entity<PaperSession>()
                .HasOne(ps => ps.Paper)
                .WithMany(p => p.PaperSessions)
                .HasForeignKey(ps => ps.PaperId)
                // make relationship optional to avoid query-filter warning, or keep required and add filter for PaperSession below
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PaperSession>()
                .HasOne(ps => ps.Session)
                .WithMany(s => s.PaperSessions)
                .HasForeignKey(ps => ps.SessionId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Cascade);

            // add a query filter for dependents too (to avoid EF complaint about principal filter)
            modelBuilder.Entity<PaperSession>().HasQueryFilter(ps => !ps.IsDeleted);

            // --- StudentAttempt configuration ---
            modelBuilder.Entity<StudentAttempt>()
                .HasOne(a => a.Paper)
                .WithMany(p => p.Attempts)
                .HasForeignKey(a => a.PaperId)
                .IsRequired(false) // optional to avoid filter interaction; make required if you prefer but then add matching filters
                .OnDelete(DeleteBehavior.Cascade);

            // add query filter for StudentAttempt as well
            modelBuilder.Entity<StudentAttempt>().HasQueryFilter(a => !a.IsDeleted);

            // set precision for Score to avoid truncation (adjust precision/scale as needed)
            modelBuilder.Entity<StudentAttempt>()
                .Property(a => a.Score)
                .HasPrecision(10, 2);

            modelBuilder.Entity<TestResultAnswer>()
                .HasOne(a => a.TestResult)
                .WithMany(r => r.TestResultAnswers)
                .HasForeignKey(a => a.TestResultId)
                .OnDelete(DeleteBehavior.Cascade);   // ALLOWED

                    modelBuilder.Entity<TestResultAnswer>()
                        .HasOne(a => a.Question)
                        .WithMany()
                        .HasForeignKey(a => a.QuestionId)
                        .OnDelete(DeleteBehavior.Restrict);  // FIXED

                    modelBuilder.Entity<TestResultAnswer>()
                        .HasOne(a => a.SelectedOption)
                        .WithMany()
                        .HasForeignKey(a => a.SelectedOptionId)
                        .OnDelete(DeleteBehavior.Restrict);  // FIXED


                // --- Lecture -> StudentLecture ----------------
                    modelBuilder.Entity<StudentLecture>()
                        .HasOne(sl => sl.Students)
                        .WithMany(s => s.StudentLectures)
                        .HasForeignKey(sl => sl.StudentId)
                        .OnDelete(DeleteBehavior.Restrict);  // SAFE

                    modelBuilder.Entity<StudentLecture>()
                        .HasOne(sl => sl.Lecturedetails)
                        .WithMany(l => l.StudentLectures)
                        .HasForeignKey(sl => sl.LecturedetailId)
                        .OnDelete(DeleteBehavior.Restrict);  // SAFE

                    // Avoid duplicate assignment:
                    modelBuilder.Entity<StudentLecture>()
                        .HasIndex(sl => new { sl.StudentId, sl.LecturedetailId })
                        .IsUnique();

        }


        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker.Entries<AuditEntity>();
            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Added)
                {
                    entry.Entity.CreatedAt = DateTime.UtcNow;
                    entry.Entity.CreatedBy = 1;
                    entry.Entity.IsActive = true;
                    entry.Entity.IsDeleted = false;
                }

                if (entry.State == EntityState.Modified)
                {
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                    entry.Entity.UpdatedBy = 1;
                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
