import { Template } from '../../index';

/* Original GoLang code example

 package main

import (
	"log"
	"os"
	"text/template"
)

func main() {
	// Define a template.
	const letter = `
Dear {{.Name}},
{{if .Attended}}
It was a pleasure to see you at the wedding.
{{- else}}
It is a shame you couldn't make it to the wedding.
{{- end}}
{{with .Gift -}}
Thank you for the lovely {{.}}.
{{end}}
Best wishes,
Josie
`

	// Prepare some data to insert into the template.
	type Recipient struct {
		Name, Gift string
		Attended   bool
	}
	var recipients = []Recipient{
		{"Aunt Mildred", "bone china tea set", true},
		{"Uncle John", "moleskin pants", false},
		{"Cousin Rodney", "", false},
	}

	// Create a new template and parse the letter into it.
	t := template.Must(template.New("letter").Parse(letter))

	// Execute the template for each recipient.
	for _, r := range recipients {
		err := t.Execute(os.Stdout, r)
		if err != nil {
			log.Println("executing template:", err)
		}
	}

}*/

test('Basic Go example', () => {
  const letter = `
Dear {{.Name}},
{{if .Attended}}
It was a pleasure to see you at the wedding.
{{- else}}
It is a shame you couldn't make it to the wedding.
{{- end}}
{{with .Gift -}}
Thank you for the lovely {{.}}.
{{end}}
Best wishes,
Josie
`;

  let recipients = [
    { Name: 'Aunt Mildred', Gift: 'bone china tea set', Attended: true },
    { Name: 'Uncle John', Gift: 'moleskin pants', Attended: false },
    { Name: 'Cousin Rodney', Gift: '', Attended: false },
  ];

  const template = new Template('letter').parse(letter);

  
  expect(template.execute(recipients[0])).toMatchInlineSnapshot(`
"
Dear Aunt Mildred,

It was a pleasure to see you at the wedding.
Thank you for the lovely bone china tea set.

Best wishes,
Josie
"
`);
  expect(template.execute(recipients[1])).toMatchInlineSnapshot(`
"
Dear Uncle John,

It is a shame you couldn't make it to the wedding.
Thank you for the lovely moleskin pants.

Best wishes,
Josie
"
`);
  expect(template.execute(recipients[2])).toMatchInlineSnapshot(`
"
Dear Cousin Rodney,

It is a shame you couldn't make it to the wedding.

Best wishes,
Josie
"
`);
  
});
