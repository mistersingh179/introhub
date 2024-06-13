const getFirstName = (fullName?: string|null, defaultName?: string): string => {
  return fullName?.split(" ")?.[0] || defaultName || "Person";
};

export default getFirstName;

if (require.main === module) {
  (async () => {
    console.log("1", getFirstName("Mister Singh"));
    console.log("2", getFirstName(""));
    console.log("2", getFirstName(null));
    console.log("3", getFirstName("Foo"));
    console.log("4", getFirstName(undefined, "User"));
    console.log("5", getFirstName(undefined, undefined));
    console.log("6", getFirstName(undefined));
  })();
}
