const config = {
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    setupFiles: ['<rootDir>/setupTests.js'],
};

export default config;
