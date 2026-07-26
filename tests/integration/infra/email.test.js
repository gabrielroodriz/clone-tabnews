import email from 'infra/email.js';

describe('infra/email', () => {
  test('should send an email', async () => {
    await email.send({
      from: 'Gabriel Rodrigues <gabriel@example.com>',
      to: 'recipient@example.com',
      subject: 'Test Email',
      text: 'Text of body',
    });
  });
});
