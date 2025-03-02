from os import environ
from urllib import request
from supabase import create_client, Client

from flask import Flask, jsonify

app = Flask(__name__)

SUPABASE_URL = "https://xfmccwekbxjkrjwuheyv.supabase.co"
SUPABASE_API_KEY = environ.get("supabase")

supabase = create_client(SUPABASE_URL, SUPABASE_API_KEY)

@app.route('/media/', methods= ['GET', 'POST'])
def media():
    if request.method == 'POST':
        data = request.get_json()
        item_name = data['name']

        response = supabase.table('')
        if response.error:
            return jsonify({'error': response.error.message}),400
        return jsonify({'message': "{item_name}"}), 200


if __name__ == '__main__':
    app.run(debug=True)