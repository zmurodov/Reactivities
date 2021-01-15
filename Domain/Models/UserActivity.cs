﻿using System;

namespace Domain.Models
{
    public class UserActivity
    {
        public string AppUserId { get; set; }
        public Guid ActivityId { get; set; }
        public DateTime DateJoined { get; set; }
        public bool IsHost { get; set; }
        public virtual AppUser AppUser { get; set; }
        public virtual Activity Activity { get; set; }
    }
}