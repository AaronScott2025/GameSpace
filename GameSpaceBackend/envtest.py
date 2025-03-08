from dotenv import load_dotenv
import os
import sys

# Print current working directory
print(f"Current working directory: {os.getcwd()}")

# Load the .env file from the current directory
dotenv_path = os.path.abspath(os.path.join(os.getcwd(), '.env'))
print(f"Loading .env from: {dotenv_path}")

# Check if .env file exists
if not os.path.exists(dotenv_path):
    print(f".env file does not exist at: {dotenv_path}")
    sys.exit(1)

# Load the .env file
load_dotenv(dotenv_path)

# Get environment variables
SUPABASE_API_KEY = os.getenv("SUPABASE")
OPEN_AI_KEY = os.getenv("OPEN_AI")

# Print the keys to verify they are loaded
if SUPABASE_API_KEY is None or OPEN_AI_KEY is None:
    print("Environment variables are not being loaded.")
    sys.exit(1)

print(f"Supabase API Key: {SUPABASE_API_KEY}")
print(f"OpenAI Key: {OPEN_AI_KEY}")
