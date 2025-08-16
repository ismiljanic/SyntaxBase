import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

export default function ShowCase4Lesson3AdvancedCourse() {
  const code = `interface User {
  name: string;
  age: number;
  email: string;
}

// Make all properties optional
type PartialUser = Partial<User>;

const updateUser: PartialUser = {
  age: 35
};

console.log(updateUser); // { age: 35 }
`;

  const updateUser = { age: 35 };

  return (
    <div style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
      <div style={{ flex: 1 }}>
        <h2>TypeScript Utility Types - Try it yourself</h2>
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
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          fontSize: '1.2rem',
          border: '1px solid #ddd',
        }}
      >
        <div>
          <strong>Updated User:</strong>
          <pre>{JSON.stringify(updateUser, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}