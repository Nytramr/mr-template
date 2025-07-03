import { Template } from '../../index';

/* Original GoLang code example

package main

import (
	"log"
	"os"
	"strings"
	"text/template"
)

func main() {
	// First we create a FuncMap with which to register the function.
	funcMap := template.FuncMap{
		// The name "title" is what the function will be called in the template text.
		"title": strings.Title,
	}

	// A simple template definition to test our function.
	// We print the input text several ways:
	// - the original
	// - title-cased
	// - title-cased and then printed with %q
	// - printed with %q and then title-cased.
	const templateText = `
Input: {{printf "%q" .}}
Output 0: {{title .}}
Output 1: {{title . | printf "%q"}}
Output 2: {{printf "%q" . | title}}
`

	// Create a template, add the function map, and parse the text.
	tmpl, err := template.New("titleTest").Funcs(funcMap).Parse(templateText)
	if err != nil {
		log.Fatalf("parsing: %s", err)
	}

	// Run the template to verify the output.
	err = tmpl.Execute(os.Stdout, "the go programming language")
	if err != nil {
		log.Fatalf("execution: %s", err)
	}

}

}*/

test('Func Go example', () => {
  const functionMap = {
    // The name "title" is what the function will be called in the template text.
    title: (str) => {
      return str
        .split('"')
        .map(
          (phrase) =>
            phrase &&
            phrase
              .split(' ')
              .map((word) => {
                const firstChar = word.charAt(0);
                return word.replace(firstChar, firstChar.toUpperCase());
              })
              .join(' '),
        )
        .join('"');
    },
  };

  const templateText = `
Input: {{printf "%q" .}}
Output 0: {{title .}}
Output 1: {{title . | printf "%q"}}
Output 2: {{printf "%q" . | title}}
`;

  const template = new Template('letter')
    .funcs(functionMap)
    .parse(templateText);

  expect(template.execute('the go programming language'))
    .toMatchInlineSnapshot(`
"
Input: "the go programming language"
Output 0: The Go Programming Language
Output 1: "The Go Programming Language"
Output 2: "The Go Programming Language"
"
`);
});
