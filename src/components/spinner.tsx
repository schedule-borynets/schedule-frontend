import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import styled from 'styled-components';

const Spinner = () => {
    return (
        <SpinContainer>
            <Spin
                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
        </SpinContainer>
    );
};
const SpinContainer = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;
export default Spinner;
