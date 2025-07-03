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
	const (
		master  = `Names:{{block "list" .}}{{"\n"}}{{range .}}{{println "-" .}}{{end}}{{end}}`
		overlay = `{{define "list"}} {{join . ", "}}{{end}} `
	)
	var (
		funcs     = template.FuncMap{"join": strings.Join}
		guardians = []string{"Gamora", "Groot", "Nebula", "Rocket", "Star-Lord"}
	)
	masterTmpl, err := template.New("master").Funcs(funcs).Parse(master)
	if err != nil {
		log.Fatal(err)
	}
	overlayTmpl, err := template.Must(masterTmpl.Clone()).Parse(overlay)
	if err != nil {
		log.Fatal(err)
	}
	if err := masterTmpl.Execute(os.Stdout, guardians); err != nil {
		log.Fatal(err)
	}
	if err := overlayTmpl.Execute(os.Stdout, guardians); err != nil {
		log.Fatal(err)
	}
}*/

test(' Go example', () => {
  const master = `Names:{{block "list" .}}{{"\n"}}{{range .}}{{println "-" .}}{{end}}{{end}}`;
  const overlay = `{{define "list"}} {{join . ", "}}{{end}} `;

  const funcs = { join: (strings = [], sep) => strings.join(sep) };
  const guardians = ['Gamora', 'Groot', 'Nebula', 'Rocket', 'Star-Lord'];

  const masterTmpl = new Template('master').funcs(funcs).parse(master);
  const overlayTmpl = masterTmpl.clone().parse(overlay);

  expect(masterTmpl.execute(guardians)).toMatchInlineSnapshot(`
"Names:
- Gamora
- Groot
- Nebula
- Rocket
- Star-Lord
"
`);

  expect(overlayTmpl.execute(guardians)).toMatchInlineSnapshot(
    `"Names: Gamora, Groot, Nebula, Rocket, Star-Lord"`,
  );
});
