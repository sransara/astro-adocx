import { AdocNodeConverters } from '../types.js';
import image from './image.js';
import inline_image from './inline_image.js';

export const builtinNodeConverters: AdocNodeConverters = {
    image,
    inline_image,
};
