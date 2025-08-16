import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

export default function ShowCase3Lesson3AdvancedCourse() {
    const code = `interface UserCardProps {
  name: string;
  age: number;
  isAdmin?: boolean; // optional prop
}

function UserCard({ name, age, isAdmin = false }: UserCardProps) {
  return (
    <div>
      <h3>{name}</h3>
      <p>Age: {age}</p>
      {isAdmin && <p>Admin User</p>}
    </div>
  );
}

<UserCard name="Alice" age={30} />
<UserCard name="Bob" age={25} isAdmin />`;

    return (
        <div style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
            <div style={{ flex: 1 }}>
                <h2>TypeScript Interfaces - Try it yourself</h2>
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
                    <h3>Alice</h3>
                    <p>Age: 30</p>
                </div>
                <div style={{ marginTop: '1rem' }}>
                    <h3>Bob</h3>
                    <p>Age: 25</p>
                    <p>Admin User</p>
                </div>
            </div>
        </div>
    );
}