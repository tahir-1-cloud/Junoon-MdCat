using Mapster;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;
using StudyApp.API.Models;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Services.Implementations
{
    public class PaperServices : IPaperServices
    {
        private readonly IPapersRepository _papersRepository;

        public PaperServices(IPapersRepository papersRepository)
        {
            _papersRepository = papersRepository;
        }

        public async Task AddPaper(CreatePaperModel request)
        {
            Paper paper = new Paper
            {
                Title = request.Title,
                TestConductedOn = request.TestConductionDate
            };

            await _papersRepository.AddAsync(paper);
        }

        public async Task<IEnumerable<PaperModel>> GetPapers()
        {
            IEnumerable<Paper> enumerable = await _papersRepository.GetAsync();
            return enumerable.Adapt<IEnumerable<PaperModel>>();
        }

        public async Task<PaperModel> GetPaperWithQuestions(int paperId)
        {
            Paper? paper = await _papersRepository.GetPaperWithQuestions(paperId);
            PaperModel data = paper.Adapt<PaperModel>();

            return data;
        }

        public async Task DeletePaper(int paperId)
        {
            await _papersRepository.DeletePaperAsync(paperId);
        }

        public async Task AssignPaperToSession(int paperId, int sessionId)
        {
            await _papersRepository.AssignPaperToSessionAsync(paperId, sessionId);
        }

        public async Task UnassignPaperFromSession(int paperId, int sessionId)
        {
            var entry = await _papersRepository.GetPaperSession(paperId, sessionId);

            if (entry == null)
                throw new Exception("Paper is not assigned to this session.");

            await _papersRepository.RemovePaperSession(entry);
        }




        public async Task<IEnumerable<AssignedPaperDto>> GetAssignedPapersForStudent(int studentId)
        {
            // repository handles the query and any student->session filtering
            var list = await _papersRepository.GetAssignedPapersForStudent(studentId);
            return list;
        }

        public async Task<IEnumerable<StudentAttemptDto>> GetAttemptsForStudent(int studentId)
        {
            return await _papersRepository.GetAttemptsForStudent(studentId);
        }

        public async Task<StartAttemptResponse> StartAttempt(StartAttemptModel model)
        {
            var paper = await _papersRepository.GetPaperWithQuestions(model.PaperId);
            if (paper == null) throw new Exception("Paper not found");

            var isAssigned = await _papersRepository.IsPaperAssignedToAnySession(model.PaperId);
            if (!isAssigned)
            {
                throw new Exception("Paper is not assigned to any session");
            }
            var existing = await _papersRepository.GetInProgressAttempt(model.PaperId, model.StudentId);
            if (existing != null)
            {
                return new StartAttemptResponse { AttemptId = existing.Id };
            }
            var completed = await _papersRepository.GetCompletedAttempt(model.PaperId, model.StudentId);
            if (completed != null)
            {
                throw new Exception("You have already completed this test.");
            }

            var newAttempt = new StudentAttempt
            {
                PaperId = model.PaperId,
                StudentId = model.StudentId,
                Status = "InProgress",
                AttemptedOn = DateTime.UtcNow,
                StartedAt = DateTime.UtcNow
            };

            await _papersRepository.AddAttempt(newAttempt);

            return new StartAttemptResponse { AttemptId = newAttempt.Id };
        }

        public async Task<StudentAttemptDto?> GetAttemptById(int attemptId)
        {
            return await _papersRepository.GetAttemptById(attemptId);
        }

    }
}
