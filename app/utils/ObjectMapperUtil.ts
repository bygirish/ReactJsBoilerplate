import { Logger } from '@utils/Logger';
import { ObjectMapper } from 'json-object-mapper';

export const deserializeJsonObjCollection = (
    response: any[],
    ModelClass: any,
    functionName: string
) => {
    const deserializeJsonObjData = response
        // eslint-disable-next-line array-callback-return
        .map((model) => {
            try {
                return ObjectMapper.deserialize(ModelClass, model);
            } catch (e) {
                const errorMessage = e.message;
                Logger.warn('DESERIALIZATION ERROR', {
                    error: errorMessage,
                    functionName,
                });
            }
        }).filter((model) => model !== undefined);
    return deserializeJsonObjData;
};

export const deserializeJsonObj = (
    response: any,
    ModelClass: any,
    functionName: string
) => {
    try {
        return ObjectMapper.deserialize(ModelClass, response);
    } catch (e) {
        const errorMessage = e.message;
        Logger.warn('DESERIALIZATION ERROR', {
            error: errorMessage,
            functionName,
        });
        throw { message: errorMessage };
    }
};
