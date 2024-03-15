using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KeywordGame.Migrations
{
    /// <inheritdoc />
    public partial class InitialV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageDesc",
                table: "FourLetters",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImagePath",
                table: "FourLetters",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageDesc",
                table: "FourLetters");

            migrationBuilder.DropColumn(
                name: "ImagePath",
                table: "FourLetters");
        }
    }
}
