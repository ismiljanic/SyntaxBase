import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

export default function ShowCase1Lesson3AdvancedCourse() {
    const code = `interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
};

function getUserInfo(user: User): string {
  return \`User \${user.name} has email \${user.email}\`;
}

console.log(getUserInfo(user));
`;

    const user = { id: 1, name: "Alice", email: "alice@example.com" };

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
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    border: '1px solid #ddd',
                }}
            >
                <div>
                    <strong>User Info:</strong>
                </div>
                <div>
                    {`User ${user.name} has email ${user.email}`}
                </div>
            </div>
        </div>
    );
}