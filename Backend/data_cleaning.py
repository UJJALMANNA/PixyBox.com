import pandas as pd
import pickle
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import ast
import requests
import time


movies = pd.read_csv('tmdb.csv')

movies = movies.loc[:, ~movies.columns.str.contains('^Unnamed')]

# print(movies.columns.to_list())

movies = movies.dropna()

# TMDB api key
# api_key = 'd28ff6dda1970828595671f95edaae76'
api_key = '22202c170f9686862e8e0992fb1fa6eb'
movies['poster_path'] = ''

# Fetch posters only for rows that don't have them
def fetchPosters() :
    for index, row in movies.iterrows():
        if len(row['poster_path']):  # Skip if there already exists a poster path
            continue

        movie_id = row['id']
        url = f'https://api.themoviedb.org/3/movie/{movie_id}?api_key={api_key}&language=en-US'

        try:
            response = requests.get(url, timeout=5)
            response.raise_for_status()
            data = response.json()
            if(data['poster_path']):
                print("https://image.tmdb.org/t/p/w500" + data['poster_path'])
                full_url = "https://image.tmdb.org/t/p/w500" + data['poster_path']

            # Store the final URL in the DataFrame
            movies.at[index, 'poster_path'] = full_url


        except requests.exceptions.RequestException as e:
            print(f"Error fetching poster for movie ID {movie_id}: {e}")
            
fetchPosters()


def convert(text):
    L = []
    for i in ast.literal_eval(text):
        L.append(i['name']) 
    return L


cv = CountVectorizer(max_features=5000,stop_words='english')


try:
    # Ensure movies['soup'] has valid text
    movies['soup'] = movies['soup'].fillna('')  # Fill NaN with empty strings
    vector = cv.fit_transform(movies['soup']).toarray()

    # print("Vector shape:", vector.shape)  # Check the shape of the resulting vector
    
    similarity = cosine_similarity(vector)
    # print("Similarity matrix shape:", similarity.shape)

except Exception as e:
    print(f"Error: {e}")
    
    
# print(similarity)

def recommend(movie):
    index = movies[movies['title'] == movie].index[0]
    distances = sorted(list(enumerate(similarity[index])),reverse=True,key = lambda x: x[1])
    for i in distances[1:10]:
        print({movies.iloc[i[0]].original_title, movies.iloc[i[0]].id})
        
        
# recommend('Avatar')

# print(movies)

# print(movies.iloc[0]['vote_average'])



movies['vote_average'] = pd.to_numeric(movies['vote_average'], errors='coerce')
# print(movies[movies['vote_average'] > 6])


print(movies[movies['title'] == 'Tangled'].index[0])





pickle.dump(movies.to_dict(),open('movie_dict.pkl','wb'))
pickle.dump(similarity,open('similarity.pkl','wb'))