using Microsoft.OpenApi.Models;
using Supabase;
using Supabase.Interfaces;
using backend.Models;
using backend.contract;
using backend.Models;
using Microsoft.VisualBasic;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

 builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// Add OpenAPI/Swagger services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "GameSpace", Description = "Gaming hub", Version = "v1" });
});

builder.Services.AddScoped<Supabase.Client>(
    _ => new Supabase.Client(
        builder.Configuration["Supabase:Url"] ?? throw new ArgumentNullException("Supabase:Url"),
        builder.Configuration["Supabase:Key"] ?? throw new ArgumentNullException("Supabase:Key"),
        new SupabaseOptions()
        {
            AutoRefreshToken = true,
            AutoConnectRealtime = true
        }
    )
);







var app = builder.Build();




// Enable middleware to serve generated Swagger as a JSON endpoint in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "GameSpace v1");
    });
}

// Example endpoint to fetch tasks


 app.UseHttpsRedirection();

  app.UseCors();



  app.MapPost("/users", async (CreateNewUser request, Supabase.Client client) =>{
    var newUser = new User{
        username = request.username,
        email = request.email,
        password = request.password,
        is_active = request.is_active
    };
    var response =  await client.From<User>().Insert(newUser);

   var newNewUser  =  response.Models.First();

   return Results.Ok(newNewUser.id);

   });

    app.MapPost("/login", async (Login request, Supabase.Client client) =>{
     var response =  await client.Auth.SignIn(request.email, request.password);
    
     return Results.Ok(response);
    
    });

    app.MapPost("/signup", async (Login request, Supabase.Client client) =>{
     var response =  await client.Auth.SignUp(request.email, request.password);
    
     return Results.Ok(response);
    
    });
  

  



app.Run();

