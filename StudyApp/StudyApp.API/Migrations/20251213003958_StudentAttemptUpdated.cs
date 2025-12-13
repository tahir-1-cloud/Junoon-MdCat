using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyApp.API.Migrations
{
    /// <inheritdoc />
    public partial class StudentAttemptUpdated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_StudentAttempts_PaperId",
                table: "StudentAttempts");

            migrationBuilder.AlterColumn<int>(
                name: "StudentId",
                table: "StudentAttempts",
                type: "int",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.CreateIndex(
                name: "IX_StudentAttempts_PaperId_StudentId",
                table: "StudentAttempts",
                columns: new[] { "PaperId", "StudentId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_StudentAttempts_StudentId",
                table: "StudentAttempts",
                column: "StudentId");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentAttempts_ApplicationUsers_StudentId",
                table: "StudentAttempts",
                column: "StudentId",
                principalTable: "ApplicationUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentAttempts_ApplicationUsers_StudentId",
                table: "StudentAttempts");

            migrationBuilder.DropIndex(
                name: "IX_StudentAttempts_PaperId_StudentId",
                table: "StudentAttempts");

            migrationBuilder.DropIndex(
                name: "IX_StudentAttempts_StudentId",
                table: "StudentAttempts");

            migrationBuilder.AlterColumn<long>(
                name: "StudentId",
                table: "StudentAttempts",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_StudentAttempts_PaperId",
                table: "StudentAttempts",
                column: "PaperId");
        }
    }
}
