import React from 'react';
import {
    Drawer,
    Form,
    Button,
    Col,
    Row,
    Input,
    Select,
    List,
    Divider,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import {
    closeSubjectInfoPanel,
    getIsInfoPanelOpen,
    getSelectedSubjectId,
} from 'store/subject/open-info-panel';
import { useDispatch, useSelector } from 'react-redux';
import { getTags } from 'store/tag/get';
import { addComment } from 'store/comment/add';
import { getComments, getIsLoading } from 'store/comment/get';
import { getSubjectSchedule } from 'store/subject/schedule';
import styled from 'styled-components';
import { format } from 'date-fns';
import { deleteComment } from 'store/comment/delete';
import { addTag } from 'store/tag/add';
import _ from 'lodash';
import { deleteTag } from 'store/tag/delete';
import Spinner from '@/components/spinner';
import LinkList from '@/components/link-list';

const SidePanel: React.FC = () => {
    const dispatch = useDispatch();
    const comments = useSelector(getComments);
    const tags = useSelector(getTags);
    const open = useSelector(getIsInfoPanelOpen);
    const isLoading = useSelector(getIsLoading);

    const subjectScheduleId = useSelector(getSelectedSubjectId);
    const subjectSchedule = useSelector(getSubjectSchedule).find(
        (s) => s._id === subjectScheduleId
    );

    const onClose = () => {
        dispatch(closeSubjectInfoPanel());
    };

    const handleCommentSubmit = (values: any) => {
        dispatch(
            addComment({
                text: values.comment,
                subjectSchedule: subjectScheduleId,
            })
        );
    };

    const handleDeleteCommentClick = (commentId: string) => {
        dispatch(deleteComment(commentId));
    };

    const handleSelectSelect = (value: string) => {
        dispatch(addTag({ text: value, subjectSchedule: subjectScheduleId }));
    };
    const handleSelectDeselect = (value: string) => {
        dispatch(deleteTag(value));
    };

    return (
        <Drawer
            title={subjectSchedule?.subject.name}
            width={720}
            onClose={onClose}
            open={open}
            bodyStyle={{ paddingBottom: 80 }}
        >
            <p>
                <b>Lecturer:</b> {subjectSchedule?.teacher.name}
            </p>
            <p>
                <b>Time:</b> {subjectSchedule?.time}
            </p>
            <Form layout="vertical" requiredMark>
                <Row gutter={16}>
                    <Col span={12}> </Col>
                </Row>
            </Form>
            <Divider />

            <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder="Enter tag"
                onSelect={handleSelectSelect}
                onDeselect={handleSelectDeselect}
                value={tags.map((t) => t._id)}
                options={tags.map((tag) => ({
                    label: tag.text,
                    value: tag._id,
                }))}
            />
            <Divider />

            <LinkList />

            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    <Divider />
                    <Form onFinish={handleCommentSubmit}>
                        <CommentInputWrapper>
                            <CommentInput name="comment">
                                <Input placeholder="Write a comment..." />
                            </CommentInput>
                            <Form.Item>
                                <Button type="default" htmlType="submit">
                                    Add Comment
                                </Button>
                            </Form.Item>
                        </CommentInputWrapper>
                    </Form>
                    {comments && comments.length > 0 && (
                        <List
                            itemLayout="horizontal"
                            dataSource={comments}
                            renderItem={(item, index) => (
                                <List.Item
                                    key={item._id}
                                    actions={[
                                        <Button
                                            type="text"
                                            key={'delete-comment'}
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => {
                                                handleDeleteCommentClick(
                                                    item._id
                                                );
                                            }}
                                        />,
                                    ]}
                                >
                                    <List.Item.Meta
                                        title={
                                            <a href="https://ant.design">
                                                {item.text}
                                            </a>
                                        }
                                        description={format(
                                            new Date(item.creationTime),
                                            'HH:mm - EEEE, MMMM dd yyyy '
                                        )}
                                    />
                                </List.Item>
                            )}
                        />
                    )}
                </>
            )}
        </Drawer>
    );
};
const CommentInputWrapper = styled.div`
    display: flex;
    width: 100%;
`;

const CommentInput = styled(Form.Item)`
    width: 100%;
    margin-right: 10px;
`;

export default SidePanel;
