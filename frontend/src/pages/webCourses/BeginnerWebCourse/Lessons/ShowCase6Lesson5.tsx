import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import '../../../../styles/webCourses/BeginnerWebCourse/ShowCase1.css';
import { transform } from '@babel/standalone';

export function ShowCase6Lesson5() {
    const [jsxContent, setJsxContent] = useState(`// Generics and Union Types Example

// A generic function that takes a value which can be either a string or a number
function displayValue<T extends string | number>(value: T) {
    return <p>Value: {value}</p>;
}

function App() {
    const [inputValue, setInputValue] = React.useState<string | number>('');
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Check if the input value is a number or string
        setInputValue(isNaN(Number(value)) ? value : Number(value));
    };

    return (
        <div>
            <h1>Generics and Union Types Example</h1>
            <input type="text" value={inputValue} onChange={handleInputChange} placeholder="Enter a value..." />
            {displayValue(inputValue)}  {/* Call the generic function */}
        </div>
    );
}

// Render the App component dynamically
ReactDOM.render(
    <App />,
    document.getElementById('root')
);
`);


    const updateIframe = () => {
        const iframe = document.getElementById('iframeResult') as HTMLIFrameElement | null;
        if (iframe) {
            const transpiledCode = transform(jsxContent, {
                presets: ['typescript', 'react'],
                filename: 'file.tsx'
            }).code;

            iframe.srcdoc = `
                <div id="root"></div>
                <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
                <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
                <script>
                    ${transpiledCode}
                </script>
            `;
        }
    };

    return (
        <div className="container">
            <div className="leftPane">
                <h2 className="heading">TypeScript Code Editor</h2>

                <CodeMirror
                    value={jsxContent}
                    extensions={[javascript({ jsx: true })]}
                    onChange={(value: React.SetStateAction<string>) => setJsxContent(value)}
                    theme="dark"
                    height="950px"
                    className="codeMirror"
                />

                <button className="button" onClick={updateIframe}>Run TypeScript</button>
            </div>

            <div className="rightPane">
                <h3 className="heading">Output</h3>
                <iframe
                    id="iframeResult"
                    className="iframe"
                    title="Output"
                ></iframe>
            </div>
        </div>
    );
}
