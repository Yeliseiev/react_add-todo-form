import React, { useState } from 'react';
import './App.scss';
import { TodoList } from './components/TodoList';
import usersFromServer from './api/users';
import todosFromServer from './api/todos';
import { TodoWithUser, User } from './react-app-env';

const findUser = (userId: number, users: User[]) => {
  return users.find(user => user.id === userId) || null;
};

const todos: TodoWithUser[] = todosFromServer.map(todo => ({
  ...todo,
  user: findUser(todo.userId, usersFromServer),
}));

export const App: React.FC = () => {
  const [newTodos, setNewTodos] = useState(todos);
  const [newTitle, setNewTitle] = useState('');
  const [isTitleValid, setIsTitleValid] = useState(false);
  const [selectUserId, setSelectUserId] = useState(0);
  const [isSelectUserIdValid, setIsSelectUserIdValid] = useState(false);

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
    setIsTitleValid(false);
  };

  const handleUserId = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectUserId(+event.target.value);
    setIsSelectUserIdValid(false);
  };

  const reset = () => {
    setSelectUserId(0);
    setNewTitle('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (newTitle.trim().length === 0) {
      setIsTitleValid(true);
    }

    setIsSelectUserIdValid(!selectUserId);
    const newTodoId = Math.max(...todos.map(todo => todo.id)) + 1;
    const newTodo = {
      id: newTodoId,
      title: newTitle,
      completed: false,
      userId: selectUserId,
      user: findUser(selectUserId, usersFromServer),
    };

    if (newTitle.trim() && selectUserId) {
      setNewTodos(currentTodos => [...currentTodos, newTodo]);
      reset();
    }
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form
        action="/api/users"
        method="POST"
        onSubmit={handleSubmit}
      >
        <div className="field">
          <label>
            <span>Title: </span>
            <input
              type="text"
              data-cy="titleInput"
              placeholder="Enter a title"
              value={newTitle}
              onChange={handleTitle}
            />
          </label>

          {isTitleValid && (
            <span className="error">Please enter a title</span>
          )}
        </div>

        <div className="field">
          <label>
            <span>User: </span>
            <select
              data-cy="userSelect"
              value={selectUserId}
              onChange={handleUserId}
            >
              <option value="0" disabled>Choose a user</option>

              {usersFromServer.map(user => (
                <option value={user.id} key={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </label>

          {isSelectUserIdValid && (
            <span className="error">Please choose a user</span>
          )}
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>
      <TodoList
        todos={newTodos}
      />
    </div>
  );
};
