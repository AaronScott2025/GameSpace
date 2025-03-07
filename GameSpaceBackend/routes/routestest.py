import requests
import json


BASE_URL = "http://127.0.0.1:5000"

def test_media_get():
    url = f"{BASE_URL}/mediaGet/"
    params = {'offset': 0}
    response = requests.get(url, params=params)
    print("Testing /mediaGet endpoint")
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
        'id': '1',
        'Username': 'gamer123',
        'Top5Games': 'Apex Legends, Fortnite, PUBG, Valorant, Overwatch',
        'PlayerType': 'Casual',
        'PlayerTypeInts': '1, 2, 3',
        'Description': 'Looking for a duo partner'
    }
    response = requests.get(url, params=params)
    print("Testing /matchmaker endpoint")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

if __name__ == "__main__":
    test_media_get()
    test_chatbot()
    test_matchmaker()
