from supabase import create_client, Client
from os import environ
import numpy as np

from GameSpaceBackend.models.classes import DuoMatching


def importSpecificProfiles(supabase, match):
    response = supabase.table("duo_matchmaker").select("*").execute()  # Fetch all candidates
    data = response.data  # Extract data
    processed_data = []
    for user in data:
        player_type_str = user.get("playerType", "")
        user["playerType"] = [ptype.strip().replace('"', '') for ptype in player_type_str.split(",")] if player_type_str else []
        top_5_games_str = user.get("top_5_games", "")
        # Remove extra spaces and quotation marks from top_5_games
        user["top_5_games"] = [
            game.strip().replace('"', '').replace('[', '').replace(']', '')
            for game in top_5_games_str.split(",") if game.strip()
        ] if top_5_games_str else []
        processed_data.append(user)
    # Filter users who share at least one game with `match.top5games`
    datafilter = [
        user for user in processed_data if any(game in match.top5games for game in user["top_5_games"])
    ]

    duoList = [
        DuoMatching(
            username=item["username"],
            top5games=item["top_5_games"],
            playertype=item["playerType"],
            playertypeints=item["playerTypeInts"],
            description=item["description"],
            weight=float(item.get("weight", 0))  # Assuming weight is optional
        )
        for item in datafilter
    ]

    return data, duoList



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



def matchMaking(duoList, match):
    origin = np.array(clean_int_data(match.playertypeints)) #Clean int data, and put into array
    for item in duoList: #All potential matches
        item_vector = np.array(clean_int_data(item.playertypeints)) #Clean int data, put into array

        item.weight = np.linalg.norm(item_vector - origin) #Euclidean distance in a 5d plane

    duoList.sort(key=lambda x: x.weight) #Sort in Ascending order (larger num = less compatible)
    return duoList #Return


def clean_int_data(data_str):
    # If data_str is already a list, directly return it
    if isinstance(data_str, list):
        return [int(i) for i in data_str if isinstance(i, int)]
    # Otherwise, clean the string as before
    cleaned_data = data_str.replace("[", "").replace("]", "").replace('"', '').replace("'", "").strip()
    return [int(i) for i in cleaned_data.split(",") if i.strip().isdigit()]
