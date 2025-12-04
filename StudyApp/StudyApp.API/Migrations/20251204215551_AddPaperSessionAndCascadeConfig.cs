using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyApp.API.Migrations
{
    /// <inheritdoc />
    public partial class AddPaperSessionAndCascadeConfig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PaperSessions",
                columns: table => new
                {
                    PaperId = table.Column<int>(type: "int", nullable: false),
                    SessionId = table.Column<int>(type: "int", nullable: false),
                    AssignedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AssignedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaperSessions", x => new { x.PaperId, x.SessionId });
                    table.ForeignKey(
                        name: "FK_PaperSessions_Papers_PaperId",
                        column: x => x.PaperId,
                        principalTable: "Papers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PaperSessions_Sessions_SessionId",
                        column: x => x.SessionId,
                        principalTable: "Sessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StudentAttempts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PaperId = table.Column<int>(type: "int", nullable: false),
                    StudentId = table.Column<long>(type: "bigint", nullable: false),
                    AttemptedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Score = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentAttempts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudentAttempts_Papers_PaperId",
                        column: x => x.PaperId,
                        principalTable: "Papers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PaperSessions_SessionId",
                table: "PaperSessions",
                column: "SessionId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentAttempts_PaperId",
                table: "StudentAttempts",
                column: "PaperId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PaperSessions");

            migrationBuilder.DropTable(
                name: "StudentAttempts");
        }
    }
}
