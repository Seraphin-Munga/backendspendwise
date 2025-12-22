namespace SpendWiseApi.Service.DTOs;

public class EducationalContentDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? Category { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsPublished { get; set; }
}

