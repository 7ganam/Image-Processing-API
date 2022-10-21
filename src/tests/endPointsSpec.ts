import supertest from 'supertest';
import app from '../index';

const request = supertest(app);

describe('End point tests', () => {
  it('should return 200 for valid request', async (done) => {
    const response = await request.get(
      '/api/image?filename=fjord.jpg&width=200&height=200'
    );
    expect(response.status).toBe(200);
    done();
  });

  it('should return 400 for missing width', async (done) => {
    const response = await request.get(
      '/api/image?filename=fjord.jpg&height=200'
    );
    expect(response.status).toBe(400);
    done();
  });

  it('should return 400 for missing height', async (done) => {
    const response = await request.get('/api/image?filename=fjord.jpg');
    expect(response.status).toBe(400);
    done();
  });
});
