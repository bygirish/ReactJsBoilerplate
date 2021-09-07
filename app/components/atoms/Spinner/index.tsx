import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import './styles.scss';

interface IProps {
    className?: string;
    isFullPage?: boolean;
}

const Spinner = (props: IProps) => {

    const { isFullPage, className } = props;

    let containerStyle = [(isFullPage ? "full-page" : ""), "spinner-container", className].join(' ');


    return (
    
        <div className={containerStyle}>
            <CircularProgress />
        </div>
    );

}

export default Spinner;