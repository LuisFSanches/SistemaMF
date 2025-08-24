import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AIIntegrationService } from '../AIIntegrationService';
import { ErrorCodes } from '../../../exceptions/root';
import OpenAI from 'openai';

// Mock OpenAI
vi.mock('openai', () => {
    return {
        default: vi.fn().mockImplementation(() => ({
            chat: {
                completions: {
                    create: vi.fn()
                }
            }
        }))
    };
});

describe('AIIntegrationService', () => {
    let service: AIIntegrationService;
    let mockOpenAIInstance: any;
    let mockCreate: any;

    beforeEach(() => {
        vi.clearAllMocks();
        
        // Setup mock OpenAI instance
        mockCreate = vi.fn();
        mockOpenAIInstance = {
            chat: {
                completions: {
                    create: mockCreate
                }
            }
        };
        
        (OpenAI as any).mockImplementation(() => mockOpenAIInstance);
        
        service = new AIIntegrationService();
        
        // Mock environment variable
        process.env.APP_OPENAI_API_KEY = 'test-api-key';
    });

    it('should successfully process AI request and return parsed JSON', async () => {
        const mockPrompt = 'You are a helpful assistant';
        const mockTextContent = 'Hello, how are you?';
        const mockResponse = {
            choices: [{
                message: {
                    content: '{"response": "I am doing well, thank you!"}'
                }
            }]
        };

        mockCreate.mockResolvedValue(mockResponse);

        const result = await service.execute(mockPrompt, mockTextContent);

        expect(OpenAI).toHaveBeenCalledWith({
            apiKey: 'test-api-key'
        });

        expect(mockCreate).toHaveBeenCalledWith({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: mockPrompt
                },
                {
                    role: "user",
                    content: mockTextContent
                }
            ],
            temperature: 0,
            response_format: { type: "json_object" }
        });

        expect(result).toEqual({
            response: "I am doing well, thank you!"
        });
    });

    it('should handle OpenAI API errors and return error object', async () => {
        const mockPrompt = 'You are a helpful assistant';
        const mockTextContent = 'Hello, how are you?';
        const mockError = new Error('API rate limit exceeded');

        mockCreate.mockRejectedValue(mockError);

        const result = await service.execute(mockPrompt, mockTextContent);

        expect(result).toEqual({
            error: true,
            message: 'API rate limit exceeded',
            code: ErrorCodes.SYSTEM_ERROR
        });
    });

    it('should handle JSON parsing errors and return error object', async () => {
        const mockPrompt = 'You are a helpful assistant';
        const mockTextContent = 'Hello, how are you?';
        const mockResponse = {
            choices: [{
                message: {
                    content: 'Invalid JSON response'
                }
            }]
        };

        mockCreate.mockResolvedValue(mockResponse);

        const result = await service.execute(mockPrompt, mockTextContent);

        expect(result).toEqual({
            error: true,
            message: expect.stringContaining('Unexpected token'),
            code: ErrorCodes.SYSTEM_ERROR
        });
    });

    it('should handle empty response content', async () => {
        const mockPrompt = 'You are a helpful assistant';
        const mockTextContent = 'Hello, how are you?';
        const mockResponse = {
            choices: [{
                message: {
                    content: null
                }
            }]
        };

        mockCreate.mockResolvedValue(mockResponse);

        const result = await service.execute(mockPrompt, mockTextContent);

        // When content is null, JSON.parse(null) returns null, not an error
        expect(result).toBeNull();
    });

    it('should handle complex JSON responses correctly', async () => {
        const mockPrompt = 'Extract information from text';
        const mockTextContent = 'John Doe, age 30, lives in New York';
        const complexJsonResponse = {
            name: 'John Doe',
            age: 30,
            location: 'New York',
            metadata: {
                processed: true,
                timestamp: '2023-01-01T00:00:00Z'
            }
        };
        
        const mockResponse = {
            choices: [{
                message: {
                    content: JSON.stringify(complexJsonResponse)
                }
            }]
        };

        mockCreate.mockResolvedValue(mockResponse);

        const result = await service.execute(mockPrompt, mockTextContent);

        expect(result).toEqual(complexJsonResponse);
    });

    it('should use correct OpenAI configuration parameters', async () => {
        const mockPrompt = 'Test prompt';
        const mockTextContent = 'Test content';
        const mockResponse = {
            choices: [{
                message: {
                    content: '{"test": true}'
                }
            }]
        };

        mockCreate.mockResolvedValue(mockResponse);

        await service.execute(mockPrompt, mockTextContent);

        expect(mockCreate).toHaveBeenCalledWith({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: mockPrompt
                },
                {
                    role: "user",
                    content: mockTextContent
                }
            ],
            temperature: 0,
            response_format: { type: "json_object" }
        });
    });

    it('should handle network errors appropriately', async () => {
        const mockPrompt = 'You are a helpful assistant';
        const mockTextContent = 'Hello, how are you?';
        const networkError = new Error('Network timeout');

        mockCreate.mockRejectedValue(networkError);

        const result = await service.execute(mockPrompt, mockTextContent);

        expect(result).toEqual({
            error: true,
            message: 'Network timeout',
            code: ErrorCodes.SYSTEM_ERROR
        });
    });
});
