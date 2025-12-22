namespace SpendWiseApi.Service.DTOs;

public class ReportDto
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal TotalIncome { get; set; }
    public decimal TotalExpenses { get; set; }
    public decimal NetAmount { get; set; }
    public List<CategoryExpenseDto> CategoryExpenses { get; set; } = new();
}

