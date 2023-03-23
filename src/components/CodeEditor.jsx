import { languageOptions } from "@/constants/languageOptions";
import Editor from "@monaco-editor/react";
import React, { useEffect, useState } from "react";

export default function CodeEditor({ onChange, lang, theme }) {
  const [value, setValue] = useState("");
  const handleEditorChange = (value) => {
    setValue(value);
    onChange("code", value);
  };
  useEffect(() => {
    setValue(languageOptions.find((l) => l.name === lang).default.runner);
  }, [lang]);
  return (
    <Editor
      height="70vh"
      // width="95%"
      language={lang || "c"}
      value={value}
      theme={theme || "vs-dark"}
      onChange={handleEditorChange}
    />
  );
}
