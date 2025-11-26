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
    }
}
