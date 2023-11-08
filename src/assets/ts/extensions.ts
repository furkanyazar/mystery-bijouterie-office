export {};

declare global {
  interface String {
    toTitleCase(): string;
    toEnglishCase(): string;
    toValueCase(): string;
  }
}

String.prototype.toTitleCase = function () {
  return this.toLocaleLowerCase().replace(/\b\w/g, (char) => char.toLocaleUpperCase());
};

String.prototype.toEnglishCase = function () {
  const turkishToEnglishMap: { [key: string]: string } = {
    ğ: "g",
    Ğ: "G",
    ş: "s",
    Ş: "S",
    ı: "i",
    İ: "I",
    ü: "u",
    Ü: "U",
    ö: "o",
    Ö: "O",
    ç: "c",
    Ç: "C",
  };
  return this.replace(/[ğĞşŞıİüÜöÖçÇ]/g, (match) => turkishToEnglishMap[match] || match);
};

String.prototype.toValueCase = function () {
  let result = this.toLocaleLowerCase();
  result = result.toEnglishCase();
  result = result.replace(/[^a-z0-9\s]/g, " ");
  result = result.replace(/\s+/g, " ");
  result = result.trim().replace(/\s/g, "-");
  return result;
};
