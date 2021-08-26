const metadataPlugin = schema => {
  schema.add({
    metadata: {
      title: {
        type: String,
        default: '',
      },
      keyword: {
        type: String,
        default: '',
      },
      description: {
        type: String,
        default: '',
      },
    },
  });
};

export default metadataPlugin;
