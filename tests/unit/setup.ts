
//media mock
window.HTMLMediaElement.prototype.load = jest.fn();
window.HTMLMediaElement.prototype.play = jest.fn();
window.HTMLMediaElement.prototype.pause = jest.fn();
window.HTMLMediaElement.prototype.addTextTrack = jest.fn();

//object url mock
globalThis.URL.createObjectURL = jest.fn((data: Blob | File) => {
    if('name' in data) {
        return data.name;
    }

    return (Math.random().toString(36) + "00000000000000000").slice(2, 8);
});
globalThis.URL.revokeObjectURL = jest.fn();