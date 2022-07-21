export default jest.fn(() => {
    return {
        //делает image.src случайной строкой длинной в 6 символов
        renderImage: jest.fn((image: HTMLImageElement) => {
            const str = (Math.random().toString(36) + "00000000000000000").slice(
                2,
                8
            );
            image.src = str;
        }),

        releaseImage: jest.fn(),
    };
});
