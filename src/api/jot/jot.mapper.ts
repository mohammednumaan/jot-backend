import { IJot, IJotDTO } from "./jot.types";

export class JotMapper {
    mapToNewJot(jot: IJot): IJotDTO {
        return {
            name: jot.name,
            description: jot.description,
            extension: jot.extension,
            content: jot.content,
            createdAt: jot.createdAt
        }
    }
}