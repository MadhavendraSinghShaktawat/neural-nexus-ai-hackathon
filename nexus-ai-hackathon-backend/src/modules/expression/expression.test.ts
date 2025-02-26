import request from 'supertest';
import { app } from '../../app';

describe('Expression API', () => {
  it('should respond to the test endpoint', async () => {
    const response = await request(app).get('/api/expression/test');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Expression API is working');
  });

  it('should detect emotions from text', async () => {
    const response = await request(app)
      .post('/api/expression/detect')
      .send({ text: 'I am feeling happy today' });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.emotion).toBeDefined();
  });
}); 