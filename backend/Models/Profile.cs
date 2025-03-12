using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace backend.Models
{
[Table("profiles")]
    public class Profile : BaseModel
    {


        [PrimaryKey("id", false)]   
        public int id { get; set; }
        [Column("user_id")]
        public string user_id { get; set; }


        [Column("username")]
        public string username { get; set; }

        

    }
}