import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';
import './App.css';

const initialFormState = { name: "", description: ""};

function App() {

  const [todos, setTodos] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect( () => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    const apiData = await API.graphql({ query: queries.listTodos });
    setTodos(apiData.data.listTodos.items);
  }

  async function createTodo() {
    if (!formData.name) return;

    await API.graphql(
      {
        query: mutations.createTodo,
        variables: {
          input: formData
        }
      }
    )
    
    setTodos([...todos, formData]);
    setFormData(initialFormState);
  }

  async function deleteTodo({ id }){
    if (!window.confirm("Do you want to delete this Todo!!")) return;
    const newTodosArray = todos.filter( todo => todo.id !== id);
    setTodos(newTodosArray);
    await API.graphql(
      {
        query: mutations.deleteTodo,
        variables: {
          input: { id }
        }
      })
  }

  return (
    <div className="App">
      <div className="todos_top">
        <h1> Todos </h1>
        <div className="todos_input">
          <input
            onChange={e => setFormData({ ...formData, 'name': e.target.value})}
            placeholder="Todo name"
            value={formData.name}
          />
          <input
            onChange={e => setFormData({ ...formData, 'description': e.target.value})}
            placeholder="Todo description"
            value={formData.description}
          />
        </div>
        <button className="button_create" onClick={createTodo}>Create Todo</button>
      </div>
      <div className="container">
        {
          todos.map(todo => (
            <div className="todoItems" key={todo.id}>
              <div> 
                <h2>{todo.name}</h2>
                <p>{todo.description}</p>
              </div>
              <button className="button_delete" onClick={() => deleteTodo(todo)}>Delete todo</button>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default App;