import { envType } from './ConfigConstant';
import DevConstant from './DevConstant.json';
import ProdConstant from './ProdConstant.json';
import StageConstant from './StageConstant.json';

const config: { [key: string]: any } = {
    dev: {
        ...DevConstant,
    },
    stage: {
        ...StageConstant,
    },
    prod: {
        ...ProdConstant,
    },
};

// Note - envType. will be used to configure Project environment
// Change to envType.dev => dev environment
// Change to envType.stage => stage environment
// Change to envType.prod => Prod environment

export default config[process.env.REACT_APP_ENV || envType.dev];
