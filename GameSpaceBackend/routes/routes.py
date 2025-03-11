import os
import sys
from dotenv import load_dotenv
import openai
from supabase import create_client, Client
from flask import Flask, jsonify, request
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '.env'))
from GameSpaceBackend.models.classes import Profile, DuoMatching
import GameSpaceBackend.services.MatchmakingService as ms
load_dotenv(dotenv_path=env_path)

SUPABASE_API_KEY = os.getenv("SUPABASE")
OPEN_AI_KEY = os.getenv("OPEN_AI")

app = Flask(__name__)

supabase = create_client("https://xfmccwekbxjkrjwuheyv.supabase.co", SUPABASE_API_KEY)


@app.route('/mediaGet/', methods=['GET'])
def mediaGet():
    try:
        offset = int(request.args.get('offset', 0))
        response = supabase.table('post').select('*').range(offset, offset + 24).execute()
        if response.data:
            return jsonify({
                "posts": response.data,
                "next_offset": offset + 25
            }), 200
        else:
            return jsonify({"message": "No more posts available"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/chatbot/', methods=['POST'])
def chatbot():
    try:
        input_data = request.get_json()
        userinfo = input_data.get('userinfo', {})
        user = Profile(
            username=userinfo.get('username', ''),
            bio=userinfo.get('bio', ''),
            favoritegames=userinfo.get('favoritegames', [])
        )
        message = input_data.get('message', '')

        # Initialize OpenAI API key
        openai.api_key = OPEN_AI_KEY

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": (
                    "You are a chatbot for a gaming social media page. "
                    "You will be talking to a user with the following background:"
                    f" Username: {user.username} "
                    f" Bio: {user.bio} "
                    f" FavoriteGames: {user.favoritegames} "
                    " Your job is to assist the user with anything they need."
                )},
                {"role": "user", "content": message}
            ]
        )
        reply = response['choices'][0]['message']['content']
        return jsonify({"response": reply}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/matchmaker/', methods=['GET'])
def matchmaker():
    try:
        mminfo = request.args
        match = DuoMatching(
            username=mminfo.get('username', ''),
            top5games=mminfo.get('Top5Games', '').split(','),
            playertype=mminfo.get('PlayerType', '').split(','),
            playertypeints=[int(i) for i in mminfo.get('PlayerTypeInts', '').split(',')],
            description=mminfo.get('Description', ''),
            weight=float(mminfo.get('Weight', 0))  # Assuming Weight is required
        )
        data,listofallduos = ms.importSpecificProfiles(supabase, match)
        listofpotentialduos = ms.matchMaking(listofallduos, match)
        return jsonify({
            'Matches': listofpotentialduos}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400



if __name__ == '__main__':
    app.run(debug=True)
