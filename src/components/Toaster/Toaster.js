import React from 'react';
import { ToastNotification } from '@carbon/react';

const Toaster = ({ subtitle, hours, minutes, seconds, dayTime }) => {
    return (
        <>
            <div>
                <ToastNotification
                    className="success_toast top-right"
                    role="status"
                    kind="success"
                    caption={`${hours}:${minutes}:${seconds} ${dayTime}`}
                    timeout={5000}
                    title="Success"
                    subtitle={subtitle}
                />
            </div>
        </>
    )
}

export default Toaster;