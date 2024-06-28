const uploadContacts = async () => {
  console.log("In upload contacts")
};

if (require.main === module) {
  (async () => {
    await uploadContacts();
  })();
}
