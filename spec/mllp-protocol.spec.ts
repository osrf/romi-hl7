import * as streams from 'memory-streams';
import { Protocol } from '../src/mllp';

describe('mllp protocol tests', () => {
  let incoming: streams.ReadableStream;
  let mllp: Protocol;

  beforeEach(() => {
    incoming = new streams.ReadableStream('');
    mllp = new Protocol(incoming);
  });

  it('parses messages', done => {
    mllp.on('message', message => {
      expect(message).toBe('hello');
      done();
    });
    incoming.push('\x0bhello\x1c\x0d');
  });

  it('parses message in multiple parts', done => {
    mllp.on('message', message => {
      expect(message).toBe('hello');
      done();
    });
    incoming.push('\x0bhel');
    incoming.push('lo\x1c\x0d');
  });

  it('parses multiple messages in one chunk', done => {
    const expected = [ 'hello', 'world' ];
    let count = 0;
    mllp.on('message', message => {
      expect(message).toBe(expected[count]);
      count++;
      if (count === 2) {
        done();
      }
    });
    incoming.push('\x0bhello\x1c\x0d\x0bworld\x1c\x0d');
  })

  it('recovers from incomplete message', done => {
    mllp.on('message', message => {
      expect(message).toBe('world');
      done();
    });
    incoming.push('\x0bhel');
    incoming.push('\x0bworld\x1c\x0d');
  });
});
