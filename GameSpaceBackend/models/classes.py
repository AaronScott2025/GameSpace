from typing import List

from pydantic import BaseModel, EmailStr, Field, ConfigDict
from dataclasses import dataclass


@dataclass
class Coaching:
    Username = str
    CoachID = str
    Title = str
    Description = str
    name = str


@dataclass
class CommunityEvents:
    EventID = str
    lat = float
    lon = float
    Description = str


@dataclass
class Clans:
    Username = str
    ClanID = str
    Title = str
    Description = str
    Logo = str

@dataclass
class Posts:
    Username = str
    PostID = str
    PostContent = str
    PostAttachment = str

@dataclass
class Users:
    UserID = str
    password = str
    Email = str

@dataclass
class Profile:
    Id = str
    Username = str
    Bio = str
    FavoriteGames = List[str]
    ProfilePicture = str
    Followers = List[str]

@dataclass
class DuoMatching:
    id = str
    Username = str
    Top5Games = List[str]
    PlayerType = List[str]
    Description = str

@dataclass
class Marketplace:
    Username = str
    SaleID = str
    Title = str
    Description = str
    Picture = str

