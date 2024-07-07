import { Template } from '../types.js';
import * as image from './image.js';
import * as inline_image from './inline_image.js';

export const builtinTemplates = {
    image,
    inline_image,
} as Record<string, Template | undefined>;
