import React, { useContext } from "react";
import ReactMarkdown from "react-markdown";
import {
  NormalComponents,
  SpecialComponents,
} from "react-markdown/src/ast-to-react";
import { Prism } from "react-syntax-highlighter";
import {
  materialLight,
  materialOceanic,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import gfm from "remark-gfm";
import { MainContext } from "../context/context";

interface Props {
  content: string;
}

function Markdown({ content }: Props) {
  const { isDark } = useContext(MainContext);

  const components: Partial<NormalComponents & SpecialComponents> = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <Prism
          style={isDark ? materialOceanic : materialLight}
          language={match[1]}
          children={String(children).trim()}
          {...props}
        />
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className="md-preview">
      <ReactMarkdown components={components} remarkPlugins={[gfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default Markdown;
