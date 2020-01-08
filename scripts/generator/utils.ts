// Handy string functions

export const capitalizeFirstLetter = (chars: string): string => {
  return `${chars.charAt(0).toUpperCase()}${chars.slice(1)}`;
};

export const lowerFirstLetter = (chars: string): string => {
  return `${chars.charAt(0).toLowerCase()}${chars.slice(1)}`;
};

export const toSnakeCase = (chars: string): string => {
  return chars.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

export const toCamelCase = (chars: string): string => {
  // from https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
  return chars.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
    if (+match === 0) {
      return '';
    } // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
};

export const toPascalCase = (chars: string): string => {
  return toCamelCase(capitalizeFirstLetter(chars));
};
