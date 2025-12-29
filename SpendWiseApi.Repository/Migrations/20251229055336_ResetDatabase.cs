using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SpendWiseApi.Repository.Migrations
{
    /// <inheritdoc />
    public partial class ResetDatabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Emoji",
                table: "Incomes");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Emoji",
                table: "Incomes",
                type: "character varying(10)",
                maxLength: 10,
                nullable: true);
        }
    }
}
