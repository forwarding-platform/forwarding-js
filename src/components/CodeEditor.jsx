import { languageOptions } from "@/constants/languageOptions";
import Editor from "@monaco-editor/react";
import React, { useEffect, useState } from "react";

export default function CodeEditor({
  onChange,
  lang,
  theme,
  practice = false,
}) {
  const [value, setValue] = useState("");
  const handleEditorChange = (value) => {
    setValue(value);
    onChange("code", value);
  };
  useEffect(() => {
    if (practice)
      setValue(languageOptions.find((l) => l.name === lang).default.practice);
    else setValue(languageOptions.find((l) => l.name === lang).default.runner);
  }, [lang, practice]);
  return (
    <Editor
      height="70vh"
      options={{ minimap: { enabled: false } }}
      // width="95%"
      language={lang || "c"}
      value={value}
      theme={theme || "vs-dark"}
      onChange={handleEditorChange}
    />
  );
}
