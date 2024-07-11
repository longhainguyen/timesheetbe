import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';

export const mailerConfig: MailerAsyncOptions = {
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
        transport: {
            service: configService.get('mailer.service'),
            host: configService.get('mailer.host'),
            port: +configService.get('mailer.port'),
            ignoreTLS: true,
            secure: false,
            auth: {
                user: configService.get('mailer.user'),
                pass: configService.get('mailer.pass'),
            },
        },
        defaults: {
            from: '"No Reply" <no-reply@localhost>',
        },
        preview: false,
        template: {
            dir: process.cwd() + '/templates/',
            adapter: new HandlebarsAdapter(),
            options: {
                strict: true,
            },
        },
    }),
};
