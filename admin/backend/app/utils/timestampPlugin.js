const timestamps = (schema, options) => {
  schema.add({
    created: {
      type: Date,
      default: new Date(),
    },
    updated: Date,
  });

  schema.pre('save', function (next) {
    this.updated = new Date();
    next();
  });

  if (options && options.index) {
    schema.path('created').index(options.index);
    schema.path('updated').index(options.index);
  }
};

export default timestamps;
