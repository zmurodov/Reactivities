﻿using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class Add
    {
        public class Command : IRequest
        {
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer = await _context.Users.SingleOrDefaultAsync(x =>
                    x.UserName == _userAccessor.GetCurrentUsername());

                var target = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                if (target == null)
                    throw new RestException(HttpStatusCode.NotFound, new {User = "Not Found"});

                var following = await _context.Followings.SingleOrDefaultAsync(x => x.ObserverId == observer.Id
                    && x.TargetId == target.Id);

                if (following != null)
                    throw new RestException(HttpStatusCode.BadRequest,
                        new {User = "You are already following this user"});

                if (following == null)
                {
                    following = new UserFollowing
                    {
                        Target = target,
                        Observer = observer
                    };

                    _context.Followings.Add(following);
                }

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}