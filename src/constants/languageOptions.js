export const languageOptions = [
  {
    value: 50,
    label: "C (GCC 9.2.0)",
    name: "c",
    default: {
      runner: `#include <stdio.h>

int main(void) {
    // Write your code here

    return 0;
}`,
    },
  },
  {
    value: 54,
    label: "C++ (GCC 9.2.0)",
    name: "cpp",
    default: {
      runner: `#include <iostream>

int main() {
    // Write your code here

    return 0;
}`,
    },
  },
  {
    value: 51,
    label: "C# (Mono 6.6.0.161)",
    name: "csharp",
    default: {
      runner: `using  System;

public class MyClass {
  public static void Main() {
    // Write your code here

  }
}`,
    },
  },
  {
    value: 60,
    label: "Go (1.13.5)",
    name: "go",
    default: {
      runner: `package main
import "fmt"

func main() {
  // Write your code here

}`,
    },
  },
  {
    value: 62,
    label: "Java (OpenJDK 13.0.1)",
    name: "java",
    default: {
      runner: `public class Main {
    public static void main(String[] args) {
      // Write your code here

    }
}`,
    },
  },
  {
    value: 63,
    label: "JavaScript (Node.js 12.14.0)",
    name: "javascript",
    default: {
      runner: `// Write your code here
`,
    },
  },
  {
    value: 71,
    label: "Python (3.8.1)",
    name: "python",
    default: {
      runner: `# Write your code here
`,
    },
  },
  {
    value: 74,
    label: "TypeScript (3.7.4)",
    name: "typescript",
    default: {
      runner: `// Write your code here
`,
    },
  },
];
