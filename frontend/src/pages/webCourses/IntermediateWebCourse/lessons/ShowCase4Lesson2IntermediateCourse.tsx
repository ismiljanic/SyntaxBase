import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
export default function ShowCase4Lesson2IntermediateCourse() {
    const code = `function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo, index) => (
        <li key={index}>{todo}</li>
      ))}
    </ul>
  );
}

<TodoList todos={['Learn React', 'Build a project', 'Deploy']} />`;

    const todos = ['Learn React', 'Build a project', 'Deploy'];

    return (
        <div style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
            <div style={{ flex: 1 }}>
                <h2>React Basics - Try it yourself</h2>
                <CodeMirror
                    value={code}
                    extensions={[javascript({ jsx: true })]}
                    height="400px"
                    theme="dark"
                />
            </div>

            <div
                style={{
                    flex: 1,
                    backgroundColor: '#fff',
                    padding: '1rem',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                }}
            >
                <ul>
                    {todos.map((todo, index) => (
                        <li key={index}>{todo}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}