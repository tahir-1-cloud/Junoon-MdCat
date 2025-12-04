using Mapster;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;
using StudyApp.API.Dto;
using StudyApp.API.Models;
using StudyApp.API.Repositories;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Services.Implementations
{
    public class MockServices: IMockServices
    {
        private readonly IMockRepository _mockRepository;
        public MockServices(IMockRepository mockRepository)
        {
            _mockRepository = mockRepository;

        }
        public Task AddMockPaper(CreateMockTestDto request)
        {
            MockTest mock = new MockTest();
            {
                mock.Title = request.Title;
                mock.TestConductedOn = request.TestConductedOn;

            }
            return _mockRepository.AddAsync(mock);
        }

        public async Task<IEnumerable<CreateMockTestDto>> GetMockPapers()
        {
            IEnumerable<MockTest> enumerable = await _mockRepository.GetAsync();
            return enumerable.Adapt<IEnumerable<CreateMockTestDto>>();
        }

        
    }
}
