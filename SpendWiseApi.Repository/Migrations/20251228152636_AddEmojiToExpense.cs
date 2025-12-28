using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SpendWiseApi.Repository.Migrations
{
    /// <inheritdoc />
    public partial class AddEmojiToExpense : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Emoji",
                table: "Expenses",
                type: "character varying(10)",
                maxLength: 10,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Emoji",
                table: "Expenses");
        }
    }
}
