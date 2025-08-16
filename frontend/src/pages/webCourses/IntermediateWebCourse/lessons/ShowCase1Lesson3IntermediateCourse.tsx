import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

export default function ShowCase1Lesson3IntermediateCourse() {
  const code = `import React, { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}`;

  return (
    <div style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
      <div style={{ flex: 1 }}>
        <h2>Live Counter</h2>
        <CodeMirror
          value={code}
          extensions={[javascript({ jsx: true })]}
          height="200px"
          theme="dark"
        />
      </div>
      <div style={{ flex: 1, background: '#fff', padding: '1rem', borderRadius: '5px', border: '1px solid #ddd' }}>
        <CounterPreview />
      </div>
    </div>
  );
}

function CounterPreview() {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
