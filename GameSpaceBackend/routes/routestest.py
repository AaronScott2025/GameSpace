import requests
import json
import os
from dotenv import load_dotenv
import openai
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '.env'))
load_dotenv(dotenv_path=env_path)

BASE_URL = "http://127.0.0.1:5000"
OPEN_AI_KEY = os.getenv("OPEN_AI")

def test_media_get():
    url = f"{BASE_URL}/mediaGet/"
    params = {'offset': 0}
    response = requests.get(url, params=params)
    print("Testing /mediaGet endpoint")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

def test_marketplace():
    url = f"{BASE_URL}/marketplaceGet/"
    params = {'offset': 0}  # Start with an offset of 0
    response = requests.get(url, params=params)
    print("Testing /marketplaceGet endpoint with offset 0")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

    # Test with a different offset ( 5 for the next set of records)
    params = {'offset': 5}
    response = requests.get(url, params=params)
    print("Testing /marketplaceGet endpoint with offset 5")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

def test_chatbot():
    url = f"{BASE_URL}/chatbot/"
    data = {
        "userinfo": {
            "username": "gamer123",
            "bio": "Love gaming",
            "favoritegames": "Apex Legends, Fortnite",
        },
        "message": "Give me some game suggestions"
    }
    response = requests.post(url, json=data)
    print("Testing /chatbot endpoint")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

def test_matchmaker():
    url = f"{BASE_URL}/matchmaker/"
    params = {
        'username': 'gamer123',
        'Top5Games': 'Apex Legends,Fortnite,PUBG,Valorant,Overwatch',
        'PlayerType': 'Supportive/Backline, Exclusive(1 or 2 games at a time), Casual, Never, 1-3 Hours',
        'PlayerTypeInts': '3, 2, 4, 3, 1',
        'Description': 'Looking for a duo partner',
        'Weight': '1.5'
    }
    response = requests.get(url, params=params)
    print("Testing /matchmaker endpoint")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

def test_logo_gen():
    url = f"{BASE_URL}/logogen/"
    params = {
        'prompt': 'profile picture about call of duty'  # Replace with your desired prompt
    }
    response = requests.post(url, params=params)  # Use params for query parameters
    print("Testing /logogen endpoint")
    print(f"Status Code: {response.status_code}")
    try:
        print(f"Response: {response.json()}")
    except json.JSONDecodeError:
        print("Response is not in JSON format")
        print(f"Response Text: {response.text}")

if __name__ == "__main__":
     #test_media_get()
    # test_chatbot()
    #est_matchmaker()
    #test_marketplace()
    test_logo_gen()
