import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { githubGist } from "react-syntax-highlighter/dist/cjs/styles/hljs";

export interface XMLEditorProps {
  name: string;
  content: string;
}

export const XMLEditor: React.FC<XMLEditorProps> = ({ name, content }) => {
  return (
    <div className="pf-c-code-editor ">
      <div className="pf-c-code-editor__header">
        <div className="pf-c-code-editor__controls">{name}</div>
        <div className="pf-c-code-editor__tab">
          <span className="pf-c-code-editor__tab-icon">
            <i className="fas fa-code"></i>
          </span>
          <span className="pf-c-code-editor__tab-text">
            {content.startsWith("<") ? "XML" : "Groovy"}
          </span>
        </div>
      </div>
      <div className="pf-c-code-editor__main">
        <div className="pf-c-code-editor__code">
          <pre className="pf-c-code-editor__code-pre">
            <SyntaxHighlighter
              language={content.startsWith("<") ? "xml" : "groovy"}
              style={githubGist}
            >
              {content}
            </SyntaxHighlighter>
          </pre>
        </div>
      </div>
    </div>
  );
};
