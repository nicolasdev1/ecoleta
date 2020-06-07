import {Request, Response} from 'express';
import knex from '../database/connection';

class CollectionPointsController {
    async index(request: Request, response: Response) {
        // filtros por cidade, uf, items vamos obter do query params
        const { city, uf, items } = request.query;

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));
        
        const collectionPoints = await knex('collectionPoints')
            .join('collectionPoints_items', 'collectionPoints.id', '=', 'collectionPoints_items.collectionPoint_id')
            .whereIn('collectionPoints_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('collectionPoints.*');

        const serializedCollectionPoints = collectionPoints.map(collectionPoint => {
            return {
                ...collectionPoint,
                image_url: `http://10.0.0.50:2222/uploads/${collectionPoint.image}`,
            };
        });

        return response.json(serializedCollectionPoints);
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const collectionPoint = await knex('collectionPoints')
            .where('id', id)
            .first();

        if (!collectionPoint) {
            return response.status(400).json({ message: 'Ponto de coleta não encontrado.' });
        }

        const serializedCollectionPoint = {
            ...collectionPoint,
            image_url: `http://10.0.0.50:2222/uploads/${collectionPoint.image}`,
        };
        
        // retorna todos os itens relacionados com o ponto de coleta que listamos nessa função
        const items = await knex('items')
            .join('collectionPoints_items', 'items.id', '=', 'collectionPoints_items.item_id')
            .where('collectionPoints_items.collectionPoint_id', id)
            .select('items.title');
        

        return response.json({ collectionPoint: serializedCollectionPoint, items });
    }

    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;
    
        // trx sigla para transaction
        const trx = await knex.transaction();

        const collectionPoint = {
            image: request.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        }
    
        const insertedIds = await trx('collectionPoints').insert(collectionPoint);
    
        const collectionPoint_id = insertedIds[0];
    
        // relacionamento das tabelas collectionPoints e items
        const collectionPointsItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
                return {
                    item_id,
                    collectionPoint_id,
                };
            });
    
        await trx('collectionPoints_items').insert(collectionPointsItems);
    
        // usando transaction é necessário colocar esse .commit() no fim de toda a função, para fazer o insert na base de dados
        await trx.commit();

        return response.json({
            id: collectionPoint_id,
            ...collectionPoint,
        });
    }
}

export default CollectionPointsController;
