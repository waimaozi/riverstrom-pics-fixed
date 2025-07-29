/**
 * Jest setup file for frontend testing
 * Configures DOM environment and global mocks
 */

// Mock DOM methods that might not be available in jsdom
Object.defineProperty(window, 'FormData', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
    append: jest.fn(),
    delete: jest.fn(),
    has: jest.fn(),
    entries: jest.fn(),
    keys: jest.fn(),
    values: jest.fn()
  }))
});

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true, message: 'Test response' })
  })
);

// Mock console methods to reduce test noise
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  document.body.innerHTML = '';
});