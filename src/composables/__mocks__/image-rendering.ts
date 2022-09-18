export default jest.fn(() => {
    return {
        //делает image.src случайной строкой длинной в 6 символов
        renderImage: jest.fn(
            (
                image: HTMLImageElement | undefined,
                file: FileSystemFileHandle | string | Blob | File | undefined
            ) => {
                const str = (
                    Math.random().toString(36) + '00000000000000000'
                ).slice(2, 8);

                if (image == undefined) return;

                if (typeof image == 'undefined' || image === null) {
                    return;
                }

                if (typeof file == 'undefined') {
                    return;
                }

                //string
                if (typeof file == 'string') {
                    image.src = str;
                    return;
                }

                //File
                if ('lastModified' in file) {
                    image.src = str;
                    return;
                }

                //blob
                if (file instanceof Blob) {
                    image.src = str;
                    return;
                }

                //FileSystemFileHandle
                image.src = str;
            }
        ),

        releaseImage: jest.fn(),
    };
});
