import * as React from "react";

import "./log-view.scss";

export interface LogViewProps {
  lines: string[];
}

export const LogView: React.FC<LogViewProps> = ({ lines }) => {
  return (
    <div className="log-view__component">
      <div className="log-view">
        {/* <div className="log-scroll log-scroll-top target-logger-node">
          <a className="follow-links">
            <span>Follow</span>
            <span>Stop following</span>
          </a>
        </div> */}
        <div className="log-view-output">
          <table>
            <tbody>
              {lines.map((line, i) => (
                <tr key={i} className="log-line">
                  <td className="log-line-number">{i}</td>
                  <td className="log-line-text">{line}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* <div className="log-scroll log-scroll-bottom">
          <a className="follow-links">Go to top</a>
        </div> */}
      </div>
    </div>
  );
};
