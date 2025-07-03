// Action names
export const BLOCK_RESERVED_WORD = 'block';
export const BREAK_RESERVED_WORD = 'break';
export const CONTINUE_RESERVED_WORD = 'continue';
export const DEFINE_RESERVED_WORD = 'define';
export const ELSE_RESERVED_WORD = 'else';
export const END_RESERVED_WORD = 'end';
export const IF_RESERVED_WORD = 'if';
export const RANGE_RESERVED_WORD = 'range';
export const TEMPLATE_RESERVED_WORD = 'template';
export const WITH_RESERVED_WORD = 'with';

export const ACTION_COMMANDS = [
  IF_RESERVED_WORD,
  WITH_RESERVED_WORD,
  ELSE_RESERVED_WORD,
  END_RESERVED_WORD,
];

export const SCOPED_ACTION_COMMANDS = [RANGE_RESERVED_WORD];

export const RENDERING_COMMANDS = [
  BLOCK_RESERVED_WORD,
  TEMPLATE_RESERVED_WORD,
  DEFINE_RESERVED_WORD,
];

export const FLOW_COMMANDS = [BREAK_RESERVED_WORD, CONTINUE_RESERVED_WORD];

export const COMMON_ACTIONS = [...ACTION_COMMANDS, ...FLOW_COMMANDS];

export const RESERVED_WORDS = [
  ...SCOPED_ACTION_COMMANDS,
  ...ACTION_COMMANDS,
  ...FLOW_COMMANDS,
  ...RENDERING_COMMANDS,
];

// Flow functions accessors
export const BREAK_ACTION = Symbol('break_action');
export const CONTINUE_ACTION = Symbol('continue_action');

// Template Private properties
export const CUSTOM_FUNCTION = Symbol('custom_functions');
export const TEMPLATE_LOOKUP = Symbol('template_lookup');
export const TEMPLATE_EXECUTE_TEMPLATE = Symbol('template_execute_template');

// Error Messages
export const NON_OVERWRITTEN_METHOD = 'This method must be overwritten';

// Types
export const ASSIGN_TYPE = 'assign';
export const BOOL_TYPE = 'boolean';
export const CHAR_TYPE = 'char';
export const FUNCTION_TYPE = 'function';
export const NIL_TYPE = 'nil';
export const NUMBER_TYPE = 'number';
export const OBJECT_TYPE = 'object';
export const PAREN_TYPE = 'paren';
export const STRING_TYPE = 'string';
export const SYMBOL_TYPE = 'symbol';
export const UNKNOWN_TYPE = 'unknown';
export const VALUE_TYPE = 'value';
export const VARIABLE_TYPE = 'variable';
