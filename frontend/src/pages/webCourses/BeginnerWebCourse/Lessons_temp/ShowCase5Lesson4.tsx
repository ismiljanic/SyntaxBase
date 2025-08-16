import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import '../../../../styles/webCourses/BeginnerWebCourse/ShowCase1.css';

export function ShowCase5Lesson4() {
    const [htmlContent, setHtmlContent] = useState(`
<!DOCTYPE html>
<html>
<head>
    <title>Advanced Margin and Padding Examples</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center; /* Center align text */
            margin: 20px; /* Margin around the body */
        }
        .outer-box {
            padding: 20px; /* Padding inside the outer box */
            margin: 30px; /* Margin around the outer box */
            background-color: #e0f7fa; /* Light blue background */
            border: 2px solid #00695c; /* Darker border for visibility */
        }
        .inner-box {
            padding: 15px; /* Padding inside the inner box */
            margin: 10px; /* Margin around the inner box */
            background-color: #80deea; /* Lighter blue background */
            border: 1px solid #004d40; /* Darker border for visibility */
        }
        .content {
            padding: 5px; /* Padding inside the content */
            margin: 5px; /* Margin around the content */
            background-color: #b2ebf2; /* Even lighter blue */
        }
    </style>
</head>
<body>
    <h1>Advanced Margin and Padding Examples</h1>

    <div class="outer-box">
        Outer Box
        <div class="inner-box">
            Inner Box
            <div class="content">
                Content Box
            </div>
        </div>
    </div>

</body>
</html>
`);
    const updateIframe = () => {
        const iframe = document.getElementById('iframeResult') as HTMLIFrameElement | null;
        if (iframe) {
            iframe.srcdoc = htmlContent;
        }
    };

    return (
        <div className="container">
            <div className="leftPane">
                <h2 className="heading">HTML Code Editor</h2>

                <CodeMirror
                    value={htmlContent}
                    extensions={[html()]}
                    onChange={(value: React.SetStateAction<string>) => setHtmlContent(value)}
                    theme="dark"
                    height="950px"
                    className="codeMirror"
                />

                <button className="button" onClick={updateIframe}>Run HTML</button>
            </div>

            <div className="rightPane">
                <h3 className="heading">Output</h3>
                <iframe
                    id="iframeResult"
                    className="iframe"
                    srcDoc={htmlContent}
                    title="Output"
                ></iframe>
            </div>
        </div>
    );
}
