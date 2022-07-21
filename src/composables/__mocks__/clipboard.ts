export default jest.fn(() => {
  return {
    readFromClipboard: jest.fn(() => {
      return [
        {
          types: ["image"],
          presentationStyle: "unspecified",
          getType: jest.fn(() => new Blob()),
        },
      ];
    }),
    copyToClipboard: jest.fn(),
  };
});
