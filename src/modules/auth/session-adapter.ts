import { INestApplicationContext } from '@nestjs/common/interfaces';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { NextFunction, RequestHandler } from 'express';
import * as passport from 'passport';
import { Server, ServerOptions, Socket } from 'socket.io';

export class SessionAdapter extends IoAdapter {
  private session: RequestHandler;
  constructor(session: RequestHandler, app: INestApplicationContext) {
    super(app);
    this.session = session;
  }

  create(
    port: number,
    options?: ServerOptions & { namespace?: string; server?: any },
  ): Server {
    console.log('создался!');
    const server = super.create(port, options);
    const wrap = (middleware) => (socket: Socket, next: NextFunction) =>
      middleware(socket.request, {}, next);

    server.use(wrap(this.session));
    server.use(wrap(passport.initialize()));
    server.use(wrap(passport.session()));
    return server;
    // return new WebSocket.Server({ port, ...options });
  }

  // Всё, что ниже - лишнее. Просто экспериментирую.

  // eslint-disable-next-line @typescript-eslint/ban-types
  bindClientConnect(server, callback: Function) {
    console.log('приконнектился');
    server.on('connection', callback);
  }

  /*
  bindMessageHandlers(
    client: WebSocket,
    handlers: MessageMappingProperties[],
    process: (data: any) => Observable<any>,
  ) {
    console.log('Срабатывает во время коннекта через постман');
    fromEvent(client, 'message')
      .pipe(
        mergeMap((data) => this.bindMessageHandler(data, handlers, process)),
        filter((result) => result),
      )
      .subscribe((response) => client.send(JSON.stringify(response)));
  }

  bindMessageHandler(
    buffer,
    handlers: MessageMappingProperties[],
    process: (data: any) => Observable<any>,
  ): Observable<any> {
    console.log('Срабатывает во время отправки сообщения через постман');
    const message = JSON.parse(buffer.data);
    console.log(message);
    const messageHandler = handlers.find(
      (handler) => handler.message === message.event,
    );
    if (!messageHandler) {
      return EMPTY;
    }
    return process(messageHandler.callback(message.data));
  }

  close(server) {
    console.log(
      'Тут обрабатывается закрытие... Вообще не понятно, когда срабатывает',
    );
    server.close();
  }
  */
}
