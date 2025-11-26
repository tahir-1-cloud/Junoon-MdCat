using Microsoft.EntityFrameworkCore;
using StudyApp.API.Domain.Entities;

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
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Added Query Filter
            modelBuilder.Entity<ApplicationUser>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<Session>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<Paper>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<Question>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<Option>().HasQueryFilter(x => !x.IsDeleted);
            modelBuilder.Entity<UserLogin>().HasQueryFilter(x => !x.IsDeleted);
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
