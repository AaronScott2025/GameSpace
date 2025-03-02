from typing import List

from pydantic import BaseModel, EmailStr, Field, ConfigDict
from pydantic.dataclasses import dataclass


@dataclass
class Coaching(BaseModel):
    Username = str
    CoachID = str
    Title = str
    Description = str
    name = str


@dataclass
class CommunityEvents(BaseModel):
    EventID = str
    lat = float
    lon = float
    Description = str


@dataclass
class Clans(BaseModel):
    Username = str
    ClanID = str
    Title = str
    Description = str
    Logo = str

@dataclass
class Posts(BaseModel):
    Username = str
    PostID = str
    PostContent = str
    PostAttachment = str

@dataclass
class Users(BaseModel):
    UserID = str
    password = str
    Email = str

@dataclass
class Profile(BaseModel):
    Id = str
    Username = str
    Bio = str
    FavoriteGames = List[str]
    ProfilePicture = str
    Followers = List[str]

@dataclass
class DuoMatching(BaseModel):
    Username = str
    Top5Games = List[str]
    PlayerType = List[str]
    Description = str

@dataclass
class Marketplace(BaseModel):
    Username = str
    SaleID = str
    Title = str
    Description = str
    Picture = str

