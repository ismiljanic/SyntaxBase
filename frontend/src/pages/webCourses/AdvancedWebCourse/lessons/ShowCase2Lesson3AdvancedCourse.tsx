import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

export default function ShowCase2Lesson3AdvancedCourse() {
  const code = `function wrapInArray<T>(value: T): T[] {
  return [value];
}

const numberArray = wrapInArray(42);
const stringArray = wrapInArray("Hello TypeScript");

console.log(numberArray); // [42]
console.log(stringArray); // ["Hello TypeScript"]
`;

  const numberArray = [42];
  const stringArray = ["Hello TypeScript"];

  return (
    <div style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
      <div style={{ flex: 1 }}>
        <h2>TypeScript Generics - Try it yourself</h2>
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
          <strong>Wrapped Values:</strong>
        </div>
        <div>{`Number Array: [${numberArray.join(", ")}]`}</div>
        <div>{`String Array: [${stringArray.join(", ")}]`}</div>
      </div>
    </div>
  );
}