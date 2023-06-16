import React from 'react';
import { List, Button, Form, Input } from 'antd';
import LinkForm from '@/components/link-form';
import { useDispatch, useSelector } from 'react-redux';
import { ScheduleLink, getLinks } from 'store/schedule_links/get';
import { addLink } from 'store/schedule_links/add';
import { getSelectedSubjectId } from 'store/subject/open-info-panel';
import { updateLink } from 'store/schedule_links/update';
import { deleteLink } from 'store/schedule_links/delete';

const LinkList: React.FC = () => {
    const dispatch = useDispatch();

    const [form] = Form.useForm();
    const links = useSelector(getLinks);
    const subjectScheduleId = useSelector(getSelectedSubjectId);

    const onFinish = (values: ScheduleLink) => {
        dispatch(
            addLink({
                description: values.description,
                link: values.link,
                subjectSchedule: subjectScheduleId,
            })
        );
    };

    const updateLinkHandler = (newLink: ScheduleLink) => {
        dispatch(
            updateLink({
                linkId: newLink._id,
                subjectScheduleId: newLink.subjectSchedule,
                description: newLink.description,
                link: newLink.link,
            })
        );
    };

    const handleLinkDelete = (link: ScheduleLink) => {
        dispatch(deleteLink(link._id));
    };

    return (
        <>
            <Form
                form={form}
                initialValues={{ description: '', link: '' }}
                onFinish={onFinish}
                layout="horizontal"
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <Form.Item
                    label="Description"
                    name="description"
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
                    label="Link"
                    name="link"
                    rules={[{ required: true, message: 'Please input link!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button type="default" htmlType="submit">
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
                                    updateLinkHandler(newLink)
                                }
                                deleteLinkHandler={(link) =>
                                    handleLinkDelete(link)
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
