import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import '../../../../styles/webCourses/BeginnerWebCourse/ShowCase1.css';
import { transform } from '@babel/standalone';

export function ShowCase7Lesson5() {
    const [jsxContent, setJsxContent] = useState(`// Define the Post interface
interface Post {
    id: number;
    title: string;
    body: string;
}

// Create a functional component that fetches posts
function PostsList() {
    const [posts, setPosts] = React.useState<Post[]>([]);
    
    React.useEffect(() => {
        // Fetch posts from the API
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(response => response.json())
            .then(data => setPosts(data));
    }, []);
    
    return (
        <div>
            <h1>Posts</h1>
            {posts.map(post => (
                <div key={post.id} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
                    <h2>{post.title}</h2>
                    <p>{post.body}</p>
                </div>
            ))}
        </div>
    );
}

// Render the PostsList component dynamically
ReactDOM.render(
    <PostsList />,
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
