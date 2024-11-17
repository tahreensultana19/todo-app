import React, { useState } from 'react';
import { Todo } from '../interfaces/todo';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(todo.text);

  const handleEdit = () => {
    if (newText.trim() && newText !== todo.text) {
      onEdit(todo.id, newText);
      setIsEditing(false);
    }
  };

  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggleComplete(todo.id)}
      />
      {isEditing ? (
        <div>
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            style={{ marginRight: '10px', padding: '5px', width: '200px' }}
          />
          <button onClick={handleEdit}>Save</button>
        </div>
      ) : (
        <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
          {todo.text}
        </span>
      )}
      <div className="todo-item-buttons">
        <button onClick={() => onDelete(todo.id)}>Delete</button>
        {!isEditing && <button onClick={() => setIsEditing(true)}>Edit</button>}
      </div>
    </div>
  );
};

export default TodoItem;