using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.contract
{
    public class CreateNewUser
    {
        public string username { get; set; }
       
        public string email { get; set; }

        public string password { get; set; }

        public bool is_active { get; set; }
    }
}

