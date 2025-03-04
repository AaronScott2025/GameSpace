from supabase import create_client, Client
from os import environ

from GameSpaceBackend.models.classes import DuoMatching


def importSpecificProfiles(supabase,match):
    response = supabase.table("duo_matchmaker").select("*").execute() #All duo candidates
    data = response.data #Data in var
    datafilter = [ #Filter to only include users with ATLEAST 1 game match in top 5 games
        user for user in data
        if any(game in match.Top5Games for game in user["top_5_games"])
    ]

    duoList = [ #Put all data into DuoMatching data class list
        DuoMatching(
            id=item["id"],
            Username=item["username"],
            Top5Games=item["top_5_games"],
            PlayerType=item["playerType"],
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
            id=item["id"],
            Username=item["username"],
            Top5Games=item["top_5_games"],
            PlayerType=item["playerType"],
            Description = item["Description"]
        )
        for item in data
    ]
    return duoList #Return all candidates in list


def matchMaking(duoList,supabase,match):
    print("wip")

def convertToNumericData(user):
    print("wip")

