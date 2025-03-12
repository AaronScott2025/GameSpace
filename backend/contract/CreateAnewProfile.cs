using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.contract
{
    public class CreateAnewProfile
    {
        public int id { get; set; }
        public string user_id { get; set; }
        public string username { get; set; }
    }
}