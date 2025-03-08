from supabase import create_client, Client
from os import environ
import numpy as np

from backend.models.classes import DuoMatching


def importSpecificProfiles(supabase,match):
    response = supabase.table("duo_matchmaker").select("*").execute() #All duo candidates
    data = response.data #Data in var
    datafilter = [ #Filter to only include users with ATLEAST 1 game match in top 5 games
        user for user in data
        if any(game in match.Top5Games for game in user["top_5_games"])
    ]

    duoList = [ #Put all data into DuoMatching data class list
        DuoMatching(
            Username=item["username"],
            Top5Games=item["top_5_games"],
            PlayerType=item["playerType"],
            PlayerTypeInts=['playerTypeInts'],
            Description = item["Description"]
        )
        for item in datafilter
    ]
    return duoList #Return all candidates in list

def importAllProfiles(supabase):
    response = supabase.table("duo_matchmaker").select("*").execute() #All duo candidates
    data = response.data #Data in var
    duoList = [ #Put all data into DuoMatching data class list
        DuoMatching(
            Username=item["username"],
            Top5Games=item["top_5_games"],
            PlayerType=item["playerType"],
            PlayerTypeInts=['playerTypeInts'],
            Description = item["Description"]
        )
        for item in data
    ]
    return duoList #Return all candidates in list


def matchMaking(duoList,match):
    origin = np.array((match.PlayerTypeInts[0],match.PlayerTypeInts[1],match.PlayerTypeInts[2],match.PlayerTypeInts[3],match.PlayerTypeInts[4]))
    for item in duoList:
        point = np.array((item.PlayerTypeInts[0],item.PlayerTypeInts[1],item.PlayerTypeInts[2],item.PlayerTypeInts[3],item.PlayerTypeInts[4]))
        item.weight = np.linalg.norm(point-origin)
    return duoList.sort(DuoMatching.Weight)



