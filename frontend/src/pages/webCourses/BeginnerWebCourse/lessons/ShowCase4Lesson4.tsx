import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import '../../../../styles/webCourses/BeginnerWebCourse/ShowCase1.css';

export function ShowCase4Lesson4() {
    const [htmlContent, setHtmlContent] = useState(`
<!DOCTYPE html>
<html>
<head>
    <title>Margin and Padding Examples</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center; /* Center align text */
            margin: 20px; /* Margin around the body */
        }
        .box {
            padding: 10px; /* Padding inside each box */
            background-color: lightblue; /* Box background color */
            border: 1px solid #ccc; /* Border for visibility */
        }
        .box1 {
            margin: 5px; /* Default margin for this box */
        }
        .box2 {
            margin: 15px; /* Larger margin for this box */
        }
        .box3 {
            margin: 25px; /* Even larger margin for this box */
        }
        .box4 {
            margin: 35px; /* Largest margin for this box */
        }
    </style>
</head>
<body>
    <h1>Margin and Padding Examples</h1>
    
    <div class="box box1">Box 1 (Margin 5px)</div>
    <div class="box box2">Box 2 (Margin 15px)</div>
    <div class="box box3">Box 3 (Margin 25px)</div>
    <div class="box box4">Box 4 (Margin 35px)</div>

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
