/* eslint-disable react/prop-types */
import stables from "../../Constants/stables";

import { FaEdit } from "react-icons/fa";
import { FaReply } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { CommentInput } from "./CommentInput";

export const Comment = ({
    comment,
    logginedUserId,
    affectedComment,
    setAffectedComment,
    addComment,
    parentId = null,
    updateComment,
    deleteComment,
    replies,
}) => {
    const isUserLoggined = Boolean(logginedUserId);
    const commentBelongsToUser = logginedUserId === comment.user._id;
    const isReplying =
        affectedComment &&
        affectedComment.type === "replying" &&
        affectedComment._id === comment._id;
    const isEditing =
        affectedComment &&
        affectedComment.type === "editing" &&
        affectedComment._id === comment._id;
    const repliedCommentId = parentId ? parentId : comment._id;
    const replyOnUserId = comment.user._id;

    return (
        <div className="bg-slate-800 w-full rounded-lg flex flex-col">
            <div className="flex flex-row gap-2 px-3 py-3 items-center">
                <div className="flex flex-col px-1 gap-2">
                    <div className="flex flex-row items-start gap-2">
                        <img
                            src={
                                comment?.user?.avatar
                                    ? stables.UPLOAD_FOLDER_BASE_URL + comment?.user.avatar
                                    : "/user.png"
                            }
                            alt="post profile"
                            className="mt-1 w-9 h-9 md:w-10 md:h-10 rounded-full"
                        />
                        <div className="flex flex-col gap-1">
                            <div className="flex flex-row items-center gap-2">
                                <span className="font-semibold">{comment.user.fullName}</span>
                                {comment?.user.mentor ? <span className="rounded-md bg-green-300 text-slate-800 px-2 py-1 text-xs">Mentor @ {comment?.user.program}</span> : <span className="rounded-md bg-blue-300 text-slate-800 px-2 py-1 text-xs">Mentee @ {comment?.user.program}</span>}
                            </div>
                            <span className="text-xs">
                                at {comment?.createdAt && (
                                    new Intl.DateTimeFormat('en-GB', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: 'numeric',
                                        hour12: false,
                                        minute: 'numeric',
                                        timeZone: 'Asia/Jakarta',
                                    }).format(new Date(comment.createdAt))
                                )}
                            </span>

                            {!isEditing && (
                                <p className="text-justify text-ellipsis whitespace-break-spaces mt-1">
                                    {comment.desc}
                                </p>
                            )}
                            {isEditing && (
                                <CommentInput
                                    btnLabel="Update"
                                    formSubmitHanlder={(value) => updateComment(value, comment._id)}
                                    formCancelHandler={() => setAffectedComment(null)}
                                    initialText={comment.desc}
                                />
                            )}
                            <div className="flex mt-3 flex-row gap-3">
                                {isUserLoggined && (
                                    <button
                                        className="flex items-center space-x-2"
                                        onClick={() =>
                                            setAffectedComment({ type: "replying", _id: comment._id })
                                        }
                                    >
                                        <p className="cursor-pointer"><FaReply /></p>
                                    </button>
                                )}
                                {commentBelongsToUser && (
                                    <>
                                        <button
                                            className="flex items-center space-x-2"
                                            onClick={() =>
                                                setAffectedComment({ type: "editing", _id: comment._id })
                                            }
                                        >
                                            <p className="cursor-pointer"><FaEdit /></p>

                                        </button>
                                        <button
                                            className="flex items-center space-x-2"
                                            onClick={() => deleteComment(comment._id)}
                                        >
                                            <p className="cursor-pointer"><FaTrash /></p>

                                        </button>
                                    </>
                                )}
                            </div>
                            {isReplying && (
                                <CommentInput
                                    btnLabel="Reply"
                                    formSubmitHanlder={(value) =>
                                        addComment(value, repliedCommentId, replyOnUserId)
                                    }
                                    formCancelHandler={() => setAffectedComment(null)}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {replies.length > 0 && (
                <div className="pl-10">
                    {replies.map((reply) => (
                        <Comment
                            key={reply._id}
                            addComment={addComment}
                            affectedComment={affectedComment}
                            setAffectedComment={setAffectedComment}
                            comment={reply}
                            deleteComment={deleteComment}
                            logginedUserId={logginedUserId}
                            replies={[]}
                            updateComment={updateComment}
                            parentId={comment._id}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
