import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

export default function ShowCase2Lesson3IntermediateCourse() {
  const code = `import React, { useState } from 'react';

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, task.trim()]);
      setTask('');
    }
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div>
      <input value={task} onChange={(e) => setTask(e.target.value)} placeholder="New task" />
      <button onClick={addTask}>Add</button>
      <ul>
        {tasks.map((t, i) => (
          <li key={i}>{t} <button onClick={() => removeTask(i)}>❌</button></li>
        ))}
      </ul>
    </div>
  );
}`;

  return (
    <div style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
      <div style={{ flex: 1 }}>
        <h2>To-Do List</h2>
        <CodeMirror
          value={code}
          extensions={[javascript({ jsx: true })]}
          height="300px"
          theme="dark"
        />
      </div>
      <div style={{ flex: 1, background: '#fff', padding: '1rem', borderRadius: '5px', border: '1px solid #ddd' }}>
        <TodoPreview />
      </div>
    </div>
  );
}

function TodoPreview() {
  const [tasks, setTasks] = React.useState<string[]>([]);
  const [task, setTask] = React.useState('');

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, task.trim()]);
      setTask('');
    }
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div>
      <input value={task} onChange={(e) => setTask(e.target.value)} placeholder="New task" />
      <button onClick={addTask}>Add</button>
      <ul>
        {tasks.map((t, i) => (
          <li key={i}>{t} <button onClick={() => removeTask(i)}>❌</button></li>
        ))}
      </ul>
    </div>
  );
}
