import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

export default function ShowCase1Lesson2IntermediateCourse() {
  const code = `function HelloWorld() {
  return <h1>Hello, React Basics!</h1>;
}
`;

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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          border: '1px solid #ddd',
        }}
      >
        <h1>Hello, React Basics!</h1>
      </div>
    </div>
  );
}