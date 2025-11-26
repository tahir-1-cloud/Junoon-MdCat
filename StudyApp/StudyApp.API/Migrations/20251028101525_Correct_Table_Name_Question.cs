using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyApp.API.Migrations
{
    /// <inheritdoc />
    public partial class Correct_Table_Name_Question : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Options_Quesions_QuestionId",
                table: "Options");

            migrationBuilder.DropForeignKey(
                name: "FK_Quesions_MockTests_MockTestId",
                table: "Quesions");

            migrationBuilder.DropForeignKey(
                name: "FK_Quesions_Papers_PaperId",
                table: "Quesions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Quesions",
                table: "Quesions");

            migrationBuilder.DropIndex(
                name: "IX_Quesions_MockTestId",
                table: "Quesions");

            migrationBuilder.DropColumn(
                name: "MockTestId",
                table: "Quesions");

            migrationBuilder.RenameTable(
                name: "Quesions",
                newName: "Questions");

            migrationBuilder.RenameIndex(
                name: "IX_Quesions_PaperId",
                table: "Questions",
                newName: "IX_Questions_PaperId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Questions",
                table: "Questions",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Options_Questions_QuestionId",
                table: "Options",
                column: "QuestionId",
                principalTable: "Questions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Questions_Papers_PaperId",
                table: "Questions",
                column: "PaperId",
                principalTable: "Papers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Options_Questions_QuestionId",
                table: "Options");

            migrationBuilder.DropForeignKey(
                name: "FK_Questions_Papers_PaperId",
                table: "Questions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Questions",
                table: "Questions");

            migrationBuilder.RenameTable(
                name: "Questions",
                newName: "Quesions");

            migrationBuilder.RenameIndex(
                name: "IX_Questions_PaperId",
                table: "Quesions",
                newName: "IX_Quesions_PaperId");

            migrationBuilder.AddColumn<int>(
                name: "MockTestId",
                table: "Quesions",
                type: "int",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Quesions",
                table: "Quesions",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Quesions_MockTestId",
                table: "Quesions",
                column: "MockTestId");

            migrationBuilder.AddForeignKey(
                name: "FK_Options_Quesions_QuestionId",
                table: "Options",
                column: "QuestionId",
                principalTable: "Quesions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Quesions_MockTests_MockTestId",
                table: "Quesions",
                column: "MockTestId",
                principalTable: "MockTests",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Quesions_Papers_PaperId",
                table: "Quesions",
                column: "PaperId",
                principalTable: "Papers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
