from supabase import create_client, Client
from os import environ
import numpy as np

from GameSpaceBackend.models.classes import DuoMatching


def importSpecificProfiles(supabase, match):
    response = supabase.table("duo_matchmaker").select("*").execute()
    data = response.data  # Extract data
    processed_data = []
    favorite_games_response = supabase.table("favorite_games").select("*").execute()
    favorite_games_data = favorite_games_response.data

    games_response = supabase.table("games").select("*").execute()
    games_data = games_response.data
    games_dict = {game["id"]: game["title"] for game in games_data}

    for user in data:
        player_type_str = user.get("playerType", "")
        user["playerType"] = [ptype.strip().replace('"', '') for ptype in player_type_str.split(",")] if player_type_str else []

        user_fav_games = [
            games_dict.get(fav_game["game_id"])
            for fav_game in favorite_games_data if fav_game["profile_id"] == user["id"] # Get user's favorite games by matching profile_id in favorite_games
        ]
        user["top_5_games"] = [game for game in user_fav_games if game]  # Filter out None values
        processed_data.append(user)

    datafilter = [
        user for user in processed_data if any(game in match.top5games for game in user["top_5_games"]) # Atleast 1 game in common
    ]

    duoList = [
        DuoMatching(
            username=item["username"],
            top5games=item["top_5_games"],
            playertype=item["playerType"],
            playertypeints=item["playerTypeInts"],
            description=item["description"],
            weight=float(item.get("weight", 0)),
            age=item.get("age")
        )
        for item in datafilter
    ]

    return data, duoList


def matchMaking(duoList, match):
    origin = np.array(clean_int_data(match.playertypeints)) #Clean int data, and put into array
    for item in duoList: #All potential matches
        item_vector = np.array(clean_int_data(item.playertypeints)) #Clean int data, put into array

        item.weight = np.linalg.norm(item_vector - origin) #Euclidean distance in a 5d plane

    duoList.sort(key=lambda x: x.weight) #Sort in Ascending order (larger num = less compatible)

    ageList = []

    if match.age > 18:
        for item in duoList:
            if(item.age > 18):
                ageList.append(item)
    elif match.age <= 18 and match.age > 25:
        for item in duoList:
            if(item.age <= 18 and item.age > 25):
                ageList.append(item)
    else:
        for item in duoList:
            if(item.age < 25):
                ageList.append(item)

    return ageList


def clean_int_data(data_str):
    # If data_str is already a list, directly return it
    if isinstance(data_str, list):
        return [int(i) for i in data_str if isinstance(i, int)]
    # Otherwise, clean the string as before
    cleaned_data = data_str.replace("[", "").replace("]", "").replace('"', '').replace("'", "").strip()
    return [int(i) for i in cleaned_data.split(",") if i.strip().isdigit()]
