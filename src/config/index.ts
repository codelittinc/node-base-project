import { initialize } from './initializers';
import { applyEnvironmentConfig } from './environment';

export function applyConfig() {
    initialize();
    applyEnvironmentConfig();
}