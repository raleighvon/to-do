import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: []
    };
  }

  getTodos = () => {
    axios.get(`http://quip-todos.herokuapp.com/get_todos?email=example@gmail.com`)
    .then(res => {
      const posts = res.data.map(obj => obj)
      this.setState({ posts })
    });
  }

  addTodo = (params) => {
    let that = this
    axios.post(`http://quip-todos.herokuapp.com/add_todo`, params)
    .then(function (response) {
      that.getTodos()
      that.clearInput()
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  completeTodo = (params) => {
    let that = this
    axios.post(`http://quip-todos.herokuapp.com/mark_completed`, params)
    .then(function (response) {
      that.getTodos()
    })
    .catch(function (error) {
      that.getTodos()
      console.log(error);
    });
  }

  resetTodos = () => {
    let that = this
    let reset = window.confirm(" There is no turning back. Are you sure you want to do that?");

    if (reset) {
      var params = new URLSearchParams();
      params.append('email', 'example@gmail.com');
      axios.post(`http://quip-todos.herokuapp.com/reset`, params)
      .then(function (response) {
        that.getTodos()
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }

  serialize = (task) => {
    var params = new URLSearchParams();
    params.append('email', 'example@gmail.com');
    params.append('text', task.text);
    if (task.id) {
      params.append('id', task.id);
    }
    params.append('completed', task.completed);
    return params
  }

  submitTodo = () => {
    this.addTodo(this.serialize({text: this.state.task}))
  }

  handleChange(event) {
    this.setState({task: event.target.value})
  }

  handleClick = (data) => {
    data.completed = !data.completed
    this.completeTodo(this.serialize(data))
  }

  clearInput = () => {
    this.state.task = "";
  }

  componentDidMount() {
    this.getTodos()
  }

  render() {
    return (
      <div className="App">
        <div class="form">
          <input
            class="task-input"
              type="text"
              placeholder="Enter Task"
              name="task"
              placeholder="Add a to do..."
              value={this.state.task}
              onChange={this.handleChange.bind(this)}/>
          <div class="button-wrapper">
            <button onClick={this.submitTodo}>Add To Do</button>
          </div>
        </div>

        <div>
          <ul>
            {this.state.posts.map(post =>
              <li className={(post.completed ? 'checked' : '')} key={post.id} onClick={this.handleClick.bind(null, post)}>
                <span class="checkbox"></span>
                <span class="task">{post.text}</span>
              </li>
            )}
          </ul>
          <button onClick={this.resetTodos}>Reset To Dos</button>
        </div>
      </div>
    );
  }
}

export default App;
