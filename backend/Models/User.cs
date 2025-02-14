using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace backend.Models
{
    [Table("users")]
    public class User : BaseModel
    {
        [PrimaryKey("id",false)]
        public string id { get; set; } // Changed from int to string
        [Column("username")]
        public string username { get; set; }
        [Column("email")]
        public string email { get; set; }
        [Column("password")]
        public string password { get; set; }
        [Column("is_active")]
        public bool is_active { get; set; }
        
    }
}