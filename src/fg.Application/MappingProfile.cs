using AutoMapper;
using fg.Application.DTOs;
using fg.Domain.Entities;

namespace fg.Application
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<CreateItemRequest, Items>();
            CreateMap<UpdateItemRequest, Items>();
        }
    }

    public class UserMappingProfile : Profile
    {
        public UserMappingProfile()
        {
            CreateMap<CreateUserRequest, User>();
            CreateMap<UpdateUserRequest, User>();
        }
    }
}
