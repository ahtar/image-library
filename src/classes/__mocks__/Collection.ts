const mockedClass = jest.fn(() => {
	return {
		manifest: {
			name: "mocked name",
			created: "mocked created date",
			description: "mocked description",
			theme: "mocked theme",
			lastModified: "mocked lastModified date",
			options: {
				corrupted: false,
			},
		},
		arr: [] as Array<ImageSet | ImageSingle>,
		tags: [],
		lastTags: [],
		handle: {
			kind: "directory",
			name: "mocked name",
			isSameEntry: jest.fn(),
			queryPermission: jest.fn(),
			requestPermission: jest.fn(),
			getDirectoryHandle: jest.fn(),
			getFileHandle: jest.fn(),
			removeEntry: jest.fn(),
			resolve: jest.fn(),
			keys: jest.fn(),
			values: jest.fn(),
			entries: jest.fn(),
			[Symbol.asyncIterator]: jest.fn(),
			isFile: false,
			isDirectory: true,
		},
		thumbnail: {
			kind: "file",
			name: "mocked name",
			isSameEntry: jest.fn(),
			queryPermission: jest.fn(),
			requestPermission: jest.fn(),
			getFile: jest.fn(),
			createWritable: jest.fn(),
			isFile: true,
			isDirectory: false,
		},
		initLoadCollection: jest.fn(),
		addTag: jest.fn(),
		getTag: jest.fn(),
		addImage(img: ImageSingle | ImageSet) {
			this.arr.push(img);
		},
		createImage: jest.fn(),
		createSet: jest.fn(),
		async deleteImage(image: ImageSingle | ImageSet): Promise<void> {
			this.removeImage(image);
		},
		removeImage(image: ImageSingle | ImageSet | ImageSingleData | string) {
			if (typeof image == "string") {
				const index = this.arr.findIndex((i) => i.manifest.id == image);
				if (index != -1) this.arr.splice(index, 1);
			} else if ("imageHandle" in image) {
				const index = this.arr.findIndex(
					(i) => i.manifest.id == image.manifest.id
				);
				if (index != -1) this.arr.splice(index, 1);
			} else if ("arr" in image) {
				const index = this.arr.findIndex(
					(i) => i.manifest.id == image.manifest.id
				);
				if (index != -1) this.arr.splice(index, 1);
			} else {
				const index = this.arr.findIndex((i) => i.manifest.id == image.id);
				if (index != -1) this.arr.splice(index, 1);
			}
		},
		updateImage: jest.fn(),
		deleteCollection: jest.fn(),
		updateCollectionManifest: jest.fn(),
	};
});

export default mockedClass;
