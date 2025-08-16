import React, { createContext, useContext } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

const ThemeContext = createContext('light');

function ThemeDisplay() {
  const theme = useContext(ThemeContext);
  return <p>Current Theme: {theme}</p>;
}

export default function ShowCase2Lesson2AdvancedCourse() {
  const code = `const ThemeContext = React.createContext('light');

function ThemeDisplay() {
  const theme = useContext(ThemeContext);
  return <p>Current Theme: {theme}</p>;
}`;

  return (
    <div style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
      <div style={{ flex: 1 }}>
        <h2>Context API - Try it yourself</h2>
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
        <ThemeContext.Provider value="dark">
          <ThemeDisplay />
        </ThemeContext.Provider>
      </div>
    </div>
  );
}