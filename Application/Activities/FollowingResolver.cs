﻿using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class FollowingResolver : IValueResolver<UserActivity, AttendeeDto, bool>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;

        public FollowingResolver(DataContext context, IUserAccessor userAccessor)
        {
            _context = context;
            _userAccessor = userAccessor;
        }

        public bool Resolve(UserActivity source, AttendeeDto destination, bool destMember, ResolutionContext context)
        {
            var currentUser = _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername())
                .Result;

            if (currentUser.Followings.Any(x => x.TargetId == source.AppUserId))
                return true;

            return false;
        }
    }
}