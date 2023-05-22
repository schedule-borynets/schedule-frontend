import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import Link from 'next/link';
import { styled } from 'styled-components';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
export interface ScheduleLink {
    description: string;
    link: string;
}

export interface LinkFormProps {
    link: ScheduleLink;
    onLinkChange: (link: ScheduleLink) => void;
    deleteLinkHandler: (link: ScheduleLink) => void;
}

const LinkForm: React.FC<LinkFormProps> = ({
    link,
    onLinkChange,
    deleteLinkHandler,
}) => {
    const [form] = Form.useForm();
    const [editing, setEditing] = useState(false);

    const onFinish = (values: ScheduleLink) => {
        onLinkChange(values);
        setEditing(false);
    };

    return (
        <>
            {editing ? (
                <Form
                    form={form}
                    initialValues={link}
                    onFinish={onFinish}
                    layout='horizontal'
                    style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <Form.Item
                        label='Description'
                        name='description'
                        rules={[
                            {
                                required: true,
                                message: 'Please input description!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label='Link'
                        name='link'
                        rules={[
                            { required: true, message: 'Please input link!' },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Button type='default' htmlType='submit'>
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            ) : (
                <p>
                    <b>{link.description}:</b>
                    <LinkSpan>
                        <Link href={link.link}>{link.link}</Link>
                    </LinkSpan>
                </p>
            )}
            {!editing && (
                <div>
                    <StyledButton
                        type='text'
                        onClick={() => setEditing(true)}
                        icon={<EditOutlined />}
                    />
                    <StyledButton
                        type='text'
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => deleteLinkHandler(link)}
                    />
                </div>
            )}
        </>
    );
};

const LinkSpan = styled.span`
    margin-left: 10px;
`;

const StyledButton = styled(Button)`
    margin-right: 8px;
`;
export default LinkForm;
