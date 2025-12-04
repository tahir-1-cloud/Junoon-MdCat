using Microsoft.EntityFrameworkCore;
using StudyApp.API.Data;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;

namespace StudyApp.API.Repositories
{
    public class QuestionRepository : BaseRepository<Question>, IQuestionRepository
    {
        public QuestionRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Question> AddQuestionWithOptionsAsync(Question question)
        {
            _context.Questions.Add(question);
            await _context.SaveChangesAsync();
            return question;
        }

        public async Task<List<Question>> GetQuestionsByPaperIdAsync(int paperId)
        {
            return await _context.Questions
                .Where(q => q.PaperId == paperId)
                .Include(q => q.Options)
                .ToListAsync();
        }
        public async Task DeleteQuestionAsync(int questionId)
        {
            var question = await _context.Questions
                .Include(q => q.Options)
                .FirstOrDefaultAsync(q => q.Id == questionId);

            if (question == null)
                throw new KeyNotFoundException($"Question with id {questionId} not found.");

            // mark question as deleted
            question.IsDeleted = true;
            question.IsActive = false;
            question.UpdatedAt = DateTime.UtcNow;
            question.UpdatedBy = 1; // adjust if you have user context

            // mark related options as deleted too
            if (question.Options != null)
            {
                foreach (var opt in question.Options)
                {
                    opt.IsDeleted = true;
                    opt.IsActive = false;
                    opt.UpdatedAt = DateTime.UtcNow;
                    opt.UpdatedBy = 1;
                }
            }

            await _context.SaveChangesAsync();
        }

    }
}
