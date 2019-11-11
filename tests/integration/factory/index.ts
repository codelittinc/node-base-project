import { factory, SequelizeAdapter } from 'factory-bot';
import * as definitions from './definitions';

factory.setAdapter(new SequelizeAdapter());
Object.values(definitions).map(modelDefinition => modelDefinition(factory));

export default factory;
