
export function useI18n() {
    return {
        t: jest.fn((t: string) => t)
    }
}

export function createI18n() {
    return {
        global: {
            t: jest.fn((t: string) => t)
        }
    }
}