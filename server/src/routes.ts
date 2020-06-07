import express from 'express';
import { celebrate, Joi } from 'celebrate';

import multer from 'multer';
import multerConfig from './config/multer';

import CollectionPointsController from './controllers/CollectionPointsController';
import ItemsController from './controllers/ItemsController';

// index: listagem, show: unico registro, create, update, delete

const routes = express.Router();
const upload = multer(multerConfig);

const collectionPointsController = new CollectionPointsController();
const itemsController = new ItemsController();

routes.get('/items', itemsController.index);

routes.get('/points', collectionPointsController.index);
routes.get('/points/:id', collectionPointsController.show);

routes.post(
    '/points',
    upload.single('image'),
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            whatsapp: Joi.number().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            items: Joi.string().required(),
        })
    }, {
        abortEarly: false
    }),
    collectionPointsController.create,
);

export default routes;
