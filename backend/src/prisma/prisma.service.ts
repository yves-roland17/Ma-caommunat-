import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import database from 'prisma.config'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy   {


    async onModuleInit() {
        
    }

    async onModuleDestroy() {
        
    }
}
