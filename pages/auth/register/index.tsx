import { useEffect } from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import {
    getErrorWhileRegistration,
    getIsLoading,
    registerUser,
} from 'store/auth/register';
import { getIsUserLoggedIn } from 'store/auth/login';
import { useRouter } from 'next/router';
import { Routes } from 'routes';

const Register = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const isLoggedIn = useSelector(getIsUserLoggedIn);
    const isLoading = useSelector(getIsLoading);
    const errorWhileRegistration = useSelector(getErrorWhileRegistration);
    const navigation = useRouter();

    useEffect(() => {
        if (errorWhileRegistration) {
            message.error('Error while registration, try again');
        } else if (isLoggedIn && !isLoading) {
            message.success('Successfully registered!');
            navigation.push(Routes.home);
        }
    }, [isLoggedIn, isLoading, errorWhileRegistration, navigation]);

    const handleSubmit = async (values: any) => {
        try {
            dispatch(
                registerUser({
                    email: values.email,
                    name: values.name,
                    password: values.password,
                })
            );
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Container>
            <Col xs={20} sm={16} md={12} lg={8} xl={6}>
                <Form
                    form={form}
                    name="register"
                    onFinish={handleSubmit}
                    autoComplete="off"
                >
                    <Form.Item
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your name!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Name" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                            },
                            {
                                required: true,
                                message: 'Please input your E-mail!',
                            },
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your Password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue('password') === value
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error(
                                            'The two passwords that you entered do not match!'
                                        )
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined />}
                            type="password"
                            placeholder="Confirm Password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Container>
    );
};
const Container = styled(Row)`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`;
export default Register;
