import { useEffect, useState } from 'react';
import { Form, Input, Button, Row, Col, Layout, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import {
    getErrorWhileLoggingIn,
    getIsLoading,
    getIsUserLoggedIn,
    loginUser,
} from 'store/auth/login';
const { Content } = Layout;
import { useRouter } from 'next/router';
import Link from 'next/link';

const Container = styled(Row)`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

const Login = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(getIsUserLoggedIn);
    const isLoading = useSelector(getIsLoading);
    const errorWhileLoggingIn = useSelector(getErrorWhileLoggingIn);
    const navigation = useRouter();

    useEffect(() => {
        if (errorWhileLoggingIn) {
            message.error('Error while logging in, try again later');
        } else if (isLoggedIn && !isLoading) {
            message.success('Successfully logged in!');
            navigation.push('/');
        }
    }, [isLoggedIn, isLoading, errorWhileLoggingIn, navigation]);

    const handleSubmit = async (values: any) => {
        try {
            dispatch(
                loginUser({ email: values.email, password: values.password })
            );
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <LayoutStyle>
            <Content>
                <Container>
                    <Col xs={20} sm={16} md={12} lg={8} xl={6}>
                        <Form
                            form={form}
                            name='login'
                            onFinish={handleSubmit}
                            autoComplete='off'
                        >
                            <Form.Item
                                name='email'
                                rules={[
                                    {
                                        type: 'email',
                                        message:
                                            'The input is not valid E-mail!',
                                    },
                                    {
                                        required: true,
                                        message: 'Please input your E-mail!',
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined />}
                                    placeholder='Email'
                                />
                            </Form.Item>

                            <Form.Item
                                name='password'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Password!',
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<LockOutlined />}
                                    type='password'
                                    placeholder='Password'
                                />
                            </Form.Item>
                            <ButtonsContainer>
                                <Form.Item>
                                    <Button type='primary' htmlType='submit'>
                                        Login
                                    </Button>
                                </Form.Item>
                                <Form.Item>
                                    <Link href={'/auth/register'}>
                                        <Button type='link' htmlType='button'>
                                            Register
                                        </Button>
                                    </Link>
                                </Form.Item>
                            </ButtonsContainer>
                        </Form>
                    </Col>
                </Container>
            </Content>
        </LayoutStyle>
    );
};
const LayoutStyle = styled(Layout)`
    height: 100%;
`;

const ButtonsContainer = styled.div`
    display: flex;
`;
export default Login;
