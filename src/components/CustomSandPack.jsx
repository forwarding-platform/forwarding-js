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
    <SandpackProvider
      template={href}
      theme={theme}
      style={{ width: "100%" }}
      options={{ recompileDelay: 1000, recompileMode: "delayed" }}
    >
      <div className="flex h-screen flex-col lg:h-[80vh] lg:flex-row">
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
            showRunButton
          />
        </div>
        <div className="flex flex-none grow basis-[30%] flex-col overflow-hidden">
          <SandpackPreview
            className="flex-none basis-1/2 overflow-scroll"
            showOpenNewtab
            showRefreshButton
            showRestartButton
          />
          <SandpackConsole className="flex-none basis-1/2 overflow-scroll" />
        </div>
      </div>
    </SandpackProvider>
  );
}
