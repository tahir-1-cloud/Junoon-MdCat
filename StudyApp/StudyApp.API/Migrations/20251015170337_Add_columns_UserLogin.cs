using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyApp.API.Migrations
{
    /// <inheritdoc />
    public partial class Add_columns_UserLogin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ExpiresAt",
                table: "UserLogins",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Token",
                table: "UserLogins",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "UserLogins",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_UserLogins_UserId",
                table: "UserLogins",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserLogins_ApplicationUsers_UserId",
                table: "UserLogins",
                column: "UserId",
                principalTable: "ApplicationUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserLogins_ApplicationUsers_UserId",
                table: "UserLogins");

            migrationBuilder.DropIndex(
                name: "IX_UserLogins_UserId",
                table: "UserLogins");

            migrationBuilder.DropColumn(
                name: "ExpiresAt",
                table: "UserLogins");

            migrationBuilder.DropColumn(
                name: "Token",
                table: "UserLogins");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "UserLogins");
        }
    }
}
