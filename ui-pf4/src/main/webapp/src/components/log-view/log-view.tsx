import React from "react";
import { useState, useRef, useEffect, useCallback } from "react";

import "./log-view.scss";

export interface LogViewProps {
  headerText: string;
  lines: string[];
  isStreamActive: boolean;
}

const FUDGE_FACTOR = 105;

export const LogView: React.FC<LogViewProps> = ({
  headerText,
  lines,
  isStreamActive,
}) => {
  const scrollPane = useRef<any>();
  const logContents = useRef<any>();

  const [height, setHeight] = useState<number>(400);

  const scrollToBottom = useCallback(() => {
    if (isStreamActive) {
      if (scrollPane && isStreamActive) {
        scrollPane.current.scrollTop = scrollPane.current.scrollHeight;
      }
    }
  }, [isStreamActive]);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom, lines]);

  const handleResize = useCallback(() => {
    if (!scrollPane) {
      return;
    }

    const scrollPaneTop = scrollPane.current.getBoundingClientRect().top;
    const targetHeight = Math.floor(
      window.innerHeight - scrollPaneTop - FUDGE_FACTOR
    );
    setHeight(targetHeight);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize, { passive: true });
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return (
    <div className="log-view__component">
      <div className="log-window__header">{headerText}</div>
      <div className="log-window__body">
        <div className="log-window__scroll-pane" ref={scrollPane}>
          <div
            className="log-window__contents"
            ref={logContents}
            style={{ height }}
          >
            <div className="log-window__contents__text">
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
          </div>
        </div>
      </div>
    </div>
  );
};
