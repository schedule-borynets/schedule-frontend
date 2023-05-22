import React, { useState } from 'react';
import { List, Button, Form, Input } from 'antd';
import LinkForm, { ScheduleLink } from '@/components/link-form';

const LinkList: React.FC = () => {
    const [links, setLinks] = useState<ScheduleLink[]>([]);
    const [form] = Form.useForm();

    const onFinish = (values: ScheduleLink) => {
        setLinks([...links, values]);
        form.resetFields();
    };

    const updateLink = (index: number, newLink: ScheduleLink) => {
        setLinks(links.map((link, i) => (i === index ? newLink : link)));
    };

    const handleLinkDelete = (index: number, newLink: ScheduleLink) => {
        setLinks(links.filter((link, i) => i !== index));
    };

    return (
        <>
            <Form
                form={form}
                initialValues={{ description: '', link: '' }}
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
                    rules={[{ required: true, message: 'Please input link!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button type='default' htmlType='submit'>
                        Add link
                    </Button>
                </Form.Item>
            </Form>

            {links.length > 0 && (
                <List
                    dataSource={links}
                    renderItem={(link, index) => (
                        <List.Item>
                            <LinkForm
                                link={link}
                                onLinkChange={(newLink) =>
                                    updateLink(index, newLink)
                                }
                                deleteLinkHandler={(newLink) =>
                                    handleLinkDelete(index, newLink)
                                }
                            />
                        </List.Item>
                    )}
                />
            )}
        </>
    );
};

export default LinkList;
