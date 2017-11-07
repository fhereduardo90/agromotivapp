import React from 'react';
import { Spin } from 'antd';
import styled from 'styled-components'

const FullscreenLoader = ({ label = '' }) => {
    return (
        <Overlay>
            <div className="spin-container">
                <Spin size="large" />

                <div className="loading-message">
                    { !!label ? label : 'Redireccionando...' }
                </div>
            </div>
        </Overlay>
    );
};

const Overlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;

    .spin-container {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 150px;
        margin-left: -75px;
        margin-top: -18px;
        text-align: center;

        .ant-spin-dot i {
            background-color: #00a854;
        }

        .loading-message {
            padding: 15px 0;
        }
    }
`;

export default FullscreenLoader;