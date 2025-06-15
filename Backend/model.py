import pickle
import requests
import pandas as pd
from flask_cors import CORS
from flask import Flask, jsonify, abort
import random
import os
import ast
import random

movies_dict = pickle.load(open('movie_dict.pkl','rb'))
movies = pd.DataFrame(movies_dict)
similarity = pickle.load(open('similarity.pkl','rb'))


movies = movies.dropna(axis=1)

# print(movies.iloc[0])



# Initialize Flask app
app = Flask(__name__)  # Fix _name_ to __name__

# Enable CORS for all routes
CORS(app)

# print(movies['id'].dtype)


# async def fetch_poster(movie_id):
#     response = await "https://api.themoviedb.org/3/movie/{movie_id}?api_key=d28ff6dda1970828595671f95edaae76&language=en-US".format(movie_id)
#     data = response.json()
#     return "https://image.tmdb.org/t/p/w500" + data['poster_path']
        


# for i in movies:
#     movie_id = movies.iloc[i[3]]
#     movies.iloc[i['poster_path']] = fetch_poster(movie_id)
    
# print(movies.iloc[0])



def recommend(movie_name):
    index = movies[movies['title'] == movie_name].index[0]
    distances = sorted(list(enumerate(similarity[index])),reverse=True,key = lambda x: x[1])
    
    recommended_movies = []
    for i in distances[1:31]:
        recommended_movies.append(movies.iloc[i[0]].to_dict())
    return recommended_movies


# Route to return 30 recommended movies
@app.route('/recommend/<name>', methods=['GET'])
def cosine_similarity(name):
    suggestions = recommend(name)
    return jsonify(suggestions)




# Route to fetch unique genres
@app.route('/genres', methods=['GET'])
def get_unique_genres():
    genres_column = movies["genres"].dropna()  # Drop NaN values if any

    all_genres = []

    for genre in genres_column:
        try:
            # Safely convert the string to a list using ast.literal_eval
            genre_list = eval(genre)  # This safely parses the list string
            all_genres.extend(genre_list)  # Flatten the list into the all_genres list
        except (ValueError, SyntaxError):
            # Skip any badly formatted genre strings
            continue

    # Get unique genres by converting to a set and then back to a list
    unique_genres = list(set(all_genres))
    
    # Capitalize the first letter of each genre
    capitalized_genres = [genre.capitalize() for genre in unique_genres]
    
    return jsonify(capitalized_genres)





# Route to fetch 30 random movies
@app.route('/movies/genres/all', methods=['GET'])
def get_random_movies_unfiltered():
    try:
        # Randomly sample 30 movies from the entire dataset
        random_movies = movies.sample(n=30, random_state=random.randint(0, 999999999))
        
        # Convert the sample to a list of dictionaries (for JSON response)
        movies_list = random_movies.to_dict(orient='records')
        
        # Return the movies as a JSON response
        return jsonify(movies_list)

    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {e}"}), 500




# Route to fetch 30 random movies based on a specific genre
@app.route('/movies/genres/<genre>', methods=['GET'])
def get_movies_by_genre(genre):
    try:
        genre = genre.lower()

        def genre_match(gstr):
            try:
                genre_list = ast.literal_eval(gstr.lower())
                return genre in genre_list
            except (ValueError, SyntaxError):
                return False

        # Filter movies safely
        matching_movies = movies[
            movies['genres'].apply(lambda x: genre_match(x) if isinstance(x, str) else False)
        ]

        if matching_movies.empty:
            return jsonify({"message": f"No movies found for genre: {genre}"}), 404

        sampled_movies = matching_movies.sample(
            n=min(30, len(matching_movies)),
            random_state=random.randint(0, 999999999)
        )

        return jsonify(sampled_movies.to_dict(orient='records'))

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500





# Route to fetch all movie titles
@app.route('/movies/titles', methods=['GET'])
def get_movie_titles():
    try:
        # Extract the 'title' column from the movies DataFrame
        movie_titles = movies['title'].dropna().tolist()  # Drop NaN values if any
        
        # Return the movie titles as a JSON response
        return jsonify(movie_titles)
    
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {e}"}), 500




# Flask entry point
if __name__ == '__main__':  # Fix _name_ to __name__
    app.run(port=5000, debug=True)
