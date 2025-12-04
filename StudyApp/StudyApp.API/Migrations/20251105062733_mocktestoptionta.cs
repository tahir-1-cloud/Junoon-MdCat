using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyApp.API.Migrations
{
    /// <inheritdoc />
    public partial class mocktestoptionta : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Options_MockQuestions_MockQuestionId",
                table: "Options");

            migrationBuilder.DropIndex(
                name: "IX_Options_MockQuestionId",
                table: "Options");

            migrationBuilder.DropColumn(
                name: "MockQuestionId",
                table: "Options");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MockQuestionId",
                table: "Options",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Options_MockQuestionId",
                table: "Options",
                column: "MockQuestionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Options_MockQuestions_MockQuestionId",
                table: "Options",
                column: "MockQuestionId",
                principalTable: "MockQuestions",
                principalColumn: "Id");
        }
    }
}
