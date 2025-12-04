using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyApp.API.Migrations
{
    /// <inheritdoc />
    public partial class MockTest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MockTestId",
                table: "Quesions",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MockQuestionId",
                table: "Options",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "MockTests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TestConductedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MockTests", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MockQuestions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MockTestId = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MockQuestions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MockQuestions_MockTests_MockTestId",
                        column: x => x.MockTestId,
                        principalTable: "MockTests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MockOptions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OptionText = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsCorrect = table.Column<bool>(type: "bit", nullable: false),
                    MockQuestionId = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MockOptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MockOptions_MockQuestions_MockQuestionId",
                        column: x => x.MockQuestionId,
                        principalTable: "MockQuestions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Quesions_MockTestId",
                table: "Quesions",
                column: "MockTestId");

            migrationBuilder.CreateIndex(
                name: "IX_Options_MockQuestionId",
                table: "Options",
                column: "MockQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_MockOptions_MockQuestionId",
                table: "MockOptions",
                column: "MockQuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_MockQuestions_MockTestId",
                table: "MockQuestions",
                column: "MockTestId");

            migrationBuilder.AddForeignKey(
                name: "FK_Options_MockQuestions_MockQuestionId",
                table: "Options",
                column: "MockQuestionId",
                principalTable: "MockQuestions",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Quesions_MockTests_MockTestId",
                table: "Quesions",
                column: "MockTestId",
                principalTable: "MockTests",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Options_MockQuestions_MockQuestionId",
                table: "Options");

            migrationBuilder.DropForeignKey(
                name: "FK_Quesions_MockTests_MockTestId",
                table: "Quesions");

            migrationBuilder.DropTable(
                name: "MockOptions");

            migrationBuilder.DropTable(
                name: "MockQuestions");

            migrationBuilder.DropTable(
                name: "MockTests");

            migrationBuilder.DropIndex(
                name: "IX_Quesions_MockTestId",
                table: "Quesions");

            migrationBuilder.DropIndex(
                name: "IX_Options_MockQuestionId",
                table: "Options");

            migrationBuilder.DropColumn(
                name: "MockTestId",
                table: "Quesions");

            migrationBuilder.DropColumn(
                name: "MockQuestionId",
                table: "Options");
        }
    }
}
