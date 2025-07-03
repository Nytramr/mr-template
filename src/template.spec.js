import {
  CUSTOM_FUNCTION,
  TEMPLATE_LOOKUP,
  TEMPLATE_EXECUTE_TEMPLATE,
} from './constants';
import { Constant } from './nodes';
import { createDummyNode } from './nodes/test-utils';
import { Parser } from './parser';
import { Template } from './template';

describe('Template', () => {
  let constant1 = Constant.stringConstant('Hello World');
  let constant2 = Constant.stringConstant('Goodby');
  let emptyNode = Constant.stringConstant('');

  let templateName = 'My Template';

  let funcMap = {
    join: Array.prototype.join,
  };

  let parse = jest.spyOn(Parser, 'parse');
  let generalTemplate;
  beforeEach(() => {
    generalTemplate = new Template(templateName);
    parse.mockReturnValue([]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create a template instance', () => {
    let template = new Template('template 1');
    expect(template).toBeInstanceOf(Template);
  });

  describe('addParseTree', () => {
    describe('main template', () => {
      it('should return the same template instance when using the template name', () => {
        let templateAux = generalTemplate.addParseTree(templateName, constant1);

        expect(templateAux).toBe(generalTemplate);
      });

      it('should replace its tree', () => {
        generalTemplate.addParseTree(templateName, constant1);

        expect(generalTemplate.templates[templateName]).toBeInstanceOf(
          Template,
        );
        expect(generalTemplate.templates[templateName].tree).toBe(constant1);

        generalTemplate.addParseTree(templateName, constant2);

        expect(generalTemplate.templates[templateName]).toBeInstanceOf(
          Template,
        );
        expect(generalTemplate.templates[templateName].tree).toBe(constant2);
      });

      test('an empty tree should not replace the main tree', () => {
        generalTemplate.addParseTree(templateName, constant1);

        expect(generalTemplate.templates[templateName]).toBeInstanceOf(
          Template,
        );
        expect(generalTemplate.templates[templateName].tree).toBe(constant1);

        generalTemplate.addParseTree(templateName, emptyNode);

        expect(generalTemplate.templates[templateName]).toBeInstanceOf(
          Template,
        );
        expect(generalTemplate.templates[templateName].tree).toBe(constant1);
      });
    });

    describe('sub templates', () => {
      it('should add templates to the internal templates list', () => {
        let subTemplateName1 = 'template 1';
        let subTemplateName2 = 'template 2';

        generalTemplate.addParseTree(subTemplateName1, constant1);

        expect(generalTemplate.templates[subTemplateName1]).toBeInstanceOf(
          Template,
        );
        expect(generalTemplate.templates[subTemplateName1].tree).toBe(
          constant1,
        );

        generalTemplate.addParseTree(subTemplateName2, constant2);

        expect(generalTemplate.templates[subTemplateName2]).toBeInstanceOf(
          Template,
        );
        expect(generalTemplate.templates[subTemplateName2].tree).toBe(
          constant2,
        );
      });

      it('should replace an existing template tree', () => {
        let templateName = 'template 2';

        generalTemplate.addParseTree(templateName, constant1);

        expect(generalTemplate.templates[templateName]).toBeInstanceOf(
          Template,
        );
        expect(generalTemplate.templates[templateName].tree).toBe(constant1);

        generalTemplate.addParseTree(templateName, constant2);

        expect(generalTemplate.templates[templateName]).toBeInstanceOf(
          Template,
        );
        expect(generalTemplate.templates[templateName].tree).toBe(constant2);
      });

      it('should return a new template instance when using a different name', () => {
        let templateAux = generalTemplate.addParseTree(
          'template name',
          constant1,
        );

        expect(templateAux).not.toBeUndefined();
        expect(templateAux).not.toBe(generalTemplate);
      });

      it('should not replace an existing template instance', () => {
        let templateAux1 = generalTemplate.addParseTree(
          'template name',
          constant1,
        );

        let templateAux2 = generalTemplate.addParseTree(
          'template name',
          constant2,
        );

        expect(templateAux1).not.toBeUndefined();
        expect(templateAux1).toBe(templateAux2);
      });

      test('empty trees do not replace an existing tree', () => {
        let templateAux1 = generalTemplate.addParseTree(
          'template name',
          constant1,
        );

        expect(templateAux1.tree).toBe(constant1);

        let templateAux2 = generalTemplate.addParseTree(
          'template name',
          emptyNode,
        );
        expect(templateAux2.tree).toBe(constant1);
      });
    });
  });

  describe('execute', () => {
    it('should execute the main tree with the given data', () => {
      let renderData = { name: 'John' };
      let node = createDummyNode('Hello, John!');
      generalTemplate.addParseTree(templateName, node);

      let result = generalTemplate.execute(renderData);

      expect(node.execute).toHaveBeenCalledWith(
        [renderData],
        [
          expect.objectContaining({
            $: renderData,
          }),
        ],
      );
      expect(result).toBe('Hello, John!');
    });

    it('should add the custom functions to the running scope', () => {
      let node = createDummyNode('My template');
      parse.mockReturnValue({ [templateName]: node });
      generalTemplate.funcs(funcMap).parse('').execute('Hello');

      expect(node.execute).toHaveBeenCalledWith(expect.any(Array), [
        expect.objectContaining(generalTemplate[CUSTOM_FUNCTION]),
      ]);
    });

    it('should include template functions in the running scope', () => {
      let node = createDummyNode('My template');
      generalTemplate.addParseTree(templateName, node).execute('Hello');

      expect(node.execute).toHaveBeenCalledWith(expect.any(Array), [
        expect.objectContaining({
          [TEMPLATE_LOOKUP]: expect.any(Function), // generalTemplate.lookup,
          [TEMPLATE_EXECUTE_TEMPLATE]: expect.any(Function), // generalTemplate.executeTemplate,
        }),
      ]);
    });
  });

  describe('executeTemplate', () => {
    it('should execute the template', () => {
      let subTemplateName = 'template 1';
      let renderData = { name: 'John' };
      let node = createDummyNode('My template');
      generalTemplate.addParseTree(subTemplateName, node);

      let subTemplate = generalTemplate.templates[subTemplateName];
      let executeSpy = jest.spyOn(subTemplate, 'execute');

      generalTemplate.executeTemplate(subTemplateName, renderData);

      expect(executeSpy).toHaveBeenCalledWith(renderData);
    });
  });

  describe('funcs', () => {
    it('should add the functions to the custom functions', () => {
      generalTemplate.funcs(funcMap);

      expect(generalTemplate[CUSTOM_FUNCTION]).toEqual(
        expect.objectContaining({ join: expect.any(Function) }),
      );
    });

    it('should return the template instance to facilitate chaining', () => {
      let templateAux = generalTemplate.funcs(funcMap);
      expect(templateAux).toBe(generalTemplate);
    });

    it('should throw an Error if any of the members is not a function', () => {
      let wrongFuncMap = {
        isFunction: jest.fn(),
        notFunction: 'no function',
      };

      expect(() => generalTemplate.funcs(wrongFuncMap)).toThrow(
        "Member 'notFunction' is not a Function",
      );
    });
  });

  describe('clone', () => {
    it('should return a different instance', () => {
      let clonedTemplate = generalTemplate.clone();

      expect(clonedTemplate).toBeInstanceOf(Template);
      expect(clonedTemplate).not.toBe(generalTemplate);
    });

    test('the copy contains the same internal data', () => {
      generalTemplate
        .funcs(funcMap)
        .parse('Hello, {{ name }}!')
        .addParseTree('sub-template', constant1);

      let clonedTemplate = generalTemplate.clone();

      expect(clonedTemplate.name).toBe(generalTemplate.name);
      expect(clonedTemplate[CUSTOM_FUNCTION]).toEqual(
        generalTemplate[CUSTOM_FUNCTION],
      );

      // Check templates
      for (let name in generalTemplate.templates) {
        let general = generalTemplate.templates[name];
        let cloned = clonedTemplate.templates[name];

        expect(cloned.tree).toBe(general.tree);
        expect(cloned.prototype).toBe(general.prototype);
      }
    });

    test('the copy contains different references to the internal data', () => {
      generalTemplate
        .funcs(funcMap)
        .parse('Hello, {{ name }}!')
        .addParseTree('sub-template', constant1);
      let clonedTemplate = generalTemplate.clone();

      expect(clonedTemplate.name).toBe(generalTemplate.name);
      expect(clonedTemplate[CUSTOM_FUNCTION]).not.toBe(
        generalTemplate[CUSTOM_FUNCTION],
      );

      // Check templates
      expect(clonedTemplate.templates).not.toBe(generalTemplate.templates);
      for (let name in generalTemplate.templates) {
        let general = generalTemplate.templates[name];
        let cloned = clonedTemplate.templates[name];

        expect(cloned).not.toBe(general);
        expect(cloned.prototype).toBe(general.prototype);
      }
    });
  });

  describe('parse', () => {
    it('should parse the template', () => {
      generalTemplate.parse('Hello, {{ name }}!');
      expect(parse).toHaveBeenCalledWith(
        templateName,
        'Hello, {{ name }}!',
        expect.any(Object),
      );
    });

    it('should return the template instance to facilitate chaining', () => {
      let templateAux = generalTemplate.parse('Hello, {{ name }}!');

      expect(templateAux).toBe(generalTemplate);
    });
  });
});
