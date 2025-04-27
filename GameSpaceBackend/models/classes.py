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
    username: str
    bio: str
    favoritegames: List[str]

@dataclass
class DuoMatching:
    username: str
    top5games: List[str]
    playertype: List[str]
    playertypeints: List[int]
    description: str
    weight: float
    age:int


@dataclass
class Marketplace:
    Username = str
    SaleID = str
    Title = str
    Description = str
    Picture = str

