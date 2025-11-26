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
    }
}
