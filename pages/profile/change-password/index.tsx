import { Form, Input, Button, message } from 'antd';

const ChangePasswordForm = () => {
    const onFinish = (values: any) => {
        // This is where you'd actually call your API to change the password.
        // For the purposes of this example, we're just simulating an API call with a setTimeout.
        setTimeout(() => {
            message.success('Password changed successfully!');
        }, 2000);
    };

    return (
        <Form onFinish={onFinish}>
            <Form.Item
                name='currentPassword'
                rules={[
                    {
                        required: true,
                        message: 'Please input your current password!',
                    },
                ]}
            >
                <Input.Password placeholder='Current password' />
            </Form.Item>

            <Form.Item
                name='newPassword'
                rules={[
                    {
                        required: true,
                        message: 'Please input your new password!',
                    },
                    {
                        min: 8,
                        message:
                            'New password should be at least 8 characters.',
                    },
                ]}
            >
                <Input.Password placeholder='New password' />
            </Form.Item>

            <Form.Item
                name='confirmPassword'
                dependencies={['newPassword']}
                rules={[
                    {
                        required: true,
                        message: 'Please confirm your new password!',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (
                                !value ||
                                getFieldValue('newPassword') === value
                            ) {
                                return Promise.resolve();
                            }

                            return Promise.reject(
                                new Error('The two passwords do not match!')
                            );
                        },
                    }),
                ]}
            >
                <Input.Password placeholder='Confirm new password' />
            </Form.Item>

            <Form.Item>
                <Button type='primary' htmlType='submit'>
                    Change Password
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ChangePasswordForm;
