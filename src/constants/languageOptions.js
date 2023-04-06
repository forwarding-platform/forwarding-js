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
      practice: `// Sample code to perform I/O:
#include <stdio.h>

int main(){
	int num;
	
  // Reading input from STDIN
	scanf("%d", &num);
  // Writing output to STDOUT              			
	printf("Input number is %d.", num);       
}

// Warning: Printing unwanted or ill-formatted data to output will cause the test cases to fail`,
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
      practice: `// Sample code to perform I/O:
#include <iostream>

using namespace std;

int main() {
	int num;
  // Reading input from STDIN
	cin >> num;			
  // Writing output to STDOUT							
	cout << "Input number is " << num << endl;		
}

// Warning: Printing unwanted or ill-formatted data to output will cause the test cases to fail`,
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
      practice: `// Sample code to perform I/O:
using  System;

public class MyClass {
  public static void Main() {
    // Reading input from STDIN
	string input = Console.ReadLine();
	// Writing output to STDOUT
	Console.WriteLine("Your input is {0}", input);
  }
}

// Warning: Printing unwanted or ill-formatted data to output will cause the test cases to fail`,
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
      practice: `// Sample code to perform I/O:
package main
import "fmt"

func main() {
  var input string
  // Reading input from STDIN
  fmt.Scanf("%s", &input)            
  // Writing output to STDOUT
  fmt.Println("Your input is", input)       
}

// Warning: Printing unwanted or ill-formatted data to output will cause the test cases to fail
`,
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
      practice: `// Sample code to perform I/O:
import java.util.*;

public class Main {
    public static void main(String[] args) {
      Scanner scanner = new Scanner(System.in);
      // Reading input from STDIN
      String input = scanner.nextLine();
      // Writing output to STDOUT
      System.out.println("Your input is " + input);
    }
}

// Warning: Printing unwanted or ill-formatted data to output will cause the test cases to fail`,
    },
  },
  {
    value: 63,
    label: "JavaScript (Node.js 12.14.0)",
    name: "javascript",
    default: {
      runner: `// Write your code here
`,
      practice: `// Sample code to perform I/O:

process.stdin.resume();
process.stdin.setEncoding("utf-8");
var stdin_input = "";

// Reading input from STDIN
process.stdin.on("data", function (input) {
  stdin_input += input;                               
});

process.stdin.on("end", function () {
  main(stdin_input);
});

function main(input) {
  // Writing output to STDOUT
  process.stdout.write(input);
}

// Warning: Printing unwanted or ill-formatted data to output will cause the test cases to fail
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
      practice: `# Sample code to perform I/O:

# Reading input from STDIN
inputString = input()                  
# Writing output to STDOUT
print('Your input is %s.' % inputString)         

# Warning: Printing unwanted or ill-formatted data to output will cause the test cases to fail`,
    },
  },
  //   {
  //     value: 74,
  //     label: "TypeScript (3.7.4)",
  //     name: "typescript",
  //     default: {
  //       runner: `// Write your code here
  // `,
  //       practice: `// Sample code to perform I/O:

  // process.stdin.resume();
  // process.stdin.setEncoding("utf-8");
  // var stdin_input = "";

  // // Reading input from STDIN
  // process.stdin.on("data", function (input) {
  //   stdin_input += input;
  // });

  // process.stdin.on("end", function () {
  //   main(stdin_input);
  // });

  // function main(input) {
  //   // Writing output to STDOUT
  //   process.stdout.write(input);
  // }

  // // Warning: Printing unwanted or ill-formatted data to output will cause the test cases to fail`,
  //     },
  //   },
];
