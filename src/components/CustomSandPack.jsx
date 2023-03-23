import { autocompletion, completionKeymap } from "@codemirror/autocomplete";
import {
  SandpackCodeEditor,
  SandpackConsole,
  SandpackFileExplorer,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";

export default function CustomSandPack({ href, theme }) {
  return (
    <SandpackProvider template={href} theme={theme} style={{ width: "100%" }}>
      <div className="flex min-h-[80vh] flex-col lg:flex-row">
        <SandpackFileExplorer className="basis-1/5 overflow-x-auto" />
        <div className="basis-1/2">
          <SandpackCodeEditor
            showTabs
            showLineNumbers
            showReadOnly
            showInlineErrors
            closableTabs
            style={{ height: "100%" }}
            extensions={[autocompletion()]}
            extensionsKeymap={[completionKeymap]}
          />
        </div>
        <div className="flex min-h-full grow flex-col overflow-x-auto">
          <SandpackPreview className="h-full" />
          <SandpackConsole />
        </div>
      </div>
    </SandpackProvider>
  );
}
