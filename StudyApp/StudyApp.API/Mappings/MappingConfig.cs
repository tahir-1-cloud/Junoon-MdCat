using Mapster;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Models;

namespace StudyApp.API.Mappings
{
    public static class MappingConfig
    {
        public static void RegisterMappings()
        {
            TypeAdapterConfig<CreateApplicationUserModel, ApplicationUser>
                .NewConfig()
                .Ignore(dest => dest.Session)
                .TwoWays();

            TypeAdapterConfig<ApplicationUserModel, ApplicationUser>
                .NewConfig()
                .TwoWays();

            TypeAdapterConfig<Session, SessionModel>.NewConfig()
                .TwoWays();

            TypeAdapterConfig<Paper, PaperModel>.NewConfig()
                .TwoWays();

            TypeAdapterConfig<Question, QuestionModel>.NewConfig()
                .TwoWays();

            TypeAdapterConfig<Option, OptionModel>.NewConfig()
                .TwoWays();

            TypeAdapterConfig<MockTest, MockTestModel>.NewConfig()
               .TwoWays();

            TypeAdapterConfig<MockQuestion, MockQuestionModel>.NewConfig()
             .TwoWays();


            TypeAdapterConfig<MockOption, MockQuestionModel>.NewConfig()
             .TwoWays();

          //  TypeAdapterConfig<Lecturedetails, LectureDetailsModel>.NewConfig()
          //.TwoWays();
        }
    }
}
