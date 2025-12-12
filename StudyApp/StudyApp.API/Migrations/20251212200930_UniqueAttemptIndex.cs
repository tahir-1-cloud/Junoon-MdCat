using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyApp.API.Migrations
{
    /// <inheritdoc />
    public partial class UniqueAttemptIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropIndex(
            //    name: "IX_StudentAttempts_PaperId",
            //    table: "StudentAttempts");

            //migrationBuilder.CreateIndex(
            //    name: "IX_StudentAttempts_PaperId_StudentId",
            //    table: "StudentAttempts",
            //    columns: new[] { "PaperId", "StudentId" },
            //    unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_StudentAttempts_PaperId_StudentId",
                table: "StudentAttempts");

            migrationBuilder.CreateIndex(
                name: "IX_StudentAttempts_PaperId",
                table: "StudentAttempts",
                column: "PaperId");
        }
    }
}
