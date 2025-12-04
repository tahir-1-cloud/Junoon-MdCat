using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyApp.API.Migrations
{
    /// <inheritdoc />
    public partial class added_new_tables_change : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FirstName",
                table: "ApplicationUsers");

            migrationBuilder.RenameColumn(
                name: "LastName",
                table: "ApplicationUsers",
                newName: "FullName");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationUsers_SessionId",
                table: "ApplicationUsers",
                column: "SessionId");

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationUsers_Sessions_SessionId",
                table: "ApplicationUsers",
                column: "SessionId",
                principalTable: "Sessions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationUsers_Sessions_SessionId",
                table: "ApplicationUsers");

            migrationBuilder.DropIndex(
                name: "IX_ApplicationUsers_SessionId",
                table: "ApplicationUsers");

            migrationBuilder.RenameColumn(
                name: "FullName",
                table: "ApplicationUsers",
                newName: "LastName");

            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                table: "ApplicationUsers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
