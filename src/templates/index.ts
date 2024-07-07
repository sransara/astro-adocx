import { Template } from '../types';
import * as image from './image';
import * as inline_image from './inline_image';

export const builtinTemplates = {
    image,
    inline_image,
} as Record<string, Template | undefined>;
