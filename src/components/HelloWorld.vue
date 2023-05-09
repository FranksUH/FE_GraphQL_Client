<script>
import gql from 'graphql-tag';

const MOVIES_QUERY = gql`query {
  movies
  {
    id,
    title,
    description,
    releaseDate
  }
  }`

const MOVIE_ADD = gql`mutation ($newMovie: AddMovieInput!) {
  addMovie(input: $newMovie)
  {
    movie {
      id,
      title,
      description,
      releaseDate
    }
  }
}`

const MOVIES_SUBSCRIBE_ADD = gql`subscription {
  movieAdded {
    id,
    title,
    description,
    releaseDate
  }
}`

const MOVIES_SUBSCRIBE_REMOVE = gql`subscription{
  movieRemoved {
    id
  }
}`

const MOVIES_REMOVE = gql`mutation ($removeId: RemoveMovieInput!) {
  removeMovie (input: $removeId)
  {
    uUID
  }
}`

export default {
  props:{
    msg: String
  },
  apollo: {
    movies: {
      query: MOVIES_QUERY,
      subscribeToMore: [{
        document: MOVIES_SUBSCRIBE_ADD,
        updateQuery: (previousResult, {subscriptionData}) => {          
          return {
            ...previousResult,
            movies: [...previousResult.movies, subscriptionData.data.movieAdded]
          }
        }
      },
      {
        document: MOVIES_SUBSCRIBE_REMOVE,
        updateQuery: (previousResult, {subscriptionData}) => {   
          
          console.log('Data from subsciption: ', previousResult.movies.filter(x => x.id !== subscriptionData.data.movieRemoved.id));
          
          return {
            ...previousResult,
            movies: previousResult.movies.filter(x => x.id !== subscriptionData.data.movieRemoved.id)
          }
        }
      }]
    },
  },
  data() {
    return {
      newTitle: '',
      newDescription: '',
    }
  },
  methods: {
    removeMovie(id)
    {
      console.log('removing', id);
      this.$apollo.mutate({
        //query
        mutation: MOVIES_REMOVE,
        //variables
        variables: {  
          removeId: { id }
        }
      })
      .then((data) =>
      {})
    },
    addMovie()
    {
      this.$apollo.mutate({
        //query
        mutation: MOVIE_ADD,
        //variables
        variables: {
          newMovie: {
            title: this.newTitle,
            description: this.newDescription,
            instructor: 'Default instructor'
          }
        },
        /*
        update: (store, { data: { addMovie: {movie} } }) => {

          // Read the data from our cache for this query.
          let data = store.readQuery({ query: MOVIES_QUERY })

          // Add our tag from the mutation to the end
          data = {
            ...data,
            movies: [
              ...data.movies,
              movie,
            ],
          }

          // Write our data back to the cache.
          store.writeQuery({ query: MOVIES_QUERY, data })
        }*/
      })
      .then((data)=>
      {
      })
    }
  }
}
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <div class="content-list" v-for="movie in movies" :id="movie.id">
      <div>
        <h2>{{ movie.title }}</h2>
        <h3>Release date: </h3><p>{{ movie.releaseDate }}</p>
        <h3>Description: </h3><p>{{ movie.description }}</p>
        <button class="remove-bt" @click="removeMovie(movie.id)">Remove</button>
      </div>
    </div>
  </div>

  <form @submit.prevent="addMovie">
    <div class="form_row">
      <p>Title</p>
      <input v-model="newTitle" type="text">
    </div>
    <div class="form_row">
      <p>Description</p>
      <textarea v-model="newDescription" placeholder="Add the description here"></textarea>
    </div>
    <br>
    <div class="form_row">
      <button class="add-bt">Add</button>
    </div>
  </form>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

div {
  margin-top: 20px;
}

form {
  margin-bottom: 100px;
  margin-top: 50px;
  margin-left: 50%;
  background-color: rgb(216, 223, 223);
  border-radius: 5px;
}

input {
  width: 100%;
  border-radius: 5px;
}

textarea {
  width: 100%;
  border-radius: 5px;
}

button {
  width: 50%;
  margin-left: 25%;  
}

.content-list {
  width: 100%;
  margin-left: 50%;
}

.remove-bt{
  background-color: #f44336;
  border-style: hidden;
  border-radius: 6px;
  font-size: 16px;
  color: white;
}

.add-bt{
  background-color: #4CAF50;
  border-style: hidden;
  border-radius: 6px;
  font-size: 16px;
  color: white;
}

.greetings h1{
  text-align: center;
  margin-top: 50px;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
