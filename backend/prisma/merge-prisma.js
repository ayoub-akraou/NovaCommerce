import fs from 'fs';
import path from 'path';

const base = fs.readFileSync(path.join('prisma', 'base.prisma'), 'utf-8');

const models = fs.readdirSync(path.join('prisma', 'models'))

let schema = base + '\n\n';

for (const model of models) {
    schema += fs.readFileSync(path.join('prisma', 'models', model), 'utf-8') + '\n\n';
}

fs.writeFileSync(path.join('prisma', 'schema.prisma'), schema);