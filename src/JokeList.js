import React from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

class JokeList extends React.Component {
  constructor(numJokesToGet = 10) {
    super((numJokesToGet = 10));
    this.state = { jokes: [] };
    this.numJokesToGet = numJokesToGet;
    this.generateNewJokes = this.generateNewJokes.bind(this);
    this.vote = this.vote.bind(this);
  }

  async componentDidMount() {
    if (this.state.jokes.length < this.numJokesToGet) this.getJokes();
  }

  async componentDidUpdate() {
    if (this.state.jokes.length < this.numJokesToGet) this.getJokes();
  }

  async getJokes() {
    let j = [...this.state.jokes];
    let seenJokes = new Set();
    try {
      while (j.length < this.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" },
        });
        let { status, ...jokeObj } = res.data;

        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          j.push({ ...jokeObj, votes: 0 });
        } else {
          console.error("duplicate found!");
        }
      }
      this.setState({ jokes: j });
    } catch (e) {
      console.log(e);
    }
  }

  async generateNewJokes() {
    console.log("generating new jokes");
    this.setState({ jokes: [] });
  }

  vote(id, delta) {
    let allJokes = [...this.state.jokes];
    let newState = allJokes.map((j) =>
      j.id === id ? { ...j, votes: j.votes + delta } : j
    );
    this.setState({ jokes: newState });
  }

  render() {
    const sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);
    console.log(sortedJokes);
    return (
      <div className="JokeList">
        <button className="JokeList-getmore" onClick={this.generateNewJokes}>
          Get New Jokes
        </button>

        {sortedJokes
          ? sortedJokes.map((j) => (
              <Joke
                text={j.joke}
                key={j.id}
                id={j.id}
                votes={j.votes}
                vote={this.vote}
              />
            ))
          : null}
      </div>
    );
  }
}

export default JokeList;
