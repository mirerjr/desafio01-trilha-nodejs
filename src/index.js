const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  
  if(!username) {
    return response.status(400).json({error: "User was not informed"});
  }
  
  const userFound = users.find(
    (user) => user.username === username
  );
  
  if(!userFound){
    return response.status(404).json({error: "User not found"});
  }

  request.user = userFound;
  return next();
}

function checksExistsUserTodo(request, response, next){
  const { id } = request.params;
  const { user } = request;

  const todo = user.todos.find(
    todo => todo.id === id
  );

  if(!id) {
    return response.status(400).json({error: "Todo was not informed"});
  }
  
  if(!todo){
    return response.status(404).json({error: "Todo not found"});
  }

  request.todo = todo;
  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  if(!username) {
    return response.status(400).json({error: "User was not informed"});
  }

  const userFound = users.find(
    (user) => user.username === username
  );
  
  if(userFound){
    return response.status(400).json({error: "User already exists"});
  }
  
  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }
  
  const userCreated = users.push(user);
  
  return response.status(201).send(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { todos } = request.user;
  
  return response.send(todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;
  
  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  };
  
  user.todos.push(todo);

  return response.status(201).send(todo);
});

app.put('/todos/:id', checksExistsUserAccount, checksExistsUserTodo, (request, response) => {
  const { todo } = request;
  const { title, deadline } = request.body;
  
  todo.title = title;
  todo.deadline = new Date(deadline);  
  
  return response.send(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;