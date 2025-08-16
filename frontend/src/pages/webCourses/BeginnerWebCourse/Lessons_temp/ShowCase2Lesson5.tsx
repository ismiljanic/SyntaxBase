import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import '../../../../styles/webCourses/BeginnerWebCourse/ShowCase1.css';
import { transform } from '@babel/standalone';

export function ShowCase2Lesson5() {
    const [jsxContent, setJsxContent] = useState(`// TypeScript Basic Types Example:

// 1. Basic types
let age: number = 25;
let name: string = 'John';
let isStudent: boolean = true;

// 2. Array
let numbers: number[] = [1, 2, 3, 4];

// 3. Object
let person: { name: string; age: number } = {
    name: 'Alice',
    age: 30
};

// 4. Interface for structured objects
interface Car {
    brand: string;
    model: string;
    year: number;
}

let myCar: Car = {
    brand: 'Toyota',
    model: 'Corolla',
    year: 2020
};

// 5. Function with type safety
function greet(name: string): string {
    return 'Hello, ' + name;
}

//printing statements you can ignore
// Render the objects and variables dynamically
ReactDOM.render(
    <div>
        <h1>TypeScript Variables and Objects</h1>
        <p><b>Age:</b> {age}</p>
        <p><b>Name:</b> {name}</p>
        <p><b>Is Student:</b> {isStudent ? 'Yes' : 'No'}</p>
        <p><b>Numbers Array:</b> {JSON.stringify(numbers)}</p>
        <p><b>Person:</b> Name: {person.name}, Age: {person.age}</p>
        <p><b>Car:</b> {myCar.brand} {myCar.model} ({myCar.year})</p>
        <p>{greet('World')}</p>
    </div>,
    document.getElementById('root')
);
    `);

    const updateIframe = () => {
        const iframe = document.getElementById('iframeResult') as HTMLIFrameElement | null;
        if (iframe) {
            // Use Babel to transpile TypeScript to JavaScript and provide a filename
            const transpiledCode = transform(jsxContent, {
                presets: ['typescript', 'react'],
                filename: 'file.tsx' // Set the filename so Babel can apply TypeScript correctly
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
